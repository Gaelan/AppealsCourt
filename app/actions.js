import cloneDeep from 'lodash/cloneDeep'

async function loadLogReport(id, dispatch) {
	const [details, log] = await Promise.all([getReportDetails(id), getReportLog(id)])

	dispatch({type: 'LOAD_REPORT', log: log, meta: details})
}

async function loadViewReport(id, dispatch) {
	if (!id) {
		dispatch({type: 'NO_JUDGE_REPORTS'})
		loadLogReport(await getReportId(), dispatch)
		return
	}
	const page = await getViewReport(id)

	dispatch({type: 'LOAD_VIEW_REPORT', page})
}

async function getJudgeReportId() {
	const re = /\/viewReport.php\?id=(\d+)/g;
	const data = new FormData()
	data.append('action', 'closereport')
	data.append('step', '1')
	data.append('data', false)
	const resp = await fetch('/Trial/manage/menu.php', {
		method: 'POST',
		body: data,
		credentials: 'include'
	})
	const text = await resp.text();
	let match;
	const reports = [];
	while ((match = re.exec(text)) !== null) {
		reports.push(match[1])
	}
	const filtered = reports.filter(id => {
		const str = id.toString()
		const shard = str.substring(0, str.length - 5)
		return (localStorage.getItem('judgeskip' + shard) || '').split("\n").indexOf(str) == -1
	})
	return filtered[0]
}

export function skipJudgeReport(id) {
	return async (dispatch) => {
		const str = id.toString()
		const shard = str.substring(0, str.length - 5)
		const existing = (localStorage.getItem('judgeskip' + shard) || '').split("\n")
		existing.push(id)
		localStorage.setItem('judgeskip' + shard, existing.join('\n'))
		loadViewReport(await getJudgeReportId(), dispatch)
	}
}

async function getReportId() {
	const data = new FormData()
	data.append('step', 1)
	const resp = await fetch('/Trial/loadingStages.php', {
		method: 'POST',
		body: data,
		credentials: 'include'
	})
	return parseInt(await resp.text())
}

export function init() {
	return async dispatch => {
		let num
		if (num = await getJudgeReportCount()) {
			dispatch({type: 'IS_JUDGE', judgeQueue: num})
			loadViewReport(await getJudgeReportId(), dispatch)
		} else {
			loadLogReport(await getReportId(), dispatch)
		}
	}
}

async function getJudgeReportCount() { // returns false if not a judge
	return false; // Judge disabled at Turd's request.
	const resp = await fetch(`/Trial/fetch.php?from=menu.php`, {
		method: 'GET',
		credentials: 'include'
	})

	const text = await resp.text()

	const match = /Unresolved Reports \((\d+)\)/.exec(text)

	return match && match[1]
}

async function getReportDetails(id) {
	const data = new FormData()
	data.append('step', 2)
	data.append('input', id)
	const resp = await fetch('/Trial/loadingStages.php', {
		method: 'POST',
		body: data,
		credentials: 'include'
	})
	return await resp.json()
}

async function getReportLog(id) {
	const data = new FormData()
	data.append('step', 3)
	data.append('input', id)
	const resp = await fetch('/Trial/loadingStages.php', {
		method: 'POST',
		body: data,
		credentials: 'include'
	})
	return await resp.json()
}

async function getViewReport(id) {
	const resp = await fetch(`/Trial/viewReport.php?id=${id}`, {
		method: 'GET',
		credentials: 'include'
	})

	return await resp.text()
}

export function vote(guilty) {
	return {type: 'VOTE', guilty}
}

export function confirmVote(guilty) {
	return async (dispatch) => {
		dispatch({type: 'VOTE_CONFIRMED'})
		const data = new FormData()
		data.append('input', guilty ? 'g' : 'i')
		await fetch('/Trial/submitVote.php', {
			method: 'POST',
			body: data,
			credentials: 'include'
		})
		loadLogReport(await getReportId(), dispatch)
		const num = await getJudgeReportCount()
		if (num) { dispatch({type: 'IS_JUDGE', judgeQueue: num})} 
	}
}

export function confirmJudgeVote(id, guilty, alternate) { // Alternate = exception/request perma
	return async (dispatch) => {
		dispatch({type: 'VOTE_CONFIRMED'})
		// Load viewReport in case some other tab messed up our session
		await fetch(`/Trial/viewReport.php?id=${id}`, {
			method: 'GET',
			credentials: 'include'
		})
		const managerData = new FormData()
		managerData.append('action', 'closereport')
		managerData.append('step', '101')
		await fetch('/Trial/manage/menu.php', {
			method: 'POST',
			body: managerData,
			credentials: 'include'
		})
		const formPageData = new FormData()
		formPageData.append('action', 'closereport')
		formPageData.append('step', '2')
		formPageData.append('data', 'false')
		await fetch('/Trial/manage/menu.php', {
			method: 'POST',
			body: formPageData,
			credentials: 'include'
		})
		const data = new FormData()
		data.append('action', 'closereport')
		data.append('step', '201')
		data.append('data', JSON.stringify({
			id: id,
			vote: guilty ? 'g' : 'i',
			[guilty ? 'perm' : 'except']: alternate
		}))
		await fetch('/Trial/manage/menu.php', {
			method: 'POST',
			body: data,
			credentials: 'include'
		})
		loadViewReport(await getJudgeReportId(), dispatch)
		const num = await getJudgeReportCount()
		dispatch({type: 'IS_JUDGE', judgeQueue: num})
	}
}

export function cancelVote(guilty) {
	return {type: 'VOTE_CANCELLED'}
}

export function duplicateReport(reportID, ign, reasonID, description) {
	return async (dispatch, getState) => {
		dispatch({type: 'DUPLICATE_STARTED'})
		const data = new FormData()
		data.append('drid', reportID)
		data.append('dp', getState().report.playersByIGN[ign].username)
		data.append('dr', reasonID)
		data.append('dd', description)
		let resp;
		try {
			resp = await (await fetch('/Trial/duplicateReport.php', {
				method: 'POST',
				body: data,
				credentials: 'include'
			})).json()
		} catch (e) {
			debugger
			dispatch({type: 'DUPLICATE_ERRORED', error: 'Network error'})
			setTimeout(() => {dispatch({type: 'DUPLICATE_HIDE'})}, 5000)
			return
		}
		if(resp != true) {
			dispatch({type: 'DUPLICATE_ERRORED', error: resp[1]})
			setTimeout(() => {dispatch({type: 'DUPLICATE_HIDE'})}, 5000)
			return
		}
		dispatch({type: 'DUPLICATE_SUCCEEDED'})
		setTimeout(() => {dispatch({type: 'DUPLICATE_HIDE'})}, 5000)
	}
}

export function switchQueue(newQueue) {
	console.log('switching queue', newQueue)
	return async (dispatch) => {
		dispatch({type: 'QUE(UE_SWITCH'})
		if(newQueue == 'judge') {
			loadViewReport(await getJudgeReportId(), dispatch)
		} else {
			loadLogReport(await getReportId(), dispatch)
		}
	}
}

export function translate(report) {
	return async (dispatch) => {
		dispatch({type: 'TRANSLATING'})
		const wip = cloneDeep(report)
		const translations = []
		wip.phases.forEach(phase => {
			phase.subphases.forEach(subphase => {
				subphase.events.forEach(event => {
					if(event.type == 'chat' && wip.turkishPlayers.has(event.player)) {
						translations.push([event.text, (out) => {
							event.orig = event.text
							event.text = out
						}])
					}
					if(event.type == 'whisper' && wip.turkishPlayers.has(event.player)) {
						translations.push([event.text, (out) => {
							event.orig = event.text
							event.text = out
						}])
					}
				})
			})
		})
		wip.players.forEach(player => {
			// XXX: This makes players inconsistend because cloneDeep won't keep
			// the pointers going everywhichway.
			if(player.will && wip.turkishPlayers.has(player.ign)) {
				player.will.origLines = []
				player.will.lines.forEach((line, idx) => {
					translations.push([line, (out) => {
						player.will.lines[idx] = out
						player.will.origLines[idx] = line
					}])
				})
			}
			if(player.note && wip.turkishPlayers.has(player.note.owner)) {
				player.note.origLines = []
				player.note.lines.forEach((line, idx) => {
					translations.push([line, (out) => {
						player.note.lines[idx] = out
						player.note.origLines[idx] = line
					}])
				})
			}
		})
		const data = new FormData();
		translations.forEach(([text, cb]) => {
			data.append('text', text)
		})
		const resp = await fetch('https://translate.yandex.net/api/v1.5/tr.json/translate?lang=en&key=trnsl.1.1.20170221T160601Z.4ec8852ebdc07717.86c1e522299e1c9817ad9a18037d10dc65ad26ec', {method: 'POST', body: data})
		const json = await resp.json()
		json.text.forEach((out, idx) => {
			translations[idx][1](out)
		})
		dispatch({type: 'TRANSLATED', report: wip})
	}
}
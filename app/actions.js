import parseLog from './bmg/logParser'

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

export function loadReport() {
	return async dispatch => {
		const id = await getReportId()
		const [details, log] = await Promise.all([getReportDetails(id), getReportLog(id)])

		dispatch({type: 'LOAD_REPORT', log: log, meta: details})
	}
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
		dispatch(loadReport())
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
class Parser {
	constructor() {
		this.phases = []
		this.players = []
		this.playersByUsername = {}
		this.playersByIGN = {}
		this.playersByName = this.playersByUsername
		this.ranked = false
	}

	parse() {
		this.parsePlayers()
		this.parseLog()
		console.log(this)
		return {
			players: this.players,
			phases: this.phases,
			ranked: this.ranked,
			playersByUsername: this.playersByUsername,
			playersByIGN: this.playersByIGN,
			reports: this.getReports(),
			reportedPlayer: this.playersByUsername[this.getUsername()].ign,
			id: this.getID(),
			reason: this.getReason(),
			winner: this.winner,
		}
	}

	parsePlayers() {
		this.players = this.getPlayers()
		this.players.forEach(player => {
			this.playersByUsername[player.username] = player
			this.playersByIGN[player.ign] = player
		})
	}

	parseLog() {
		this.getEvents().forEach(rawEl => {
			const el = jQuery(rawEl)
			if(el.html().indexOf(': ') != -1) {
				this.handleChat(el)
			} else if (el.hasClass('time') || el.hasClass('stage')) {
				this.handlePhase(el)
			} else if (el.hasClass('death')) {
				this.handleDeath(el)
			} else if (el.hasClass('notice')) {
				this.handleNotice(el)
			} else if (el.hasClass('note')) {
				this.handleNote(el)
			} else if (el.hasClass('end')) {
				this.handleEnd(el)
			} else if (el.hasClass('vampire')) {
				this.handleVamp(el)
			} else if (el.html().indexOf(':') == (el.html().length - 1)) {
				let scope
				if(el.hasClass('mafia')) {
					scope = 'mafia'
				} else if (el.hasClass('jail')) {
					scope = 'jail'
				} else if (el.hasClass('dead') || el.hasClass('seance')) {
					scope = 'dead'
				}
				// Empty chat message. Wat.
				this.currentSubphase.events.push({
					type: 'chat',
					player: this.playersByName[el.html().split(':')[0]].ign, // force IGN
					text: '',
					scope: scope
				})
			} else {
				this.currentSubphase.events.push({
					type: 'unknown',
					text: el.html(),
				})
			}
		})
	}

	handleChat(el) {
		if(el.hasClass('whisper')) {
			this.handleWhisper(el)
			return
		}
		const [name, ...messageParts] = el.html().split(': ')
		const message = messageParts.join(': ')

		let scope;

		if(el.hasClass('mafia')) {
			scope = 'mafia'
		} else if (el.hasClass('jail')) {
			scope = 'jail'
		} else if (el.hasClass('dead') || el.hasClass('seance')) {
			scope = 'dead'
		}
		this.currentSubphase.events.push({
			type: 'chat',
			player: this.playersByName[name] && this.playersByName[name].ign, // force IGN
			text: message,
			scope: scope
		})
	}

	handlePhase(el) {
		if(el.html() == 'Judgement' || el.html() == 'Defense') {
			this.startSubphase(el.html())
			return
		}
		const phase = {
			name: el.html(),
			subphases: []
		}
		this.phases.push(phase)
		this.currentPhase = phase
		this.startSubphase()

		if (phase.name != 'Lobby') { // Game has started, we switch to IGNs
			this.playersByName = this.playersByIGN
		}
	}

	startSubphase(name) {
		const subphase = {
			name: name,
			events: []
		}

		this.currentPhase.subphases.push(subphase)
		this.currentSubphase = subphase
	}

	handleDeath(el) {
		const [_, name] = /(.+) has been/.exec(el.html())
		const event = {
			type: 'death',
			player: name
		}
		this.playersByIGN[name].deathPhase = this.currentPhase;
		this.lastDeath = event
		if (el.html().indexOf('lynched') != -1) {
			event.killer = 'town'
		}
		if (this.playersByIGN[name].left) {
			event.killer = 'suicide'
		}
		if (this.playersByIGN[name].executed) {
			event.killer = 'jailor'
		}
		this.currentSubphase.events.push(event)
	}

	handleWhisper(el) {
		const [_, from, to, message] = /(.+) to (.+): (.*)/.exec(el.html())
		this.currentSubphase.events.push({
			type: 'whisper',
			player: this.playersByName[from].ign,
			recipient: this.playersByName[to].ign,
			text: message
		})
	}

	handleNotice(el) {
		const revealRegexp = /^(.+) has revealed themselves as the Mayor\.$/
		const revealMatch = revealRegexp.exec(el.html())
		const abilityRegexp = /^(.+) (checked|investigated|decided to execute) (.+)\.$/
		const abilityMatch = abilityRegexp.exec(el.html())
		const transRegexp = /^Transporter swapped (.+) with (.+)\.$/
		const transMatch = transRegexp.exec(el.html())
		const witchRegexp = /^Witch made (.+) target (.+)\.$/
		const witchMatch = witchRegexp.exec(el.html())
		const leaveRegexp = /^(.*) has left the game.$/ // Sometimes the name is not present
		const leaveMatch = leaveRegexp.exec(el.html())
		const voteRegexp = /^(.+) (abstained|voted guilty|voted innocent).$/
		const voteMatch = voteRegexp.exec(el.html());
		const winnerRegexp = /^(.+) has won.$/
		const winnerMatch = winnerRegexp.exec(el.html())
		const reviveRegexp = /^(.+) has been resurrected.$/
		const reviveMatch = reviveRegexp.exec(el.html())
		const rememberRegexp = /^(.+) has remembered they were (.+).$/
		const rememberMatch = rememberRegexp.exec(el.html())
		const convertRegexp = /^.+was converted from being a(.+).$/
		const convertMatch = convertRegexp.exec(el.html())
		if (revealMatch) {
			this.currentSubphase.events.push({
				type: 'reveal',
				player: revealMatch[1]
			})
		} else if (abilityMatch) {
			if (abilityMatch[2] == 'decided to execute') {
				this.playersByIGN[abilityMatch[3]].executed = true
			}
			this.currentSubphase.events.push({
				type: 'ability',
				player: abilityMatch[1],
				ability: abilityMatch[2],
				target: abilityMatch[3]
			})
		} else if (transMatch) {
			this.currentSubphase.events.push({
				type: 'transport',
				swap: [
					transMatch[1],
					transMatch[2]
				]
			})
		} else if (witchMatch) {
			this.currentSubphase.events.push({
				type: 'witch',
				controlled: witchMatch[1],
				target: witchMatch[2]
			})
		} else if (leaveMatch) {
			const player = this.playersByName[leaveMatch[1]]
			const event = {
				type: 'leave',
				player: player ? player.ign : null
			}
			if (player) player.left = true;
			this.currentSubphase.events.push(event)
		} else if (voteMatch) {
			const type = {'abstained': 'abstain', 'voted guilty': 'guilty', 'voted innocent': 'innocent'}[voteMatch[2]]
			let votesEvent = this.currentSubphase.events[this.currentSubphase.events.length - 1] || {}
			if (votesEvent.type != 'votes') {
				votesEvent = {type: 'votes', innocent: [], guilty: [], abstain: []}
				this.currentSubphase.events.push(votesEvent)
			}
			votesEvent[type].push(voteMatch[1])
		} else if (el.html() == 'Ranked Game.') {
			this.ranked = true;
		} else if (el.html() == 'Stalemate.') {
			this.winner = 'Stalemate'
		} else if (winnerMatch) {
			this.winner = winnerMatch[1].toLowerCase();
		} else if (reviveMatch) {
			this.currentSubphase.events.push({
				type: 'revive',
				player: reviveMatch[1]
			})
		} else if (rememberMatch) {
			this.currentSubphase.events.push({
				type: 'remember',
				player: rememberMatch[1],
				role: rememberMatch[2]
			})
		} else if (convertMatch) {
			this.currentSubphase.events[this.currentSubphase.events.length - 1].fromRole = convertMatch[1]
		} else {
			const attacks = {
				mafia: /^(.+) was attacked by the Mafia.$/,
				sk: /^(.+) was attacked by a SerialKiller.$/,
				'sk-visit': /^(.+) visited a SerialKiller.$/,
				guarding: /^(.+) died guarding someone.$/,
				bodyguard: /^(.+) was attacked by a BodyGuard.$/,
				vigilante: /^(.+) was attacked by a Vigilante.$/,
				'vig-guilt': /^(.+) died from guilt over shooting a Town member.$/,
				jester: /^(.+) was attacked by a Jester.$/,
				veteran: /^(.+) attacked by a Veteran.$/,
				arsonist: /^(.+) was ignited by an Arsonist.$/,
				werewolf: /^(.+) was attacked by a Werewolf.$/,
				'vh-visit': /^(.+) visited a VampireHunter.$/,
				vampire: /^(.+) was attacked by a Vampire.$/
			}
			for(let attacker in attacks) {
				const match = attacks[attacker].exec(el.html());
				if (match) {
					this.lastDeath.killer = attacker; 
					return
				}
			}

			this.currentSubphase.events.push({
				type: 'unknown',
				text: el.html()
			})
		}
	}

	handleNote(el) {
		this.playersByIGN[this.lastDeath.player][el.data('type')] = this.parseNote(atob(el.data('info')))
	}

	parseNote(html) {
		const parsed = jQuery(html)
		let owner;
		let lines = ['']
		parsed.each((idx, el) => {
			if(el instanceof HTMLSpanElement) {
				const ownerString = el.innerHTML
				owner = ownerString.split('(')[0]
			} else if (el instanceof HTMLBRElement) {
				lines.push('')
			} else {
				// Text
				lines[lines.length - 1] = lines[lines.length - 1] + el.textContent
			}
		})
		return {owner, lines}
	}

	handleEnd(el) {
		// no-op
	}

	handleVamp(el) {
		const [_, bitten] = /\*Vampires have bit (.+)\(Vampire\)\./.exec(el.html())
		this.currentSubphase.events.push({
			type: 'bite',
			player: bitten
		})
	}

	getID() {
		return this.meta.ReportID
	}

	getReason() {
		return this.meta.Reason
	}

	getReason() {
		return this.meta.Reason
	}

	getUsername() {
		return this.meta.Username
	}
}

class StageParser extends Parser {
	constructor(log, meta) {
		super()
		this.log = log
		this.meta = meta
	}

	getReports() {
		return this.log.reports[this.meta.Username]
	}

	getEvents() {
		return this.log.html
	}

	getPlayers() {
		return this.log.players
	}
}

class ViewParser extends Parser {
	constructor(page) {
		super()
		const p = new DOMParser()
		this.page = p.parseFromString(page, 'text/html')
		this.meta = this.getMeta()
	}

	getMeta() {
		const regex = /^\t+data = (\{.+\});$/m
		let data;
		Array.from(this.page.scripts).forEach(el => {
			const match = regex.exec(el.text);
			if(match) {
				data = JSON.parse(match[1])
			}
		})
		if(!data) { throw new Error("Couldn't find players") }
		return data
	}

	getPlayers() {
		return this.meta.players
	}

	getEvents() {
		return Array.from(this.page.getElementById('reportContent').children)
	}

	getReports() {
		return Array.from(this.page.getElementsByClassName('reportDescription')).map(el => {
			return [undefined, el.textContent]
		})
	}
}

export default function parseLog(log, meta) {
	return new StageParser(log, meta).parse()
}

export function parseView(page) {
	console.time('view parse')
	const p = new ViewParser(page).parse()
	console.timeEnd('view parse')
	return p
}
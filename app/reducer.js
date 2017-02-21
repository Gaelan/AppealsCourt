import parseReport, {parseView} from './bmg/logParser'

export default function reducer(state = {loading: 'Loading report…'}, action) {
	let parse
	switch (action.type) {
		case 'LOAD_REPORT':
			if(action.log[1] == 'You must be logged in to view report data.') {
				return { loading: "You aren't logged in. Pull up normal Trial (you don't have to vote, just get to where a report shows) then come back." }
			}
			parse = parseReport(action.log, action.meta)
			return { ...state, loading: null, report: parse, reportType: 'juror' }
			break;
		case 'LOAD_VIEW_REPORT':
			parse = parseView(action.page)
			return { ...state, loading: null, report: parse, reportType: 'judge' }
		case 'VOTE':
			return { ...state, pendingVoteGuilty: action.guilty }
			break;
		case 'VOTE_CONFIRMED':
			return { ...state,
				loading: 'Submitting vote & loading report…',
				pendingVoteGuilty: null,
				report: null,
				pendingVoteGuilty: null,
				translatorState: null
			}
		case 'VOTE_CANCELLED':
			return { ...state, pendingVoteGuilty: null }
			break;
		case 'DUPLICATE_STARTED':
			return { ...state, dupeState: 'Duplicating report…' }
			break;
		case 'DUPLICATE_ERRORED':
			return { ...state, dupeState: 'Duplicating failed: ' + action.error}
		case 'DUPLICATE_SUCCEEDED':
			return { ...state, dupeState: 'Report duplicated!' }
		case 'DUPLICATE_HIDE':
			return { ...state, dupeState: null }
		case 'EXCEPTION':
		    return { exception: {err: action.err, action: action.action, state: action.state, message: action.err.message, stack: action.err.stack} }
		case 'IS_JUDGE':
			return { ...state, judge: true, judgeQueueLength: action.judgeQueue }
		case 'QUEUE_SWITCH':
			return { ...state,
				loading: 'Loading report…',
				pendingVoteGuilty: null,
				report: null,
				pendingVoteGuilty: null,
				translatorState: null
			}
		case 'NO_JUDGE_REPORTS':
			return { ...state, loading: 'No judge reports or all filtered. Loading juror report…' }
		case 'TRANSLATING':
			return { ...state, translatorState: 'translating' }
		case 'TRANSLATED':
			return { ...state, report: action.report, translatorState: 'done'}
		default:
			return state;
	}
}
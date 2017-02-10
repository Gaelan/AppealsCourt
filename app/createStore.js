import { createStore, compose, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
let DevTools;
if (process.env.NODE_ENV !== 'production') {
	DevTools = require('./components/DevTools').default
}
import parseReport from './bmg/logParser'

function reducer(state = {loading: 'Loading report…'}, action) {
	switch (action.type) {
		case 'LOAD_REPORT':
			if(action.log[1] == 'You must be logged in to view report data.') {
				return { loading: "You aren't logged in. Pull up normal Trial (you don't have to vote, just get to where a report shows) then come back." }
			}
			let parse
			try {
				parse = parseReport(action.log, action.meta)
			} catch (e) {
				console.error(e)
				return { loading: `Something went wrong loading report ${action.meta.ReportID}. Please report this to DoodleFungus with the report ID.`}
			}
			return { ...state, loading: null, report: parse }
			break;
		case 'VOTE':
			return { ...state, pendingVoteGuilty: action.guilty }
			break;
		case 'VOTE_CONFIRMED':
			return { loading: 'Submitting vote & loading report… '}
		case 'VOTE_CANCELLED': // falls through
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
		default:
			return state;
	}
}

let enhancer = applyMiddleware(thunk)

if(process.env.NODE_ENV !== 'production') {
	enhancer = compose(enhancer, DevTools.instrument())
}

export default function() {
	return createStore(
		reducer,
		enhancer
	)
}
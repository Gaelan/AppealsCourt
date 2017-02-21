import { createStore, compose, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
let DevTools;
if (process.env.NODE_ENV !== 'production') {
	DevTools = require('./components/DevTools').default
}

import reducer from './reducer'

const crashReporter = store => next => action => {
  try {
    return next(action)
  } catch (err) {
    console.error('Caught an exception!', err)
    next({type: 'EXCEPTION', err: err, action: action, state: store.getState()})
    throw err
  }
}

let enhancer = (process.env.NODE_ENV === 'production')
	? applyMiddleware(thunk, crashReporter)
	: applyMiddleware(thunk)

if(process.env.NODE_ENV !== 'production') {
	enhancer = compose(enhancer, DevTools.instrument({shouldCatchErrors: true}))
}

export default function() {
	const store = createStore(
		reducer,
		enhancer
	)

	// Hot reload reducers (requires Webpack or Browserify HMR to be enabled)
	if (module.hot) {
		console.log('accept')
		module.hot.accept('./reducer', () => {
			console.log('accepting')
			store.replaceReducer(reducer)
		});
	}

	return store
}
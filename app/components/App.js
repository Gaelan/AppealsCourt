import React from 'react'
import { Provider } from 'react-redux'

import UI from './ui'
let DevTools;
if (process.env.NODE_ENV !== 'production') {
	DevTools = require('./DevTools').default
}
import createStore from '../createStore'
import {loadReport} from '../actions'

const store = createStore()

export default class App extends React.Component {
	render() {
		return <div><Provider store={store}><UI /></Provider>
		{ (process.env.NODE_ENV !== 'production') ? <DevTools store={store}/> : null }
		</div>
	}

	componentWillMount() {
		store.dispatch(loadReport())
	}
}


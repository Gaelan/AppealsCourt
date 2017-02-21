import React from 'react'
import { Provider } from 'react-redux'

import UI from './ui'
let DevTools;
if (process.env.NODE_ENV !== 'production') {
	DevTools = require('./DevTools').default
}
import {init} from '../actions'

export default class App extends React.Component {
	render() {
		return <div><Provider store={this.props.store}><UI /></Provider>
		{ (process.env.NODE_ENV !== 'production') ? <DevTools store={this.props.store}/> : null }
		</div>
	}

	componentWillMount() {
		this.props.store.dispatch(init())
	}
}


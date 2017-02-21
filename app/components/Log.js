import React from 'react'
import {connect} from 'react-redux'

import Phase from './Phase'
import TurkishPrompt from './TurkishPrompt'
import {translate} from '../actions'

import Styles from '../styles/Log.css'

function Log(props) {
	return <div className={Styles.default}>
		{(props.report.turkishPlayers.size > 0) ? <TurkishPrompt translate={() => props.translate(props.report)} state={props.translatorState} /> : null}
		{props.report.phases.map(phase => <Phase key={phase.name} {...phase} reportedPlayer={props.report.reportedPlayer} />)}
	</div>
}

export default connect(
	(state, props) => { return {report: state.report, translatorState: state.translatorState} },
	({translate})
)(Log)
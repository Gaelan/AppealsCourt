import React from 'react'

import Phase from './Phase'

import Styles from '../styles/Log.css'

export default function Log(props) {
	return <div className={Styles.default}>
		{props.report.phases.map(phase => <Phase key={phase.name} {...phase} reportedPlayer={props.report.reportedPlayer} />)}
	</div>
}
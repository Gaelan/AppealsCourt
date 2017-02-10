import React from 'react'

import Subphase from './Subphase'

import Styles from '../styles/Phase.css'

export default function Phase(props) {
	return <div className={Styles.default}>
		<h2> {props.name} </h2>
		{props.subphases.map((subphase, idx) => <Subphase
			key={(subphase.name || 'init') + idx}
			subphase={subphase}
			reportedPlayer={props.reportedPlayer}
		/>)}
	</div>
}
import React from 'react'

import Styles from '../styles/Subphase.css'
import Event from './Event'

export default function Subphase(props) {
	return <div className={Styles.default}>
		{ props.subphase.name ? <h3> {props.subphase.name} </h3> : null }
		{ props.subphase.events.map((event, idx) => <Event key={idx} event={event} reportedPlayer={props.reportedPlayer} />) }
	</div>
}
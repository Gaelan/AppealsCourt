import React from 'react'

import Styles from '../styles/TurkishPrompt.css'

export default function TurkishPrompt(props) {
	if (props.state) {
		return <div className={Styles.default}>
			<div> {{'translating': 'Translating…', 'done': 'Translated. Take everything with a grain of salt, web translators are wonky sometimes.'}[props.state]} </div>
		</div>
	} else {
		return <div className={Styles.default}>
			<div> Looks like one or more players are speaking Turkish. </div>
			<button onClick={props.translate}> Translate </button>
		</div>
	}
}
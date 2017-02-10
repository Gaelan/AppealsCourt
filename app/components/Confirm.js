import React from 'react'

import PlayerName from './PlayerName'

import Styles from '../styles/Confirm.css'

export default function Confirm(props) {
	console.log(props)
	return <div className={Styles.default}>
		The charges of <b>{props.report.reason}</b> against <PlayerName name={props.report.reportedPlayer} /> are deemed…
		<button className={Styles[props.isGuilty ? 'guiltyButton' : 'innoButton']} onClick={props.confirm}>
			{props.isGuilty ? 'Guilty' : 'Innocent'}
		</button>
		<button className={Styles.button} onClick={props.cancel}>
			Cancel
		</button>
	</div>
}
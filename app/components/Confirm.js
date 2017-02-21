import React from 'react'

import PlayerName from './PlayerName'

import Styles from '../styles/Confirm.css'

export default function Confirm(props) {
	console.log(props)
	return <div className={Styles.default}>
		The charges of <b>{props.report.reason}</b> against <PlayerName name={props.report.reportedPlayer} /> are deemed…
		<button className={Styles[props.isGuilty ? 'guiltyButton' : 'innoButton']} onClick={() => props.confirm(false)}>
			{props.isGuilty ? 'Guilty' : 'Innocent'}
		</button>
		{(props.reportType == 'judge') ? (
			<button className={Styles[props.isGuilty ? 'guiltyButton' : 'innoButton']} onClick={() => props.confirm(true)}>
				{props.isGuilty ? 'Permanent' : 'Exception'}
			</button>
		) : null}
		<button className={Styles.button} onClick={props.cancel}>
			Cancel
		</button>
	</div>
}
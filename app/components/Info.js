import React from 'react'

import ReportDetails from './ReportDetails'
import PlayerList from './PlayerList'
import Buttons from './Buttons'
import Confirm from './Confirm'

import Styles from '../styles/Info.css'

export default function Info(props) {
	let style;
	if(props.pendingVoteGuilty == undefined) {
		style = Styles.default
	} else {
		style = Styles[props.pendingVoteGuilty ? 'guilty' : 'innocent']
	}
	return (props.pendingVoteGuilty == undefined) ? <div className={style}>
			{props.dupeState ? <div className={Styles.dupeState}> {props.dupeState} </div> : null}
			<PlayerList players={props.report.players} reportedPlayer={props.report.reportedPlayer} />
			<ReportDetails report={props.report} reportedPlayer={props.report.reportedPlayer} />
			<Buttons inno={props.inno} guilty={props.guilty} />
		</div> : <div className={style}>
			<Confirm
				isGuilty={props.pendingVoteGuilty}
				report={props.report}
				confirm={() => props.confirmVote(props.pendingVoteGuilty)}
				cancel={() => props.cancelVote()}
			/>
		</div>
}
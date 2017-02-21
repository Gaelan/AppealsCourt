import React from 'react'

import Tabs from './Tabs'
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
			{props.judge ? <Tabs value={props.reportType} change={props.switchType} judgeCount={props.judgeQueueLength} /> : null}
			{props.dupeState ? <div className={Styles.dupeState}> {props.dupeState} </div> : null}
			<PlayerList players={props.report.players} reportedPlayer={props.report.reportedPlayer} />
			<ReportDetails report={props.report} reportedPlayer={props.report.reportedPlayer} />
			<Buttons inno={props.inno} guilty={props.guilty} skip={() => {props.judge ? props.judgeSkip(props.report.id) : null}} />
		</div> : <div className={style}>
			<Confirm
				isGuilty={props.pendingVoteGuilty}
				report={props.report}
				confirm={(alt) => {
					if (props.judge) {
						props.confirmJudgeVote(props.report.id, props.pendingVoteGuilty, alt)
					} else {
						props.confirmVote(props.pendingVoteGuilty)
					}
				}}
				cancel={() => props.cancelVote()}
				judge={props.judge}
			/>
		</div>
}
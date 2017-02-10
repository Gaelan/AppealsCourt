import React from 'react'

import PlayerName from './PlayerName'
import PNStyles from '../styles/PlayerName.css'

import Styles from '../styles/ReportMetadata.css'

export default function ReportMetadata(props) {
	return <div className={Styles.default}>
		<h1>Report {props.report.id}</h1>
		<PlayerName name={props.report.reportedPlayer} /> is on trial for <b>{props.report.reason}</b>
		{props.report.reports ? props.report.reports.map((report, idx) => (
			<p key={idx}> <span className={PNStyles.role}>{report[0]}</span> {report[1]} </p> 
		)) : null}
	</div>
}
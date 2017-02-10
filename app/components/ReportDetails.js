import React from 'react'

import ReportMetadata from './ReportMetadata'
import OtherReports from './OtherReports'

export default function ReportDetails(props) {
	return <div>
		<ReportMetadata report={props.report} reportedPlayer={props.reportedPlayer} />
		<OtherReports report={props.report} />
	</div>
}
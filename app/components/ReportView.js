import React from 'react'

import Log from './Log'
import Info from './Info'

import Styles from '../styles/ReportView.css'

export default function ReportView(props) {
	return <div className={Styles.default}>
		<Log />
		<Info {...props} />
	</div>
}
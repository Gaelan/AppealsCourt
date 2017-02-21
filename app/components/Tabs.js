import React from 'react'

import Styles from '../styles/Tabs.css'

export default function Tabs(props) {
	return <div className={Styles.container}>
		<div className={props.value == 'juror' ? Styles.on : Styles.off} onClick={() => props.change('juror')}>
			Juror
		</div>
		<div className={props.value == 'judge' ? Styles.on : Styles.off} onClick={() => props.change('judge')}>
			Judge ({props.judgeCount})
		</div>
	</div>
}
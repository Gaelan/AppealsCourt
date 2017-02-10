import React from 'react'
import Spinner from 'react-spinkit'

import Styles from '../styles/Loading.css'

export default function Loading(props) {
	return <div className={Styles.default}>
		<Spinner spinnerName="chasing-dots" />
		<p>{props.message}</p>
	</div>
}
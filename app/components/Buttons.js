import React from 'react';

import Styles from '../styles/Buttons.css'

export default function Buttons(props) {
	return <div className={Styles.outer}>
		<button onClick={props.inno} className={Styles.innocent}>Innocent</button>
		<button onClick={props.guilty} className={Styles.guilty}>Guilty</button>
		<button className={Styles.skip}>»</button>
	</div>
}
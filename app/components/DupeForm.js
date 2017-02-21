import React from 'react'
import Select, {option} from 'rc-select'
import 'rc-select/assets/index.css'

import Styles from '../styles/DupeForm.css'

export default class DupeForm extends React.Component {
	render() {
		return <div className={Styles.default}>
			<select
				value={this.state.reason}
				onChange={this.setReason.bind(this)}
            >
				<option value="1">Hate speech/Harassment</option>
				<option value="2">Impersonating BMG Employee</option>
				<option value="3">Cheating</option>
				<option value="4">Inappropriate Username</option>
				<option value="5">Gamethrowing</option>
				<option value="6">Spamming</option>
				<option value="7">Leaving</option>
				<option value="8">Multi-accounting</option>
			</select>
			<textarea className={Styles.box} value={this.state.description} onChange={this.setDescription.bind(this)} />
			<button className={Styles.button} onClick={this.submit.bind(this)}> Duplicate Report </button>
		</div>
	}

	constructor() {
		super()
		this.state = {reason: 1}
	}

	setReason(evt) {
		this.setState({reason: evt.target.value})
	}

	setDescription(evt) {
		this.setState({description: evt.target.value})
	}

	submit() {
		this.props.close()
		this.props.duplicate(this.state.reason, this.state.description)
	}
}
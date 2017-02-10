import React from 'react'
import Select, {Option} from 'rc-select'
import 'rc-select/assets/index.css'

import Styles from '../styles/DupeForm.css'

export default class DupeForm extends React.Component {
	render() {
		return <div className={Styles.default}>
			<Select
				placeholder="Report Reason"
				className={Styles.menu}
				value={this.state.reason}
				onChange={this.setReason.bind(this)}
				optionLabelProp="children"
            	filterOption={(input, child) => {
            		return String(child.props['children']).toLowerCase().indexOf(input.toLowerCase()) > -1;}
            	}
            >
				<Option key="1" label="HS/H">Hate speech/Harassment</Option>
				<Option key="2">Impersonating BMG Employee</Option>
				<Option key="3">Cheating</Option>
				<Option key="4">Inappropriate Username</Option>
				<Option key="5">Gamethrowing</Option>
				<Option key="6">Spamming</Option>
				<Option key="7">Leaving</Option>
				<Option key="8">Multi-accounting</Option>
			</Select>
			<textarea className={Styles.box} value={this.state.description} onChange={this.setDescription.bind(this)} />
			<button className={Styles.button} onClick={this.submit.bind(this)}> Duplicate Report </button>
		</div>
	}

	constructor() {
		super()
		this.state = {}
	}

	setReason(reason) {
		this.setState({reason})
	}

	setDescription(evt) {
		this.setState({description: evt.target.value})
	}

	submit() {
		this.props.close()
		this.props.duplicate(this.state.reason, this.state.description)
	}
}
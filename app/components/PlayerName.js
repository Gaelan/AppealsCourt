import React from 'react'
import {connect} from 'react-redux'
import Popover from 'react-popover'

import roles from '../roles'
import DupeForm from './DupeForm'
import {duplicateReport} from '../actions'

import Styles from '../styles/PlayerName.css'

class PlayerName extends React.Component {
	render() {
		this._popoverUpdate()
		if(!this.props.player) {
			return <span> {this.props.name} </span>
		}
		const el = (
			<span className={Styles.default} onClick={this.toggle}>
				<span className={(this.props.player.ign == this.props.reportedPlayer) && Styles.highlight}>
					<span className={Styles['role-' + roles[this.props.player.role].colorGroup]}>
						{this.props.player.role}
					</span>
				</span>
				&nbsp;
				<span> {this.props.player.ign} </span>
			</span>
		)
		const ret = this.state.hasOpened ? <Popover isOpen={this.state.open} preferPlace="row" body={<DupeForm duplicate={this.dupe.bind(this)} close={this.toggle.bind(this)}/>}>
			{el}
		</Popover> : el
		return ret
	}

	constructor() {
		super()
		this.state = {open: false, hasOpened: false}
		this.toggle = () => {
			this.setState({hasOpened: true})
			// popover doesn't close if it starts open
			if (this.state.hasOpened) {
				this.setState({open: !this.state.open})
			} else {
				this._popoverUpdate = () => {
					setTimeout((() => this.setState({open: true})), 0)
					this._popoverUpdate = () => {}
				}
			}
		}
		this._popoverUpdate = () => {}
	}

	dupe(reason, desc) {
		this.props.duplicate(this.props.report.id, this.props.name, reason, desc)
	}
}

let lastState
let propsHash
export default connect(
	(state, props) => {
		if (state != lastState) {
			lastState = state
			propsHash = {}
		}
		if(propsHash[props.name]) {
			return propsHash[props.name]
		}
		const ret = propsHash[props.name] = {
			player: state.report.playersByIGN[props.name],
			reportedPlayer: state.report.reportedPlayer,
			report: state.report
		}
		return ret
	},
	{
		duplicate: duplicateReport
	}
)(PlayerName)
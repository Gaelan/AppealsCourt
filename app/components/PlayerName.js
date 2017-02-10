import React from 'react'
import {connect} from 'react-redux'
import Popover from 'react-popover'

import roles from '../roles'
import DupeForm from './DupeForm'
import {duplicateReport} from '../actions'

import Styles from '../styles/PlayerName.css'

class PlayerName extends React.Component {
	render() {
		if(!this.props.player) {
			console.log("UNKNOWN PLAYER")
			return <span> UNKNOWN PLAYER </span>
		}
		return <Popover isOpen={this.state.open} preferPlace="row" body={<DupeForm duplicate={this.dupe.bind(this)} close={this.toggle.bind(this)}/>}>
			<span className={Styles.default} onClick={this.toggle.bind(this)}>
				<span className={(this.props.player.ign == this.props.reportedPlayer) && Styles.highlight}>
					<span className={Styles['role-' + roles[this.props.player.role].colorGroup]}>
						{this.props.player.role}
					</span>
				</span>
				&nbsp;
				<span> {this.props.player.ign} </span>
			</span>
		</Popover>
	}

	constructor() {
		super()
		this.state = {open: false}
	}

	toggle() {
		this.setState({open: !this.state.open})
	}

	dupe(reason, desc) {
		this.props.duplicate(this.props.report.id, this.props.name, reason, desc)
	}
}

export default connect(
	(state, props) => {
		return {
			player: state.report.playersByIGN[props.name],
			reportedPlayer: state.report.reportedPlayer,
			report: state.report
		}
	},
	{
		duplicate: duplicateReport
	}
)(PlayerName)
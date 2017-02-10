import React from 'react'
import Modal from 'react-modal'

import PlayerName from './PlayerName'

import Styles from '../styles/NoteButton.css'

export default class NoteButton extends React.Component {
	render() {
		if (!this.props.note) { return <span /> }
		return <span>
     		<button className={Styles.default} onClick={this.open.bind(this)}>{this.props.abbreviation}</button>
			<Modal isOpen={this.state.open} onRequestClose={this.close.bind(this)} contentLabel="Note">
				<h3> <PlayerName name={this.props.note.owner} /> </h3>
				{this.props.note.lines.map((line, idx) => <div key={idx}> {line} </div>)}
			</Modal>
		</span>
	}

	open() {
		this.setState({open: true})
	}

	close() {
		this.setState({open: false})
	}

	constructor() {
		super()
		this.state = {open: false}
	}
}
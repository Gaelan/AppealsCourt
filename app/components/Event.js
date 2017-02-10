import React from 'react'

import PlayerName from './PlayerName'
import PNStyles from '../styles/PlayerName.css'
import roles from '../roles'
import DupeForm from './DupeForm'

import Styles from '../styles/Event.css'

function ChatEvent(props) {
	return <p className={props.event.scope ? Styles[props.event.scope] : Styles.default}>
		<PlayerName name={props.event.player} />: {props.event.text}
	</p>
}

function DeathEvent(props) {
	return <p className={Styles.default}>
		<PlayerName name={props.event.player} /> was kiled by <span className={PNStyles['role-' + props.event.killer]}> {props.event.killer} </span>
	</p>
}

function WhisperEvent(props) {
	return <p className={Styles.default}>
		<PlayerName name={props.event.player} /> to <PlayerName name={props.event.recipient} />: {props.event.text}
	</p>
}

function RevealEvent(props) {
	return <p className={Styles.default}>
		<PlayerName name={props.event.player} /> has revealed themselves as the mayor!
	</p>
}

function AbilityEvent(props) {
	return <p className={Styles.default}>
		<PlayerName name={props.event.player} /> {props.event.ability} <PlayerName name={props.event.target} />.
	</p>
}

function TransportEvent(props) {
	return <p className={Styles.default}>
		<b className={PNStyles['role-town']}>Transporter</b> swapped <PlayerName name={props.event.swap[0]} /> with <PlayerName name={props.event.swap[1]} /> 
	</p>
}

function WitchEvent(props) {
	return <p className={Styles.default}>
		<b className={PNStyles['role-witch']}>Witch</b> made <PlayerName name={props.event.controlled} /> target <PlayerName name={props.event.target} /> 
	</p>
}

function BiteEvent(props) {
	return <p className={Styles.default}>
		<b className={PNStyles['role-vampire']}>Vampires</b> bit <PlayerName name={props.event.player} />{props.event.fromRole ? <span>, who was a <span className={PNStyles['role-' + roles[props.event.fromRole].colorGroup]}>{props.event.fromRole}</span></span> : null } 
	</p>
}

function LeaveEvent(props) {
	return <p className={Styles.default}>
		<PlayerName name={props.event.player} /> has left the game.
	</p>
}

function VotesEvent(props) {
	return <div>
		<p className={Styles.default}> Guilty: {props.event.guilty.map(x => (
			<span key={x}><PlayerName name={x} />{" "}</span>
		))} </p>
		<p className={Styles.default}> Innocent: {props.event.innocent.map(x => (
			<span key={x}><PlayerName name={x} />{" "}</span>
		))} </p>
		<p className={Styles.default}> Abstained: {props.event.abstain.map(x => (
			<span key={x}><PlayerName name={x} />{" "}</span>
		))} </p>
	</div>
}

function RememberEvent(props) {
	return <p className={Styles.default}>
		<PlayerName name={props.event.player} /> has remembered
		<span className={'role-' + roles[props.event.role].colorGroup}>{props.event.role}</span>
	</p>
}

function ReviveEvent(props) {
	return <p className={Styles.default}>
		<PlayerName name={props.event.player} /> has been revived!
	</p>
}

const types = {
	chat: ChatEvent,
	death: DeathEvent,
	whisper: WhisperEvent,
	reveal: RevealEvent,
	ability: AbilityEvent,
	transport: TransportEvent,
	witch: WitchEvent,
	leave: LeaveEvent,
	votes: VotesEvent,
	remember: RememberEvent,
	revive: ReviveEvent,
	bite: BiteEvent
}

export default class Event extends React.Component {
	render() {
		const EventType = types[this.props.event.type] || `Unknown Event ${props.event.type}`
		return <EventType event={this.props.event} reportedPlayer={this.props.reportedPlayer} />
	}
}
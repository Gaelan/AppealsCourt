import React from 'react'

import PlayerName from './PlayerName'
import NoteButton from './NoteButton'

import Styles from '../styles/PlayerList.css'

export default function PlayerList(props) {
	return <div className={Styles.outer}><table><tbody>
		{props.players.map(player => (
			<tr key={player.ign}>
				<td> {player.username} </td>
				<td className={Styles.ign}> as <PlayerName name={player.ign}/> </td>
				<td> {player.deathPhase ? <span className={Styles.deathPhase}>{player.deathPhase.name}</span> : null } </td>
				<td> <NoteButton note={player.will} abbreviation='W' />  </td>
				<td> <NoteButton note={player.note} abbreviation='DN' /> </td>
			</tr>
		))}
	</tbody></table></div>
}
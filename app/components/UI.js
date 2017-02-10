import React from 'react'
import {connect} from 'react-redux'

import ReportView from './ReportView'
import Loading from './Loading'
import Styles from '../styles/UI.css'
import {vote, confirmVote, cancelVote} from '../actions'

function mapStateToProps(state) {
	return {
		loading: state.loading,
		report: state.report,
		pendingVoteGuilty: state.pendingVoteGuilty,
		dupeState: state.dupeState
	}
}

function mapDispatchToProps(dispatch, ownProps) {
	return {
		inno() {dispatch(vote(false))},
		guilty() {dispatch(vote(true))},
		confirmVote(vote) {dispatch(confirmVote(vote))},
		cancelVote(vote) {dispatch(cancelVote())}
	}
}

export function UI(props) {
	return <div className={Styles.default}>
		{ props.loading
			? <Loading message={props.loading} /> 
			: <ReportView {...props} /> }
	</div>
}

export default connect(mapStateToProps, mapDispatchToProps)(UI)
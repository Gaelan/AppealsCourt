import React from 'react'
import {connect} from 'react-redux'

import ReportView from './ReportView'
import Loading from './Loading'
import Styles from '../styles/UI.css'
import {vote, confirmVote, cancelVote, confirmJudgeVote, switchQueue, skipJudgeReport} from '../actions'

function mapStateToProps(state) {
	return state
}

function mapDispatchToProps(dispatch, ownProps) {
	return {
		inno() {dispatch(vote(false))},
		guilty() {dispatch(vote(true))},
		judgeSkip(id) {dispatch(skipJudgeReport(id))},
		confirmVote(vote) {dispatch(confirmVote(vote))},
		confirmJudgeVote(id, vote, alt) {dispatch(confirmJudgeVote(id, vote, alt))},
		cancelVote(vote) {dispatch(cancelVote())},
		switchType(type) {dispatch(switchQueue(type))}
	}
}

export function UI(props) {
	if (props.exception) {
		return <div className={Styles.default}>
			<p>Flummery, something went wrong. Please send the following to DoodleFungus:</p>
			<textarea value={JSON.stringify(props.exception)} readOnly rows={20}/>
		</div>
	}
	return <div className={Styles.default}>
		{ props.loading
			? <Loading message={props.loading} /> 
			: <ReportView {...props} /> }
	</div>
}

export default connect(mapStateToProps, mapDispatchToProps)(UI)
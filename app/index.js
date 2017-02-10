import React from 'react'
import ReactDOM from 'react-dom'

import App from './components/App'

window.process = {env: {}} // So that prod checks don't break in dev.

const root = jQuery('<div id="root"></div>')
jQuery('body').append(root)

ReactDOM.render(<App />, root[0])
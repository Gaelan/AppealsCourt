import React from 'react'
import ReactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader'

import App from './components/App'
import createStore from './createStore'

window.process = {env: {}} // So that prod checks don't break in dev.

if(process.env.NODE_ENV !== 'production') {
	window.Perf = require('react-addons-perf')
	Perf.start()
}

const root = jQuery('<div id="root"></div>')
jQuery('body').append(root)

const store = createStore()
ReactDOM.render(<AppContainer><App store={store}/></AppContainer>, root[0])

if (module.hot) {
  module.hot.accept('./components/App', () => {
    ReactDOM.render(
      <AppContainer>
        <App store={store}/>
      </AppContainer>,
      document.getElementById('root')
    );
  });
}
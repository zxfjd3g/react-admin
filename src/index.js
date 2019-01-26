/*
入口JS
 */
import React from 'react'
import {render} from 'react-dom'
import {Provider} from 'react-redux'

import storageUtils from './utils/storageUtils'

import App from './App'
import store from './redux/store'

render((
  <Provider store={store}>
    <App/>
  </Provider>
), document.getElementById('root'))
'use strict';

import React from 'react';
import ReactDom from 'react-dom';
import Main from './Main.jsx';

import { Provider } from 'react-redux'
import configureStore from './store/configureStore.dev.jsx';

require('./styles/main.less');


ReactDom.render(
  (
    <Provider store={configureStore()}>
      <Main />
    </Provider>
  ),
  document.getElementById('dnd-tree')
);

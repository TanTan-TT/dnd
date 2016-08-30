
import { combineReducers } from 'redux'

// import {RESET_ERROR_MESSAGE} from '../actions/errorAction.js';
import tree from './treeReducer';
// import energyData from './energyReducer.js';

// Updates error message to notify about the failed fetches.
// function error(state = null, action) {
//   const { type, error } = action
//
//   if (type === RESET_ERROR_MESSAGE) {
//     return null
//   } else if (error) {
//     if(typeof error === 'string'){
//       return action.error
//     }
//     else if(error['message']){
//       return error['message'];
//     }
//     else {
//       return '未知错误';
//     }
//
//   }
//
//   return state
// }

const rootReducer = combineReducers({
  tree
})

export default rootReducer

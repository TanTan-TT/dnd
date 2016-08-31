'use strict';

import Immutable from 'immutable';
// import moment from 'moment';
import {
  TREE_LOAD_SUCCESS,
  TREE_LOAD_REQUEST
  // WEATHER_LOAD_FAILURE
} from '../actions/treeAction';
import assign from 'object-assign';


var defaultState = Immutable.fromJS({
  isFetching:false,
  data:null,
});

function getItem(data) {
  return {
    Id:data.Id,
    Type:data.Type,
    Name:data.Name
  }
}

function map(data,fn) {
  if(data){
    return data.map(fn);
  }
  return [];
}

function rec(data) {
  return assign(
      getItem(data),
      {
        Children:map(data.Children,(item)=>{
          return rec(item)
        })
      }
    )
}

function getValidTreeData(data) {
  return rec(data);
}

function updateData(state,action) {
  // console.log(action);
  var {response:{Result}} = action;


  return state.set('data',Immutable.fromJS(getValidTreeData(Result))).set('isFetching',false);
}

// function handleError(state,action) {
//   var {Error} = action.error;
//   // console.warn('handleError',action);
//
//   switch (Error) {
//     case '050001212602':
//       action.error = '该手机号在系统内未注册';
//       break;
//     default:
//
//   }
//   // console.warn('action',action);
//   return state.set('isFetching',false)
// }

export default function(state=defaultState,action){
  // console.warn('action.type',action.type);
  switch (action.type) {
    case TREE_LOAD_SUCCESS:
      return updateData(state,action);
    case TREE_LOAD_REQUEST:
      return state.set('isFetching',true);
    // case WEATHER_LOAD_FAILURE:
    //   return handleError(state,action);
    default:

  }
  return state;
}

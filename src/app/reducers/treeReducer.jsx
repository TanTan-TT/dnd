'use strict';

import Immutable from 'immutable';
// import moment from 'moment';
import {
  TREE_LOAD_SUCCESS,
  TREE_LOAD_REQUEST,
  DRAG_TREE_SUCCESS
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
    Name:data.Name,
    ChildrenNum:data.Children.length,
    ParentId:data.ParentId
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
function findNodeById(data,id){
  var node;
  var f=function(item){
    if(item.get('Id')===id){
      node=item;
      return
    }
    else if(item.get('Children').size!==0){
      item.get('Children').forEach(child=>{f(child)})
    }
  }
  f(data);
  return node
}
function insertNode(data,destItem){
  var f=function(item){
    let index=item.get('Children').findIndex(el=>el.get('Id')===destItem.get('Id'));
    if(index>-1){
      item=item.setIn(['Children',index],destItem);
      return item
    }
    else if(item.get('Children').size!==0){
      item=item.set('Children',item.get('Children').map(child=>f(child)))
    }
    return item
  }
  data=f(data);
  return data
}
function moveNode(state,action){
  var {source,dest,preId}=action,
      data=state.get('data'),
      sourceItem=data.getIn(source.path);
  sourceItem=sourceItem.set('ParentId',dest.id);
  //first remove
  data=data.deleteIn(source.path);
  if(preId===null){
    var destItem=findNodeById(data,dest.id);
    destItem=destItem.set('Children',destItem.get('Children').size>0?destItem.get('Children').unshift(sourceItem):[sourceItem]);
    data=insertNode(data,destItem);
  }
  else {
    var destItem=findNodeById(data,dest.id),
        preIndex=destItem.get('Children').findIndex(item=>item.get('Id')===preId),
        preItems = destItem.get('Children').filter((item, i) => (i <= preIndex)),
        afterItems = destItem.get('Children').filter((item, i) => (i > preIndex));

        destItem=destItem.set('Children',preItems.push(sourceItem).concat(afterItems));
        data=insertNode(data,destItem);
  }
  return state.set('data',data).set('isFetching',false);
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
    case DRAG_TREE_SUCCESS:
    return moveNode(state,action);
    break;
      //return updateData(state,action);
    default:

  }
  return state;
}

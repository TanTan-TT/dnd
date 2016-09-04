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
import {nodeType} from '../controls/AssetConstants.jsx';

var defaultState = Immutable.fromJS({
  isFetching:false,
  data:null,
});

function getItem(data,cSum) {
  return {
    Id:data.Id,
    Type:data.Type,
    Name:data.Name,
    ParentChildrenSum:cSum,
    ParentId:data.ParentId,
    IsAsset:data.IsAsset,
    HasDataPrivilege:data.HasDataPrivilege
  }
}

function map(data,fn) {
  if(data){
    return data.map(fn);
  }
  return [];
}

function rec(data,cSum) {
  return assign(
      getItem(data,cSum),
      {
        Children:map(data.Children,(item)=>{
          return rec(item,data.Children.length)
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
  var {source,destId,preId}=action,
      data=state.get('data'),
      sourceItem=data.getIn(source.path);
  sourceItem=sourceItem.set('ParentId',destId);
  //first remove
  data=data.deleteIn(source.path);
  if(preId===null){
    var destItem=findNodeById(data,destId);
    sourceItem=sourceItem.set('ParentChildrenSum',1);
    destItem=destItem.set('Children',destItem.get('Children').size>0?destItem.get('Children').push(sourceItem):Immutable.List([sourceItem]));
    data=insertNode(data,destItem);
  }
  else {
    var destItem=findNodeById(data,destId),
        preIndex=destItem.get('Children').findIndex(item=>item.get('Id')===preId),
        preItems = destItem.get('Children').filter((item, i) => (i < preIndex)),
        afterItems = destItem.get('Children').filter((item, i) => (i >= preIndex));
        sourceItem=sourceItem.set('ParentChildrenSum',destItem.get('Children').size+1);
        destItem=destItem.set('Children',preItems.push(sourceItem).concat(afterItems));
        data=insertNode(data,destItem);
  }
  return state.set('data',data).set('isFetching',false);
}
function moveNode(state,action){
  var {source,destId,preId}=action,
      data=state.get('data'),
      sourceItem=data.getIn(source.path);
  sourceItem=sourceItem.set('ParentId',destId);
  //first remove
  data=data.deleteIn(source.path);
  if(preId===null){
    var destItem=findNodeById(data,destId);
    sourceItem=sourceItem.set('ParentChildrenSum',1);
    destItem=destItem.set('Children',destItem.get('Children').size>0?destItem.get('Children').push(sourceItem):Immutable.List([sourceItem]));
    data=insertNode(data,destItem);
  }
  else {
    var destItem=findNodeById(data,destId),
        preIndex=destItem.get('Children').findIndex(item=>item.get('Id')===preId),
        preItems = destItem.get('Children').filter((item, i) => (i < preIndex)),
        afterItems = destItem.get('Children').filter((item, i) => (i >= preIndex));
        sourceItem=sourceItem.set('ParentChildrenSum',destItem.get('Children').size+1);
        destItem=destItem.set('Children',preItems.push(sourceItem).concat(afterItems));
        data=insertNode(data,destItem);
  }
  return state.set('data',data).set('isFetching',false);
}
export function canDropFromBox(node,monitorItem){
  if(!monitorItem.isAsset && monitorItem.type-node.get('Type')<2){
    return true
  }
  return false
}
export function canDropByType(node,monitorItem){
  let type=node.get('Type');
  switch(monitorItem.type) {
    case nodeType.Organization:
    case nodeType.Site:
    case nodeType.Building:
        return type<=monitorItem.type
        break;
    case nodeType.Room:
    case nodeType.Panel:
        return monitorItem.type-type<=1
        break;
    case nodeType.Panel:
        return monitorItem.type-type<=2
        break;
    default:
      // do nothing
  }
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

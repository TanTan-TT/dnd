'use strict'

export const TREE_LOAD_REQUEST = 'TREE_LOAD_REQUEST';
export const TREE_LOAD_SUCCESS = 'TREE_LOAD_SUCCESS';
export const TREE_LOAD_FAILURE = 'TREE_LOAD_FAILURE';


export const DRAG_TREE_SUCCESS = 'DRAG_TREE_SUCCESS';

export function loadTree(){
  return (dispatch, getState) => {
    return dispatch({
        types: [TREE_LOAD_REQUEST, TREE_LOAD_SUCCESS, TREE_LOAD_FAILURE],
        url: 'tree'
    });

  }
}
export function dragNode(source,destId,preId){
  return (dispatch, getState) => {
    return dispatch({
        type: DRAG_TREE_SUCCESS,
        source,
        destId,
        preId,
    });

  }
}

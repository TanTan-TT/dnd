'use strict'

export const TREE_LOAD_REQUEST = 'TREE_LOAD_REQUEST';
export const TREE_LOAD_SUCCESS = 'TREE_LOAD_SUCCESS';
export const TREE_LOAD_FAILURE = 'TREE_LOAD_FAILURE';

export function loadTree(){
  return (dispatch, getState) => {
    return dispatch({
        types: [TREE_LOAD_REQUEST, TREE_LOAD_SUCCESS, TREE_LOAD_FAILURE],
        url: 'tree'
    });

  }
}

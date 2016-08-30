'use strict';

import React, { Component, PropTypes } from 'react';

import assign from 'object-assign';
import classnames from 'classnames';
import Immutable from 'immutable';
// import {first, tail, curry} from 'lodash';

function renderChildrenNode( mapTreeNode, data, paths ) {
	return (childKey, idx) => {
		if( typeof childKey === 'object' ) {
			childKey = idx;
		}
		let newPath = assign([], paths);
		newPath.push(childKey);
		return mapTreeNode( data.get(childKey), newPath );
	};
}

function map(data,renderNode) {
	let mapTreeNode = (data, paths) => {
		let mapTreeNodeChildren = renderChildrenNode(mapTreeNode, data, paths);

		if( data instanceof Immutable.Map ) {
			return renderNode(data, paths, mapTreeNodeChildren);
		} else if( data instanceof Immutable.List ) {
			return data.map( mapTreeNodeChildren ).toJS()
		}
	}
	return mapTreeNode(data, []);
}

class TreeNode extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    return this.props.data === nextProps.data;
  }
  render() {
    let {data, state, paths, childrenKeys, renderNode, mapTreeNodeChildren} = this.props;
    return renderNode(data, state, paths, () => {
      return childrenKeys.map( mapTreeNodeChildren );
    });
  }
}

TreeNode.propTypes = {
	data: PropTypes.object.isRequired,
}

export default class NewTree extends Component {
	render() {
		let {data, renderNode, childrenKeys,className, keyField} = this.props;
    return (
      <div
				className={classnames('tree', {[className]: className})}>
        	{
						map(data,
							(data, paths, mapTreeNodeChildren) => {
		            return (
		              <TreeNode
		                key={keyField ? data.get(keyField) : paths.join('.')}
		                data={data}
		                renderNode={renderNode}
		                paths={paths}
		                childrenKeys={childrenKeys}
		                mapTreeNodeChildren={mapTreeNodeChildren}
		                />
		            );
		        })
					}
      </div>
    );
	}
}

NewTree.propTypes = {
	data: PropTypes.object.isRequired,
	renderNode: PropTypes.func.isRequired,
	className: PropTypes.string,
	keyField: PropTypes.func.isRequired,
	childrenKeys: PropTypes.array.isRequired,
};

// NewTree.filter = ( data, childrenKeys, cb ) => {
// 	let result = Immutable.fromJS([]);
// 	NewTree.each( data, childrenKeys, (itemData, paths, data) => {
// 		if( cb(itemData, paths, data) ) {
// 			result = result.push(itemData);
// 		}
// 	} );
// 	return result;
// }
// NewTree.each = ( data, childrenKeys, cb ) => {
// 	map((itemData, paths, mapTreeNodeChildren) => {
// 		cb(itemData, paths, data);
// 		childrenKeys.map( mapTreeNodeChildren );
// 	}, data);
// }
//
// NewTree.initState = (data, childrenKeys, cb) => {
//   let state;
//   NewTree.each( data, childrenKeys, (itemData, paths, data) => {
//     let itemState = {};
//     if(cb && typeof cb === 'function') {
//       itemState = cb(itemData, paths, data);
//     }
//     if(paths.length === 0) {
//       state = Immutable.fromJS(itemState);
//     } else {
//       state = state.setIn(paths, Immutable.fromJS(itemState));
//     }
//   } );
//   return state;
// };
//
//
// NewTree.flattenObj = curry((flattenKeys, preDataFunc, postDataFunc, data) => {
// 	let result = flattenObjImpl([].concat(flattenKeys), preDataFunc, data, '0');
// 	if(result instanceof Array) {
// 		result = getData(first(result), tail(result));
// 	}
// 	let rawData = Immutable.fromJS(result);
// 	if(!rawData)return;
//   	return rawData.set('data', rawData.get('data').map(postDataFunc));
// });

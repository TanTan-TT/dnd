'use strict';


import React, { PropTypes } from 'react'
import classNames from 'classnames';
import { DropTarget} from 'react-dnd';
import {dragNode} from '../actions/treeAction'
import {connect} from 'react-redux';
import * as tree from '../reducers/treeReducer';

const Types = {
  TREE: 'tree'
};

@DropTarget(
  Types.TREE,
  {
    canDrop:(props,monitor)=>{
      // console.log('canDrop',props.node.get('Name'),monitor.getItem().id);
      // console.log('canDrop',props.node.get('Type'),monitor.getItem().type);
     return monitor.getItem().isAsset?tree.canDropByType(props.node,monitor.getItem()):tree.canDropFromBox(props.node,monitor.getItem())

    },
    hover:(props,monitor,component)=>{
      if(monitor.isOver({shallow:true}) && monitor.canDrop()){
        component.isOverNode(false)
      }
      // console.log('hover',props.node.get('Name'),monitor.getItem().id);
    },
    drop: function (props,monitor,component) {
      // console.log('inset__drop');
      // console.log(monitor.getItem().id);
      // console.log(props.node.get('Name'));
      // console.log(props.before);
      component.props.dragNode(
        monitor.getItem(),
        props.node.get('ParentId'),
        props.before ? props.node.get('Id') : null);
        }
  },
  (connect, monitor) => {
    let canDrop = monitor.canDrop();
    let isOverCurrent = monitor.isOver({shallow:true});
    return {
      connectDropTarget: connect.dropTarget(),
      isOverCurrent,
      canDrop
    };
  }
)

export default class TreeNodeDropBar extends React.Component {
  isOverNode(status){
    this.props.isOverNode(status)
  }
  shouldComponentUpdate(nextProps, nextState) {
    if(nextProps.isOverCurrent !== this.props.isOverCurrent){
      return true;
    }
    return false;
  }
  render () {
    const { isOverCurrent,connectDropTarget,canDrop} = this.props;
    const { paths } = this.props;
    return (
      connectDropTarget(
        <div className={classNames('insertBar',{before:this.props.before,after:!this.props.before})}
              style={{zIndex:10+paths.length}}>
          <div className={
              classNames({show:isOverCurrent && canDrop})
            }>
            <hr />
          </div>
        </div>
      )
    )
  }
}

TreeNodeDropBar.propTypes = {
  node:PropTypes.object,
  paths:PropTypes.array,
  before:PropTypes.bool,
  canDrop:PropTypes.bool,
  connectDropTarget:PropTypes.func,
  isOverCurrent:PropTypes.bool,
  isOverNode:PropTypes.func,
}

function mapStateToProps(state) {
  return {

  };
}

export default connect(mapStateToProps,{dragNode})(TreeNodeDropBar);

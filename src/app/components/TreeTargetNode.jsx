'use strict';


import React, { PropTypes } from 'react'
import {connect} from 'react-redux';
import {dragNode} from '../actions/treeAction'
import { DropTarget} from 'react-dnd';
import * as Func from '../controls/DragFunc.jsx';
import classNames from 'classnames';

const Types = {
  TREE: 'tree'
};

var currentNode = null;
var currentNodeHoverTime = null;

@DropTarget(Types.TREE,
  {
    canDrop:(props,monitor)=>{
      if(props.node.get('Id') === monitor.getItem().id){
        return false;
      }
      if(props.node.get('Type') > monitor.getItem().type){
        return false;
      }
      console.log('canDrop');
      return true;
    },
    hover:(props,monitor,component)=>{
      console.log('hover',props.node.get('Name'));
      if(!monitor.isOver({ shallow: true })
          || !component.canExpand()) return;
      if(component.props.node !== props.node){
        currentNode = component;
        currentNodeHoverTime = new Date().getTime();
      }
      else {
        let delta = new Date().getTime() - currentNodeHoverTime;
        console.log('delta',delta);
        if(delta > 500){
          currentNode = null;
          currentNodeHoverTime = null;
          component.expand();
        }
      }
    },
    drop: (props,monitor) => {
      console.log('over__drop');
      console.log(monitor.getItem().id);
      console.log(props.node.get('Name'));
      if(props.node.get('childrenNum')===0){
        props.dragNode(monitor.getItem().id,props.node.get('Id'),null);
      }

    }
  },
  (connect, monitor) => {
    let canDrop = monitor.canDrop();
    return {
      connectDropTarget: connect.dropTarget(),
      isTargetDragging:!!monitor.getItem(),
      canDrop
    };
  }
)
class TreeTargetNode extends React.Component {
  canExpand(){
    return this.props.canExpand();
  }
  expand(){
    this.props.expand();
  }
  render () {
    const {connectDropTarget,isTargetDragging,canDrop} = this.props;
    return connectDropTarget(
      <span className={classNames({cannotDrop:(isTargetDragging && !canDrop)})}>{this.props.node.get('Name')}</span>
    )
  }
}

TreeTargetNode.propTypes = {
  node:PropTypes.object,
  canExpand:PropTypes.func,
  expand:PropTypes.func,
  isTargetDragging:PropTypes.bool,
  canDrop:PropTypes.bool,
  connectDropTarget: PropTypes.func.isRequired,
};

function mapStateToProps(state) {
  return {

  };
}

export default connect(mapStateToProps,{dragNode})(TreeTargetNode);

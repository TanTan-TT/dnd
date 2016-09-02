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
      return true;
    },
    hover:(props,monitor,component)=>{
      //console.log('hover',props.node.get('Name'));
      // console.log(component.props.node.get('Name'));
      //  console.log(props.node.get('Name'));
      if(!monitor.isOver({ shallow: true })
          || !component.canExpand()) return;
      if(component.props.node !== props.node){
        currentNode = component;
        currentNodeHoverTime = new Date().getTime();
      }
      else {
        if(currentNodeHoverTime===null){
          currentNodeHoverTime = new Date().getTime();
          return;
        }
        let delta = new Date().getTime() - currentNodeHoverTime;
        if(delta > 500){
          currentNode = null;
          currentNodeHoverTime = null;
          component.expand();
        }
      }
    },
    drop: (props,monitor) => {
      // console.log('over__drop');
      // console.log(monitor.getItem().id);
      // console.log(props.node.get('Name'));

        props.dragNode(monitor.getItem(),props.node.get('Id'),null);


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

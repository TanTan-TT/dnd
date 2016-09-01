'use strict';


import React, { PropTypes } from 'react'
import classNames from 'classnames';
import { DropTarget} from 'react-dnd';


const Types = {
  TREE: 'tree'
};

@DropTarget(
  Types.TREE,
  {
    canDrop:(props,monitor)=>{
      // console.log('canDrop',props.node.get('Name'),monitor.getItem().id);
      // console.log('canDrop',props.node.get('Type'),monitor.getItem().type);

      return true;

    },
    hover:(props,monitor,component)=>{
      // console.log('hover',props.node.get('Name'),monitor.getItem().id);
      if(monitor.isOver({shallow:true})){
        // console.log('hover');
        // component.scrollTree();
      }
    },
  },
  (connect, monitor) => {
    return {
      connectDropTarget: connect.dropTarget(),

    };
  }
)
export default class TreeScrollTarget extends React.Component {
  scrollTree(){
    this.props.scrollTree();
  }
  render () {
    const { connectDropTarget } = this.props;
    return (
      connectDropTarget(
        <div className="tree-scroll-holder">
        </div>
      )
    )
  }
}

TreeScrollTarget.propTypes = {
  show:PropTypes.bool,
  before:PropTypes.bool,
}

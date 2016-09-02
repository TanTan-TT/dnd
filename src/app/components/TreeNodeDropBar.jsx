'use strict';


import React, { PropTypes } from 'react'
import classNames from 'classnames';
import { DropTarget} from 'react-dnd';
import {dragNode} from '../actions/treeAction'
import {connect} from 'react-redux';

const Types = {
  TREE: 'tree'
};

@DropTarget(
  Types.TREE,
  {
    canDrop:(props,monitor)=>{
      // console.log('canDrop',props.node.get('Name'),monitor.getItem().id);
      // console.log('canDrop',props.node.get('Type'),monitor.getItem().type);
      if(props.node.get('Id') === monitor.getItem().id){
        return false;
      }
      if(props.node.get('Type') > monitor.getItem().type){
        return false;
      }
      return true;

    },
    hover:(props,monitor,component)=>{
      // console.log('hover',props.node.get('Name'),monitor.getItem().id);
    },
    drop: function (props,monitor,component) {
      component.props.dragNode(
        monitor.getItem(),{
          id:props.node.get('ParentId'),
          path:props.paths.slice(0,props.paths.length-2)},
          props.before ? null : props.node.get('Id'));
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
 class TreeNodeDropBar extends React.Component {
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
}

function mapStateToProps(state) {
  return {

  };
}

export default connect(mapStateToProps,{dragNode})(TreeNodeDropBar);

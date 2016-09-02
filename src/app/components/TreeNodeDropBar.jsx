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
    drop: function (props,monitor,component) {
      console.log('inset__drop');
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

class TreeNodeDropBar extends React.Component {
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
}

function mapStateToProps(state) {
  return {

  };
}

export default connect(mapStateToProps,{dragNode})(TreeNodeDropBar);

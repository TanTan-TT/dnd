'use strict';


import React, { PropTypes } from 'react'
import classNames from 'classnames';
import { DropTarget} from 'react-dnd';
import * as Func from '../controls/DragFunc.jsx';

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
    drop: function (props) {
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
  render () {
    const { isOverCurrent,connectDropTarget } = this.props;
    const { paths } = this.props;
    return (
      connectDropTarget(
        <div className={classNames('insertBar',{before:this.props.before,after:!this.props.before})}
              style={{zIndex:10+paths.length}}>
          <div className={
              classNames({show:isOverCurrent})
            }>
            <hr />
          </div>
        </div>
      )
    )
  }
}

TreeNodeDropBar.propTypes = {
  show:PropTypes.bool,
  before:PropTypes.bool,
}

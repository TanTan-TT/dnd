'use strict';


import React, { PropTypes } from 'react';
import classNames from 'classnames';
import { DragSource,DropTarget} from 'react-dnd';
import * as Func from '../controls/DragFunc.jsx';

const Types = {
  TREE: 'tree'
};

@DragSource(Types.TREE,Func.source,Func.sourceCollect)
@DropTarget(Types.TREE,Func.target,Func.targetCollect)
export default class TreeNode extends React.Component {
  state = {
    collapsed:false
  };
  render () {
    const { connectDragSource,connectDropTarget,isDragging,canDrop,isOverCurrent } = this.props;

    let hasChild=this.props.node.get('Children') && this.props.node.get('Children').size > 0;
    return (
      connectDropTarget(connectDragSource(
        <div className={classNames('pop-tree-node-container',{'isDragging':isDragging})}>
          <div className="tree-node"
            style={{marginLeft: 24+( this.props.paths.length - 1) * 11}}
          title={this.props.node.get("Name")}>

            <div className={classNames({
                "hasNoChild": !hasChild
              })}>
              <em className={
                  classNames({
                    "fa icon-hierarchy-unfold": !this.state.collapsed,
                    "fa icon-hierarchy-fold"  : this.state.collapsed,
                  })}
                  onClick={() => {
                    this.setState({
                      collapsed:!this.state.collapsed
                  })
              }}/>

            </div>

            <span className={classNames({canDrop,cannotDrop:isDragging && !cannotDrop})}>{this.props.node.get('Name')}</span>
            <div className={classNames("insertBar",{show:isOverCurrent})}>
              <hr />
            </div>
          </div>

          <div className={classNames("tree-children",{collapsed:this.state.collapsed})}>
            {this.props.children}
          </div>
        </div>
      ))

    )
  }
}

TreeNode.propTypes = {
  node:PropTypes.object,
  paths:PropTypes.array,
  children:PropTypes.object,
  isDragging:PropTypes.bool,
  canDrop:PropTypes.bool,
  isOverCurrent:PropTypes.bool,
  connectDropTarget: PropTypes.func.isRequired,
  connectDragSource: PropTypes.func.isRequired
};

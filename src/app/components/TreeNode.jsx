'use strict';


import React, { PropTypes } from 'react';
import classNames from 'classnames';
import { DragSource,DropTarget} from 'react-dnd';
import * as Func from '../controls/DragFunc.jsx';
import TreeNodeDropBar from './TreeNodeDropBar.jsx';

const Types = {
  TREE: 'tree'
};

@DragSource(Types.TREE,Func.source,Func.sourceCollect)
@DropTarget(Types.TREE,Func.target,Func.targetCollect)
export default class TreeNode extends React.Component {
  state = {
    collapsed:false
  };
  _getInsertBar(type,isFirst){
    let before = null;
    if(type === 'top'){
      if(isFirst){
        before = true;
      }
    }
    else if(type === 'bottom') {
      before = false;
    }
    if(before !== null){
      return (<TreeNodeDropBar paths={this.props.paths} node={this.props.node} before={before} />);
    }
    return null;
  }
  _getIcon(){
    let hasChild=this.props.node.get('Children') && this.props.node.get('Children').size > 0;
    if(hasChild){
      return (
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
      );
    }
    return null;
  }
  _getNodeName(){
    // console.log('canDrop',canDrop);
    // console.log('isTargetDragging',isTargetDragging);
    return (<span>{this.props.node.get('Name')}</span>)
  }
  _getChildren(){
    return (
      <div className={classNames("tree-children",{collapsed:this.state.collapsed})}>
        {this.props.children}
      </div>
    );
  }
  render () {
    const { connectDragSource,connectDropTarget,isDragging,canDrop,isTargetDragging,isOverCurrent } = this.props;
    // console.log('path',this.props.paths);
    const isFirst = this.props.paths[this.props.paths.length-1] === 0;
    return (
      connectDragSource(
        <div className={classNames('pop-tree-node-container',{'isDragging':isDragging})}
              style={{zIndex:9+this.props.paths.length}}>
          <div className={classNames("tree-node",{cannotDrop:(isTargetDragging && !canDrop)})}

              title={this.props.node.get("Name")}>
            {this._getInsertBar('top',isFirst)}
            {this._getIcon()}
            {this._getNodeName()}
            {this._getInsertBar('bottom')}
          </div>

          {this._getChildren()}
          {this.props.node.get('Children').size > 0 ? this._getInsertBar('bottom') : null}

        </div>
      )

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

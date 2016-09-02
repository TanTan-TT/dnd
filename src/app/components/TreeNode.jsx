'use strict';


import React, { PropTypes } from 'react';
import classNames from 'classnames';
import { DragSource} from 'react-dnd';
import * as Func from '../controls/DragFunc.jsx';
import TreeNodeDropBar from './TreeNodeDropBar.jsx';
import TreeNodePreview from './TreeNodePreview.jsx';
import TreeTargetNode from './TreeTargetNode';

const Types = {
  TREE: 'tree'
};

@DragSource(Types.TREE,Func.source,Func.sourceCollect)
export default class TreeNode extends React.Component {
  state = {
    collapsed:false
  };
  _getInsertBar(type,isLast){
    let before = null;
    if(type === 'bottom'){
      if(isLast){
        before = false;
      }
    }
    else if(type === 'top') {
      before = true;
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
    return (
      <TreeTargetNode
        node={this.props.node}
        expand={()=>this.expand()}
        canExpand={()=>this.canExpand()} />)
  }
  _getChildren(){
    return (
      <div className={classNames("tree-children",{collapsed:this.state.collapsed})}>
        {this.props.children}
      </div>
    );
  }
  expand(){
    if(this.state.collapsed){
      this.setState({collapsed:false});
    }
  }
  canExpand(){
    if(this.props.node.get('Children').size === 0 ) return false;
    if(this.state.collapsed === false) return false;
    return true;
  }
  shouldComponentUpdate(nextProps, nextState) {
    if(this.props.node !== nextProps.node){
      return true;
    }
    if(this.state.collapsed !== nextState.collapsed){
      return true;
    }
    if(this.props.isDragging !== nextProps.isDragging){
      return true;
    }

    return false;
  }
  render () {
    const {node,connectDragSource,isDragging,connectDragPreview,canExpand} = this.props;
    // console.log('path',this.props.paths);
    //const isFirst = this.props.paths[this.props.paths.length-1] === 0;
    const isLast = this.props.paths[this.props.paths.length-1] === node.get('ParentChildrenSum')-1;
    return (
      connectDragSource(
        (<div className={classNames('pop-tree-node-container',{'isDragging':isDragging})}
              style={{zIndex:9+this.props.paths.length}}>
          <div className={classNames("tree-node")}

              title={node.get("Name")}>
            {this._getInsertBar('top')}
            {this._getIcon()}
            {this._getNodeName()}
            {this._getInsertBar('bottom',isLast)}
          </div>

          {this._getChildren()}
          {node.get('Children').size > 0 ? this._getInsertBar('bottom',true) : null}
        </div>
      )
    ))
  }
}

TreeNode.propTypes = {
  node:PropTypes.object,
  paths:PropTypes.array,
  children:PropTypes.object,
  isDragging:PropTypes.bool,
  canDrop:PropTypes.bool,
  canExpand:PropTypes.bool,
  isTargetDragging:PropTypes.bool,
  connectDropTarget: PropTypes.func.isRequired,
  connectDragSource: PropTypes.func.isRequired,
  connectDragPreview: PropTypes.func.isRequired,
};

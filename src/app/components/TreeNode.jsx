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
    let collapsedProps={
            className:'arrow',
            onClick:() => {
              this.setState({
                collapsed:!this.state.collapsed
              })
              }
                };
      let hasChild=this.props.node.get('Children') && this.props.node.get('Children').size > 0;
    return (
      <div className="pop-tree-node-container">
        <div className='tree-node'
          style={{paddingLeft: 24+( this.props.paths.length - 1) * 11}}
        title={this.props.node.get("Name")}>

          <div className={classNames({
              "hasNoChild": !hasChild
            })}>
            <div className={classNames({
                "fa icon-hierarchy-unfold": !this.state.collapsed,
                "fa icon-hierarchy-fold"  : this.state.collapsed,
                })}
                onClick={() => {
                  this.setState({
                    collapsed:!this.state.collapsed
                  })
                  }}/>

          </div>
          {this.props.node.get('Name')}
        </div>

        <div className='tree-children'>
          {!this.state.collapsed &&this.props.children}
        </div>
      </div>
    )
  }
}

TreeNode.propTypes = {
  node:PropTypes.object,
  paths:PropTypes.array,
};

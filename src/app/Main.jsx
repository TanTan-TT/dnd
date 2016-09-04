'use strict';

import React, { PropTypes } from 'react';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import {connect} from 'react-redux';
import {loadTree} from './actions/treeAction';
import Tree from './components/Tree';
import TreeNode from './components/TreeNode';
import TreeNodePreview from './components/TreeNodePreview.jsx';



const CHILDRENKEYS = ['Children'];

class Main extends React.Component {
  state = {
    collapsed:false,
    isOverNode:false,
  };
  constructor(props) {
  super(props);
  this.overNode = this.overNode.bind(this);
}
  _onScroll(){
    this._tree.scroll();
  }
  overNode(isOverNode,collapsed){
    this.setState({
      isOverNode:isOverNode,
      collapsed:collapsed
    })
  }
  componentDidMount() {
    this.props.loadTree();
  }
  render () {
    if(this.props.tree.get('isFetching')){
      return (
        <div>Tree will be rendered</div>
      )
    }
    else {
      return (
        <div>
          <TreeNodePreview {...this.state}/>
          <Tree
            ref={(tree)=>this._tree}
            childrenKeys={CHILDRENKEYS}
            data={this.props.tree.get('data')}
            renderNode={
              (node, state, paths, renderChildren) => {
                return (
                  <TreeNode refs='TreeNode' node={node} paths={paths} overNode={this.overNode}>{renderChildren()}</TreeNode>
                );
              }
            }
          />
        </div>


      )
    }
  }
}

function mapStateToProps(state) {
  return {
    tree:state.tree,
  };
}

Main.propTypes = {
  tree:PropTypes.object,
  loadTree:PropTypes.func,
}

export default connect(mapStateToProps,{loadTree})(DragDropContext(HTML5Backend)(Main));

// export default Main;

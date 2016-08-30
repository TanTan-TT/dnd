'use strict';

import React, { PropTypes } from 'react'
import {connect} from 'react-redux';
import {loadTree} from './actions/treeAction';
import Tree from './components/Tree';
import TreeNode from './components/TreeNode';


const CHILDRENKEYS = ['Children'];

class Main extends React.Component {
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
        <Tree
          childrenKeys={CHILDRENKEYS}
          data={this.props.tree.get('data')}
          renderNode={
            (node, state, paths, renderChildren) => {
              return (
                <TreeNode node={node}>{renderChildren()}</TreeNode>
              );
            }
          }
        />
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


export default connect(mapStateToProps,{loadTree})(Main);

// export default Main;

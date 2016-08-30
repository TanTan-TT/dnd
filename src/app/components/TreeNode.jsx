'use strict';


import React, { PropTypes } from 'react'

export default class TreeNode extends React.Component {
  render () {
    return (
      <div>
        {this.props.get('Name')}
        <div style={{paddingLeft: 20}}>
          {this.props.children}
        </div>
      </div>
    )
  }
}

TreeNode.propTypes = {
  data:PropTypes.object,
}

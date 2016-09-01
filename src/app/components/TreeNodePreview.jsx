import React, { PropTypes } from 'react'
export default class TreeNodePreview extends React.Component {
  render () {
    const { canExpand } = this.props;
    if(canExpand){
      return(
        <div>{'即将展开'}</div>
      )
    }
    else {
      return(
        <div>'可以拖入'</div>
      )
    }
  }
}

TreeNodePreview.propTypes = {
  canExpand:PropTypes.bool,
}

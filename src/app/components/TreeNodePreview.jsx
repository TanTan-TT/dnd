import React, { PropTypes } from 'react';
import { DragLayer } from 'react-dnd';

const layerStyles = {
  position: 'fixed',
  pointerEvents: 'none',
  zIndex: 100,
  left: 0,
  top: 0,
  width: '100%',
  height: '100%'
};

@DragLayer(monitor => ({
  item: monitor.getItem(),
  itemType: monitor.getItemType(),
  isDragging: monitor.isDragging(),
  currentOffset: monitor.getSourceClientOffset(),
}))
export default class TreeNodePreview extends React.Component {
  render () {
    const { item,itemType,isDragging,currentOffset} = this.props;
if (!isDragging || !currentOffset) {
  return null;
}else {
  var layerStyles = {
    position: 'fixed',
    pointerEvents: 'none',
    zIndex: 100,
    left: currentOffset.x,
    top: currentOffset.y,
    width: '100%',
    height: '100%',
    color:'red'
  };
  var iconClass;
  if(!this.props.isOverNode){
    iconClass='icon-column-fold'
  }
  else if(!this.props.collapsed){
    iconClass='icon-hierarchy-fold'
  }
  return (
    <div style={layerStyles} className={iconClass}/>
  );
}


  }
}

TreeNodePreview.propTypes = {
  item: PropTypes.object,
itemType: PropTypes.string,
    currentOffset: PropTypes.shape({
      x: PropTypes.number.isRequired,
      y: PropTypes.number.isRequired
    }),
    isDragging: PropTypes.bool.isRequired,
    collapsed:PropTypes.bool,
    isOverNode:PropTypes.bool,
}

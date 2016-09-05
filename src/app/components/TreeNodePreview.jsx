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
function getItemStyles(props) {
  const { initialOffset, currentOffset } = props;
  if (!initialOffset || !currentOffset) {
    return {
      display: 'none'
    };
  }

  let { x, y } = currentOffset;


  const transform = `translate(${x}px, ${y}px)`;
  return {
    transform: transform,
    WebkitTransform: transform
  };
}
@DragLayer(monitor => ({
  item: monitor.getItem(),
  itemType: monitor.getItemType(),
  isDragging: monitor.isDragging(),
  currentOffset: monitor.getSourceClientOffset(),
  initialOffset: monitor.getInitialSourceClientOffset(),
}))
export default class TreeNodePreview extends React.Component {
  render () {
    const {isDragging,currentOffset} = this.props;
if (!isDragging || !currentOffset) {
  return null;
}else {

  var iconClass;
  if(!this.props.isOverNode){
    iconClass='icon-column-fold'
  }
  else if(!this.props.collapsed){
    iconClass='icon-hierarchy-fold'
  }
  return (
    <div style={layerStyles}>
      <div style={getItemStyles(this.props)} className={iconClass}/>
    </div>
  );
}


  }
}

TreeNodePreview.propTypes = {
  item: PropTypes.object,
  itemType: PropTypes.string,
  initialOffset: PropTypes.shape({
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired
}),
  currentOffset: PropTypes.shape({
      x: PropTypes.number.isRequired,
      y: PropTypes.number.isRequired
    }),
    isDragging: PropTypes.bool.isRequired,
    collapsed:PropTypes.bool,
    isOverNode:PropTypes.bool,
}

export var source = {
  beginDrag: function (props) {
    console.log('beginDrag');
    // Return the data describing the dragged item
    var item = { id: props.node.get('Id') };
    console.log('item',item);
    return item;
  },
};
export function sourceCollect(connect, monitor) {
  return {
    // Call this function inside render()
    // to let React DnD handle the drag events:
    connectDragSource: connect.dragSource(),
    // You can ask the monitor about the current drag state:
    isDragging: monitor.isDragging()
  };
}
export var target = {
  drop: function (props) {
  }
};
export function targetCollect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver()
  };
}

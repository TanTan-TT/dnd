export var source = {
  beginDrag: function (props) {
    console.log('beginDrag');
    // Return the data describing the dragged item
    var item = {
      id: props.node.get('Id'),
      type: props.node.get('Type')
    };
    // console.log('item',item);
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
  canDrop:(props,monitor)=>{

    if(props.node.get('Id') === monitor.getItem().id){
      return false;
    }
    if(props.node.get('Type') > monitor.getItem().type){
      return false;
    }
    return true;

  },
  hover:(props,monitor,component)=>{
    // console.log('hover',props.node.get('Name'),monitor.getItem().id);
  },
  drop: function (props) {
  }
};
export function targetCollect(connect, monitor) {
  let canDrop = monitor.canDrop();
  let isOverCurrent = monitor.isOver({shallow:true});
  if(!canDrop && isOverCurrent) isOverCurrent = false;
  return {
    connectDropTarget: connect.dropTarget(),
    isTargetDragging:!!monitor.getItem(),
    isOverCurrent,
    canDrop
  };
}

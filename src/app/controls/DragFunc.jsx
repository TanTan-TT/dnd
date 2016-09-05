'use strict';

var currentNode = null;
var currentNodeHoverTime = null;
export var source = {
  beginDrag: function (props) {
    // console.log('beginDrag');
    // Return the data describing the dragged item
    var item = {
      id: props.node.get('Id'),
      type: props.node.get('Type'),
      name:props.node.get('Name'),
      path: props.paths,
      isAsset:props.node.get('IsAsset'),
    };
    // console.log('item',item);
    return item;
  },
  endDrag:()=>{
    currentNode = null;
    currentNodeHoverTime = null;
  },
  canDrag(props){
    //console.log(props.node.get('Type'));
    if(props.node.get('Type')===-1){
      return false
    }
    return true
  }
};
export function sourceCollect(connect, monitor) {
  return {
    // Call this function inside render()
    // to let React DnD handle the drag events:
    connectDragSource: connect.dragSource(),
    // You can ask the monitor about the current drag state:
    isDragging: monitor.isDragging(),
    canExpand:currentNode!==null,
    connectDragPreview: connect.dragPreview(),
  };
}

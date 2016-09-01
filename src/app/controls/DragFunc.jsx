import {dragNode} from '../actions/treeAction'
var currentNode = null;
var currentNodeHoverTime = null;
export var source = {
  beginDrag: function (props) {
    console.log('beginDrag');
    // Return the data describing the dragged item
    var item = {
      id: props.node.get('Id'),
      type: props.node.get('Type'),
      path:props.paths
    };
    // console.log('item',item);
    return item;
  },
  endDrag:()=>{
    currentNode = null;
    currentNodeHoverTime = null;
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
    if(!monitor.isOver({ shallow: true })
        || !component.canExpand()) return;
    if(component.props.node !== props.node){
      currentNode = component;
      currentNodeHoverTime = new Date().getTime();
    }
    else {
      let delta = new Date().getTime() - currentNodeHoverTime;
      console.log('delta',delta);
      if(delta > 500){
        currentNode = null;
        currentNodeHoverTime = null;
        component.expand();
      }
    }
  },
  drop: function (props,monitor) {
    console.log('over__drop');
    console.log(monitor.getItem().id);
    console.log(props.node.get('Name'));
    if(props.node.get('childrenNum')===0){
      dragNode(monitor.getItem().id,props.node.get('Id'),null);
    }

  }
};
export function targetCollect(connect, monitor) {
  let canDrop = monitor.canDrop();
  return {
    connectDropTarget: connect.dropTarget(),
    isTargetDragging:!!monitor.getItem(),
    canDrop
  };
}

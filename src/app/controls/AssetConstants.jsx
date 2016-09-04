import keyMirror from 'keymirror';

module.exports = {
  editStatus: keyMirror({
    ADD_STATUS: null,
    EDIT_STATUS: null,
    VIEW_STATUS: null
  }),

  nodeType: {
    Customer: -1,
    Organization: 0,
    Site: 1,
    Building: 2,
    Room: 3,
    Panel: 4,
    Device: 5
  },

  nodeTypeDes:{
    "-1" : '客户',
    "0" : '组织',
    "1" : '园区',
    "2" : '建筑',
    "3" : '配电室',
    "4" : '配电柜',
    "5" : '设备'
  },
  addingNodeId:-10000,

};

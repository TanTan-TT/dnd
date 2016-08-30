

import request from 'superagent';
// var Promise = require('es6-promise').Promise;
import assign from 'object-assign';
// export var TOKENHEADER = "disco-token";

// var _BASEURL = "http://mobile.poptest.energymost.com/pop/v2.4.0/Mobile/api/";
//dev
// var _BASEURL = 'http://121.41.53.66/Pop/v2.2.0/mobile/api/';
//pro
// var PROD_BASEURL = "http://mobile.fm.energymost.com/api/";
var _BASEURL = "http://localhost:8080/api/";
// var _BASEURL = 'http://121.199.24.158/test/v2.6.0/OpenApi/API/';

export function getBaseUri() {
  return _BASEURL;
}



var defaultFetch = function(options){

  // var isProd = await storage.getItem('prod');
  // console.warn('appInfo.get().prod',appInfo.get().prod);
  var baseUrl = _BASEURL;


  // console.log(token);
  var headers = {
    "Content-Type":"application/json",
    'Accept': 'application/json',
  };


  var url ;
  if(options.url.indexOf('http') >= 0){
    url = options.url;
  }
  else {
    url = baseUrl + options.url;
  }

  // console.log('url:%s',url);
  // console.log(headers);
  // console.log(options.body);
  if(options.verb === 'get'){
    return new Promise((resolve)=>{
      request
      .get(url)
      .end(function(err, res){
        if(!err){
          resolve(res.body);
        }
      });
    })

  }
  else {
    return new Promise((resolve)=>{
      request
      .post(url)
      .send(options.body).
      set(headers)
      .end(function(err, res){
        if(!err){
          resolve(res.body);
        }
      });
    })
  }


  return fetch(url,
    {
      method:options.verb,
      headers,
      mode:'no-cors',
      credentials:'omit',
      body: JSON.stringify(options.body)
    })
    .then((response)=>{
      // console.warn('response',response);
      if(response.ok){
        if(response.status === 204){
          return new Promise((resolve)=>{
            resolve({Result:true,Error:'0'});
          })
        }
        return response.json()
      }
      else {
          return Promise.reject('error');
      }

    })
    .then((data)=>{

      if(data){
        if(data.Error && data.Error === '0'){
          return data;
        }
        else {
          return data;
        }

      }
      else{
        return Promise.reject(data);
      }

    });
}



export default (store) => (next) => (action) => {
  // console.log(action);
  let {url,body,types} = action;
  // console.log('url:%s',url);
  if (typeof url === 'undefined') {
    return next(action);
  }


  const [requestType, successType, failureType] = types;
  next(assign({}, action, { type: requestType }));

  return defaultFetch({url,body,verb:body?'post':"get"}).then((data)=>{
    next(assign({},action,{type:successType,response:data}));
  },(error)=>{

    next(assign({},action,{type:failureType,error}));
  });

};

var Hapi = require("hapi");
var fs = require("fs");
var path = require("path");


// load bundle information from stats
var stats = require("../../build/stats.json");

var publicPath = stats.publicPath;

var STYLE_URL = publicPath + "main.css?" + stats.hash;
var APP_URL = publicPath + [].concat(stats.assetsByChunkName.main)[0];
// var VENDOR_URL = publicPath + [].concat(stats.assetsByChunkName.vendors)[0];
var FAVICON_ICON = publicPath + "favicon.ico?" + stats.hash;
//console.log(SCRIPT_URL);
/**
 * Start Hapi server on port 8080.
 */
var server = new Hapi.Server();

server.connection({
  port: 8080
});

function returnIndexHtml(request, reply) {
  var html = fs.readFileSync(path.resolve(__dirname, "../app/index.html"), "utf-8");
  html = html.replace('APP_URL', APP_URL);
  html = html.replace('STYLE_URL', STYLE_URL);
  html = html.replace('FAVICON_ICON', FAVICON_ICON);
  var res = reply(html).type("text/html");
  return res;
}


server.route({
  method: 'GET',
  path: '/{any?}',
  handler: returnIndexHtml
});




server.route({
  method: 'GET',
  path: '/api/picture/{id}',
  handler: function(request, reply) {
    var file = function(str) {
      return fs.readFileSync(str);
    }
    var id = request.paramsArray[0].toString();
    if (id.indexOf('sl') >= 0) {
      reply(file('src/server/right.jpg'));
      return;
    }
    if (id.indexOf('1ll') >= 0) {
      reply(file('src/server/singleline.jpg'));
      return;
    }
    if (id.indexOf('sc') >= 0) {
      reply(file('src/server/scene.jpg'));
      return;
    }
    if (id == "site") {
      reply(file('src/server/site.jpg'));
      return;
    }
    if (id == "building") {
      reply(file('src/server/building.jpg'));
      return;
    }
    if (id == "room") {
      reply(file('src/server/site.jpg'));
      return;
    }
    if (id == "100001" || id == '-1') {
      reply(file('src/server/tianjing.png'));
      return;
    }
    if (id == "100002") {
      reply(file('src/server/soho.png'));
      return;
    }
    if (id == "100003") {
      reply(file('src/server/se.png'));
      return;
    }

    reply({
      Error: 0,
      Message: [""],
      Result: {}
    }).type("application/json");
  }
});


// paging
server.route({
  method: 'GET',
  path: '/api/tree',
  handler: function(request, reply) {
    // sleep(1000);
    // console.log("api/tree");
    var filePath = path.join(__dirname,'data.json');
    // console.log(filePath);
    var content = fs.readFileSync(filePath,'utf8');
    reply(JSON.parse(content)).type("application/json");
  }
});

function sleep(milliSeconds) {
  var startTime = new Date().getTime();
  while (new Date().getTime() < startTime + milliSeconds);
}



server.start(function() {
  //Log to the console the host and port info
  console.log('Server started at: ' + server.info.uri);
});

module.exports = server;

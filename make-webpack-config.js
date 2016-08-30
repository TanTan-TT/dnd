
module.exports = function(options) {
	var path = require("path");
	var webpack = require("webpack");
	var ExtractTextPlugin = require("extract-text-webpack-plugin");
	// var extractLessModule = require("./extract-less-webpack-module.js");
	var fs = require('fs');
	var appRoot = path.join(__dirname, "src","app");
	var entry = {
		main: path.join(appRoot,"app.jsx"),
		// vendors:"./reference.jsx",
		// favicon: path.join(appRoot, "less/images/favicon.ico")
	};

	(function(){ // check build folder

		var bp = path.join(__dirname, "build");
		if (!fs.existsSync(bp)){
		    fs.mkdirSync(bp);
		}


	})();

	var additionalLoaders = [
		// { test: /some-reg-exp$/, loader: "any-loader" }
	];
	var alias = {
		moment:'moment/min/moment.min.js',
		config: path.join(__dirname, "src/app/config/" + options.env + ".jsx")
	};
	var aliasLoader = {

	};
	var externals = [

	];
	var extensions = ["", ".jsx","html",".js"];

	var publicPath = options.devServer ?
		"http://localhost:3000/build/" :
		"/assets/"//"./";
	var output = {
		path: path.join(__dirname, "build","assets"),
		publicPath: publicPath,
		filename: "bundle.js"+(options.publish?"?[chunkhash]":""),
		chunkFilename: (options.devServer ? "[id].js" : "[name].js") + (options.publish ? "?[chunkhash]" : ""),
		//sourceMapFilename: "debugging/[file].map",
		pathinfo: options.debug
	};
	var excludeFromStats = [
		/node_modules[\\\/]react(-router)?[\\\/]/,
		/node_modules[\\\/]items-store[\\\/]/
	];
	var plugins = [
		function() {
			if(!options.publish) {
				this.plugin("done", function(stats) {
					var jsonStats = stats.toJson({
						chunkModules: true,
						exclude: excludeFromStats
					});
					jsonStats.publicPath = publicPath;
					fs.writeFileSync(path.join(__dirname, "build", "stats.json"), JSON.stringify(jsonStats));
				});
			}
			else {
				console.log("publish！！！！！！！！！！！！！！！！！！！！！！！！！");
				this.plugin("done", function(stats) {
					var APP_URL = "bundle.js",STYLE_URL="main.css",FAVICON_ICON="favicon.ico";
					var html = fs.readFileSync(path.join(appRoot, "index.html"), "utf-8");
					var pathAssets = "/assets/";
					// html = html.replace('DLL_REACT_URL',pathAssets + 'dll.' + JSON.parse(fs.readFileSync(path.join(__dirname, 'build', 'assets', 'react-manifest.json')), 'utf-8').name + '.js');
					Object.keys(stats.compilation.assets).forEach(function(item) {
						if(item.indexOf(APP_URL)>=0){
							html = html.replace('APP_URL',pathAssets+item);
						}

						if(item.indexOf(STYLE_URL)>=0){
							html = html.replace('STYLE_URL',pathAssets+item);
						}
						if(item.indexOf(FAVICON_ICON)>=0){
							html = html.replace('FAVICON_ICON',pathAssets+item);
						}
					});
					var buildPath = path.join(__dirname, "build/");

					if(!fs.existsSync(buildPath)){ //check folder
						fs.mkdirSync(buildPath);
					}
					fs.writeFileSync(path.join(buildPath,"index.html"), html);
					fs.writeFileSync(path.join(buildPath,"UpdateBrowserTip.html"), fs.readFileSync(path.join(appRoot, "UpdateBrowserTip.html"), "utf-8"));
					(function(){
						var assetsPath = "/assets/";
						var html = fs.readFileSync(path.join(appRoot, "DownloadApp.html"), "utf-8");
						html = html.replace(/FAVICON_ICON/g,assetsPath + 'favicon.png');
						html = html.replace(/PUBLIC_PATH/g,publicPath);
						fs.writeFileSync(path.join(buildPath,"DownloadApp.html"), html);
					})()

					console.log("ok");
				});

			}
		},
		new webpack.PrefetchPlugin("react"),
		new webpack.PrefetchPlugin("react/lib/ReactComponentBrowserEnvironment")
	];


	// plugins.push(new webpack.optimize.CommonsChunkPlugin("vendors","vendors.js"+(options.publish?"?[chunkhash]":"")));
	//plugins.push(new webpack.optimize.CommonsChunkPlugin("zhCn","zh-cn.js"+(options.publish?"?[chunkhash]":"")));
	//plugins.push(new webpack.optimize.CommonsChunkPlugin("enUs","en-us.js"+(options.publish?"?[chunkhash]":"")));



	plugins.push(new ExtractTextPlugin("main.css"+(options.publish ? "?[contenthash]" : "")));
	// plugins.push( extractLessModule.getWebpackPlugin() );

	var loaders =  [
	{ test: /\.jsx?$/, loaders:  ["react-hot-loader", "babel-loader"], exclude: /node_modules/ },
	{ test: /\.less$/, loader:ExtractTextPlugin.extract("style-loader", "css-loader?sourceMap!postcss-loader!less-loader") },
			{ test: /\.(ico|png|jpg|gif)$/, loader: 'file-loader?name=[name].[ext]' },
			{ test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "url-loader?name=[name].[ext]&limit=10000&minetype=application/font-woff" },
			{ test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "file-loader?name=[name].[ext]" }
	];
	if(options.publish) {
		plugins.push(
			// new webpack.DllReferencePlugin({
	  //           manifest: require(path.join(__dirname, 'build', 'assets', 'react-manifest.json')),
	  //           context: '',
	  //       }),
			new webpack.optimize.UglifyJsPlugin(),
			new webpack.optimize.DedupePlugin(),
			new webpack.DefinePlugin({
				"process.env": {
					NODE_ENV: JSON.stringify("production")
				}
			}),
			new webpack.optimize.OccurenceOrderPlugin()
		);
		loaders[0].loaders=null;
		loaders[0].loader = 'babel-loader';
		// loaders[0].query = {compact:true};
		loaders[1].loader = ExtractTextPlugin.extract('css-loader!postcss-loader!less-loader');

	}

	return {
		entry: entry,
		output: output,
		module: {
			loaders:loaders,
			noParse:[/moment\.min/,/numeral\.js/]
		},
		postcss:function(){
			return [
				require("postcss-import")({ addDependencyTo: webpack }),
				require("postcss-url")(),
				require("postcss-cssnext")(),
				require("postcss-browser-reporter")(),
				require("postcss-reporter")()
			];
		},
		resolve:{
			alias:alias,
			extensions:extensions
		},
		devtool: options.devtool,
		debug: options.debug,
		externals: externals,
		plugins: plugins,
		devServer: {
			stats:       {colors: true,exclude: excludeFromStats}
		},

		// lessLoader: {
		// 	lessPlugins: [
		// 		extractLessModule.getLessPlugin()
		// 	]
		// }

	};
};

// Example express application adding the parse-server module to expose Parse
// compatible API routes.

var express = require('express');
var ParseServer = require('parse-server').ParseServer;
var http = require('http');

if (!process.env.DATABASE_URI) {
  console.log('DATABASE_URI not specified, falling back to localhost.');
}

var api = new ParseServer({
  databaseURI: process.env.DATABASE_URI || 'mongodb://localhost:27017/dev',
  cloud: process.env.CLOUD_CODE_MAIN || __dirname + '/cloud/main.js',
  appId: process.env.PARSE_APP_ID || 'myAppId',
  masterKey: process.env.PARSE_MASTER_KEY || 'myMasterKey',
  fileKey: process.env.PARSE_FILE_KEY || 'myFileKey',
  dotNetKey: process.env.PARSE_DOTNET_KEY || 'myDotNetKey',
});

// Client-keys like the javascript key or the .NET key are not necessary with parse-server
// If you wish you require them, you can set them as options in the initialization above:
// javascriptKey, restAPIKey, dotNetKey, clientKey

var app = express();

// Serve the Parse API on the /parse URL prefix
var mountPath = process.env.PARSE_MOUNT || '/parse';
app.use(mountPath, api);

// Parse Server plays nicely with the rest of your web routes
app.get('/', function(req, res) {
  res.status(200).send('Parse server running on Azure App Service.');
});

var port = process.env.PORT || 1337;
var httpServer = http.createServer(app);
httpServer.listen(port, function() {
  console.log('parse-server-example running on port ' + port + '.');
});

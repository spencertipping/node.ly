var shortened     = {};
var current_index = 0;

var serve_file = function (response, filename) {
  var mimetypes = {html: 'text/html', css: 'text/css', js: 'application/javascript'};
  require('fs').readFile(filename, function (err, data) {
    response.writeHead(200, {'content-type': mimetypes[filename.replace(/^.*\./, '').toLowerCase()]});
    response.end(data);
  });
};

var serve_text = function (response, text) {
  response.writeHead(200, {'content-type': 'text/plain'});
  response.end(text);
};

var redirect_to = function (response, url) {
  response.writeHead(301, {location: url});
  response.end();
};

var short_url = function (original) {
  var short_name = (++current_index).toString(36);
  shortened[short_name] = original;
  return short_name;
};

require('http').createServer(function (request, response) {
  if (request.url === '/')                   serve_file(response, 'client/index.html');
  else if (/^\/client\//.test(request.url))  serve_file(response, request.url.substring(1));
  else if (/^\/shorten\//.test(request.url)) serve_text(response, short_url(request.url.substring('/shorten/'.length)));
  else                                       redirect_to(response, shortened[request.url.substring(1)]);
}).listen(8080);

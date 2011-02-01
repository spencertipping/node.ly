// JSON parsing & stringification:
var JSON;
if(!JSON)JSON={};
(function(){"use strict";function f(n){return n<10?'0'+n:n;}
if(typeof Date.prototype.toJSON!=='function'){Date.prototype.toJSON=function(key){return isFinite(this.valueOf())?this.getUTCFullYear()+'-'+
f(this.getUTCMonth()+1)+'-'+
f(this.getUTCDate())+'T'+
f(this.getUTCHours())+':'+
f(this.getUTCMinutes())+':'+
f(this.getUTCSeconds())+'Z':null;};String.prototype.toJSON=Number.prototype.toJSON=Boolean.prototype.toJSON=function(key){return this.valueOf();};}
var cx=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,escapable=/[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,gap,indent,meta={'\b':'\\b','\t':'\\t','\n':'\\n','\f':'\\f','\r':'\\r','"':'\\"','\\':'\\\\'},rep;function quote(string){escapable.lastIndex=0;return escapable.test(string)?'"'+string.replace(escapable,function(a){var c=meta[a];return typeof c==='string'?c:'\\u'+('0000'+a.charCodeAt(0).toString(16)).slice(-4);})+'"':'"'+string+'"';}
function str(key,holder){var i,k,v,length,mind=gap,partial,value=holder[key];if(value&&typeof value==='object'&&typeof value.toJSON==='function'){value=value.toJSON(key);}
if(typeof rep==='function'){value=rep.call(holder,key,value);}
switch(typeof value){case'string':return quote(value);case'number':return isFinite(value)?String(value):'null';case'boolean':case'null':return String(value);case'object':if(!value){return'null';}
gap+=indent;partial=[];if(Object.prototype.toString.apply(value)==='[object Array]'){length=value.length;for(i=0;i<length;i+=1){partial[i]=str(i,value)||'null';}
v=partial.length===0?'[]':gap?'[\n'+gap+partial.join(',\n'+gap)+'\n'+mind+']':'['+partial.join(',')+']';gap=mind;return v;}
if(rep&&typeof rep==='object'){length=rep.length;for(i=0;i<length;i+=1){k=rep[i];if(typeof k==='string'){v=str(k,value);if(v){partial.push(quote(k)+(gap?': ':':')+v);}}}}else{for(k in value){if(Object.hasOwnProperty.call(value,k)){v=str(k,value);if(v){partial.push(quote(k)+(gap?': ':':')+v);}}}}
v=partial.length===0?'{}':gap?'{\n'+gap+partial.join(',\n'+gap)+'\n'+mind+'}':'{'+partial.join(',')+'}';gap=mind;return v;}}
if(typeof JSON.stringify!=='function'){JSON.stringify=function(value,replacer,space){var i;gap='';indent='';if(typeof space==='number'){for(i=0;i<space;i+=1){indent+=' ';}}else if(typeof space==='string'){indent=space;}
rep=replacer;if(replacer&&typeof replacer!=='function'&&(typeof replacer!=='object'||typeof replacer.length!=='number')){throw new Error('JSON.stringify');}
return str('',{'':value});};}
if(typeof JSON.parse!=='function'){JSON.parse=function(text,reviver){var j;function walk(holder,key){var k,v,value=holder[key];if(value&&typeof value==='object'){for(k in value){if(Object.hasOwnProperty.call(value,k)){v=walk(value,k);if(v!==undefined){value[k]=v;}else{delete value[k];}}}}
return reviver.call(holder,key,value);}
text=String(text);cx.lastIndex=0;if(cx.test(text)){text=text.replace(cx,function(a){return'\\u'+
('0000'+a.charCodeAt(0).toString(16)).slice(-4);});}
if(/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,'@').replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,']').replace(/(?:^|:|,)(?:\s*\[)+/g,''))){j=eval('('+text+')');return typeof reviver==='function'?walk({'':j},''):j;}
throw new SyntaxError('JSON.parse');};}}());

// ReportGrid core:
var ReportGrid = {};

(function() {
  var Util = {
    getConfiguration: function() {
      var findThisScript = function() {
        var scripts = document.getElementsByTagName('SCRIPT');

        for (var i = 0; i < scripts.length; i++) {
          var script = scripts[i];
          var src = script.getAttribute('src');

          if (src.indexOf('reportgrid-core.js') != -1) {
            return script;
          }
        }

        return undefined;
      };
      
      return Util.parseQueryParameters(findThisScript().getAttribute('src'));
    },
    
    parseQueryParameters: function(url) {
      var index = url.indexOf('?');

      if (index < 0) return {};

      var query = url.substr(index + 1);

      var keyValuePairs = query.split('&');

      var parameters = {};

      for (var i = 0; i < keyValuePairs.length; i++) {
        var keyValuePair = keyValuePairs[i];

        var split = keyValuePair.split('=');

        var key = split[0];
        var value = '';

        if (split.length >= 2) {
          value = unescape(split[1]);
        }

        parameters[key] = value;
      }

      return parameters;
    },
    
    addQueryParameters: function(url, query) {
      var suffix = url.indexOf('?') == -1 ? '?' : '&';

      var queries = [];

      for (var name in query) {
        var value = query[name].toString();

        queries.push(name + '=' + escape(value));
      }

      if (queries.length == 0) return url;
      else return url + suffix + queries.join('&');
    },
    
    getConsole: function() {
      var console = window.console;
      if (!console) {
        console = {};

        console.log   = function() {}
        console.debug = function() {}
        console.info  = function() {}
        console.warn  = function() {}
        console.error = function() {}
      }

      return console;
    },
    
    createCallbacks: function(success, failure, msg) {
      var successFn = function(fn, msg) {
        if (fn) return fn;
        else return function(result) {
          if (result !== undefined) {
            $.Log.debug('Success: ' + msg + ': ' + JSON.stringify(result));
          }
          else {
            $.Log.debug('Success: ' + msg);
          }
        }
      }

      var failureFn = function(fn, msg) {
        if (fn) return fn;
        else return function(code, reason) {
          $.Log.error('Failure: ' + msg + ': code = ' + code + ', reason = ' + reason);
        }
      }

      return {
        success: successFn(success, msg),
        failure: failureFn(failure, msg)
      };
    },

    stripLeadingSlash: function(path) {
      return path.substr(0, 1) === "/" ? path.substr(1) : path;
    }
  }
  
  var Network = {
    doAjaxRequest: function(options) {
      var method   = options.method || 'GET';
      var query    = options.query || {};
      var path     = Util.addQueryParameters(options.path, query);
      var content  = options.content;
      var headers  = options.headers || {};
      var success  = options.success;
      var failure  = options.failure || function() {};

      var createNewXmlHttpRequest = function() {
        if (window.XMLHttpRequest) {
          return new XMLHttpRequest();
        }
        else {
          return new ActiveXObject("Microsoft.XMLHTTP");
        }
      }

      var request = createNewXmlHttpRequest();

      request.open(method, path);

      request.onreadystatechange = function() {
        if (request.readyState == 4) {
          if (request.status == 200) {
            if (request.responseText !== null && request.responseText.length > 0) {
              success(JSON.parse(this.responseText));
            }
            else {
              success(undefined);
            }
          }
          else {
            failure(request.status, request.statusText);
          }
        }
      }

      for (var name in headers) {
        var value = headers[name];

        request.setRequestHeader(name, value);
      }

      if (content !== undefined) {
        request.setRequestHeader('Content-Type', 'application/json');

        request.send(JSON.stringify(content));
      }
      else {
        request.send(null);
      }
    },
    
    doJsonpRequest: function(options) {
      var method   = options.method || 'GET';
      var query    = options.query || {};
      var path     = Util.addQueryParameters(options.path, query);
      var content  = options.content;
      var headers  = options.headers || {};
      var success  = options.success;
      var failure  = options.failure || function() {};

      var random   = Math.floor(Math.random() * 214748363);
      var funcName = 'ReportGridJsonpCallback' + random.toString();

      window[funcName] = function(content, meta) {
        if (meta.status.code === 200) {
          success(content);
        }
        else {
          failure(meta.status.code, meta.status.reason);
        }

        document.head.removeChild(document.getElementById(funcName));

        delete window[funcName];
      }

      var extraQuery = {};

      extraQuery.method   = method;
      extraQuery.headers  = JSON.stringify(headers);
      extraQuery.callback = funcName;

      if (content !== undefined) {
        extraQuery.content = JSON.stringify(content);
      }

      var fullUrl = Util.addQueryParameters(path, extraQuery);

      var script = document.createElement('SCRIPT');

      script.setAttribute('type', 'text/javascript');
      script.setAttribute('src',  fullUrl);
      script.setAttribute('id',   funcName);

      document.head.appendChild(script);
    },
    
    createHttpInterface: function(doRequest) {
      return {
        get: function(path, callbacks, query, headers) {
          doRequest(
            {
              method:   'GET',
              path:     path,
              headers:  headers,
              success:  callbacks.success,
              failure:  callbacks.failure,
              query:    query
            }
          ); 
        },

        put: function(path, content, callbacks, query, headers) {
          doRequest(
            {
              method:   'PUT',
              path:     path,
              content:  content,
              headers:  headers,
              success:  callbacks.success,
              failure:  callbacks.failure,
              query:    query
            }
          );
        },

        post: function(path, content, callbacks, query, headers) {
          doRequest(
            {
              method:   'POST',
              path:     path,
              content:  content,
              headers:  headers,
              success:  callbacks.success,
              failure:  callbacks.failure,
              query:    query
            }
          );
        },

        remove: function(path, callbacks, query, headers) {
          doRequest(
            {
              method:   'DELETE',
              path:     path,
              headers:  headers,
              success:  callbacks.success,
              failure:  callbacks.failure,
              query:    query
            }
          ); 
        }
      }
    }
  }
  
  ReportGrid.$ = {};
  
  $ = ReportGrid.$;
  
  $.Config = Util.getConfiguration();
  
  $.Extend = function(object, extensions) {
    for (var name in extensions) {
      if (object[name] === undefined) {
        object[name] = extensions[name];
      }
    }
  }
  
  $.Extend($.Config,
    {
      analyticsServer: "" // TODO: Insert default location to analytics server
    }
  );
  
  $.Http = function() {
    return ReportGrid.$.Config.useJsonp ? ReportGrid.$.Http.Jsonp : ReportGrid.$.Http.Ajax;
  }
  
  $.Http.Ajax  = Network.createHttpInterface(Network.doAjaxRequest);
  $.Http.Jsonp = Network.createHttpInterface(Network.doJsonpRequest);
  
  var console = Util.getConsole();
  
  $.Log = {
    log:    function(text) { console.log(text);   },
    debug:  function(text) { console.debug(text); },
    info:   function(text) { console.info(text);  },
    warn:   function(text) { console.warn(text);  },
    error:  function(text) { console.error(text); }
  }
  
  /** Constants */
  ReportGrid.Minute   = 'minute';
  ReportGrid.Hour     = 'hour';
  ReportGrid.Day      = 'day';
  ReportGrid.Week     = 'week';
  ReportGrid.Month    = 'month';
  ReportGrid.Year     = 'year';
  ReportGrid.Eternity = 'eternity';
  
  /** Tracks an event.
   */
  ReportGrid.track = function(path_, eventName, props_, success, failure, timestamp) {
    var path  = Util.stripLeadingSlash(path_);
    var props = props_ || {};
    
    var http = $.Http();
    
    var event = {};
    
    event[eventName] = props;
    
    var tracker = {
      event: event
    };
    
    if (timestamp != null) {
      tracker.timestamp = timestamp;
    }
    
    var description = 'Track event ' + eventName + ' to ' + path;
    
    http.post(
      $.Config.analyticsServer + 'events/vfs/' + path, 
      tracker, 
      Util.createCallbacks(success, failure, description),
      {tokenId: $.Config.tokenId }
    );
  }
  
  /** Retrieves a summary report.
   */
  ReportGrid.summary = function(path_, success, failure) {
    var path = Util.stripLeadingSlash(path_);

    var http = $.Http();
    
    http.get(
      $.Config.analyticsServer + 'reports/events/summary/vfs/' + path, 
      Util.createCallbacks(success, failure, 'Pull summary report from ' + path),
      {tokenId: $.Config.tokenId }
    );
  }
  
  /** Retrieves a time series report.
   */
  ReportGrid.timeSeries = function(path_, periodicity, start_, end_, success, failure) {
    var convertTime = function(input) {
      return (input instanceof Date) ? input.getTime() : input;
    }
    
    var path = Util.stripLeadingSlash(path_);
    
    var http = $.Http();
    
    var start = convertTime(start_ || 0);
    var end   = convertTime(end_   || new Date().getTime());
    
    http.get(
      $.Config.analyticsServer + 'reports/events/series/' + periodicity + '/start/' + start + '/end/' + end + '/vfs/' + path,
      Util.createCallbacks(success, failure, 'Pull time series from ' + path + ' (start = ' + start + ', end = ' + end + ')'),
      {tokenId: $.Config.tokenId }
    );
  }
  
  /** Lists all tokens.
   */
  ReportGrid.listTokens = function(success, failure) {
    var http = $.Http();
    
    http.get(
      $.Config.analyticsServer + 'tokens/', 
      Util.createCallbacks(success, failure, 'List all tokens'),
      {tokenId: $.Config.tokenId }
    );
  }
  
  /** Creates a new token.
   */
  ReportGrid.createToken = function(newToken, success, failure) {
    var http = $.Http();
    
    http.post(
      $.Config.analyticsServer + 'tokens/', 
      newToken, 
      Util.createCallbacks(success, failure, 'Create a token (' + JSON.stringify(newToken) + ')'),
      {tokenId: $.Config.tokenId }
    );
  }
  
  /** Deletes the token with the specified id.
   */
  ReportGrid.deleteToken = function(tokenId, success, failure) {
    var http = $.Http();
    
    http.remove(
      $.Config.analyticsServer + 'tokens/' + tokenId, 
      Util.createCallbacks(success, failure, 'Delete token ' + tokenId),
      {tokenId: $.Config.tokenId }
    );
  }
  
  ReportGrid.visualize = function(path, id, events, options) {
    // TODO
    events = (events == null || events === "*") ? [] : ((events instanceof Array) ? events : [events]);
  }
})();



(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],2:[function(require,module,exports){
(function (process){
// Generated by purs bundle 0.13.5
var PS = {};
(function(exports) {
  /* global XMLHttpRequest */
  /* global process */
  "use strict";

  exports._ajax = function () {
    var platformSpecific = { };
    if (typeof module !== "undefined" && module.require && !(typeof process !== "undefined" && process.versions["electron"])) {
      // We are on node.js
      platformSpecific.newXHR = function () {
        var XHR = module.require("xhr2");
        return new XHR();
      };

      platformSpecific.fixupUrl = function (url, xhr) {
        if (xhr.nodejsBaseUrl === null) {
          var urllib = module.require("url");
          var u = urllib.parse(url);
          u.protocol = u.protocol || "http:";
          u.hostname = u.hostname || "localhost";
          return urllib.format(u);
        } else {
          return url || "/";
        }
      };

      platformSpecific.getResponse = function (xhr) {
        return xhr.response;
      };
    } else {
      // We are in the browser
      platformSpecific.newXHR = function () {
        return new XMLHttpRequest();
      };

      platformSpecific.fixupUrl = function (url) {
        return url || "/";
      };

      platformSpecific.getResponse = function (xhr) {
        return xhr.response;
      };
    }

    return function (mkHeader, options) {
      return function (errback, callback) {
        var xhr = platformSpecific.newXHR();
        var fixedUrl = platformSpecific.fixupUrl(options.url, xhr);
        xhr.open(options.method || "GET", fixedUrl, true, options.username, options.password);
        if (options.headers) {
          try {
            for (var i = 0, header; (header = options.headers[i]) != null; i++) {
              xhr.setRequestHeader(header.field, header.value);
            }
          } catch (e) {
            errback(e);
          }
        }
        var onerror = function (msg) {
          return function () {
            errback(new Error(msg + ": " + options.method + " " + options.url));
          };
        };
        xhr.onerror = onerror("AJAX request failed");
        xhr.ontimeout = onerror("AJAX request timed out");
        xhr.onload = function () {
          callback({
            status: xhr.status,
            statusText: xhr.statusText,
            headers: xhr.getAllResponseHeaders().split("\r\n")
              .filter(function (header) {
                return header.length > 0;
              })
              .map(function (header) {
                var i = header.indexOf(":");
                return mkHeader(header.substring(0, i))(header.substring(i + 2));
              }),
            body: platformSpecific.getResponse(xhr)
          });
        };
        xhr.responseType = options.responseType;
        xhr.withCredentials = options.withCredentials;
        xhr.send(options.content);

        return function (error, cancelErrback, cancelCallback) {
          try {
            xhr.abort();
          } catch (e) {
            return cancelErrback(e);
          }
          return cancelCallback();
        };
      };
    };
  }();
})(PS["Affjax"] = PS["Affjax"] || {});
(function($PS) {
  // Generated by purs version 0.13.5
  "use strict";
  $PS["Control.Apply"] = $PS["Control.Apply"] || {};
  var exports = $PS["Control.Apply"];                    
  var Apply = function (Functor0, apply) {
      this.Functor0 = Functor0;
      this.apply = apply;
  };                      
  var apply = function (dict) {
      return dict.apply;
  };
  exports["Apply"] = Apply;
  exports["apply"] = apply;
})(PS);
(function(exports) {
  "use strict";

  exports.unit = {};
})(PS["Data.Unit"] = PS["Data.Unit"] || {});
(function($PS) {
  // Generated by purs version 0.13.5
  "use strict";
  $PS["Data.Unit"] = $PS["Data.Unit"] || {};
  var exports = $PS["Data.Unit"];
  var $foreign = $PS["Data.Unit"];
  exports["unit"] = $foreign.unit;
})(PS);
(function($PS) {
  // Generated by purs version 0.13.5
  "use strict";
  $PS["Control.Applicative"] = $PS["Control.Applicative"] || {};
  var exports = $PS["Control.Applicative"];
  var Control_Apply = $PS["Control.Apply"];
  var Data_Unit = $PS["Data.Unit"];                
  var Applicative = function (Apply0, pure) {
      this.Apply0 = Apply0;
      this.pure = pure;
  };
  var pure = function (dict) {
      return dict.pure;
  };
  var when = function (dictApplicative) {
      return function (v) {
          return function (v1) {
              if (v) {
                  return v1;
              };
              if (!v) {
                  return pure(dictApplicative)(Data_Unit.unit);
              };
              throw new Error("Failed pattern match at Control.Applicative (line 57, column 1 - line 57, column 63): " + [ v.constructor.name, v1.constructor.name ]);
          };
      };
  };
  var liftA1 = function (dictApplicative) {
      return function (f) {
          return function (a) {
              return Control_Apply.apply(dictApplicative.Apply0())(pure(dictApplicative)(f))(a);
          };
      };
  };
  exports["Applicative"] = Applicative;
  exports["pure"] = pure;
  exports["liftA1"] = liftA1;
  exports["when"] = when;
})(PS);
(function($PS) {
  // Generated by purs version 0.13.5
  "use strict";
  $PS["Data.Function"] = $PS["Data.Function"] || {};
  var exports = $PS["Data.Function"];                    
  var on = function (f) {
      return function (g) {
          return function (x) {
              return function (y) {
                  return f(g(x))(g(y));
              };
          };
      };
  };
  var flip = function (f) {
      return function (b) {
          return function (a) {
              return f(a)(b);
          };
      };
  };
  var $$const = function (a) {
      return function (v) {
          return a;
      };
  };
  exports["flip"] = flip;
  exports["const"] = $$const;
  exports["on"] = on;
})(PS);
(function($PS) {
  // Generated by purs version 0.13.5
  "use strict";
  $PS["Control.Bind"] = $PS["Control.Bind"] || {};
  var exports = $PS["Control.Bind"];
  var Data_Function = $PS["Data.Function"];
  var Bind = function (Apply0, bind) {
      this.Apply0 = Apply0;
      this.bind = bind;
  };                     
  var bind = function (dict) {
      return dict.bind;
  };
  var bindFlipped = function (dictBind) {
      return Data_Function.flip(bind(dictBind));
  };
  var composeKleisliFlipped = function (dictBind) {
      return function (f) {
          return function (g) {
              return function (a) {
                  return bindFlipped(dictBind)(f)(g(a));
              };
          };
      };
  };
  exports["Bind"] = Bind;
  exports["bind"] = bind;
  exports["bindFlipped"] = bindFlipped;
  exports["composeKleisliFlipped"] = composeKleisliFlipped;
})(PS);
(function(exports) {
  "use strict";

  exports.arrayMap = function (f) {
    return function (arr) {
      var l = arr.length;
      var result = new Array(l);
      for (var i = 0; i < l; i++) {
        result[i] = f(arr[i]);
      }
      return result;
    };
  };
})(PS["Data.Functor"] = PS["Data.Functor"] || {});
(function($PS) {
  // Generated by purs version 0.13.5
  "use strict";
  $PS["Control.Semigroupoid"] = $PS["Control.Semigroupoid"] || {};
  var exports = $PS["Control.Semigroupoid"];
  var Semigroupoid = function (compose) {
      this.compose = compose;
  };
  var semigroupoidFn = new Semigroupoid(function (f) {
      return function (g) {
          return function (x) {
              return f(g(x));
          };
      };
  });
  var compose = function (dict) {
      return dict.compose;
  };
  exports["compose"] = compose;
  exports["semigroupoidFn"] = semigroupoidFn;
})(PS);
(function($PS) {
  // Generated by purs version 0.13.5
  "use strict";
  $PS["Data.Functor"] = $PS["Data.Functor"] || {};
  var exports = $PS["Data.Functor"];
  var $foreign = $PS["Data.Functor"];
  var Control_Semigroupoid = $PS["Control.Semigroupoid"];
  var Data_Function = $PS["Data.Function"];
  var Data_Unit = $PS["Data.Unit"];                
  var Functor = function (map) {
      this.map = map;
  };
  var map = function (dict) {
      return dict.map;
  };
  var mapFlipped = function (dictFunctor) {
      return function (fa) {
          return function (f) {
              return map(dictFunctor)(f)(fa);
          };
      };
  };
  var $$void = function (dictFunctor) {
      return map(dictFunctor)(Data_Function["const"](Data_Unit.unit));
  };
  var functorFn = new Functor(Control_Semigroupoid.compose(Control_Semigroupoid.semigroupoidFn));
  var functorArray = new Functor($foreign.arrayMap);
  exports["Functor"] = Functor;
  exports["map"] = map;
  exports["mapFlipped"] = mapFlipped;
  exports["void"] = $$void;
  exports["functorFn"] = functorFn;
  exports["functorArray"] = functorArray;
})(PS);
(function($PS) {
  // Generated by purs version 0.13.5
  "use strict";
  $PS["Data.Maybe"] = $PS["Data.Maybe"] || {};
  var exports = $PS["Data.Maybe"];
  var Control_Applicative = $PS["Control.Applicative"];
  var Control_Apply = $PS["Control.Apply"];
  var Control_Bind = $PS["Control.Bind"];
  var Data_Functor = $PS["Data.Functor"];          
  var Nothing = (function () {
      function Nothing() {

      };
      Nothing.value = new Nothing();
      return Nothing;
  })();
  var Just = (function () {
      function Just(value0) {
          this.value0 = value0;
      };
      Just.create = function (value0) {
          return new Just(value0);
      };
      return Just;
  })();
  var maybe = function (v) {
      return function (v1) {
          return function (v2) {
              if (v2 instanceof Nothing) {
                  return v;
              };
              if (v2 instanceof Just) {
                  return v1(v2.value0);
              };
              throw new Error("Failed pattern match at Data.Maybe (line 217, column 1 - line 217, column 51): " + [ v.constructor.name, v1.constructor.name, v2.constructor.name ]);
          };
      };
  };                                                      
  var functorMaybe = new Data_Functor.Functor(function (v) {
      return function (v1) {
          if (v1 instanceof Just) {
              return new Just(v(v1.value0));
          };
          return Nothing.value;
      };
  });
  var applyMaybe = new Control_Apply.Apply(function () {
      return functorMaybe;
  }, function (v) {
      return function (v1) {
          if (v instanceof Just) {
              return Data_Functor.map(functorMaybe)(v.value0)(v1);
          };
          if (v instanceof Nothing) {
              return Nothing.value;
          };
          throw new Error("Failed pattern match at Data.Maybe (line 67, column 1 - line 69, column 30): " + [ v.constructor.name, v1.constructor.name ]);
      };
  });
  var bindMaybe = new Control_Bind.Bind(function () {
      return applyMaybe;
  }, function (v) {
      return function (v1) {
          if (v instanceof Just) {
              return v1(v.value0);
          };
          if (v instanceof Nothing) {
              return Nothing.value;
          };
          throw new Error("Failed pattern match at Data.Maybe (line 125, column 1 - line 127, column 28): " + [ v.constructor.name, v1.constructor.name ]);
      };
  });
  var applicativeMaybe = new Control_Applicative.Applicative(function () {
      return applyMaybe;
  }, Just.create);
  exports["Nothing"] = Nothing;
  exports["Just"] = Just;
  exports["maybe"] = maybe;
  exports["functorMaybe"] = functorMaybe;
  exports["applyMaybe"] = applyMaybe;
  exports["applicativeMaybe"] = applicativeMaybe;
  exports["bindMaybe"] = bindMaybe;
})(PS);
(function($PS) {
  // Generated by purs version 0.13.5
  "use strict";
  $PS["Data.MediaType.Common"] = $PS["Data.MediaType.Common"] || {};
  var exports = $PS["Data.MediaType.Common"];          
  var applicationJSON = "application/json";
  var applicationFormURLEncoded = "application/x-www-form-urlencoded";
  exports["applicationFormURLEncoded"] = applicationFormURLEncoded;
  exports["applicationJSON"] = applicationJSON;
})(PS);
(function($PS) {
  // Generated by purs version 0.13.5
  "use strict";
  $PS["Affjax.RequestBody"] = $PS["Affjax.RequestBody"] || {};
  var exports = $PS["Affjax.RequestBody"];
  var Data_Maybe = $PS["Data.Maybe"];
  var Data_MediaType_Common = $PS["Data.MediaType.Common"];                
  var ArrayView = (function () {
      function ArrayView(value0) {
          this.value0 = value0;
      };
      ArrayView.create = function (value0) {
          return new ArrayView(value0);
      };
      return ArrayView;
  })();
  var Blob = (function () {
      function Blob(value0) {
          this.value0 = value0;
      };
      Blob.create = function (value0) {
          return new Blob(value0);
      };
      return Blob;
  })();
  var Document = (function () {
      function Document(value0) {
          this.value0 = value0;
      };
      Document.create = function (value0) {
          return new Document(value0);
      };
      return Document;
  })();
  var $$String = (function () {
      function $$String(value0) {
          this.value0 = value0;
      };
      $$String.create = function (value0) {
          return new $$String(value0);
      };
      return $$String;
  })();
  var FormData = (function () {
      function FormData(value0) {
          this.value0 = value0;
      };
      FormData.create = function (value0) {
          return new FormData(value0);
      };
      return FormData;
  })();
  var FormURLEncoded = (function () {
      function FormURLEncoded(value0) {
          this.value0 = value0;
      };
      FormURLEncoded.create = function (value0) {
          return new FormURLEncoded(value0);
      };
      return FormURLEncoded;
  })();
  var Json = (function () {
      function Json(value0) {
          this.value0 = value0;
      };
      Json.create = function (value0) {
          return new Json(value0);
      };
      return Json;
  })();
  var toMediaType = function (v) {
      if (v instanceof FormURLEncoded) {
          return new Data_Maybe.Just(Data_MediaType_Common.applicationFormURLEncoded);
      };
      if (v instanceof Json) {
          return new Data_Maybe.Just(Data_MediaType_Common.applicationJSON);
      };
      return Data_Maybe.Nothing.value;
  };
  var string = $$String.create;
  exports["ArrayView"] = ArrayView;
  exports["Blob"] = Blob;
  exports["Document"] = Document;
  exports["String"] = $$String;
  exports["FormData"] = FormData;
  exports["FormURLEncoded"] = FormURLEncoded;
  exports["Json"] = Json;
  exports["string"] = string;
  exports["toMediaType"] = toMediaType;
})(PS);
(function(exports) {
  "use strict";

  exports.boolConj = function (b1) {
    return function (b2) {
      return b1 && b2;
    };
  };

  exports.boolDisj = function (b1) {
    return function (b2) {
      return b1 || b2;
    };
  };

  exports.boolNot = function (b) {
    return !b;
  };
})(PS["Data.HeytingAlgebra"] = PS["Data.HeytingAlgebra"] || {});
(function($PS) {
  // Generated by purs version 0.13.5
  "use strict";
  $PS["Data.HeytingAlgebra"] = $PS["Data.HeytingAlgebra"] || {};
  var exports = $PS["Data.HeytingAlgebra"];
  var $foreign = $PS["Data.HeytingAlgebra"];
  var HeytingAlgebra = function (conj, disj, ff, implies, not, tt) {
      this.conj = conj;
      this.disj = disj;
      this.ff = ff;
      this.implies = implies;
      this.not = not;
      this.tt = tt;
  };
  var not = function (dict) {
      return dict.not;
  };
  var ff = function (dict) {
      return dict.ff;
  };
  var disj = function (dict) {
      return dict.disj;
  };
  var heytingAlgebraBoolean = new HeytingAlgebra($foreign.boolConj, $foreign.boolDisj, false, function (a) {
      return function (b) {
          return disj(heytingAlgebraBoolean)(not(heytingAlgebraBoolean)(a))(b);
      };
  }, $foreign.boolNot, true);
  exports["ff"] = ff;
  exports["disj"] = disj;
  exports["heytingAlgebraBoolean"] = heytingAlgebraBoolean;
})(PS);
(function($PS) {
  // Generated by purs version 0.13.5
  "use strict";
  $PS["Data.Monoid"] = $PS["Data.Monoid"] || {};
  var exports = $PS["Data.Monoid"];
  var Monoid = function (Semigroup0, mempty) {
      this.Semigroup0 = Semigroup0;
      this.mempty = mempty;
  };
  var mempty = function (dict) {
      return dict.mempty;
  };
  exports["Monoid"] = Monoid;
  exports["mempty"] = mempty;
})(PS);
(function($PS) {
  // Generated by purs version 0.13.5
  "use strict";
  $PS["Data.Semigroup"] = $PS["Data.Semigroup"] || {};
  var exports = $PS["Data.Semigroup"];
  var Semigroup = function (append) {
      this.append = append;
  };
  var append = function (dict) {
      return dict.append;
  };
  exports["Semigroup"] = Semigroup;
  exports["append"] = append;
})(PS);
(function($PS) {
  // Generated by purs version 0.13.5
  "use strict";
  $PS["Data.Monoid.Disj"] = $PS["Data.Monoid.Disj"] || {};
  var exports = $PS["Data.Monoid.Disj"];
  var Data_HeytingAlgebra = $PS["Data.HeytingAlgebra"];
  var Data_Monoid = $PS["Data.Monoid"];
  var Data_Semigroup = $PS["Data.Semigroup"];      
  var Disj = function (x) {
      return x;
  };
  var semigroupDisj = function (dictHeytingAlgebra) {
      return new Data_Semigroup.Semigroup(function (v) {
          return function (v1) {
              return Data_HeytingAlgebra.disj(dictHeytingAlgebra)(v)(v1);
          };
      });
  };
  var monoidDisj = function (dictHeytingAlgebra) {
      return new Data_Monoid.Monoid(function () {
          return semigroupDisj(dictHeytingAlgebra);
      }, Data_HeytingAlgebra.ff(dictHeytingAlgebra));
  };
  exports["Disj"] = Disj;
  exports["monoidDisj"] = monoidDisj;
})(PS);
(function($PS) {
  // Generated by purs version 0.13.5
  "use strict";
  $PS["Data.Newtype"] = $PS["Data.Newtype"] || {};
  var exports = $PS["Data.Newtype"];
  var Data_Functor = $PS["Data.Functor"];
  var Data_Monoid_Disj = $PS["Data.Monoid.Disj"];                      
  var Newtype = function (unwrap, wrap) {
      this.unwrap = unwrap;
      this.wrap = wrap;
  };
  var wrap = function (dict) {
      return dict.wrap;
  };
  var unwrap = function (dict) {
      return dict.unwrap;
  };                        
  var newtypeDisj = new Newtype(function (v) {
      return v;
  }, Data_Monoid_Disj.Disj);
  var alaF = function (dictFunctor) {
      return function (dictFunctor1) {
          return function (dictNewtype) {
              return function (dictNewtype1) {
                  return function (v) {
                      return function (f) {
                          var $96 = Data_Functor.map(dictFunctor1)(unwrap(dictNewtype1));
                          var $97 = Data_Functor.map(dictFunctor)(wrap(dictNewtype));
                          return function ($98) {
                              return $96(f($97($98)));
                          };
                      };
                  };
              };
          };
      };
  };
  exports["unwrap"] = unwrap;
  exports["Newtype"] = Newtype;
  exports["alaF"] = alaF;
  exports["newtypeDisj"] = newtypeDisj;
})(PS);
(function($PS) {
  // Generated by purs version 0.13.5
  "use strict";
  $PS["Data.MediaType"] = $PS["Data.MediaType"] || {};
  var exports = $PS["Data.MediaType"];
  var Data_Newtype = $PS["Data.Newtype"];          
  var MediaType = function (x) {
      return x;
  }; 
  var newtypeMediaType = new Data_Newtype.Newtype(function (n) {
      return n;
  }, MediaType);
  exports["newtypeMediaType"] = newtypeMediaType;
})(PS);
(function($PS) {
  // Generated by purs version 0.13.5
  "use strict";
  $PS["Affjax.RequestHeader"] = $PS["Affjax.RequestHeader"] || {};
  var exports = $PS["Affjax.RequestHeader"];
  var Data_MediaType = $PS["Data.MediaType"];
  var Data_Newtype = $PS["Data.Newtype"];          
  var Accept = (function () {
      function Accept(value0) {
          this.value0 = value0;
      };
      Accept.create = function (value0) {
          return new Accept(value0);
      };
      return Accept;
  })();
  var ContentType = (function () {
      function ContentType(value0) {
          this.value0 = value0;
      };
      ContentType.create = function (value0) {
          return new ContentType(value0);
      };
      return ContentType;
  })();
  var RequestHeader = (function () {
      function RequestHeader(value0, value1) {
          this.value0 = value0;
          this.value1 = value1;
      };
      RequestHeader.create = function (value0) {
          return function (value1) {
              return new RequestHeader(value0, value1);
          };
      };
      return RequestHeader;
  })();
  var value = function (v) {
      if (v instanceof Accept) {
          return Data_Newtype.unwrap(Data_MediaType.newtypeMediaType)(v.value0);
      };
      if (v instanceof ContentType) {
          return Data_Newtype.unwrap(Data_MediaType.newtypeMediaType)(v.value0);
      };
      if (v instanceof RequestHeader) {
          return v.value1;
      };
      throw new Error("Failed pattern match at Affjax.RequestHeader (line 26, column 1 - line 26, column 33): " + [ v.constructor.name ]);
  }; 
  var name = function (v) {
      if (v instanceof Accept) {
          return "Accept";
      };
      if (v instanceof ContentType) {
          return "Content-Type";
      };
      if (v instanceof RequestHeader) {
          return v.value0;
      };
      throw new Error("Failed pattern match at Affjax.RequestHeader (line 21, column 1 - line 21, column 32): " + [ v.constructor.name ]);
  };
  exports["Accept"] = Accept;
  exports["ContentType"] = ContentType;
  exports["name"] = name;
  exports["value"] = value;
})(PS);
(function($PS) {
  // Generated by purs version 0.13.5
  "use strict";
  $PS["Control.Category"] = $PS["Control.Category"] || {};
  var exports = $PS["Control.Category"];
  var Control_Semigroupoid = $PS["Control.Semigroupoid"];                
  var Category = function (Semigroupoid0, identity) {
      this.Semigroupoid0 = Semigroupoid0;
      this.identity = identity;
  };
  var identity = function (dict) {
      return dict.identity;
  };
  var categoryFn = new Category(function () {
      return Control_Semigroupoid.semigroupoidFn;
  }, function (x) {
      return x;
  });
  exports["identity"] = identity;
  exports["categoryFn"] = categoryFn;
})(PS);
(function($PS) {
  // Generated by purs version 0.13.5
  "use strict";
  $PS["Affjax.ResponseFormat"] = $PS["Affjax.ResponseFormat"] || {};
  var exports = $PS["Affjax.ResponseFormat"];
  var Control_Category = $PS["Control.Category"];
  var Data_Maybe = $PS["Data.Maybe"];
  var Data_MediaType_Common = $PS["Data.MediaType.Common"];
  var $$ArrayBuffer = (function () {
      function $$ArrayBuffer(value0) {
          this.value0 = value0;
      };
      $$ArrayBuffer.create = function (value0) {
          return new $$ArrayBuffer(value0);
      };
      return $$ArrayBuffer;
  })();
  var Blob = (function () {
      function Blob(value0) {
          this.value0 = value0;
      };
      Blob.create = function (value0) {
          return new Blob(value0);
      };
      return Blob;
  })();
  var Document = (function () {
      function Document(value0) {
          this.value0 = value0;
      };
      Document.create = function (value0) {
          return new Document(value0);
      };
      return Document;
  })();
  var Json = (function () {
      function Json(value0) {
          this.value0 = value0;
      };
      Json.create = function (value0) {
          return new Json(value0);
      };
      return Json;
  })();
  var $$String = (function () {
      function $$String(value0) {
          this.value0 = value0;
      };
      $$String.create = function (value0) {
          return new $$String(value0);
      };
      return $$String;
  })();
  var Ignore = (function () {
      function Ignore(value0) {
          this.value0 = value0;
      };
      Ignore.create = function (value0) {
          return new Ignore(value0);
      };
      return Ignore;
  })();
  var toResponseType = function (v) {
      if (v instanceof $$ArrayBuffer) {
          return "arraybuffer";
      };
      if (v instanceof Blob) {
          return "blob";
      };
      if (v instanceof Document) {
          return "document";
      };
      if (v instanceof Json) {
          return "text";
      };
      if (v instanceof $$String) {
          return "text";
      };
      if (v instanceof Ignore) {
          return "";
      };
      throw new Error("Failed pattern match at Affjax.ResponseFormat (line 46, column 3 - line 52, column 19): " + [ v.constructor.name ]);
  };
  var toMediaType = function (v) {
      if (v instanceof Json) {
          return new Data_Maybe.Just(Data_MediaType_Common.applicationJSON);
      };
      return Data_Maybe.Nothing.value;
  };
  var json = new Json(Control_Category.identity(Control_Category.categoryFn));
  var ignore = new Ignore(Control_Category.identity(Control_Category.categoryFn));
  exports["ArrayBuffer"] = $$ArrayBuffer;
  exports["Blob"] = Blob;
  exports["Document"] = Document;
  exports["Json"] = Json;
  exports["String"] = $$String;
  exports["Ignore"] = Ignore;
  exports["json"] = json;
  exports["ignore"] = ignore;
  exports["toResponseType"] = toResponseType;
  exports["toMediaType"] = toMediaType;
})(PS);
(function($PS) {
  // Generated by purs version 0.13.5
  "use strict";
  $PS["Affjax.ResponseHeader"] = $PS["Affjax.ResponseHeader"] || {};
  var exports = $PS["Affjax.ResponseHeader"];      
  var ResponseHeader = (function () {
      function ResponseHeader(value0, value1) {
          this.value0 = value0;
          this.value1 = value1;
      };
      ResponseHeader.create = function (value0) {
          return function (value1) {
              return new ResponseHeader(value0, value1);
          };
      };
      return ResponseHeader;
  })();
  exports["ResponseHeader"] = ResponseHeader;
})(PS);
(function($PS) {
  // Generated by purs version 0.13.5
  "use strict";
  $PS["Data.Either"] = $PS["Data.Either"] || {};
  var exports = $PS["Data.Either"];
  var Data_Functor = $PS["Data.Functor"];
  var Data_Maybe = $PS["Data.Maybe"];              
  var Left = (function () {
      function Left(value0) {
          this.value0 = value0;
      };
      Left.create = function (value0) {
          return new Left(value0);
      };
      return Left;
  })();
  var Right = (function () {
      function Right(value0) {
          this.value0 = value0;
      };
      Right.create = function (value0) {
          return new Right(value0);
      };
      return Right;
  })();
  var note = function (a) {
      return Data_Maybe.maybe(new Left(a))(Right.create);
  };
  var functorEither = new Data_Functor.Functor(function (f) {
      return function (m) {
          if (m instanceof Left) {
              return new Left(m.value0);
          };
          if (m instanceof Right) {
              return new Right(f(m.value0));
          };
          throw new Error("Failed pattern match at Data.Either (line 38, column 1 - line 38, column 52): " + [ m.constructor.name ]);
      };
  });
  var either = function (v) {
      return function (v1) {
          return function (v2) {
              if (v2 instanceof Left) {
                  return v(v2.value0);
              };
              if (v2 instanceof Right) {
                  return v1(v2.value0);
              };
              throw new Error("Failed pattern match at Data.Either (line 238, column 1 - line 238, column 64): " + [ v.constructor.name, v1.constructor.name, v2.constructor.name ]);
          };
      };
  };
  exports["Left"] = Left;
  exports["Right"] = Right;
  exports["either"] = either;
  exports["note"] = note;
  exports["functorEither"] = functorEither;
})(PS);
(function($PS) {
  // Generated by purs version 0.13.5
  "use strict";
  $PS["Control.Monad.Error.Class"] = $PS["Control.Monad.Error.Class"] || {};
  var exports = $PS["Control.Monad.Error.Class"];
  var Control_Applicative = $PS["Control.Applicative"];
  var Data_Either = $PS["Data.Either"];
  var Data_Functor = $PS["Data.Functor"];                        
  var MonadThrow = function (Monad0, throwError) {
      this.Monad0 = Monad0;
      this.throwError = throwError;
  };
  var MonadError = function (MonadThrow0, catchError) {
      this.MonadThrow0 = MonadThrow0;
      this.catchError = catchError;
  };
  var throwError = function (dict) {
      return dict.throwError;
  };                                                      
  var catchError = function (dict) {
      return dict.catchError;
  };
  var $$try = function (dictMonadError) {
      return function (a) {
          return catchError(dictMonadError)(Data_Functor.map(((((dictMonadError.MonadThrow0()).Monad0()).Bind1()).Apply0()).Functor0())(Data_Either.Right.create)(a))((function () {
              var $21 = Control_Applicative.pure(((dictMonadError.MonadThrow0()).Monad0()).Applicative0());
              return function ($22) {
                  return $21(Data_Either.Left.create($22));
              };
          })());
      };
  };
  exports["throwError"] = throwError;
  exports["MonadThrow"] = MonadThrow;
  exports["MonadError"] = MonadError;
  exports["try"] = $$try;
})(PS);
(function($PS) {
  // Generated by purs version 0.13.5
  "use strict";
  $PS["Control.Monad"] = $PS["Control.Monad"] || {};
  var exports = $PS["Control.Monad"];
  var Control_Applicative = $PS["Control.Applicative"];
  var Control_Bind = $PS["Control.Bind"];                
  var Monad = function (Applicative0, Bind1) {
      this.Applicative0 = Applicative0;
      this.Bind1 = Bind1;
  };
  var ap = function (dictMonad) {
      return function (f) {
          return function (a) {
              return Control_Bind.bind(dictMonad.Bind1())(f)(function (v) {
                  return Control_Bind.bind(dictMonad.Bind1())(a)(function (v1) {
                      return Control_Applicative.pure(dictMonad.Applicative0())(v(v1));
                  });
              });
          };
      };
  };
  exports["Monad"] = Monad;
  exports["ap"] = ap;
})(PS);
(function($PS) {
  // Generated by purs version 0.13.5
  "use strict";
  $PS["Control.Monad.Except.Trans"] = $PS["Control.Monad.Except.Trans"] || {};
  var exports = $PS["Control.Monad.Except.Trans"];
  var Control_Applicative = $PS["Control.Applicative"];
  var Control_Apply = $PS["Control.Apply"];
  var Control_Bind = $PS["Control.Bind"];
  var Control_Monad = $PS["Control.Monad"];
  var Control_Monad_Error_Class = $PS["Control.Monad.Error.Class"];
  var Data_Either = $PS["Data.Either"];
  var Data_Functor = $PS["Data.Functor"];                
  var ExceptT = function (x) {
      return x;
  };
  var runExceptT = function (v) {
      return v;
  }; 
  var mapExceptT = function (f) {
      return function (v) {
          return f(v);
      };
  };
  var functorExceptT = function (dictFunctor) {
      return new Data_Functor.Functor(function (f) {
          return mapExceptT(Data_Functor.map(dictFunctor)(Data_Functor.map(Data_Either.functorEither)(f)));
      });
  };
  var monadExceptT = function (dictMonad) {
      return new Control_Monad.Monad(function () {
          return applicativeExceptT(dictMonad);
      }, function () {
          return bindExceptT(dictMonad);
      });
  };
  var bindExceptT = function (dictMonad) {
      return new Control_Bind.Bind(function () {
          return applyExceptT(dictMonad);
      }, function (v) {
          return function (k) {
              return Control_Bind.bind(dictMonad.Bind1())(v)(Data_Either.either((function () {
                  var $98 = Control_Applicative.pure(dictMonad.Applicative0());
                  return function ($99) {
                      return $98(Data_Either.Left.create($99));
                  };
              })())(function (a) {
                  var v1 = k(a);
                  return v1;
              }));
          };
      });
  };
  var applyExceptT = function (dictMonad) {
      return new Control_Apply.Apply(function () {
          return functorExceptT(((dictMonad.Bind1()).Apply0()).Functor0());
      }, Control_Monad.ap(monadExceptT(dictMonad)));
  };
  var applicativeExceptT = function (dictMonad) {
      return new Control_Applicative.Applicative(function () {
          return applyExceptT(dictMonad);
      }, (function () {
          var $100 = Control_Applicative.pure(dictMonad.Applicative0());
          return function ($101) {
              return ExceptT($100(Data_Either.Right.create($101)));
          };
      })());
  };
  var monadThrowExceptT = function (dictMonad) {
      return new Control_Monad_Error_Class.MonadThrow(function () {
          return monadExceptT(dictMonad);
      }, (function () {
          var $110 = Control_Applicative.pure(dictMonad.Applicative0());
          return function ($111) {
              return ExceptT($110(Data_Either.Left.create($111)));
          };
      })());
  };
  exports["runExceptT"] = runExceptT;
  exports["applicativeExceptT"] = applicativeExceptT;
  exports["bindExceptT"] = bindExceptT;
  exports["monadThrowExceptT"] = monadThrowExceptT;
})(PS);
(function($PS) {
  // Generated by purs version 0.13.5
  "use strict";
  $PS["Data.Identity"] = $PS["Data.Identity"] || {};
  var exports = $PS["Data.Identity"];
  var Control_Applicative = $PS["Control.Applicative"];
  var Control_Apply = $PS["Control.Apply"];
  var Control_Bind = $PS["Control.Bind"];
  var Control_Monad = $PS["Control.Monad"];
  var Data_Functor = $PS["Data.Functor"];
  var Data_Newtype = $PS["Data.Newtype"];          
  var Identity = function (x) {
      return x;
  };
  var newtypeIdentity = new Data_Newtype.Newtype(function (n) {
      return n;
  }, Identity);
  var functorIdentity = new Data_Functor.Functor(function (f) {
      return function (m) {
          return f(m);
      };
  });
  var applyIdentity = new Control_Apply.Apply(function () {
      return functorIdentity;
  }, function (v) {
      return function (v1) {
          return v(v1);
      };
  });
  var bindIdentity = new Control_Bind.Bind(function () {
      return applyIdentity;
  }, function (v) {
      return function (f) {
          return f(v);
      };
  });
  var applicativeIdentity = new Control_Applicative.Applicative(function () {
      return applyIdentity;
  }, Identity);
  var monadIdentity = new Control_Monad.Monad(function () {
      return applicativeIdentity;
  }, function () {
      return bindIdentity;
  });
  exports["newtypeIdentity"] = newtypeIdentity;
  exports["monadIdentity"] = monadIdentity;
})(PS);
(function($PS) {
  // Generated by purs version 0.13.5
  "use strict";
  $PS["Control.Monad.Except"] = $PS["Control.Monad.Except"] || {};
  var exports = $PS["Control.Monad.Except"];
  var Control_Monad_Except_Trans = $PS["Control.Monad.Except.Trans"];
  var Data_Identity = $PS["Data.Identity"];
  var Data_Newtype = $PS["Data.Newtype"];                                                
  var runExcept = (function () {
      var $0 = Data_Newtype.unwrap(Data_Identity.newtypeIdentity);
      return function ($1) {
          return $0(Control_Monad_Except_Trans.runExceptT($1));
      };
  })();
  exports["runExcept"] = runExcept;
})(PS);
(function(exports) {
  "use strict";

  function id(x) {
    return x;
  }                      
  exports.fromObject = id;

  exports.stringify = function (j) {
    return JSON.stringify(j);
  };

  function isArray(a) {
    return Object.prototype.toString.call(a) === "[object Array]";
  }
})(PS["Data.Argonaut.Core"] = PS["Data.Argonaut.Core"] || {});
(function(exports) {
  "use strict";

  exports.empty = {};

  function toArrayWithKey(f) {
    return function (m) {
      var r = [];
      for (var k in m) {
        if (hasOwnProperty.call(m, k)) {
          r.push(f(k)(m[k]));
        }
      }
      return r;
    };
  }
})(PS["Foreign.Object"] = PS["Foreign.Object"] || {});
(function($PS) {
  // Generated by purs version 0.13.5
  "use strict";
  $PS["Foreign.Object"] = $PS["Foreign.Object"] || {};
  var exports = $PS["Foreign.Object"];
  var $foreign = $PS["Foreign.Object"];
  exports["empty"] = $foreign.empty;
})(PS);
(function($PS) {
  // Generated by purs version 0.13.5
  "use strict";
  $PS["Data.Argonaut.Core"] = $PS["Data.Argonaut.Core"] || {};
  var exports = $PS["Data.Argonaut.Core"];
  var $foreign = $PS["Data.Argonaut.Core"];
  var Foreign_Object = $PS["Foreign.Object"];   
  var jsonEmptyObject = $foreign.fromObject(Foreign_Object.empty);
  exports["jsonEmptyObject"] = jsonEmptyObject;
  exports["stringify"] = $foreign.stringify;
})(PS);
(function(exports) {
  "use strict";

  exports._jsonParser = function (fail, succ, s) {
    try {
      return succ(JSON.parse(s));
    }
    catch (e) {
      return fail(e.message);
    }
  };
})(PS["Data.Argonaut.Parser"] = PS["Data.Argonaut.Parser"] || {});
(function($PS) {
  // Generated by purs version 0.13.5
  "use strict";
  $PS["Data.Argonaut.Parser"] = $PS["Data.Argonaut.Parser"] || {};
  var exports = $PS["Data.Argonaut.Parser"];
  var $foreign = $PS["Data.Argonaut.Parser"];
  var Data_Either = $PS["Data.Either"];                
  var jsonParser = function (j) {
      return $foreign["_jsonParser"](Data_Either.Left.create, Data_Either.Right.create, j);
  };
  exports["jsonParser"] = jsonParser;
})(PS);
(function(exports) {
  "use strict";

  exports.snoc = function (l) {
    return function (e) {
      var l1 = l.slice();
      l1.push(e);
      return l1;
    };
  };
})(PS["Data.Array"] = PS["Data.Array"] || {});
(function($PS) {
  // Generated by purs version 0.13.5
  "use strict";
  $PS["Data.Array"] = $PS["Data.Array"] || {};
  var exports = $PS["Data.Array"];
  var $foreign = $PS["Data.Array"];
  exports["snoc"] = $foreign.snoc;
})(PS);
(function(exports) {
  "use strict";

  var refEq = function (r1) {
    return function (r2) {
      return r1 === r2;
    };
  };                         
  exports.eqStringImpl = refEq;
})(PS["Data.Eq"] = PS["Data.Eq"] || {});
(function($PS) {
  // Generated by purs version 0.13.5
  "use strict";
  $PS["Data.Eq"] = $PS["Data.Eq"] || {};
  var exports = $PS["Data.Eq"];
  var $foreign = $PS["Data.Eq"];
  var Eq = function (eq) {
      this.eq = eq;
  }; 
  var eqString = new Eq($foreign.eqStringImpl);
  var eq = function (dict) {
      return dict.eq;
  };
  exports["eq"] = eq;
  exports["eqString"] = eqString;
})(PS);
(function(exports) {
  "use strict";

  exports.foldrArray = function (f) {
    return function (init) {
      return function (xs) {
        var acc = init;
        var len = xs.length;
        for (var i = len - 1; i >= 0; i--) {
          acc = f(xs[i])(acc);
        }
        return acc;
      };
    };
  };

  exports.foldlArray = function (f) {
    return function (init) {
      return function (xs) {
        var acc = init;
        var len = xs.length;
        for (var i = 0; i < len; i++) {
          acc = f(acc)(xs[i]);
        }
        return acc;
      };
    };
  };
})(PS["Data.Foldable"] = PS["Data.Foldable"] || {});
(function($PS) {
  // Generated by purs version 0.13.5
  "use strict";
  $PS["Data.Foldable"] = $PS["Data.Foldable"] || {};
  var exports = $PS["Data.Foldable"];
  var $foreign = $PS["Data.Foldable"];
  var Data_Functor = $PS["Data.Functor"];
  var Data_Monoid = $PS["Data.Monoid"];
  var Data_Monoid_Disj = $PS["Data.Monoid.Disj"];
  var Data_Newtype = $PS["Data.Newtype"];
  var Data_Semigroup = $PS["Data.Semigroup"];      
  var Foldable = function (foldMap, foldl, foldr) {
      this.foldMap = foldMap;
      this.foldl = foldl;
      this.foldr = foldr;
  };
  var foldr = function (dict) {
      return dict.foldr;
  };
  var foldl = function (dict) {
      return dict.foldl;
  }; 
  var foldMapDefaultR = function (dictFoldable) {
      return function (dictMonoid) {
          return function (f) {
              return foldr(dictFoldable)(function (x) {
                  return function (acc) {
                      return Data_Semigroup.append(dictMonoid.Semigroup0())(f(x))(acc);
                  };
              })(Data_Monoid.mempty(dictMonoid));
          };
      };
  };
  var foldableArray = new Foldable(function (dictMonoid) {
      return foldMapDefaultR(foldableArray)(dictMonoid);
  }, $foreign.foldlArray, $foreign.foldrArray);
  var foldMap = function (dict) {
      return dict.foldMap;
  };
  var any = function (dictFoldable) {
      return function (dictHeytingAlgebra) {
          return Data_Newtype.alaF(Data_Functor.functorFn)(Data_Functor.functorFn)(Data_Newtype.newtypeDisj)(Data_Newtype.newtypeDisj)(Data_Monoid_Disj.Disj)(foldMap(dictFoldable)(Data_Monoid_Disj.monoidDisj(dictHeytingAlgebra)));
      };
  };
  exports["Foldable"] = Foldable;
  exports["foldr"] = foldr;
  exports["foldl"] = foldl;
  exports["any"] = any;
  exports["foldableArray"] = foldableArray;
})(PS);
(function(exports) {
  "use strict";

  exports.joinWith = function (s) {
    return function (xs) {
      return xs.join(s);
    };
  };
})(PS["Data.String.Common"] = PS["Data.String.Common"] || {});
(function($PS) {
  // Generated by purs version 0.13.5
  "use strict";
  $PS["Data.String.Common"] = $PS["Data.String.Common"] || {};
  var exports = $PS["Data.String.Common"];
  var $foreign = $PS["Data.String.Common"];
  exports["joinWith"] = $foreign.joinWith;
})(PS);
(function(exports) {
  "use strict";

  // jshint maxparams: 3

  exports.traverseArrayImpl = function () {
    function array1(a) {
      return [a];
    }

    function array2(a) {
      return function (b) {
        return [a, b];
      };
    }

    function array3(a) {
      return function (b) {
        return function (c) {
          return [a, b, c];
        };
      };
    }

    function concat2(xs) {
      return function (ys) {
        return xs.concat(ys);
      };
    }

    return function (apply) {
      return function (map) {
        return function (pure) {
          return function (f) {
            return function (array) {
              function go(bot, top) {
                switch (top - bot) {
                case 0: return pure([]);
                case 1: return map(array1)(f(array[bot]));
                case 2: return apply(map(array2)(f(array[bot])))(f(array[bot + 1]));
                case 3: return apply(apply(map(array3)(f(array[bot])))(f(array[bot + 1])))(f(array[bot + 2]));
                default:
                  // This slightly tricky pivot selection aims to produce two
                  // even-length partitions where possible.
                  var pivot = bot + Math.floor((top - bot) / 4) * 2;
                  return apply(map(concat2)(go(bot, pivot)))(go(pivot, top));
                }
              }
              return go(0, array.length);
            };
          };
        };
      };
    };
  }();
})(PS["Data.Traversable"] = PS["Data.Traversable"] || {});
(function($PS) {
  // Generated by purs version 0.13.5
  "use strict";
  $PS["Data.Traversable"] = $PS["Data.Traversable"] || {};
  var exports = $PS["Data.Traversable"];
  var $foreign = $PS["Data.Traversable"];
  var Control_Applicative = $PS["Control.Applicative"];
  var Control_Apply = $PS["Control.Apply"];
  var Control_Category = $PS["Control.Category"];
  var Data_Foldable = $PS["Data.Foldable"];
  var Data_Functor = $PS["Data.Functor"];                                                      
  var Traversable = function (Foldable1, Functor0, sequence, traverse) {
      this.Foldable1 = Foldable1;
      this.Functor0 = Functor0;
      this.sequence = sequence;
      this.traverse = traverse;
  };
  var traverse = function (dict) {
      return dict.traverse;
  }; 
  var sequenceDefault = function (dictTraversable) {
      return function (dictApplicative) {
          return traverse(dictTraversable)(dictApplicative)(Control_Category.identity(Control_Category.categoryFn));
      };
  };
  var traversableArray = new Traversable(function () {
      return Data_Foldable.foldableArray;
  }, function () {
      return Data_Functor.functorArray;
  }, function (dictApplicative) {
      return sequenceDefault(traversableArray)(dictApplicative);
  }, function (dictApplicative) {
      return $foreign.traverseArrayImpl(Control_Apply.apply(dictApplicative.Apply0()))(Data_Functor.map((dictApplicative.Apply0()).Functor0()))(Control_Applicative.pure(dictApplicative));
  });
  exports["traverse"] = traverse;
  exports["traversableArray"] = traversableArray;
})(PS);
(function(exports) {
  /* globals exports */
  "use strict";                                      

  var encdecURI = function (encdec) {
    return function (fail, succ, s) {
      try {
        return succ(encdec(s));
      }
      catch (e) {
        return fail(e.message);
      }
    };
  };                                                          
  exports._encodeURIComponent = encdecURI(encodeURIComponent);
})(PS["Global"] = PS["Global"] || {});
(function($PS) {
  // Generated by purs version 0.13.5
  "use strict";
  $PS["Global"] = $PS["Global"] || {};
  var exports = $PS["Global"];
  var $foreign = $PS["Global"];
  var Data_Function = $PS["Data.Function"];
  var Data_Maybe = $PS["Data.Maybe"];
  var $$encodeURIComponent = function (s) {
      return $foreign["_encodeURIComponent"](Data_Function["const"](Data_Maybe.Nothing.value), Data_Maybe.Just.create, s);
  };
  exports["encodeURIComponent"] = $$encodeURIComponent;
})(PS);
(function($PS) {
  // Generated by purs version 0.13.5
  "use strict";
  $PS["Data.FormURLEncoded"] = $PS["Data.FormURLEncoded"] || {};
  var exports = $PS["Data.FormURLEncoded"];
  var Control_Apply = $PS["Control.Apply"];
  var Data_Functor = $PS["Data.Functor"];
  var Data_Maybe = $PS["Data.Maybe"];
  var Data_String_Common = $PS["Data.String.Common"];
  var Data_Traversable = $PS["Data.Traversable"];
  var Global = $PS["Global"];
  var toArray = function (v) {
      return v;
  };                                                                                                                 
  var encode = (function () {
      var encodePart = function (v) {
          if (v.value1 instanceof Data_Maybe.Nothing) {
              return Global["encodeURIComponent"](v.value0);
          };
          if (v.value1 instanceof Data_Maybe.Just) {
              return Control_Apply.apply(Data_Maybe.applyMaybe)(Data_Functor.map(Data_Maybe.functorMaybe)(function (key) {
                  return function (val) {
                      return key + ("=" + val);
                  };
              })(Global["encodeURIComponent"](v.value0)))(Global["encodeURIComponent"](v.value1.value0));
          };
          throw new Error("Failed pattern match at Data.FormURLEncoded (line 37, column 18 - line 39, column 108): " + [ v.constructor.name ]);
      };
      var $19 = Data_Functor.map(Data_Maybe.functorMaybe)(Data_String_Common.joinWith("&"));
      var $20 = Data_Traversable.traverse(Data_Traversable.traversableArray)(Data_Maybe.applicativeMaybe)(encodePart);
      return function ($21) {
          return $19($20(toArray($21)));
      };
  })();
  exports["encode"] = encode;
})(PS);
(function(exports) {
  "use strict";

  exports.showIntImpl = function (n) {
    return n.toString();
  };

  exports.showStringImpl = function (s) {
    var l = s.length;
    return "\"" + s.replace(
      /[\0-\x1F\x7F"\\]/g, // eslint-disable-line no-control-regex
      function (c, i) {
        switch (c) {
          case "\"":
          case "\\":
            return "\\" + c;
          case "\x07": return "\\a";
          case "\b": return "\\b";
          case "\f": return "\\f";
          case "\n": return "\\n";
          case "\r": return "\\r";
          case "\t": return "\\t";
          case "\v": return "\\v";
        }
        var k = i + 1;
        var empty = k < l && s[k] >= "0" && s[k] <= "9" ? "\\&" : "";
        return "\\" + c.charCodeAt(0).toString(10) + empty;
      }
    ) + "\"";
  };
})(PS["Data.Show"] = PS["Data.Show"] || {});
(function($PS) {
  // Generated by purs version 0.13.5
  "use strict";
  $PS["Data.Show"] = $PS["Data.Show"] || {};
  var exports = $PS["Data.Show"];
  var $foreign = $PS["Data.Show"];
  var Show = function (show) {
      this.show = show;
  };
  var showString = new Show($foreign.showStringImpl);
  var showInt = new Show($foreign.showIntImpl);
  var show = function (dict) {
      return dict.show;
  };
  exports["Show"] = Show;
  exports["show"] = show;
  exports["showInt"] = showInt;
  exports["showString"] = showString;
})(PS);
(function($PS) {
  // Generated by purs version 0.13.5
  "use strict";
  $PS["Data.HTTP.Method"] = $PS["Data.HTTP.Method"] || {};
  var exports = $PS["Data.HTTP.Method"];
  var Data_Either = $PS["Data.Either"];
  var Data_Show = $PS["Data.Show"];                                  
  var OPTIONS = (function () {
      function OPTIONS() {

      };
      OPTIONS.value = new OPTIONS();
      return OPTIONS;
  })();
  var GET = (function () {
      function GET() {

      };
      GET.value = new GET();
      return GET;
  })();
  var HEAD = (function () {
      function HEAD() {

      };
      HEAD.value = new HEAD();
      return HEAD;
  })();
  var POST = (function () {
      function POST() {

      };
      POST.value = new POST();
      return POST;
  })();
  var PUT = (function () {
      function PUT() {

      };
      PUT.value = new PUT();
      return PUT;
  })();
  var DELETE = (function () {
      function DELETE() {

      };
      DELETE.value = new DELETE();
      return DELETE;
  })();
  var TRACE = (function () {
      function TRACE() {

      };
      TRACE.value = new TRACE();
      return TRACE;
  })();
  var CONNECT = (function () {
      function CONNECT() {

      };
      CONNECT.value = new CONNECT();
      return CONNECT;
  })();
  var PROPFIND = (function () {
      function PROPFIND() {

      };
      PROPFIND.value = new PROPFIND();
      return PROPFIND;
  })();
  var PROPPATCH = (function () {
      function PROPPATCH() {

      };
      PROPPATCH.value = new PROPPATCH();
      return PROPPATCH;
  })();
  var MKCOL = (function () {
      function MKCOL() {

      };
      MKCOL.value = new MKCOL();
      return MKCOL;
  })();
  var COPY = (function () {
      function COPY() {

      };
      COPY.value = new COPY();
      return COPY;
  })();
  var MOVE = (function () {
      function MOVE() {

      };
      MOVE.value = new MOVE();
      return MOVE;
  })();
  var LOCK = (function () {
      function LOCK() {

      };
      LOCK.value = new LOCK();
      return LOCK;
  })();
  var UNLOCK = (function () {
      function UNLOCK() {

      };
      UNLOCK.value = new UNLOCK();
      return UNLOCK;
  })();
  var PATCH = (function () {
      function PATCH() {

      };
      PATCH.value = new PATCH();
      return PATCH;
  })();
  var unCustomMethod = function (v) {
      return v;
  };
  var showMethod = new Data_Show.Show(function (v) {
      if (v instanceof OPTIONS) {
          return "OPTIONS";
      };
      if (v instanceof GET) {
          return "GET";
      };
      if (v instanceof HEAD) {
          return "HEAD";
      };
      if (v instanceof POST) {
          return "POST";
      };
      if (v instanceof PUT) {
          return "PUT";
      };
      if (v instanceof DELETE) {
          return "DELETE";
      };
      if (v instanceof TRACE) {
          return "TRACE";
      };
      if (v instanceof CONNECT) {
          return "CONNECT";
      };
      if (v instanceof PROPFIND) {
          return "PROPFIND";
      };
      if (v instanceof PROPPATCH) {
          return "PROPPATCH";
      };
      if (v instanceof MKCOL) {
          return "MKCOL";
      };
      if (v instanceof COPY) {
          return "COPY";
      };
      if (v instanceof MOVE) {
          return "MOVE";
      };
      if (v instanceof LOCK) {
          return "LOCK";
      };
      if (v instanceof UNLOCK) {
          return "UNLOCK";
      };
      if (v instanceof PATCH) {
          return "PATCH";
      };
      throw new Error("Failed pattern match at Data.HTTP.Method (line 40, column 1 - line 56, column 23): " + [ v.constructor.name ]);
  });
  var print = Data_Either.either(Data_Show.show(showMethod))(unCustomMethod);
  exports["GET"] = GET;
  exports["POST"] = POST;
  exports["print"] = print;
})(PS);
(function($PS) {
  // Generated by purs version 0.13.5
  "use strict";
  $PS["Control.Alt"] = $PS["Control.Alt"] || {};
  var exports = $PS["Control.Alt"];                          
  var Alt = function (Functor0, alt) {
      this.Functor0 = Functor0;
      this.alt = alt;
  };
  exports["Alt"] = Alt;
})(PS);
(function($PS) {
  // Generated by purs version 0.13.5
  "use strict";
  $PS["Control.Plus"] = $PS["Control.Plus"] || {};
  var exports = $PS["Control.Plus"];                   
  var Plus = function (Alt0, empty) {
      this.Alt0 = Alt0;
      this.empty = empty;
  };       
  var empty = function (dict) {
      return dict.empty;
  };
  exports["Plus"] = Plus;
  exports["empty"] = empty;
})(PS);
(function($PS) {
  // Generated by purs version 0.13.5
  "use strict";
  $PS["Data.List.Types"] = $PS["Data.List.Types"] || {};
  var exports = $PS["Data.List.Types"];
  var Control_Alt = $PS["Control.Alt"];
  var Control_Plus = $PS["Control.Plus"];
  var Data_Foldable = $PS["Data.Foldable"];
  var Data_Function = $PS["Data.Function"];
  var Data_Functor = $PS["Data.Functor"];
  var Data_Monoid = $PS["Data.Monoid"];
  var Data_Semigroup = $PS["Data.Semigroup"];                    
  var Nil = (function () {
      function Nil() {

      };
      Nil.value = new Nil();
      return Nil;
  })();
  var Cons = (function () {
      function Cons(value0, value1) {
          this.value0 = value0;
          this.value1 = value1;
      };
      Cons.create = function (value0) {
          return function (value1) {
              return new Cons(value0, value1);
          };
      };
      return Cons;
  })();
  var NonEmptyList = function (x) {
      return x;
  };
  var listMap = function (f) {
      var chunkedRevMap = function ($copy_chunksAcc) {
          return function ($copy_v) {
              var $tco_var_chunksAcc = $copy_chunksAcc;
              var $tco_done = false;
              var $tco_result;
              function $tco_loop(chunksAcc, v) {
                  if (v instanceof Cons && (v.value1 instanceof Cons && v.value1.value1 instanceof Cons)) {
                      $tco_var_chunksAcc = new Cons(v, chunksAcc);
                      $copy_v = v.value1.value1.value1;
                      return;
                  };
                  var unrolledMap = function (v1) {
                      if (v1 instanceof Cons && (v1.value1 instanceof Cons && v1.value1.value1 instanceof Nil)) {
                          return new Cons(f(v1.value0), new Cons(f(v1.value1.value0), Nil.value));
                      };
                      if (v1 instanceof Cons && v1.value1 instanceof Nil) {
                          return new Cons(f(v1.value0), Nil.value);
                      };
                      return Nil.value;
                  };
                  var reverseUnrolledMap = function ($copy_v1) {
                      return function ($copy_acc) {
                          var $tco_var_v1 = $copy_v1;
                          var $tco_done = false;
                          var $tco_result;
                          function $tco_loop(v1, acc) {
                              if (v1 instanceof Cons && (v1.value0 instanceof Cons && (v1.value0.value1 instanceof Cons && v1.value0.value1.value1 instanceof Cons))) {
                                  $tco_var_v1 = v1.value1;
                                  $copy_acc = new Cons(f(v1.value0.value0), new Cons(f(v1.value0.value1.value0), new Cons(f(v1.value0.value1.value1.value0), acc)));
                                  return;
                              };
                              $tco_done = true;
                              return acc;
                          };
                          while (!$tco_done) {
                              $tco_result = $tco_loop($tco_var_v1, $copy_acc);
                          };
                          return $tco_result;
                      };
                  };
                  $tco_done = true;
                  return reverseUnrolledMap(chunksAcc)(unrolledMap(v));
              };
              while (!$tco_done) {
                  $tco_result = $tco_loop($tco_var_chunksAcc, $copy_v);
              };
              return $tco_result;
          };
      };
      return chunkedRevMap(Nil.value);
  };
  var functorList = new Data_Functor.Functor(listMap);                 
  var foldableList = new Data_Foldable.Foldable(function (dictMonoid) {
      return function (f) {
          return Data_Foldable.foldl(foldableList)(function (acc) {
              var $202 = Data_Semigroup.append(dictMonoid.Semigroup0())(acc);
              return function ($203) {
                  return $202(f($203));
              };
          })(Data_Monoid.mempty(dictMonoid));
      };
  }, function (f) {
      var go = function ($copy_b) {
          return function ($copy_v) {
              var $tco_var_b = $copy_b;
              var $tco_done = false;
              var $tco_result;
              function $tco_loop(b, v) {
                  if (v instanceof Nil) {
                      $tco_done = true;
                      return b;
                  };
                  if (v instanceof Cons) {
                      $tco_var_b = f(b)(v.value0);
                      $copy_v = v.value1;
                      return;
                  };
                  throw new Error("Failed pattern match at Data.List.Types (line 109, column 12 - line 111, column 30): " + [ v.constructor.name ]);
              };
              while (!$tco_done) {
                  $tco_result = $tco_loop($tco_var_b, $copy_v);
              };
              return $tco_result;
          };
      };
      return go;
  }, function (f) {
      return function (b) {
          var rev = Data_Foldable.foldl(foldableList)(Data_Function.flip(Cons.create))(Nil.value);
          var $204 = Data_Foldable.foldl(foldableList)(Data_Function.flip(f))(b);
          return function ($205) {
              return $204(rev($205));
          };
      };
  });
  var semigroupList = new Data_Semigroup.Semigroup(function (xs) {
      return function (ys) {
          return Data_Foldable.foldr(foldableList)(Cons.create)(ys)(xs);
      };
  });                                              
  var altList = new Control_Alt.Alt(function () {
      return functorList;
  }, Data_Semigroup.append(semigroupList));
  var plusList = new Control_Plus.Plus(function () {
      return altList;
  }, Nil.value);
  exports["NonEmptyList"] = NonEmptyList;
  exports["plusList"] = plusList;
})(PS);
(function($PS) {
  // Generated by purs version 0.13.5
  "use strict";
  $PS["Data.NonEmpty"] = $PS["Data.NonEmpty"] || {};
  var exports = $PS["Data.NonEmpty"];
  var Control_Plus = $PS["Control.Plus"];                        
  var NonEmpty = (function () {
      function NonEmpty(value0, value1) {
          this.value0 = value0;
          this.value1 = value1;
      };
      NonEmpty.create = function (value0) {
          return function (value1) {
              return new NonEmpty(value0, value1);
          };
      };
      return NonEmpty;
  })();
  var singleton = function (dictPlus) {
      return function (a) {
          return new NonEmpty(a, Control_Plus.empty(dictPlus));
      };
  };
  exports["singleton"] = singleton;
})(PS);
(function($PS) {
  // Generated by purs version 0.13.5
  "use strict";
  $PS["Data.List.NonEmpty"] = $PS["Data.List.NonEmpty"] || {};
  var exports = $PS["Data.List.NonEmpty"];
  var Data_List_Types = $PS["Data.List.Types"];
  var Data_NonEmpty = $PS["Data.NonEmpty"];
  var singleton = (function () {
      var $168 = Data_NonEmpty.singleton(Data_List_Types.plusList);
      return function ($169) {
          return Data_List_Types.NonEmptyList($168($169));
      };
  })();
  var head = function (v) {
      return v.value0;
  };
  exports["singleton"] = singleton;
  exports["head"] = head;
})(PS);
(function(exports) {
  "use strict";

  exports["null"] = null;

  exports.notNull = function (x) {
    return x;
  };
})(PS["Data.Nullable"] = PS["Data.Nullable"] || {});
(function($PS) {
  // Generated by purs version 0.13.5
  "use strict";
  $PS["Data.Nullable"] = $PS["Data.Nullable"] || {};
  var exports = $PS["Data.Nullable"];
  var $foreign = $PS["Data.Nullable"];
  var Data_Maybe = $PS["Data.Maybe"];              
  var toNullable = Data_Maybe.maybe($foreign["null"])($foreign.notNull);
  exports["toNullable"] = toNullable;
})(PS);
(function(exports) {
  /* globals setImmediate, clearImmediate, setTimeout, clearTimeout */
  /* jshint -W083, -W098, -W003 */
  "use strict";

  var Aff = function () {
    // A unique value for empty.
    var EMPTY = {};

    /*

  An awkward approximation. We elide evidence we would otherwise need in PS for
  efficiency sake.

  data Aff eff a
    = Pure a
    | Throw Error
    | Catch (Aff eff a) (Error -> Aff eff a)
    | Sync (Eff eff a)
    | Async ((Either Error a -> Eff eff Unit) -> Eff eff (Canceler eff))
    | forall b. Bind (Aff eff b) (b -> Aff eff a)
    | forall b. Bracket (Aff eff b) (BracketConditions eff b) (b -> Aff eff a)
    | forall b. Fork Boolean (Aff eff b) ?(Fiber eff b -> a)
    | Sequential (ParAff aff a)

  */  
    var PURE    = "Pure";
    var THROW   = "Throw";
    var CATCH   = "Catch";
    var SYNC    = "Sync";
    var ASYNC   = "Async";
    var BIND    = "Bind";
    var BRACKET = "Bracket";
    var FORK    = "Fork";
    var SEQ     = "Sequential";

    /*

  data ParAff eff a
    = forall b. Map (b -> a) (ParAff eff b)
    | forall b. Apply (ParAff eff (b -> a)) (ParAff eff b)
    | Alt (ParAff eff a) (ParAff eff a)
    | ?Par (Aff eff a)

  */  
    var MAP   = "Map";
    var APPLY = "Apply";
    var ALT   = "Alt";

    // Various constructors used in interpretation
    var CONS      = "Cons";      // Cons-list, for stacks
    var RESUME    = "Resume";    // Continue indiscriminately
    var RELEASE   = "Release";   // Continue with bracket finalizers
    var FINALIZER = "Finalizer"; // A non-interruptible effect
    var FINALIZED = "Finalized"; // Marker for finalization
    var FORKED    = "Forked";    // Reference to a forked fiber, with resumption stack
    var FIBER     = "Fiber";     // Actual fiber reference
    var THUNK     = "Thunk";     // Primed effect, ready to invoke

    function Aff(tag, _1, _2, _3) {
      this.tag = tag;
      this._1  = _1;
      this._2  = _2;
      this._3  = _3;
    }

    function AffCtr(tag) {
      var fn = function (_1, _2, _3) {
        return new Aff(tag, _1, _2, _3);
      };
      fn.tag = tag;
      return fn;
    }

    function nonCanceler(error) {
      return new Aff(PURE, void 0);
    }

    function runEff(eff) {
      try {
        eff();
      } catch (error) {
        setTimeout(function () {
          throw error;
        }, 0);
      }
    }

    function runSync(left, right, eff) {
      try {
        return right(eff());
      } catch (error) {
        return left(error);
      }
    }

    function runAsync(left, eff, k) {
      try {
        return eff(k)();
      } catch (error) {
        k(left(error))();
        return nonCanceler;
      }
    }

    var Scheduler = function () {
      var limit    = 1024;
      var size     = 0;
      var ix       = 0;
      var queue    = new Array(limit);
      var draining = false;

      function drain() {
        var thunk;
        draining = true;
        while (size !== 0) {
          size--;
          thunk     = queue[ix];
          queue[ix] = void 0;
          ix        = (ix + 1) % limit;
          thunk();
        }
        draining = false;
      }

      return {
        isDraining: function () {
          return draining;
        },
        enqueue: function (cb) {
          var i, tmp;
          if (size === limit) {
            tmp = draining;
            drain();
            draining = tmp;
          }

          queue[(ix + size) % limit] = cb;
          size++;

          if (!draining) {
            drain();
          }
        }
      };
    }();

    function Supervisor(util) {
      var fibers  = {};
      var fiberId = 0;
      var count   = 0;

      return {
        register: function (fiber) {
          var fid = fiberId++;
          fiber.onComplete({
            rethrow: true,
            handler: function (result) {
              return function () {
                count--;
                delete fibers[fid];
              };
            }
          })();
          fibers[fid] = fiber;
          count++;
        },
        isEmpty: function () {
          return count === 0;
        },
        killAll: function (killError, cb) {
          return function () {
            if (count === 0) {
              return cb();
            }

            var killCount = 0;
            var kills     = {};

            function kill(fid) {
              kills[fid] = fibers[fid].kill(killError, function (result) {
                return function () {
                  delete kills[fid];
                  killCount--;
                  if (util.isLeft(result) && util.fromLeft(result)) {
                    setTimeout(function () {
                      throw util.fromLeft(result);
                    }, 0);
                  }
                  if (killCount === 0) {
                    cb();
                  }
                };
              })();
            }

            for (var k in fibers) {
              if (fibers.hasOwnProperty(k)) {
                killCount++;
                kill(k);
              }
            }

            fibers  = {};
            fiberId = 0;
            count   = 0;

            return function (error) {
              return new Aff(SYNC, function () {
                for (var k in kills) {
                  if (kills.hasOwnProperty(k)) {
                    kills[k]();
                  }
                }
              });
            };
          };
        }
      };
    }

    // Fiber state machine
    var SUSPENDED   = 0; // Suspended, pending a join.
    var CONTINUE    = 1; // Interpret the next instruction.
    var STEP_BIND   = 2; // Apply the next bind.
    var STEP_RESULT = 3; // Handle potential failure from a result.
    var PENDING     = 4; // An async effect is running.
    var RETURN      = 5; // The current stack has returned.
    var COMPLETED   = 6; // The entire fiber has completed.

    function Fiber(util, supervisor, aff) {
      // Monotonically increasing tick, increased on each asynchronous turn.
      var runTick = 0;

      // The current branch of the state machine.
      var status = SUSPENDED;

      // The current point of interest for the state machine branch.
      var step      = aff;  // Successful step
      var fail      = null; // Failure step
      var interrupt = null; // Asynchronous interrupt

      // Stack of continuations for the current fiber.
      var bhead = null;
      var btail = null;

      // Stack of attempts and finalizers for error recovery. Every `Cons` is also
      // tagged with current `interrupt` state. We use this to track which items
      // should be ignored or evaluated as a result of a kill.
      var attempts = null;

      // A special state is needed for Bracket, because it cannot be killed. When
      // we enter a bracket acquisition or finalizer, we increment the counter,
      // and then decrement once complete.
      var bracketCount = 0;

      // Each join gets a new id so they can be revoked.
      var joinId  = 0;
      var joins   = null;
      var rethrow = true;

      // Each invocation of `run` requires a tick. When an asynchronous effect is
      // resolved, we must check that the local tick coincides with the fiber
      // tick before resuming. This prevents multiple async continuations from
      // accidentally resuming the same fiber. A common example may be invoking
      // the provided callback in `makeAff` more than once, but it may also be an
      // async effect resuming after the fiber was already cancelled.
      function run(localRunTick) {
        var tmp, result, attempt;
        while (true) {
          tmp       = null;
          result    = null;
          attempt   = null;

          switch (status) {
          case STEP_BIND:
            status = CONTINUE;
            try {
              step   = bhead(step);
              if (btail === null) {
                bhead = null;
              } else {
                bhead = btail._1;
                btail = btail._2;
              }
            } catch (e) {
              status = RETURN;
              fail   = util.left(e);
              step   = null;
            }
            break;

          case STEP_RESULT:
            if (util.isLeft(step)) {
              status = RETURN;
              fail   = step;
              step   = null;
            } else if (bhead === null) {
              status = RETURN;
            } else {
              status = STEP_BIND;
              step   = util.fromRight(step);
            }
            break;

          case CONTINUE:
            switch (step.tag) {
            case BIND:
              if (bhead) {
                btail = new Aff(CONS, bhead, btail);
              }
              bhead  = step._2;
              status = CONTINUE;
              step   = step._1;
              break;

            case PURE:
              if (bhead === null) {
                status = RETURN;
                step   = util.right(step._1);
              } else {
                status = STEP_BIND;
                step   = step._1;
              }
              break;

            case SYNC:
              status = STEP_RESULT;
              step   = runSync(util.left, util.right, step._1);
              break;

            case ASYNC:
              status = PENDING;
              step   = runAsync(util.left, step._1, function (result) {
                return function () {
                  if (runTick !== localRunTick) {
                    return;
                  }
                  runTick++;
                  Scheduler.enqueue(function () {
                    // It's possible to interrupt the fiber between enqueuing and
                    // resuming, so we need to check that the runTick is still
                    // valid.
                    if (runTick !== localRunTick + 1) {
                      return;
                    }
                    status = STEP_RESULT;
                    step   = result;
                    run(runTick);
                  });
                };
              });
              return;

            case THROW:
              status = RETURN;
              fail   = util.left(step._1);
              step   = null;
              break;

            // Enqueue the Catch so that we can call the error handler later on
            // in case of an exception.
            case CATCH:
              if (bhead === null) {
                attempts = new Aff(CONS, step, attempts, interrupt);
              } else {
                attempts = new Aff(CONS, step, new Aff(CONS, new Aff(RESUME, bhead, btail), attempts, interrupt), interrupt);
              }
              bhead    = null;
              btail    = null;
              status   = CONTINUE;
              step     = step._1;
              break;

            // Enqueue the Bracket so that we can call the appropriate handlers
            // after resource acquisition.
            case BRACKET:
              bracketCount++;
              if (bhead === null) {
                attempts = new Aff(CONS, step, attempts, interrupt);
              } else {
                attempts = new Aff(CONS, step, new Aff(CONS, new Aff(RESUME, bhead, btail), attempts, interrupt), interrupt);
              }
              bhead  = null;
              btail  = null;
              status = CONTINUE;
              step   = step._1;
              break;

            case FORK:
              status = STEP_RESULT;
              tmp    = Fiber(util, supervisor, step._2);
              if (supervisor) {
                supervisor.register(tmp);
              }
              if (step._1) {
                tmp.run();
              }
              step = util.right(tmp);
              break;

            case SEQ:
              status = CONTINUE;
              step   = sequential(util, supervisor, step._1);
              break;
            }
            break;

          case RETURN:
            bhead = null;
            btail = null;
            // If the current stack has returned, and we have no other stacks to
            // resume or finalizers to run, the fiber has halted and we can
            // invoke all join callbacks. Otherwise we need to resume.
            if (attempts === null) {
              status = COMPLETED;
              step   = interrupt || fail || step;
            } else {
              // The interrupt status for the enqueued item.
              tmp      = attempts._3;
              attempt  = attempts._1;
              attempts = attempts._2;

              switch (attempt.tag) {
              // We cannot recover from an unmasked interrupt. Otherwise we should
              // continue stepping, or run the exception handler if an exception
              // was raised.
              case CATCH:
                // We should compare the interrupt status as well because we
                // only want it to apply if there has been an interrupt since
                // enqueuing the catch.
                if (interrupt && interrupt !== tmp && bracketCount === 0) {
                  status = RETURN;
                } else if (fail) {
                  status = CONTINUE;
                  step   = attempt._2(util.fromLeft(fail));
                  fail   = null;
                }
                break;

              // We cannot resume from an unmasked interrupt or exception.
              case RESUME:
                // As with Catch, we only want to ignore in the case of an
                // interrupt since enqueing the item.
                if (interrupt && interrupt !== tmp && bracketCount === 0 || fail) {
                  status = RETURN;
                } else {
                  bhead  = attempt._1;
                  btail  = attempt._2;
                  status = STEP_BIND;
                  step   = util.fromRight(step);
                }
                break;

              // If we have a bracket, we should enqueue the handlers,
              // and continue with the success branch only if the fiber has
              // not been interrupted. If the bracket acquisition failed, we
              // should not run either.
              case BRACKET:
                bracketCount--;
                if (fail === null) {
                  result   = util.fromRight(step);
                  // We need to enqueue the Release with the same interrupt
                  // status as the Bracket that is initiating it.
                  attempts = new Aff(CONS, new Aff(RELEASE, attempt._2, result), attempts, tmp);
                  // We should only coninue as long as the interrupt status has not changed or
                  // we are currently within a non-interruptable finalizer.
                  if (interrupt === tmp || bracketCount > 0) {
                    status = CONTINUE;
                    step   = attempt._3(result);
                  }
                }
                break;

              // Enqueue the appropriate handler. We increase the bracket count
              // because it should not be cancelled.
              case RELEASE:
                attempts = new Aff(CONS, new Aff(FINALIZED, step, fail), attempts, interrupt);
                status   = CONTINUE;
                // It has only been killed if the interrupt status has changed
                // since we enqueued the item, and the bracket count is 0. If the
                // bracket count is non-zero then we are in a masked state so it's
                // impossible to be killed.
                if (interrupt && interrupt !== tmp && bracketCount === 0) {
                  step = attempt._1.killed(util.fromLeft(interrupt))(attempt._2);
                } else if (fail) {
                  step = attempt._1.failed(util.fromLeft(fail))(attempt._2);
                } else {
                  step = attempt._1.completed(util.fromRight(step))(attempt._2);
                }
                fail = null;
                bracketCount++;
                break;

              case FINALIZER:
                bracketCount++;
                attempts = new Aff(CONS, new Aff(FINALIZED, step, fail), attempts, interrupt);
                status   = CONTINUE;
                step     = attempt._1;
                break;

              case FINALIZED:
                bracketCount--;
                status = RETURN;
                step   = attempt._1;
                fail   = attempt._2;
                break;
              }
            }
            break;

          case COMPLETED:
            for (var k in joins) {
              if (joins.hasOwnProperty(k)) {
                rethrow = rethrow && joins[k].rethrow;
                runEff(joins[k].handler(step));
              }
            }
            joins = null;
            // If we have an interrupt and a fail, then the thread threw while
            // running finalizers. This should always rethrow in a fresh stack.
            if (interrupt && fail) {
              setTimeout(function () {
                throw util.fromLeft(fail);
              }, 0);
            // If we have an unhandled exception, and no other fiber has joined
            // then we need to throw the exception in a fresh stack.
            } else if (util.isLeft(step) && rethrow) {
              setTimeout(function () {
                // Guard on reathrow because a completely synchronous fiber can
                // still have an observer which was added after-the-fact.
                if (rethrow) {
                  throw util.fromLeft(step);
                }
              }, 0);
            }
            return;
          case SUSPENDED:
            status = CONTINUE;
            break;
          case PENDING: return;
          }
        }
      }

      function onComplete(join) {
        return function () {
          if (status === COMPLETED) {
            rethrow = rethrow && join.rethrow;
            join.handler(step)();
            return function () {};
          }

          var jid    = joinId++;
          joins      = joins || {};
          joins[jid] = join;

          return function() {
            if (joins !== null) {
              delete joins[jid];
            }
          };
        };
      }

      function kill(error, cb) {
        return function () {
          if (status === COMPLETED) {
            cb(util.right(void 0))();
            return function () {};
          }

          var canceler = onComplete({
            rethrow: false,
            handler: function (/* unused */) {
              return cb(util.right(void 0));
            }
          })();

          switch (status) {
          case SUSPENDED:
            interrupt = util.left(error);
            status    = COMPLETED;
            step      = interrupt;
            run(runTick);
            break;
          case PENDING:
            if (interrupt === null) {
              interrupt = util.left(error);
            }
            if (bracketCount === 0) {
              if (status === PENDING) {
                attempts = new Aff(CONS, new Aff(FINALIZER, step(error)), attempts, interrupt);
              }
              status   = RETURN;
              step     = null;
              fail     = null;
              run(++runTick);
            }
            break;
          default:
            if (interrupt === null) {
              interrupt = util.left(error);
            }
            if (bracketCount === 0) {
              status = RETURN;
              step   = null;
              fail   = null;
            }
          }

          return canceler;
        };
      }

      function join(cb) {
        return function () {
          var canceler = onComplete({
            rethrow: false,
            handler: cb
          })();
          if (status === SUSPENDED) {
            run(runTick);
          }
          return canceler;
        };
      }

      return {
        kill: kill,
        join: join,
        onComplete: onComplete,
        isSuspended: function () {
          return status === SUSPENDED;
        },
        run: function () {
          if (status === SUSPENDED) {
            if (!Scheduler.isDraining()) {
              Scheduler.enqueue(function () {
                run(runTick);
              });
            } else {
              run(runTick);
            }
          }
        }
      };
    }

    function runPar(util, supervisor, par, cb) {
      // Table of all forked fibers.
      var fiberId   = 0;
      var fibers    = {};

      // Table of currently running cancelers, as a product of `Alt` behavior.
      var killId    = 0;
      var kills     = {};

      // Error used for early cancelation on Alt branches.
      var early     = new Error("[ParAff] Early exit");

      // Error used to kill the entire tree.
      var interrupt = null;

      // The root pointer of the tree.
      var root      = EMPTY;

      // Walks a tree, invoking all the cancelers. Returns the table of pending
      // cancellation fibers.
      function kill(error, par, cb) {
        var step  = par;
        var head  = null;
        var tail  = null;
        var count = 0;
        var kills = {};
        var tmp, kid;

        loop: while (true) {
          tmp = null;

          switch (step.tag) {
          case FORKED:
            if (step._3 === EMPTY) {
              tmp = fibers[step._1];
              kills[count++] = tmp.kill(error, function (result) {
                return function () {
                  count--;
                  if (count === 0) {
                    cb(result)();
                  }
                };
              });
            }
            // Terminal case.
            if (head === null) {
              break loop;
            }
            // Go down the right side of the tree.
            step = head._2;
            if (tail === null) {
              head = null;
            } else {
              head = tail._1;
              tail = tail._2;
            }
            break;
          case MAP:
            step = step._2;
            break;
          case APPLY:
          case ALT:
            if (head) {
              tail = new Aff(CONS, head, tail);
            }
            head = step;
            step = step._1;
            break;
          }
        }

        if (count === 0) {
          cb(util.right(void 0))();
        } else {
          // Run the cancelation effects. We alias `count` because it's mutable.
          kid = 0;
          tmp = count;
          for (; kid < tmp; kid++) {
            kills[kid] = kills[kid]();
          }
        }

        return kills;
      }

      // When a fiber resolves, we need to bubble back up the tree with the
      // result, computing the applicative nodes.
      function join(result, head, tail) {
        var fail, step, lhs, rhs, tmp, kid;

        if (util.isLeft(result)) {
          fail = result;
          step = null;
        } else {
          step = result;
          fail = null;
        }

        loop: while (true) {
          lhs = null;
          rhs = null;
          tmp = null;
          kid = null;

          // We should never continue if the entire tree has been interrupted.
          if (interrupt !== null) {
            return;
          }

          // We've made it all the way to the root of the tree, which means
          // the tree has fully evaluated.
          if (head === null) {
            cb(fail || step)();
            return;
          }

          // The tree has already been computed, so we shouldn't try to do it
          // again. This should never happen.
          // TODO: Remove this?
          if (head._3 !== EMPTY) {
            return;
          }

          switch (head.tag) {
          case MAP:
            if (fail === null) {
              head._3 = util.right(head._1(util.fromRight(step)));
              step    = head._3;
            } else {
              head._3 = fail;
            }
            break;
          case APPLY:
            lhs = head._1._3;
            rhs = head._2._3;
            // If we have a failure we should kill the other side because we
            // can't possible yield a result anymore.
            if (fail) {
              head._3 = fail;
              tmp     = true;
              kid     = killId++;

              kills[kid] = kill(early, fail === lhs ? head._2 : head._1, function (/* unused */) {
                return function () {
                  delete kills[kid];
                  if (tmp) {
                    tmp = false;
                  } else if (tail === null) {
                    join(fail, null, null);
                  } else {
                    join(fail, tail._1, tail._2);
                  }
                };
              });

              if (tmp) {
                tmp = false;
                return;
              }
            } else if (lhs === EMPTY || rhs === EMPTY) {
              // We can only proceed if both sides have resolved.
              return;
            } else {
              step    = util.right(util.fromRight(lhs)(util.fromRight(rhs)));
              head._3 = step;
            }
            break;
          case ALT:
            lhs = head._1._3;
            rhs = head._2._3;
            // We can only proceed if both have resolved or we have a success
            if (lhs === EMPTY && util.isLeft(rhs) || rhs === EMPTY && util.isLeft(lhs)) {
              return;
            }
            // If both sides resolve with an error, we should continue with the
            // first error
            if (lhs !== EMPTY && util.isLeft(lhs) && rhs !== EMPTY && util.isLeft(rhs)) {
              fail    = step === lhs ? rhs : lhs;
              step    = null;
              head._3 = fail;
            } else {
              head._3 = step;
              tmp     = true;
              kid     = killId++;
              // Once a side has resolved, we need to cancel the side that is still
              // pending before we can continue.
              kills[kid] = kill(early, step === lhs ? head._2 : head._1, function (/* unused */) {
                return function () {
                  delete kills[kid];
                  if (tmp) {
                    tmp = false;
                  } else if (tail === null) {
                    join(step, null, null);
                  } else {
                    join(step, tail._1, tail._2);
                  }
                };
              });

              if (tmp) {
                tmp = false;
                return;
              }
            }
            break;
          }

          if (tail === null) {
            head = null;
          } else {
            head = tail._1;
            tail = tail._2;
          }
        }
      }

      function resolve(fiber) {
        return function (result) {
          return function () {
            delete fibers[fiber._1];
            fiber._3 = result;
            join(result, fiber._2._1, fiber._2._2);
          };
        };
      }

      // Walks the applicative tree, substituting non-applicative nodes with
      // `FORKED` nodes. In this tree, all applicative nodes use the `_3` slot
      // as a mutable slot for memoization. In an unresolved state, the `_3`
      // slot is `EMPTY`. In the cases of `ALT` and `APPLY`, we always walk
      // the left side first, because both operations are left-associative. As
      // we `RETURN` from those branches, we then walk the right side.
      function run() {
        var status = CONTINUE;
        var step   = par;
        var head   = null;
        var tail   = null;
        var tmp, fid;

        loop: while (true) {
          tmp = null;
          fid = null;

          switch (status) {
          case CONTINUE:
            switch (step.tag) {
            case MAP:
              if (head) {
                tail = new Aff(CONS, head, tail);
              }
              head = new Aff(MAP, step._1, EMPTY, EMPTY);
              step = step._2;
              break;
            case APPLY:
              if (head) {
                tail = new Aff(CONS, head, tail);
              }
              head = new Aff(APPLY, EMPTY, step._2, EMPTY);
              step = step._1;
              break;
            case ALT:
              if (head) {
                tail = new Aff(CONS, head, tail);
              }
              head = new Aff(ALT, EMPTY, step._2, EMPTY);
              step = step._1;
              break;
            default:
              // When we hit a leaf value, we suspend the stack in the `FORKED`.
              // When the fiber resolves, it can bubble back up the tree.
              fid    = fiberId++;
              status = RETURN;
              tmp    = step;
              step   = new Aff(FORKED, fid, new Aff(CONS, head, tail), EMPTY);
              tmp    = Fiber(util, supervisor, tmp);
              tmp.onComplete({
                rethrow: false,
                handler: resolve(step)
              })();
              fibers[fid] = tmp;
              if (supervisor) {
                supervisor.register(tmp);
              }
            }
            break;
          case RETURN:
            // Terminal case, we are back at the root.
            if (head === null) {
              break loop;
            }
            // If we are done with the right side, we need to continue down the
            // left. Otherwise we should continue up the stack.
            if (head._1 === EMPTY) {
              head._1 = step;
              status  = CONTINUE;
              step    = head._2;
              head._2 = EMPTY;
            } else {
              head._2 = step;
              step    = head;
              if (tail === null) {
                head  = null;
              } else {
                head  = tail._1;
                tail  = tail._2;
              }
            }
          }
        }

        // Keep a reference to the tree root so it can be cancelled.
        root = step;

        for (fid = 0; fid < fiberId; fid++) {
          fibers[fid].run();
        }
      }

      // Cancels the entire tree. If there are already subtrees being canceled,
      // we need to first cancel those joins. We will then add fresh joins for
      // all pending branches including those that were in the process of being
      // canceled.
      function cancel(error, cb) {
        interrupt = util.left(error);
        var innerKills;
        for (var kid in kills) {
          if (kills.hasOwnProperty(kid)) {
            innerKills = kills[kid];
            for (kid in innerKills) {
              if (innerKills.hasOwnProperty(kid)) {
                innerKills[kid]();
              }
            }
          }
        }

        kills = null;
        var newKills = kill(error, root, cb);

        return function (killError) {
          return new Aff(ASYNC, function (killCb) {
            return function () {
              for (var kid in newKills) {
                if (newKills.hasOwnProperty(kid)) {
                  newKills[kid]();
                }
              }
              return nonCanceler;
            };
          });
        };
      }

      run();

      return function (killError) {
        return new Aff(ASYNC, function (killCb) {
          return function () {
            return cancel(killError, killCb);
          };
        });
      };
    }

    function sequential(util, supervisor, par) {
      return new Aff(ASYNC, function (cb) {
        return function () {
          return runPar(util, supervisor, par, cb);
        };
      });
    }

    Aff.EMPTY       = EMPTY;
    Aff.Pure        = AffCtr(PURE);
    Aff.Throw       = AffCtr(THROW);
    Aff.Catch       = AffCtr(CATCH);
    Aff.Sync        = AffCtr(SYNC);
    Aff.Async       = AffCtr(ASYNC);
    Aff.Bind        = AffCtr(BIND);
    Aff.Bracket     = AffCtr(BRACKET);
    Aff.Fork        = AffCtr(FORK);
    Aff.Seq         = AffCtr(SEQ);
    Aff.ParMap      = AffCtr(MAP);
    Aff.ParApply    = AffCtr(APPLY);
    Aff.ParAlt      = AffCtr(ALT);
    Aff.Fiber       = Fiber;
    Aff.Supervisor  = Supervisor;
    Aff.Scheduler   = Scheduler;
    Aff.nonCanceler = nonCanceler;

    return Aff;
  }();

  exports._pure = Aff.Pure;

  exports._throwError = Aff.Throw;

  exports._catchError = function (aff) {
    return function (k) {
      return Aff.Catch(aff, k);
    };
  };

  exports._map = function (f) {
    return function (aff) {
      if (aff.tag === Aff.Pure.tag) {
        return Aff.Pure(f(aff._1));
      } else {
        return Aff.Bind(aff, function (value) {
          return Aff.Pure(f(value));
        });
      }
    };
  };

  exports._bind = function (aff) {
    return function (k) {
      return Aff.Bind(aff, k);
    };
  };

  exports._liftEffect = Aff.Sync;

  exports.makeAff = Aff.Async;

  exports._makeFiber = function (util, aff) {
    return function () {
      return Aff.Fiber(util, null, aff);
    };
  };
})(PS["Effect.Aff"] = PS["Effect.Aff"] || {});
(function(exports) {
  "use strict";

  exports.pureE = function (a) {
    return function () {
      return a;
    };
  };

  exports.bindE = function (a) {
    return function (f) {
      return function () {
        return f(a())();
      };
    };
  };
})(PS["Effect"] = PS["Effect"] || {});
(function($PS) {
  // Generated by purs version 0.13.5
  "use strict";
  $PS["Effect"] = $PS["Effect"] || {};
  var exports = $PS["Effect"];
  var $foreign = $PS["Effect"];
  var Control_Applicative = $PS["Control.Applicative"];
  var Control_Apply = $PS["Control.Apply"];
  var Control_Bind = $PS["Control.Bind"];
  var Control_Monad = $PS["Control.Monad"];
  var Data_Functor = $PS["Data.Functor"];                    
  var monadEffect = new Control_Monad.Monad(function () {
      return applicativeEffect;
  }, function () {
      return bindEffect;
  });
  var bindEffect = new Control_Bind.Bind(function () {
      return applyEffect;
  }, $foreign.bindE);
  var applyEffect = new Control_Apply.Apply(function () {
      return functorEffect;
  }, Control_Monad.ap(monadEffect));
  var applicativeEffect = new Control_Applicative.Applicative(function () {
      return applyEffect;
  }, $foreign.pureE);
  var functorEffect = new Data_Functor.Functor(Control_Applicative.liftA1(applicativeEffect));
  exports["functorEffect"] = functorEffect;
  exports["applicativeEffect"] = applicativeEffect;
})(PS);
(function($PS) {
  // Generated by purs version 0.13.5
  "use strict";
  $PS["Effect.Class"] = $PS["Effect.Class"] || {};
  var exports = $PS["Effect.Class"];         
  var MonadEffect = function (Monad0, liftEffect) {
      this.Monad0 = Monad0;
      this.liftEffect = liftEffect;
  };                                                         
  var liftEffect = function (dict) {
      return dict.liftEffect;
  };
  exports["liftEffect"] = liftEffect;
  exports["MonadEffect"] = MonadEffect;
})(PS);
(function(exports) {
  "use strict";

  // module Partial.Unsafe

  exports.unsafePartial = function (f) {
    return f();
  };
})(PS["Partial.Unsafe"] = PS["Partial.Unsafe"] || {});
(function(exports) {
  "use strict";

  // module Partial

  exports.crashWith = function () {
    return function (msg) {
      throw new Error(msg);
    };
  };
})(PS["Partial"] = PS["Partial"] || {});
(function($PS) {
  // Generated by purs version 0.13.5
  "use strict";
  $PS["Partial"] = $PS["Partial"] || {};
  var exports = $PS["Partial"];
  var $foreign = $PS["Partial"];
  exports["crashWith"] = $foreign.crashWith;
})(PS);
(function($PS) {
  // Generated by purs version 0.13.5
  "use strict";
  $PS["Partial.Unsafe"] = $PS["Partial.Unsafe"] || {};
  var exports = $PS["Partial.Unsafe"];
  var $foreign = $PS["Partial.Unsafe"];
  var Partial = $PS["Partial"];
  var unsafeCrashWith = function (msg) {
      return $foreign.unsafePartial(function (dictPartial) {
          return Partial.crashWith()(msg);
      });
  };
  exports["unsafeCrashWith"] = unsafeCrashWith;
})(PS);
(function($PS) {
  // Generated by purs version 0.13.5
  "use strict";
  $PS["Effect.Aff"] = $PS["Effect.Aff"] || {};
  var exports = $PS["Effect.Aff"];
  var $foreign = $PS["Effect.Aff"];
  var Control_Applicative = $PS["Control.Applicative"];
  var Control_Apply = $PS["Control.Apply"];
  var Control_Bind = $PS["Control.Bind"];
  var Control_Monad = $PS["Control.Monad"];
  var Control_Monad_Error_Class = $PS["Control.Monad.Error.Class"];
  var Data_Either = $PS["Data.Either"];
  var Data_Function = $PS["Data.Function"];
  var Data_Functor = $PS["Data.Functor"];
  var Data_Unit = $PS["Data.Unit"];
  var Effect = $PS["Effect"];
  var Effect_Class = $PS["Effect.Class"];
  var Partial_Unsafe = $PS["Partial.Unsafe"];                          
  var functorAff = new Data_Functor.Functor($foreign["_map"]);
  var ffiUtil = (function () {
      var unsafeFromRight = function (v) {
          if (v instanceof Data_Either.Right) {
              return v.value0;
          };
          if (v instanceof Data_Either.Left) {
              return Partial_Unsafe.unsafeCrashWith("unsafeFromRight: Left");
          };
          throw new Error("Failed pattern match at Effect.Aff (line 400, column 21 - line 402, column 54): " + [ v.constructor.name ]);
      };
      var unsafeFromLeft = function (v) {
          if (v instanceof Data_Either.Left) {
              return v.value0;
          };
          if (v instanceof Data_Either.Right) {
              return Partial_Unsafe.unsafeCrashWith("unsafeFromLeft: Right");
          };
          throw new Error("Failed pattern match at Effect.Aff (line 395, column 20 - line 397, column 54): " + [ v.constructor.name ]);
      };
      var isLeft = function (v) {
          if (v instanceof Data_Either.Left) {
              return true;
          };
          if (v instanceof Data_Either.Right) {
              return false;
          };
          throw new Error("Failed pattern match at Effect.Aff (line 390, column 12 - line 392, column 20): " + [ v.constructor.name ]);
      };
      return {
          isLeft: isLeft,
          fromLeft: unsafeFromLeft,
          fromRight: unsafeFromRight,
          left: Data_Either.Left.create,
          right: Data_Either.Right.create
      };
  })();
  var makeFiber = function (aff) {
      return $foreign["_makeFiber"](ffiUtil, aff);
  };
  var launchAff = function (aff) {
      return function __do() {
          var v = makeFiber(aff)();
          v.run();
          return v;
      };
  };
  var launchAff_ = (function () {
      var $49 = Data_Functor["void"](Effect.functorEffect);
      return function ($50) {
          return $49(launchAff($50));
      };
  })();
  var monadAff = new Control_Monad.Monad(function () {
      return applicativeAff;
  }, function () {
      return bindAff;
  });
  var bindAff = new Control_Bind.Bind(function () {
      return applyAff;
  }, $foreign["_bind"]);
  var applyAff = new Control_Apply.Apply(function () {
      return functorAff;
  }, Control_Monad.ap(monadAff));
  var applicativeAff = new Control_Applicative.Applicative(function () {
      return applyAff;
  }, $foreign["_pure"]);
  var monadEffectAff = new Effect_Class.MonadEffect(function () {
      return monadAff;
  }, $foreign["_liftEffect"]);
  var monadThrowAff = new Control_Monad_Error_Class.MonadThrow(function () {
      return monadAff;
  }, $foreign["_throwError"]);
  var monadErrorAff = new Control_Monad_Error_Class.MonadError(function () {
      return monadThrowAff;
  }, $foreign["_catchError"]);
  var nonCanceler = Data_Function["const"](Control_Applicative.pure(applicativeAff)(Data_Unit.unit));
  exports["launchAff_"] = launchAff_;
  exports["nonCanceler"] = nonCanceler;
  exports["functorAff"] = functorAff;
  exports["applicativeAff"] = applicativeAff;
  exports["bindAff"] = bindAff;
  exports["monadErrorAff"] = monadErrorAff;
  exports["monadEffectAff"] = monadEffectAff;
  exports["makeAff"] = $foreign.makeAff;
})(PS);
(function($PS) {
  // Generated by purs version 0.13.5
  "use strict";
  $PS["Effect.Aff.Compat"] = $PS["Effect.Aff.Compat"] || {};
  var exports = $PS["Effect.Aff.Compat"];
  var Data_Either = $PS["Data.Either"];
  var Effect_Aff = $PS["Effect.Aff"];
  var fromEffectFnAff = function (v) {
      return Effect_Aff.makeAff(function (k) {
          return function __do() {
              var v1 = v(function ($4) {
                  return k(Data_Either.Left.create($4))();
              }, function ($5) {
                  return k(Data_Either.Right.create($5))();
              });
              return function (e) {
                  return Effect_Aff.makeAff(function (k2) {
                      return function __do() {
                          v1(e, function ($6) {
                              return k2(Data_Either.Left.create($6))();
                          }, function ($7) {
                              return k2(Data_Either.Right.create($7))();
                          });
                          return Effect_Aff.nonCanceler;
                      };
                  });
              };
          };
      });
  };
  exports["fromEffectFnAff"] = fromEffectFnAff;
})(PS);
(function(exports) {
  "use strict";

  exports.message = function (e) {
    return e.message;
  };
})(PS["Effect.Exception"] = PS["Effect.Exception"] || {});
(function($PS) {
  // Generated by purs version 0.13.5
  "use strict";
  $PS["Effect.Exception"] = $PS["Effect.Exception"] || {};
  var exports = $PS["Effect.Exception"];
  var $foreign = $PS["Effect.Exception"];
  exports["message"] = $foreign.message;
})(PS);
(function(exports) {
  "use strict";

  exports.unsafeToForeign = function (value) {
    return value;
  };

  exports.unsafeFromForeign = function (value) {
    return value;
  };

  exports.tagOf = function (value) {
    return Object.prototype.toString.call(value).slice(8, -1);
  };
})(PS["Foreign"] = PS["Foreign"] || {});
(function($PS) {
  // Generated by purs version 0.13.5
  "use strict";
  $PS["Data.Boolean"] = $PS["Data.Boolean"] || {};
  var exports = $PS["Data.Boolean"];
  var otherwise = true;
  exports["otherwise"] = otherwise;
})(PS);
(function($PS) {
  // Generated by purs version 0.13.5
  "use strict";
  $PS["Foreign"] = $PS["Foreign"] || {};
  var exports = $PS["Foreign"];
  var $foreign = $PS["Foreign"];
  var Control_Applicative = $PS["Control.Applicative"];
  var Control_Monad_Error_Class = $PS["Control.Monad.Error.Class"];
  var Control_Monad_Except_Trans = $PS["Control.Monad.Except.Trans"];
  var Data_Boolean = $PS["Data.Boolean"];
  var Data_Identity = $PS["Data.Identity"];
  var Data_List_NonEmpty = $PS["Data.List.NonEmpty"];
  var Data_Show = $PS["Data.Show"];                                        
  var ForeignError = (function () {
      function ForeignError(value0) {
          this.value0 = value0;
      };
      ForeignError.create = function (value0) {
          return new ForeignError(value0);
      };
      return ForeignError;
  })();
  var TypeMismatch = (function () {
      function TypeMismatch(value0, value1) {
          this.value0 = value0;
          this.value1 = value1;
      };
      TypeMismatch.create = function (value0) {
          return function (value1) {
              return new TypeMismatch(value0, value1);
          };
      };
      return TypeMismatch;
  })();
  var ErrorAtIndex = (function () {
      function ErrorAtIndex(value0, value1) {
          this.value0 = value0;
          this.value1 = value1;
      };
      ErrorAtIndex.create = function (value0) {
          return function (value1) {
              return new ErrorAtIndex(value0, value1);
          };
      };
      return ErrorAtIndex;
  })();
  var ErrorAtProperty = (function () {
      function ErrorAtProperty(value0, value1) {
          this.value0 = value0;
          this.value1 = value1;
      };
      ErrorAtProperty.create = function (value0) {
          return function (value1) {
              return new ErrorAtProperty(value0, value1);
          };
      };
      return ErrorAtProperty;
  })();
  var renderForeignError = function (v) {
      if (v instanceof ForeignError) {
          return v.value0;
      };
      if (v instanceof ErrorAtIndex) {
          return "Error at array index " + (Data_Show.show(Data_Show.showInt)(v.value0) + (": " + renderForeignError(v.value1)));
      };
      if (v instanceof ErrorAtProperty) {
          return "Error at property " + (Data_Show.show(Data_Show.showString)(v.value0) + (": " + renderForeignError(v.value1)));
      };
      if (v instanceof TypeMismatch) {
          return "Type mismatch: expected " + (v.value0 + (", found " + v.value1));
      };
      throw new Error("Failed pattern match at Foreign (line 72, column 1 - line 72, column 45): " + [ v.constructor.name ]);
  };
  var fail = (function () {
      var $107 = Control_Monad_Error_Class.throwError(Control_Monad_Except_Trans.monadThrowExceptT(Data_Identity.monadIdentity));
      return function ($108) {
          return $107(Data_List_NonEmpty.singleton($108));
      };
  })();
  var unsafeReadTagged = function (tag) {
      return function (value) {
          if ($foreign.tagOf(value) === tag) {
              return Control_Applicative.pure(Control_Monad_Except_Trans.applicativeExceptT(Data_Identity.monadIdentity))($foreign.unsafeFromForeign(value));
          };
          if (Data_Boolean.otherwise) {
              return fail(new TypeMismatch(tag, $foreign.tagOf(value)));
          };
          throw new Error("Failed pattern match at Foreign (line 106, column 1 - line 106, column 55): " + [ tag.constructor.name, value.constructor.name ]);
      };
  };
  exports["ForeignError"] = ForeignError;
  exports["renderForeignError"] = renderForeignError;
  exports["unsafeReadTagged"] = unsafeReadTagged;
  exports["fail"] = fail;
  exports["unsafeToForeign"] = $foreign.unsafeToForeign;
})(PS);
(function($PS) {
  // Generated by purs version 0.13.5
  "use strict";
  $PS["Affjax"] = $PS["Affjax"] || {};
  var exports = $PS["Affjax"];
  var $foreign = $PS["Affjax"];
  var Affjax_RequestBody = $PS["Affjax.RequestBody"];
  var Affjax_RequestHeader = $PS["Affjax.RequestHeader"];
  var Affjax_ResponseFormat = $PS["Affjax.ResponseFormat"];
  var Affjax_ResponseHeader = $PS["Affjax.ResponseHeader"];
  var Control_Applicative = $PS["Control.Applicative"];
  var Control_Bind = $PS["Control.Bind"];
  var Control_Monad_Error_Class = $PS["Control.Monad.Error.Class"];
  var Control_Monad_Except = $PS["Control.Monad.Except"];
  var Control_Monad_Except_Trans = $PS["Control.Monad.Except.Trans"];
  var Data_Argonaut_Core = $PS["Data.Argonaut.Core"];
  var Data_Argonaut_Parser = $PS["Data.Argonaut.Parser"];
  var Data_Array = $PS["Data.Array"];
  var Data_Either = $PS["Data.Either"];
  var Data_Eq = $PS["Data.Eq"];
  var Data_Foldable = $PS["Data.Foldable"];
  var Data_FormURLEncoded = $PS["Data.FormURLEncoded"];
  var Data_Function = $PS["Data.Function"];
  var Data_Functor = $PS["Data.Functor"];
  var Data_HTTP_Method = $PS["Data.HTTP.Method"];
  var Data_HeytingAlgebra = $PS["Data.HeytingAlgebra"];
  var Data_Identity = $PS["Data.Identity"];
  var Data_List_NonEmpty = $PS["Data.List.NonEmpty"];
  var Data_Maybe = $PS["Data.Maybe"];
  var Data_Nullable = $PS["Data.Nullable"];
  var Data_Unit = $PS["Data.Unit"];
  var Effect_Aff = $PS["Effect.Aff"];
  var Effect_Aff_Compat = $PS["Effect.Aff.Compat"];
  var Effect_Exception = $PS["Effect.Exception"];
  var Foreign = $PS["Foreign"];                
  var RequestContentError = (function () {
      function RequestContentError(value0) {
          this.value0 = value0;
      };
      RequestContentError.create = function (value0) {
          return new RequestContentError(value0);
      };
      return RequestContentError;
  })();
  var ResponseBodyError = (function () {
      function ResponseBodyError(value0, value1) {
          this.value0 = value0;
          this.value1 = value1;
      };
      ResponseBodyError.create = function (value0) {
          return function (value1) {
              return new ResponseBodyError(value0, value1);
          };
      };
      return ResponseBodyError;
  })();
  var XHRError = (function () {
      function XHRError(value0) {
          this.value0 = value0;
      };
      XHRError.create = function (value0) {
          return new XHRError(value0);
      };
      return XHRError;
  })();
  var request = function (req) {
      var parseJSON = function (v) {
          if (v === "") {
              return Control_Applicative.pure(Control_Monad_Except_Trans.applicativeExceptT(Data_Identity.monadIdentity))(Data_Argonaut_Core.jsonEmptyObject);
          };
          return Data_Either.either(function ($47) {
              return Foreign.fail(Foreign.ForeignError.create($47));
          })(Control_Applicative.pure(Control_Monad_Except_Trans.applicativeExceptT(Data_Identity.monadIdentity)))(Data_Argonaut_Parser.jsonParser(v));
      };
      var fromResponse = (function () {
          if (req.responseFormat instanceof Affjax_ResponseFormat["ArrayBuffer"]) {
              return Foreign.unsafeReadTagged("ArrayBuffer");
          };
          if (req.responseFormat instanceof Affjax_ResponseFormat.Blob) {
              return Foreign.unsafeReadTagged("Blob");
          };
          if (req.responseFormat instanceof Affjax_ResponseFormat.Document) {
              return Foreign.unsafeReadTagged("Document");
          };
          if (req.responseFormat instanceof Affjax_ResponseFormat.Json) {
              return Control_Bind.composeKleisliFlipped(Control_Monad_Except_Trans.bindExceptT(Data_Identity.monadIdentity))(function ($48) {
                  return req.responseFormat.value0(parseJSON($48));
              })(Foreign.unsafeReadTagged("String"));
          };
          if (req.responseFormat instanceof Affjax_ResponseFormat["String"]) {
              return Foreign.unsafeReadTagged("String");
          };
          if (req.responseFormat instanceof Affjax_ResponseFormat.Ignore) {
              return Data_Function["const"](req.responseFormat.value0(Control_Applicative.pure(Control_Monad_Except_Trans.applicativeExceptT(Data_Identity.monadIdentity))(Data_Unit.unit)));
          };
          throw new Error("Failed pattern match at Affjax (line 237, column 18 - line 243, column 57): " + [ req.responseFormat.constructor.name ]);
      })();
      var extractContent = function (v) {
          if (v instanceof Affjax_RequestBody.ArrayView) {
              return Data_Either.Right.create(v.value0(Foreign.unsafeToForeign));
          };
          if (v instanceof Affjax_RequestBody.Blob) {
              return Data_Either.Right.create(Foreign.unsafeToForeign(v.value0));
          };
          if (v instanceof Affjax_RequestBody.Document) {
              return Data_Either.Right.create(Foreign.unsafeToForeign(v.value0));
          };
          if (v instanceof Affjax_RequestBody["String"]) {
              return Data_Either.Right.create(Foreign.unsafeToForeign(v.value0));
          };
          if (v instanceof Affjax_RequestBody.FormData) {
              return Data_Either.Right.create(Foreign.unsafeToForeign(v.value0));
          };
          if (v instanceof Affjax_RequestBody.FormURLEncoded) {
              return Data_Either.note("Body contains values that cannot be encoded as application/x-www-form-urlencoded")(Data_Functor.map(Data_Maybe.functorMaybe)(Foreign.unsafeToForeign)(Data_FormURLEncoded.encode(v.value0)));
          };
          if (v instanceof Affjax_RequestBody.Json) {
              return Data_Either.Right.create(Foreign.unsafeToForeign(Data_Argonaut_Core.stringify(v.value0)));
          };
          throw new Error("Failed pattern match at Affjax (line 203, column 20 - line 218, column 69): " + [ v.constructor.name ]);
      };
      var addHeader = function (mh) {
          return function (hs) {
              if (mh instanceof Data_Maybe.Just && !Data_Foldable.any(Data_Foldable.foldableArray)(Data_HeytingAlgebra.heytingAlgebraBoolean)(Data_Function.on(Data_Eq.eq(Data_Eq.eqString))(Affjax_RequestHeader.name)(mh.value0))(hs)) {
                  return Data_Array.snoc(hs)(mh.value0);
              };
              return hs;
          };
      };
      var headers = function (reqContent) {
          return addHeader(Data_Functor.map(Data_Maybe.functorMaybe)(Affjax_RequestHeader.ContentType.create)(Control_Bind.bindFlipped(Data_Maybe.bindMaybe)(Affjax_RequestBody.toMediaType)(reqContent)))(addHeader(Data_Functor.map(Data_Maybe.functorMaybe)(Affjax_RequestHeader.Accept.create)(Affjax_ResponseFormat.toMediaType(req.responseFormat)))(req.headers));
      };
      var ajaxRequest = function (v) {
          return {
              method: Data_HTTP_Method.print(req.method),
              url: req.url,
              headers: Data_Functor.map(Data_Functor.functorArray)(function (h) {
                  return {
                      field: Affjax_RequestHeader.name(h),
                      value: Affjax_RequestHeader.value(h)
                  };
              })(headers(req.content)),
              content: v,
              responseType: Affjax_ResponseFormat.toResponseType(req.responseFormat),
              username: Data_Nullable.toNullable(req.username),
              password: Data_Nullable.toNullable(req.password),
              withCredentials: req.withCredentials
          };
      };
      var send = function (content) {
          return Data_Functor.mapFlipped(Effect_Aff.functorAff)(Control_Monad_Error_Class["try"](Effect_Aff.monadErrorAff)(Effect_Aff_Compat.fromEffectFnAff($foreign["_ajax"](Affjax_ResponseHeader.ResponseHeader.create, ajaxRequest(content)))))(function (v) {
              if (v instanceof Data_Either.Right) {
                  var v1 = Control_Monad_Except.runExcept(fromResponse(v.value0.body));
                  if (v1 instanceof Data_Either.Left) {
                      return new Data_Either.Left(new ResponseBodyError(Data_List_NonEmpty.head(v1.value0), v.value0));
                  };
                  if (v1 instanceof Data_Either.Right) {
                      return new Data_Either.Right({
                          body: v1.value0,
                          headers: v.value0.headers,
                          status: v.value0.status,
                          statusText: v.value0.statusText
                      });
                  };
                  throw new Error("Failed pattern match at Affjax (line 184, column 9 - line 186, column 52): " + [ v1.constructor.name ]);
              };
              if (v instanceof Data_Either.Left) {
                  return new Data_Either.Left(new XHRError(v.value0));
              };
              throw new Error("Failed pattern match at Affjax (line 182, column 86 - line 188, column 28): " + [ v.constructor.name ]);
          });
      };
      if (req.content instanceof Data_Maybe.Nothing) {
          return send(Data_Nullable.toNullable(Data_Maybe.Nothing.value));
      };
      if (req.content instanceof Data_Maybe.Just) {
          var v = extractContent(req.content.value0);
          if (v instanceof Data_Either.Right) {
              return send(Data_Nullable.toNullable(new Data_Maybe.Just(v.value0)));
          };
          if (v instanceof Data_Either.Left) {
              return Control_Applicative.pure(Effect_Aff.applicativeAff)(new Data_Either.Left(new RequestContentError(v.value0)));
          };
          throw new Error("Failed pattern match at Affjax (line 173, column 7 - line 177, column 48): " + [ v.constructor.name ]);
      };
      throw new Error("Failed pattern match at Affjax (line 169, column 3 - line 177, column 48): " + [ req.content.constructor.name ]);
  };
  var printError = function (v) {
      if (v instanceof RequestContentError) {
          return "There was a problem with the request content: " + v.value0;
      };
      if (v instanceof ResponseBodyError) {
          return "There was a problem with the response body: " + Foreign.renderForeignError(v.value0);
      };
      if (v instanceof XHRError) {
          return "There was a problem making the request: " + Effect_Exception.message(v.value0);
      };
      throw new Error("Failed pattern match at Affjax (line 91, column 14 - line 97, column 66): " + [ v.constructor.name ]);
  };
  var defaultRequest = {
      method: new Data_Either.Left(Data_HTTP_Method.GET.value),
      url: "/",
      headers: [  ],
      content: Data_Maybe.Nothing.value,
      username: Data_Maybe.Nothing.value,
      password: Data_Maybe.Nothing.value,
      withCredentials: false,
      responseFormat: Affjax_ResponseFormat.ignore
  };
  var post = function (rf) {
      return function (u) {
          return function (c) {
              return request({
                  method: new Data_Either.Left(Data_HTTP_Method.POST.value),
                  url: u,
                  headers: defaultRequest.headers,
                  content: c,
                  username: defaultRequest.username,
                  password: defaultRequest.password,
                  withCredentials: defaultRequest.withCredentials,
                  responseFormat: rf
              });
          };
      };
  };
  exports["printError"] = printError;
  exports["post"] = post;
})(PS);
(function(exports) {
  "use strict";

  exports.log = function (s) {
    return function () {
      console.log(s);
      return {};
    };
  };
})(PS["Effect.Console"] = PS["Effect.Console"] || {});
(function($PS) {
  // Generated by purs version 0.13.5
  "use strict";
  $PS["Effect.Console"] = $PS["Effect.Console"] || {};
  var exports = $PS["Effect.Console"];
  var $foreign = $PS["Effect.Console"];
  exports["log"] = $foreign.log;
})(PS);
(function(exports) {
  'use strict';

  exports.trigger = function(evt) {
    return function(ob) {
      return function() {
        ob.trigger(evt);
      }
    }
  }

  exports.getKeycode = function(evt) {
    return function() {
      return evt.which;
    }
  }

  exports.isShiftDown = function(evt) {
    return function() {
      return evt.shiftKey;
    }
  }
  exports.serialize = function(ob) {
    return function() {
      return ob.serialize();
    }
  }
})(PS["FrontendMain"] = PS["FrontendMain"] || {});
(function(exports) {
  /* global exports */
  "use strict";

  exports.ready = function(func) {
      return function() {
          jQuery(document).ready(func);
      };
  };

  exports.select = function(selector) {
      return function() {
          return jQuery(selector);
      };
  };

  exports.on = function(evt) {
      return function(act) {
          return function(ob) {
              return function() {
                  ob.on(evt, function(e) {
                      act(e)(jQuery(this))();
                  });
              };
          };
      };
  };

  exports.preventDefault = function(e) {
      return function() {
          e.preventDefault();
      };
  };
})(PS["JQuery"] = PS["JQuery"] || {});
(function($PS) {
  // Generated by purs version 0.13.5
  "use strict";
  $PS["JQuery"] = $PS["JQuery"] || {};
  var exports = $PS["JQuery"];
  var $foreign = $PS["JQuery"];
  exports["ready"] = $foreign.ready;
  exports["select"] = $foreign.select;
  exports["on"] = $foreign.on;
  exports["preventDefault"] = $foreign.preventDefault;
})(PS);
(function($PS) {
  // Generated by purs version 0.13.5
  "use strict";
  $PS["FrontendMain"] = $PS["FrontendMain"] || {};
  var exports = $PS["FrontendMain"];
  var $foreign = $PS["FrontendMain"];
  var Affjax = $PS["Affjax"];
  var Affjax_RequestBody = $PS["Affjax.RequestBody"];
  var Affjax_ResponseFormat = $PS["Affjax.ResponseFormat"];
  var Control_Applicative = $PS["Control.Applicative"];
  var Control_Bind = $PS["Control.Bind"];
  var Data_Either = $PS["Data.Either"];
  var Data_Maybe = $PS["Data.Maybe"];
  var Effect = $PS["Effect"];
  var Effect_Aff = $PS["Effect.Aff"];
  var Effect_Class = $PS["Effect.Class"];
  var Effect_Console = $PS["Effect.Console"];
  var JQuery = $PS["JQuery"];                
  var handleKeypress = function (form) {
      return function (event) {
          return function (v) {
              return function __do() {
                  var v1 = $foreign.getKeycode(event)();
                  var v2 = $foreign.isShiftDown(event)();
                  return Control_Applicative.when(Effect.applicativeEffect)(v1 === 13 && !v2)(function __do() {
                      JQuery.preventDefault(event)();
                      return $foreign.trigger("submit")(form)();
                  })();
              };
          };
      };
  };
  var handleFormSubmit = function (textarea) {
      return function (event) {
          return function (form) {
              return function __do() {
                  JQuery.preventDefault(event)();
                  var v = $foreign.serialize(form)();
                  return Effect_Aff.launchAff_(Control_Bind.bind(Effect_Aff.bindAff)(Affjax.post(Affjax_ResponseFormat.json)("/api/msg")(Data_Maybe.Just.create(Affjax_RequestBody.string(v))))(function (v1) {
                      if (v1 instanceof Data_Either.Left) {
                          return Effect_Class.liftEffect(Effect_Aff.monadEffectAff)(Effect_Console.log(Affjax.printError(v1.value0)));
                      };
                      if (v1 instanceof Data_Either.Right) {
                          return Effect_Class.liftEffect(Effect_Aff.monadEffectAff)(Effect_Console.log(v1.value0.statusText));
                      };
                      throw new Error("Failed pattern match at FrontendMain (line 42, column 5 - line 44, column 63): " + [ v1.constructor.name ]);
                  }))();
              };
          };
      };
  };
  var main = JQuery.ready(function __do() {
      var v = JQuery.select("#msgs")();
      var v1 = JQuery.select("#form")();
      var v2 = JQuery.select("#msgfield")();
      JQuery.on("keypress")(handleKeypress(v1))(v2)();
      return JQuery.on("submit")(handleFormSubmit(v2))(v1)();
  });
  exports["main"] = main;
  exports["handleKeypress"] = handleKeypress;
  exports["handleFormSubmit"] = handleFormSubmit;
  exports["trigger"] = $foreign.trigger;
  exports["getKeycode"] = $foreign.getKeycode;
  exports["isShiftDown"] = $foreign.isShiftDown;
  exports["serialize"] = $foreign.serialize;
})(PS);
PS["FrontendMain"].main();
}).call(this,require('_process'))
},{"_process":1}]},{},[2]);

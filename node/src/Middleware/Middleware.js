// module Middleware.Middleware
"use strict";

exports._json = function(req, res, nxt) {
    return function() {
      var express = require("express");
      return express.json()(req, res, nxt);
  }
}

exports._urlencoded = function(req, res, nxt) {
    return function() {
      var express = require("express");
      return express.urlencoded({extended:false})(req, res, nxt);
  }
}

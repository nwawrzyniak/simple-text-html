#!/bin/bash

cd node
npm install
bower install
pulp build
pulp browserify -m FrontendMain -O | npx uglifyjs --compress --mangle --toplevel -o static/main.min.js
PORT="${PORT:-8080}" pulp run

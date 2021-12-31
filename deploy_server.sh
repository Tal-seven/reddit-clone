#! /bin/bash
yarn build
heroku container:push --app=serene-mesa-11210 web
heroku container:release --app=serene-mesa-11210 web

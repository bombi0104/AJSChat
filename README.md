# AJSChat
AJSChat

Chat with AngularJS

After clone, run cmd
> sudo npm install

How to run
> DEBUG=myapp npm start
or call nodemon
> ./node_modules/nodemon/bin/nodemon.js

Start MongoDB
> sudo mongod --config /etc/mongod.conf --fork
> mongod --config /usr/local/etc/mongod.conf --fork  (MacOS)
///

==============

Setup on ubuntu :
1. Install Mongodb
  sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 7F0CEB10
  
  echo "deb http://repo.mongodb.org/apt/ubuntu "$(lsb_release -sc)"/mongodb-org/3.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.0.list

2. Install NodeJS
  curl -sL https://deb.nodesource.com/setup_0.12 | sudo bash -
  sudo apt-get install nodejs

'use strict';

const Colley = require('./colley.js');

Colley.getRankings()
  .then(function(rankings){
    console.log(rankings);
  });

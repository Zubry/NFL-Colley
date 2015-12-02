'use strict';

const games = require('./games.js');
const teams = require('./teams.js');
const Colley = require('colley-rankings');
const Promise = require('bluebird');

const CURRENT_WEEK = 12;

// Create a 32-team Colley matrix
let C = Colley(32);

// Normalize the schedule (team name -> team id)
function normalizeSchedule(schedule){
  return schedule.map(function(game){
    let gameCopy = {};
    gameCopy.winner = teams.toID[game.winner];
    gameCopy.loser = teams.toID[game.loser];
    return gameCopy;
  });
}

// Add each game to the matrix
function addGamesToMatrix(schedule){
  return schedule.map(function(game){
    C.addGame(game.winner, game.loser);
  });
}

// Solve the matrix
function solveMatrix(){
  return C.solve();
}

// Add a week property to the matrix, so that we can pull the rankings at a given week
function augmentMatrixObjectWithWeek(matrix, week){
  return {
    'week': week,
    'matrix': matrix
  };
}

// Retrieve the array from the matrix
function getMatrixArray(result){
  return result.array;
}

// Denormalize the rankings (team ID -> team name)
function denormalizeRankings(rankings){
  return rankings.map(function(element, index){
    return {
      'team': teams.toName[index],
      'score': element
    };
  });
}

// Sort rankings according to score
function sortRankings(rankings){
  return rankings.sort(function(a, b){
    return b.score - a.score;
  });
}

const addWeek = function(week){
  return games.getWeek(week)
    .then(normalizeSchedule)
    .then(addGamesToMatrix)
    .then(function(matrix){
      return augmentMatrixObjectWithWeek(matrix, week);
    })
};

const getRankings = function(){
  let weeks = [];

  for(let i = 1; i <= CURRENT_WEEK; i++){
    weeks.push(addWeek(i));
  }

  return Promise.settle(weeks)
    .then(solveMatrix)
    .then(getMatrixArray)
    .then(denormalizeRankings)
    .then(sortRankings);
};

module.exports = {
  'getRankings': getRankings
};

'use strict';

// Gets each NFL game that has been played, via espn.com

const request = require('request-promise');
const cheerio = require('cheerio');

const ESPN_SCHEDULE = "http://www.nfl.com/schedules/2015/REG";

const getWeek = function(week){
  var options = {
    uri: ESPN_SCHEDULE + week,
    transform: cheerio.load
  };

  return request(options)
    .then(function($){
      let schedule = []
      $('.list-matchup-row-team').each(function(index, element){
        schedule.push({
          'loser': $(this).find('.team-name.lost').text(),
          'winner': $(this).find('.team-name').not('.team-name.lost').text()
        });
      });
      return schedule;
    })
    .catch(function(){
      console.error('Lost a week');
    });
};

module.exports = {
  'getWeek': getWeek
};

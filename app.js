var ForecastIO = require("forecastio");
var pry = require("pryjs");
var tuc = require('temp-units-conv');
const { RTMClient } = require('@slack/client');

const token = process.env.tokenSlack;

const forecastid = process.env.forecastid

var darksky = new ForecastIO(forecastid);

function getWeather(latitudeGg, longitudeGg) {
  if(!latitudeGg || !longitudeGg){
    next();
    return;
  }

  darksky.forecast(latitudeGg, latitudeGg, function(err, data) {
    var temperature = tuc.f2c(data.currently.temperature).toFixed(2);
    var summaryDaily = data.daily.data[0].summary
    if(err){
      return;
    }

    var content = "It is " + temperature + " °C in Da Nang. " + "Summary daily: " + summaryDaily
    sendMgsSlack(content)
  })
}

const rtm = new RTMClient(token);
rtm.start();

const channelId = process.env.channelID;


var schedule = require('node-schedule');

schedule.scheduleJob('00 00 7 * * 1-7', function(){
  getWeather(16.066901, 108.213032);
});

function sendMgsSlack(content) {
  rtm.sendMessage(content, channelId)
    .then((res) => {
      console.log('Message sent: ' + content);
    })
    .catch(console.error);
};

var path = require("path");
var express = require("express");
var zipdb = require("zippity-do-dah");
var ForecastIO = require("forecastio");
var pry = require("pryjs");
var tuc = require('temp-units-conv');

var app = express();
var darksky = new ForecastIO("a8d5dea0a222e77479ff9c6b11fe9192");

app.use(express.static(path.resolve(__dirname, "assets")));

app.set("views", path.resolve(__dirname, "views"));
app.set("view engine", "ejs");

app.get("/", function(req, res){
  res.render("index");
});

app.get(/^\/(\d{5})$/, function(req, res) {
  var latitudeGg = req.query["lat"];
  var longitudeGg = req.query["lng"];
  if(!latitudeGg || !longitudeGg){
    next();
    return;
  }
  var latitude = latitudeGg;
  var longitude = longitudeGg;

  darksky.forecast(latitude, longitude, function(err, data) {
    var temperature = tuc.f2c(data.currently.temperature).toFixed(2);
    var summaryDaily = data.daily.data[0].summary
    if(err){
      next();
      return;
    }
    res.json({
      zipcode: "zipcode",
      temperature: temperature,
      summaryDaily: summaryDaily
    })
  })
});

app.use(function(req, res) {
  res.status(404).render("404");
});

app.listen(8080);

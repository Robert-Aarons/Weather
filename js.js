/*jslint browser: true*/
/*global $, jQuery, alert*/
/*
{"coord":{"lon":-121.36,"lat":38.55},"weather":[{"id":800,"main":"Clear","description":"clear sky","icon":"01d"}],"base":"cmc stations","main":{"temp":58.01,"pressure":1013,"humidity":67,"temp_min":55.4,"temp_max":60.8},"wind":{"speed":8.05,"deg":150},"clouds":{"all":1},"dt":1467899458,"sys":{"type":1,"id":408,"message":0.0041,"country":"US","sunrise":1467895729,"sunset":1467948723},"id":5388873,"name":"Rosemont","cod":200}
*/
function unixTimeStampToLocal(uts) {
    'use strict';
    var date, ampm, hours, minutes, formattedTime;
    date = new Date(uts * 1000);
    ampm = date.getHours() >= 12 ? "PM" : "AM";
    hours = date.getHours() % 12;
    if (hours === 0) {
        hours = 12;
    }
    minutes = "0" + date.getMinutes();
    formattedTime = "as of " + hours + ':' + minutes.substr(-2) + ampm;
    return formattedTime;
}

function updateWeather(weather) {
    "use strict";
    $("#debugID").html(JSON.stringify(weather));
    //FIXME: Insert check for valid response
    $("#city").html(weather.name);
    $("#temp").html(weather.main.temp.toFixed(0) + "&deg");
    $("#lastUpdated").html(unixTimeStampToLocal(weather.dt));
    $("#humidity").html("Humidity: " + weather.main.humidity + "%");
    $("#description").html(weather.weather[0].main);
    $("#wind").html("Wind: " + weather.wind.speed.toFixed(0) + " MPH ");
}

function queryWeather(queryType, query) {
    "use strict";
    switch (queryType) {
    case "zip":
        $.getJSON("//api.openweathermap.org/data/2.5/weather?zip=" + query + ",us&units=imperial&appid=32fcd78891a9e95e81d010e36d79c64e", function (weather) {
            updateWeather(weather);
        });
        break;
    case "city":
        $.getJSON("//api.openweathermap.org/data/2.5/weather?q=" + query + ",us&units=imperial&appid=32fcd78891a9e95e81d010e36d79c64e", function (weather) {
            updateWeather(weather);
        });
        break;
    case "latLon":
        $.getJSON("//api.openweathermap.org/data/2.5/weather?lat=" + query[0] + "&lon=" + query[1] + "&units=imperial&appid=32fcd78891a9e95e81d010e36d79c64e", function (weather) {
            updateWeather(weather);
        });
        break;
    default:
        return;
    }
}
$(document).ready(function () {
    'use strict';
    var lat, lon;
    $("#cityOrZip").keydown(function (event) {
        if (event.keyCode === 13) {
            var qt;
            if ((new RegExp(/^\d{5}$/)).test($("#cityOrZip").val())) {
                qt = "zip";
            }
            else {
                qt = "city";
            }
            queryWeather(qt, $("#cityOrZip").val());
            return false;
        }
    });
    (function ($) {
        $('#getLocation').on('click', function () {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function (position) {
                    lat = position.coords.latitude.toFixed(3);
                    lon = position.coords.longitude.toFixed(3);
                    queryWeather("latLon", [lat, lon]);
                });
            }
            else {
                alert("Location services not enabled, please enable or manually input City or Zip Code");
            }
        });
    })(jQuery);
});

//Global variables
var searches = [];

var searchFormEl=document.getElementById("search-form");
var searchInputEl=document.getElementById("cityName");
var currentWeatherEl=document.getElementById("current-weather-conditions");
var cityDisplayEl = document.getElementById("city-display");
var fiveDayTitle = document.getElementById("five-day-forecast");
var futureWeatherEl = document.getElementById("five-day-weather");
var searchHistoryButtonEl = document.getElementById("search-history-buttons");

//Search event handler with no input alert
var searchSubmitHandler = function(event){
    event.preventDefault();

    var city = searchInputEl.value.trim();
    if(city){
        getWeather(city);
        getFiveDay(city);
        searches.unshift({city});
        searchInputEl.value = "";
    } else{
        alert("Enter a city name to view weather.");
    }
    saveSearch();
    searchHistory(city);
}

//Save search history
var saveSearch = function(){
    localStorage.setItem("searches", JSON.stringify(searches));
};

//Get current weather from API
var getWeather = function(city){
    var apiKey = "558e113344de301d49fe3d6eb22f4f37"
    var requestURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`

    fetch(requestURL)
    .then(function(response){
        response.json().then(function(data){
            displayWeather(data, city);
        });
    });
};

//Display current weather
var displayWeather = function(weather, searchCity){
   currentWeatherEl.textContent= "";  
   cityDisplayEl.textContent=searchCity;

   //Create and place current date using Moment.js
   var currentDate = document.createElement("span")
   currentDate.textContent=" (" + moment(weather.dt.value).format("L") + ")";
   cityDisplayEl.appendChild(currentDate);

   //Pull in and place current conditions icon
   var weatherIcon = document.createElement("img")
   weatherIcon.setAttribute("src", `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`);
   cityDisplayEl.appendChild(weatherIcon);

   //Pull and place current temp
   var temperatureEl = document.createElement("span");
   temperatureEl.textContent = "Temperature: " + weather.main.temp + " °F";
   temperatureEl.classList = "list-group-item"
   currentWeatherEl.appendChild(temperatureEl);

   //Pull and place current humidity
   var humidityEl = document.createElement("span");
   humidityEl.textContent = "Humidity: " + weather.main.humidity + "%";
   humidityEl.classList = "list-group-item"
   currentWeatherEl.appendChild(humidityEl);

   //Pull and place current wind speed
   var windSpeedEl = document.createElement("span");
   windSpeedEl.textContent = "Wind Speed: " + weather.wind.speed + " MPH";
   windSpeedEl.classList = "list-group-item"
   currentWeatherEl.appendChild(windSpeedEl);
}

//Get 5 day forecast from API
var getFiveDay = function(city){
    var apiKey = "558e113344de301d49fe3d6eb22f4f37"
    var requestURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${apiKey}`

    fetch(requestURL)
    .then(function(response){
        response.json().then(function(data){
           displayFiveDay(data);
        });
    });
};

//Display 5 day forecast
var displayFiveDay = function(forecast){
    futureWeatherEl.textContent = ""
    fiveDayTitle.textContent = "5-Day Forecast:";

    var futureForecast = forecast.list;
        for(var i=5; i < futureForecast.length; i=i+8){
       var dailyForecast = futureForecast[i];
        
       var forecastEl=document.createElement("div");
       forecastEl.classList = "card bg-primary text-light m-3";

       //create date element
       var forecastDate = document.createElement("h5")
       forecastDate.textContent= moment.unix(dailyForecast.dt).format("MMM D, YYYY");
       forecastDate.classList = "card-header text-center"
       forecastEl.appendChild(forecastDate);

       
       //create an image element
       var weatherIcon = document.createElement("img")
       weatherIcon.classList = "card-body text-center";
       weatherIcon.setAttribute("src", `https://openweathermap.org/img/wn/${dailyForecast.weather[0].icon}@2x.png`);  

       //append to forecast card
       forecastEl.appendChild(weatherIcon);
       
       //create temperature span
       var forecastTempEl=document.createElement("span");
       forecastTempEl.classList = "card-body text-center";
       forecastTempEl.textContent = dailyForecast.main.temp + " °F";

       //append to forecast card
       forecastEl.appendChild(forecastTempEl);

       var forecastHumEl=document.createElement("span");
       forecastHumEl.classList = "card-body text-center";
       forecastHumEl.textContent = dailyForecast.main.humidity + "  %";

       //append to forecast card
       forecastEl.appendChild(forecastHumEl);

       // console.log(forecastEl);
       //append to five day container
       futureWeatherEl.appendChild(forecastEl);
    }

}

var searchHistory = function(searchHistory){
 
    // console.log(searchHistory)

    searchHistoryEl = document.createElement("button");
    searchHistoryEl.textContent = searchHistory;
    searchHistoryEl.classList = "d-flex w-100 btn-light border p-2";
    searchHistoryEl.setAttribute("data-city",searchHistory)
    searchHistoryEl.setAttribute("type", "submit");

    searchHistoryButtonEl.prepend(searchHistoryEl);
}

var searchHistoryHandler = function(event){
    var city = event.target.getAttribute("data-city")
    if(city){
        getCityWeather(city);
        getFiveDay(city);
    }
}

searchFormEl.addEventListener("submit", searchSubmitHandler);
searchHistoryButtonEl.addEventListener("click", searchHistoryHandler);
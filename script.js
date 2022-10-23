
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
   var currTempEl = document.createElement("span");
   currTempEl.textContent = "Temperature: " + weather.main.temp + " °F";
   currTempEl.classList = "list-group-item"
   currentWeatherEl.appendChild(currTempEl);

   //Pull and place current humidity
   var currHumidityEl = document.createElement("span");
   currHumidityEl.textContent = "Humidity: " + weather.main.humidity + "%";
   currHumidityEl.classList = "list-group-item"
   currentWeatherEl.appendChild(currHumidityEl);

   //Pull and place current wind speed
   var currWindEl = document.createElement("span");
   currWindEl.textContent = "Wind Speed: " + weather.wind.speed + " MPH";
   currWindEl.classList = "list-group-item"
   currentWeatherEl.appendChild(currWindEl);
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
       futureWeatherEl.appendChild(forecastEl);

       //Card date using Moment.js
       var forecastDate = document.createElement("h5")
       forecastDate.textContent= moment.unix(dailyForecast.dt).format("L");
       forecastDate.classList = "card-header text-center"
       forecastEl.appendChild(forecastDate);
       
       //Pull in and place future conditions icon
       var weatherIcon = document.createElement("img")
       weatherIcon.classList = "card-body text-center";
       weatherIcon.setAttribute("src", `https://openweathermap.org/img/wn/${dailyForecast.weather[0].icon}@2x.png`);  
       forecastEl.appendChild(weatherIcon);
       
       //Pull and place future temp
       var futureTempEl=document.createElement("span");
       futureTempEl.classList = "card-body";
       futureTempEl.textContent = "Temperature: " + dailyForecast.main.temp + " °F";
       forecastEl.appendChild(futureTempEl);
       
       //Pull and place future humidity
       var futureHumidityEl=document.createElement("span");
       futureHumidityEl.classList = "card-body";
       futureHumidityEl.textContent = "Humidity: " + dailyForecast.main.humidity + "%";
       forecastEl.appendChild(futureHumidityEl);

       //Pull and place future wind speed
       var futureWindEl=document.createElement("span");
       futureWindEl.classList = "card-body";
       futureWindEl.textContent = "Wind Speed: " + dailyForecast.wind.speed + " MPH";
       forecastEl.appendChild(futureWindEl);
    }
}

//Store and display search history
var searchHistory = function(searchHistory) {

    searchHistoryEl = document.createElement("button");
    searchHistoryEl.textContent = searchHistory;
    searchHistoryEl.classList = "d-flex w-100 btn-light border p-2";
    searchHistoryEl.setAttribute("data-city",searchHistory)
    searchHistoryEl.setAttribute("type","submit");
    searchHistoryButtonEl.prepend(searchHistoryEl);
}

//Call weather conditions from search history
var searchHistoryHandler = function(event) {
    var city = event.target.getAttribute("data-city")
    if(city){
        getWeather(city);
        getFiveDay(city);
    }
}

//Event listeners
searchFormEl.addEventListener("submit", searchSubmitHandler);
searchHistoryButtonEl.addEventListener("click", searchHistoryHandler);
var apiKey = "558e113344de301d49fe3d6eb22f4f37";
var today = moment().format('L');
var searchHistoryList = [];

var queryURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=imperial`;
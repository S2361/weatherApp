const apiKey = "86bc0c7700ff45abb28175214230911";
const firstForecast =
  "http://api.weatherapi.com/v1/forecast.json?key=86bc0c7700ff45abb28175214230911&q=";
const secondForecast = "&days=3&aqi=yes&alerts=no";
const searchAutocomplete =
  "http://api.weatherapi.com/v1/search.json?key=86bc0c7700ff45abb28175214230911&q=";
const collegePark = firstForecast + "college park" + secondForecast;
let recentURL = collegePark;
let recentDay = 0;
function dataLoader(weatherURL, day, tempScale) {
  recentURL = weatherURL;
  recentDay = day;
  fetch(weatherURL, {
    method: "GET",
  })
    .then((res) => res.json())
    .then((data) => {
      //Accessing values from the response
      const locationName = data.location.name;
      const region = data.location.region;
      const country = data.location.country;
      const localTime = data.location.localtime;
      let currentConditionLink = data.current.condition.icon;

      //Setting general weather info
      let currentTemperatureFahrenheit = data.current[tempScale];
      let currentWindSpeed = data.current.wind_mph;
      let currentCloud = data.current.cloud;
      let currentHumidity = data.current.humidity;

      //Changing from mph to kph if in celsius
      if (tempScale == "temp_c") {
        currentWindSpeed = data.current.wind_kph;
      }

      //Checking if day > 0 then accomodate for those changes
      if (day > 0) {
        currentConditionLink =
          data.forecast.forecastday[day].day.condition.icon;
        currentTemperatureFahrenheit =
          data.forecast.forecastday[day].day[`max${tempScale}`];
        currentWindSpeed = data.forecast.forecastday[day].day.maxwind_mph;
        if (tempScale == "temp_c") {
          currentWindSpeed = data.forecast.forecastday[day].day.maxwind_kph;
        }
        currentCloud = data.forecast.forecastday[day].day[`min${tempScale}`];
        currentHumidity = data.forecast.forecastday[day].day.avghumidity;
      }

      //Today's forecast temperatures
      const morningTemperature =
        data.forecast.forecastday[day].hour[7][tempScale]; //@7:00 am
      const afternoonTemperature =
        data.forecast.forecastday[day].hour[13][tempScale]; //@1:00 pm
      const eveningTemperature =
        data.forecast.forecastday[day].hour[18][tempScale]; //@6:00 pm
      const nightTemperature =
        data.forecast.forecastday[day].hour[22][tempScale]; //@10:00 pm

      //Today's forecast image links
      const morningIconLink =
        data.forecast.forecastday[day].hour[7].condition.icon;
      const afternoonIconLink =
        data.forecast.forecastday[day].hour[13].condition.icon;
      const eveningIconLink =
        data.forecast.forecastday[day].hour[18].condition.icon;
      const nightIconLink =
        data.forecast.forecastday[day].hour[22].condition.icon;

      //Future forecast 3 days MAX temperatures (includes current day)
      const todayMaxTemp = data.forecast.forecastday[0].day[`max${tempScale}`];
      const tomorrowMaxTemp =
        data.forecast.forecastday[1].day[`max${tempScale}`];
      const followingTomorrowMaxTemp =
        data.forecast.forecastday[2].day[`max${tempScale}`];

      //Future forecasts 3 days image links (includes current day)
      const todayOverallLink = data.forecast.forecastday[0].day.condition.icon;
      const tomorrowOverallLink =
        data.forecast.forecastday[1].day.condition.icon;
      const followingTomorrowOverallLink =
        data.forecast.forecastday[2].day.condition.icon;

      //Writing to the html by ID for headerTime
      let amPM = " AM"; //Variable for whether its AM or PM
      let hourNumber = 12; //Hour number to be displayed
      const time = localTime.split(" ")[1];
      let hourIndex = Number(time.split(":")[0]);
      if (Number(time.split(":")[0]) >= 12) {
        amPM = " PM";
        if (Number(time.split(":")[0]) == 12) {
          hourNumber = Number(time.split(":")[0]);
          document.getElementById("headingTime").innerText = time + amPM;
        } else {
          hourNumber = Number(time.split(":")[0]) - 12;
          document.getElementById("headingTime").innerText =
            (Number(time.split(":")[0]) - 12).toString() +
            ":" +
            time.split(":")[1] +
            amPM;
        }
      } else {
        amPM = " AM";
        if (Number(time.split(":")[0]) !== 0) {
          hourNumber = Number(time.split(":")[0]);
          document.getElementById("headingTime").innerText = time + amPM;
        } else {
          hourNumber = 0;
          document.getElementById("headingTime").innerText =
            (Number(time.split(":")[0]) + 12).toString() +
            ":" +
            time.split(":")[1] +
            amPM;
        }
      }

      //Checking if there is region name available to use in headingLocation
      if (region.length == 0) {
        document.getElementById("headingTemp").innerText =
          currentTemperatureFahrenheit + "° " + locationName + ", " + country;
        document.getElementById("headingLocation").innerText =
          locationName + ", " + country;
      } else {
        document.getElementById("headingTemp").innerText =
          currentTemperatureFahrenheit +
          "° " +
          locationName +
          ", " +
          region +
          " " +
          country;
        document.getElementById("headingLocation").innerText =
          locationName + ", " + region;
      }

      //Writing to the html by ID for the general weather info
      if (tempScale == "temp_f") {
        document.getElementById(
          "wind"
        ).innerText = `Wind: ${currentWindSpeed} mph`;
      } else {
        document.getElementById(
          "wind"
        ).innerText = `Wind: ${currentWindSpeed} kph`;
      }
      if (day == 0) {
        document.getElementById(
          "temperature"
        ).innerText = `Temperature: ${currentTemperatureFahrenheit} °${tempScale
          .slice(-1)
          .toUpperCase()}`;
        document.getElementById(
          "cloud"
        ).innerText = `Cloud Coverage: ${currentCloud}%`;
      } else {
        document.getElementById(
          "temperature"
        ).innerText = `Max Temperature: ${currentTemperatureFahrenheit} °${tempScale
          .slice(-1)
          .toUpperCase()}`;
        document.getElementById(
          "cloud"
        ).innerText = `Min Temperature: ${currentCloud} °${tempScale
          .slice(-1)
          .toUpperCase()}`;
      }
      document.getElementById(
        "humidity"
      ).innerText = `Humidity: ${currentHumidity}%`;

      //Writing to the html by ID for the temperatures
      document.getElementById("morningTemp").innerText =
        morningTemperature + "°";
      document.getElementById("afternoonTemp").innerText =
        afternoonTemperature + "°";
      document.getElementById("eveningTemp").innerText =
        eveningTemperature + "°";
      document.getElementById("nightTemp").innerText = nightTemperature + "°";

      //Writing to the html by ID for the current condition image
      document.getElementById(
        "currentIcon"
      ).src = `https:${currentConditionLink}`;

      //Writing to the html by ID for the condition images
      document.getElementById("morningIcon").src = `https:${morningIconLink}`;
      document.getElementById(
        "afternoonIcon"
      ).src = `https:${afternoonIconLink}`;
      document.getElementById("eveningIcon").src = `https:${eveningIconLink}`;
      document.getElementById("nightIcon").src = `https:${nightIconLink}`;

      //Writing to the html by ID for the forecasted overall temperatures
      document.getElementById("todayTemp").innerText = todayMaxTemp + "°";
      document.getElementById("tomorrowTemp").innerText = tomorrowMaxTemp + "°";
      document.getElementById("followingTomorrowTemp").innerText =
        followingTomorrowMaxTemp + "°";

      //Writing to the html by ID for the forecasted days images
      document.getElementById("todayIcon").src = `https:${todayOverallLink}`;
      document.getElementById(
        "tomorrowIcon"
      ).src = `https:${tomorrowOverallLink}`;
      document.getElementById(
        "followingTomorrowIcon"
      ).src = `https:${followingTomorrowOverallLink}`;

      //Retrieving 24 hours and icons from API
      const hourlyAPI = data.forecast.forecastday[day].hour;
      const hourlyTempsIcons = [];
      hourlyAPI.forEach((hour) => {
        let tempArray = [];
        tempArray.push(hour[tempScale]);
        tempArray.push(hour.condition.icon);
        hourlyTempsIcons.push(tempArray);
      });

      const timesContainer = document.getElementById("timesContainer");

      //Clear hourly temperatures
      timesContainer.innerHTML = "";

      //Creating hour div elements
      let index = 0;
      if (day > 0) {
        hourIndex = 0;
        hourNumber = 12;
      }
      console.log("hourindex" + hourIndex);
      hourlyTempsIcons.forEach((tempIcon) => {
        if (index >= hourIndex) {
          const hourTemp = tempIcon[0];
          const hourIconLink = tempIcon[1];
          const timeElement = createTimeElement(
            hourNumber + amPM,
            hourIconLink,
            hourTemp
          );
          timesContainer.appendChild(timeElement);
          hourNumber++;
          if (hourNumber > 12) {
            hourNumber = 1;
          }
          if (hourNumber == 12) {
            amPM = " PM";
          }
        }
        index++;
      });

      //Creating dates for daily forecasts
      const tomorrowDate = data.forecast.forecastday[1].date;
      const followingTomorrowDate = data.forecast.forecastday[2].date;
      const tomorrowArray = tomorrowDate.split("-");
      const followingTomorrowArray = followingTomorrowDate.split("-");
      document.getElementById(
        "tomorrowDate"
      ).innerHTML = `${tomorrowArray[1]}/${tomorrowArray[2]}`;
      document.getElementById(
        "followingTomorrowDate"
      ).innerHTML = `${followingTomorrowArray[1]}/${followingTomorrowArray[2]}`;
    })
    .catch((error) => console.error("Error:", error));
  console.log("dataLoader executed for: " + weatherURL);
}

let tempScale = "temp_f";

//Default display
dataLoader(collegePark, 0, tempScale);

//Creating possible suggestions for search-bar
const searchInput = document.getElementById("searchInput");
searchInput.addEventListener("input", updateSuggestions);

//Allowing forecasted Days to be clickable
const forecastedDays = document.querySelectorAll(".days .time");
forecastedDays.forEach((forecastedDay) => {
  forecastedDay.addEventListener("click", function () {
    if (forecastedDay.classList.contains("today")) {
      console.log("today");
      dataLoader(recentURL, 0, tempScale);
    } else if (forecastedDay.classList.contains("tomorrow")) {
      console.log("tomorrow");
      dataLoader(recentURL, 1, tempScale);
    } else {
      console.log("following tomorrow");
      dataLoader(recentURL, 2, tempScale);
    }
  });
});

//Updates page
function updatePage() {
  // Get the user input
  const userInput = document.getElementById("searchInput").value;

  // Clearing suggestionsList
  suggestionsList.innerHTML = "";

  dataLoader(firstForecast + userInput + secondForecast, recentDay, tempScale);
}

//Changes temp scale used to F
function changeToF() {
  tempScale = "temp_f";
  const search = document.getElementById("searchInput").value;
  if (search !== "") {
    updatePage();
  } else {
    dataLoader(collegePark, recentDay, tempScale);
  }

  const optionTextSpan = document.querySelector(".option-text");
  optionTextSpan.textContent = "°F";
}

//Changes temp scale used to C
function changeToC() {
  tempScale = "temp_c";
  const search = document.getElementById("searchInput").value;
  if (search !== "") {
    updatePage();
  } else {
    dataLoader(collegePark, recentDay, tempScale);
  }

  const optionTextSpan = document.querySelector(".option-text");
  optionTextSpan.textContent = "°C";
}

function toggleDropdown() {
  document.getElementById("dropdown-content").classList.toggle("show");
}

//Updates and displays suggestions for locations
async function updateSuggestions() {
  // Cleaning input value
  const inputValue = searchInput.value.trim().toLowerCase();

  // Clearing suggestionsList
  suggestionsList.innerHTML = "";

  if (inputValue.length == 0) {
    return;
  }
  console.log(inputValue);

  // Determining what possible cities it could be
  const possibleCities = await possibleSuggestions(inputValue);
  console.log(possibleCities);

  // Display the search results
  possibleCities.forEach((result) => {
    const resultElement = document.createElement("li");
    resultElement.textContent = result;
    resultElement.classList.add("location");
    resultElement.addEventListener("click", function () {
      dataLoader(
        firstForecast + resultElement.textContent + secondForecast,
        0,
        tempScale
      );
      document.getElementById("searchInput").value = resultElement.textContent;
      suggestionsList.innerHTML = "";
    });
    suggestionsList.appendChild(resultElement);
  });

  // Show/hide suggestions container
  if (possibleCities.length > 0) {
    suggestionsContainer.style.display = "block";
  } else {
    suggestionsContainer.style.display = "none";
  }

  //dataLoader(firstForecast + userInput + secondForecast);
}

//Returns a list of possible suggestions based on user input
async function possibleSuggestions(inputCity) {
  let listCities = [];

  try {
    const res = await fetch(searchAutocomplete + inputCity, {
      method: "GET",
    });

    if (!res.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await res.json();

    data.forEach((location) => {
      const countryName = location.country;
      const regionName = location.region;
      const cityName = location.name;
      if (regionName.length == 0) {
        listCities.push(cityName + ", " + countryName);
      } else {
        listCities.push(cityName + ", " + regionName);
      }
    });

    console.log("LIST CITIES:", listCities);
    return listCities;
  } catch (error) {
    console.error("Error fetching data:", error);
    return listCities; // Return an empty array or handle the error as needed
  }
}

//Creates a div element for hourly temperatures
function createTimeElement(time, iconLink, temperature) {
  const timeElement = document.createElement("div");
  timeElement.className = "time";

  timeElement.innerHTML = `
      <h3>${time}</h3>
      <div class="weather-icon">
        <img src="https:${iconLink}" alt="Weather Icon">
      </div>
      <p>${temperature}°</p>
    `;
  return timeElement;
}

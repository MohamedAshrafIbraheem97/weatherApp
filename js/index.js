'use strict';

const modal = document.querySelector('.modal');

const changeLocationButton = document.querySelector('.change-location-button');

const mainIcon = document.querySelector('.first-view .image img');

const regionNameFirstView = document.querySelector(
  '.first-view .text .heading p'
).lastChild;

const currentTempNoFirstView = document.querySelector(
  '.first-view .text .current-temp'
).firstElementChild;

const currentTempTextFirstView = document.querySelector(
  '.first-view .text .current-temp'
).lastElementChild;

const regionNameSecondFold = document.querySelector(
  '.second-view .current-temp-details .row .temp-location p'
).lastChild;

const currentTempNoSecondFold = document.querySelector(
  '.second-view .current-temp-details .row'
).nextElementSibling.childNodes[3];

const currentTempTextSecondFold = document.querySelector(
  '.second-view .current-temp-details .row'
).nextElementSibling.childNodes[5];

const todayAllTemps = document.querySelector('.first-view .text .all-temps');

const todayAllTemps2 = document.querySelector('.second-view .row  .all-temps');

const tempDays = document.querySelector('.second-view .temp-days');

const addLocationText =
  document.querySelector('.new-location').firstElementChild;

const addLocationButton =
  document.querySelector('.new-location').lastElementChildElementChild;

const loader = document.querySelector('.loader');
// code logic
// Get user location
swal('Please make sure you opened your location in your device, Thank you!');

const getLocation = function () {
  // This is an alert from sweetAlertLibrary it looks good so that i  used it

  if (navigator.geolocation) {
    return new Promise(function (resolve, reject) {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });
  } else {
    swal("Browser doesn't support geolocation!");
    // alert("Browser doesn't support geolocation!");
  }
};

getLocation()
  .then((result) => {
    const key = '39a38170082d49dfb16201520212512';
    let lat = result.coords.latitude;
    let lng = result.coords.longitude;

    callWeatherAPI(key, lat, lng);
  })
  .catch(function (error) {
    console.log(new Error(error));
  });

async function callWeatherAPI(key, latitude, longitude) {
  let response;

  response = await fetch(
    `https://api.weatherapi.com/v1/forecast.json?key=${key}&q=${latitude},${longitude}&days=10&aqi=no&alerts=no
    `
  );
  // to control hiding/showing the loader
  if (response !== undefined) {
    loader.style.display = 'none';
  }

  const jsonData = await response.json();

  regionNameFirstView.textContent = regionNameSecondFold.textContent =
    jsonData.location.name;

  currentTempNoFirstView.textContent = currentTempNoSecondFold.textContent =
    jsonData.current.condition.text;

  currentTempTextFirstView.textContent =
    currentTempTextSecondFold.textContent = `${jsonData.current.temp_c}`;

  mainIcon.src = `images/${checkLargeIcons(
    jsonData.forecast.forecastday[0].hour[6].condition.code
  )}.png`;

  insertHtmlForTodayTemp(jsonData);

  insertHtmlForDynamicDays(jsonData);
}
function insertHtmlForTodayTemp(jsonData) {
  let innerHtml = '';
  for (let index = 0; index < 24; index += 6) {
    innerHtml += `<div class="first-temp">
      <p class="temp-time">${jsonData.forecast.forecastday[0].hour[
        index
      ].time.substr(-5)}</p>
      <div class="temp-and-icon">
        <p class="temp-degree">${
          jsonData.forecast.forecastday[0].hour[index].temp_c
        }&deg; </p>
        <span class="temp-icon"
          > <img src="images/icons/${checkSmallIcons(
            jsonData.forecast.forecastday[0].hour[index].condition.code
          )}.png" alt=""
        /></span>
      </div>
    </div>`;
  }

  // adding inner html to the page
  todayAllTemps.innerHTML = todayAllTemps2.innerHTML = innerHtml;
}
function insertHtmlForDynamicDays(jsonData) {
  let daysInnerHtml = '';
  for (let index = 0; index < 3; index++) {
    daysInnerHtml += `
    <div class="day-temp">
      <div class="day">${getWeekDay(
        new Date(jsonData.forecast.forecastday[index].date)
      )}${index === 0 ? ' - Today' : ''}</div>
      <div class="temp">
        <div class="great-temp">${
          jsonData.forecast.forecastday[index].day.maxtemp_c
        }&deg;</div>
        <div class="low-temp">${
          jsonData.forecast.forecastday[index].day.mintemp_c
        }&deg;</div>
        <div class="temp-icon">
          <img src="images/icons/${checkSmallIcons(
            jsonData.forecast.forecastday[index].day.condition.code
          )}.png" alt="" />
        </div> 
      </div>
    </div>`;
  }

  tempDays.innerHTML = daysInnerHtml;
}
// return the appropiriate small icon
function checkSmallIcons(code) {
  switch (code) {
    case 1000:
      return 'day-haze';
    case 1180 ||
      1183 ||
      1186 ||
      1189 ||
      1192 ||
      1195 ||
      1198 ||
      1201 ||
      1204 ||
      1207 ||
      1240 ||
      1243 ||
      1246 ||
      1249:
      return 'day-rain';
    case 1066 || 1069 || 1114 || 1210 || 1213 || 1216 || 1219 || 1222 || 1237:
      return 'day-snow';
    default:
      return 'day-cloudy';
  }
}
// return the appropiriate large icon
function checkLargeIcons(code) {
  switch (code) {
    case 1000:
      return 'mainSun';
    case 1180 ||
      1183 ||
      1186 ||
      1189 ||
      1192 ||
      1195 ||
      1198 ||
      1201 ||
      1204 ||
      1207 ||
      1240 ||
      1243 ||
      1246 ||
      1249:
      return 'mainRain';
    case 1066 || 1069 || 1114 || 1210 || 1213 || 1216 || 1219 || 1222 || 1237:
      return 'mainSnow';
    default:
      return 'mainSun';
  }
}
// return week day of the specified date
function getWeekDay(date) {
  let weekday = new Array('Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat');
  return weekday[date.getDay()];
}

// Event listeners
// to show the modal when we click on the change location button
changeLocationButton.addEventListener('click', function (e) {
  e.preventDefault();
  modal.style.display = 'block';
});
changeLocationButton.disabled = true;
// to close modal when we click any where outside the modal
document.addEventListener('click', function (e) {
  if (e.target.className === 'modal') modal.style.display = 'none';
});

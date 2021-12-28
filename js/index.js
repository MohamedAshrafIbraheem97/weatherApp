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
console.log(currentTempTextSecondFold);

const todayAllTemps = document.querySelector('.first-view .text .all-temps');

const todayAllTemps2 = document.querySelector('.second-view .row  .all-temps');

// code logic
// Get user location
const getLocation = function () {
  if (navigator.geolocation) {
    return new Promise(function (resolve, reject) {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });
  } else {
    alert("Browser doesn't support geolocation!");
  }
};

let promise = new Promise(function (resolve, reject) {
  setTimeout(() => resolve('done!'), 1000);
});

// resolve runs the first function in .then
// promise.then(
//   (result) => alert(result), // shows "done!" after 1 second
//   (error) => alert(error) // doesn't run
// );

getLocation()
  .then((result) => {
    const key = '39a38170082d49dfb16201520212512';
    let lat = result.coords.latitude;
    let lng = result.coords.longitude;

    callWeatherAPI(key, lat, lng);
  })
  .catch(function (error) {
    console.log(error);
  });

async function callWeatherAPI(key, latitude, longitude) {
  // const { lat, lng } = await retreivePosition();
  const response = await fetch(
    `http://api.weatherapi.com/v1/forecast.json?key=${key}&q=${latitude},${longitude}&days=10&aqi=no&alerts=no
    `
  );

  const jsonData = await response.json();

  console.log(jsonData);
  console.log(jsonData.forecast.forecastday[0].hour[2].time.substr(-5));
  console.log();

  regionNameFirstView.textContent = regionNameSecondFold.textContent =
    jsonData.location.region;

  currentTempNoFirstView.textContent = currentTempNoSecondFold.textContent =
    jsonData.current.condition.text;

  currentTempTextFirstView.textContent =
    currentTempTextSecondFold.textContent = `${jsonData.current.temp_c}`;

  mainIcon.src = `images/${checkLargeIcons(
    jsonData.forecast.forecastday[0].hour[6].condition.code
  )}.png`;

  todayAllTemps.innerHTML = todayAllTemps2.innerHTML = `
  <div class="first-temp">
    <p class="temp-time">${jsonData.forecast.forecastday[0].hour[6].time.substr(
      -5
    )}</p>
    <div class="temp-and-icon">
      <p class="temp-degree">${
        jsonData.forecast.forecastday[0].hour[6].temp_c
      }&deg; </p>
      <span class="temp-icon"
        > <img src="images/icons/${checkSmallIcons(
          jsonData.forecast.forecastday[0].hour[6].condition.code
        )}.png" alt=""
      /></span>
    </div>
  </div>
  <div class="second-temp">
  
  <p class="temp-time">${jsonData.forecast.forecastday[0].hour[12].time.substr(
    -5
  )}</p>
  <div class="temp-and-icon">
    <p class="temp-degree">${
      jsonData.forecast.forecastday[0].hour[12].temp_c
    }&deg; </p>
    <span class="temp-icon"
      > <img src="images/icons/${checkSmallIcons(
        jsonData.forecast.forecastday[0].hour[12].condition.code
      )}.png" alt=""
    /></span>
  </div>
  </div>
  <div class="third-temp">
  <p class="temp-time">${jsonData.forecast.forecastday[0].hour[18].time.substr(
    -5
  )}</p>
  <div class="temp-and-icon">
    <p class="temp-degree">${
      jsonData.forecast.forecastday[0].hour[18].temp_c
    }&deg; </p>
    <span class="temp-icon"
      > <img src="images/icons/${checkSmallIcons(
        jsonData.forecast.forecastday[0].hour[18].condition.code
      )}.png" alt=""
    /></span>
  </div>

  </div>
  <div class="fourth-temp">
  <p class="temp-time">${jsonData.forecast.forecastday[0].hour[23].time.substr(
    -5
  )}</p>
  <div class="temp-and-icon">
    <p class="temp-degree">${
      jsonData.forecast.forecastday[0].hour[23].temp_c
    }&deg; </p>
    <span class="temp-icon"
      > <img src="images/icons/${checkSmallIcons(
        jsonData.forecast.forecastday[0].hour[23].condition.code
      )}.png" alt=""
    /></span>
  </div>
  </div>

`;
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

// Event listeners
// to show the modal when we click on the change location button
changeLocationButton.addEventListener('click', function (e) {
  e.preventDefault();
  modal.style.display = 'block';
});
// to close modal when we click any where outside the modal
document.addEventListener('click', function (e) {
  if (e.target.className === 'modal') modal.style.display = 'none';
});

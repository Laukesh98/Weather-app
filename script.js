let your_Weather = document.querySelector(".your_Weather");
let search_weather = document.querySelector(".search_weather");
let loading_screen = document.querySelector("[data-loading_screen]");
let grant_access_btn = document.getElementById("grant_access_btn");
let grant_aceess_screen = document.querySelector("[data-grant_access_screen]");
let Weather_showing_screen = document.querySelector("[data-Weather_showing_screen]");
let search_Weather_screen = document.querySelector("[data-search_Weather_screen]");
let search_button = document.getElementById("icon_bg");
let search_input = document.getElementById("search_input");
let sub_search = document.getElementsByClassName("sub_search");
let not_found_screen = document.querySelector('[data-404_screen]')
let current_tab = your_Weather;
const API_KEY = "d1845658f92b31c64bd94f06f7188c9c";

getfromSessionStorage();

function switching_tab(a) {
  console.log(a);
  if (current_tab == a) {
    return;
  } else {
    current_tab.classList.remove("current_tab_bg");
    current_tab = a;
    current_tab.classList.add("current_tab_bg");
  }
}
your_Weather.addEventListener("click", () => {
  switching_tab(your_Weather);
  getfromSessionStorage();
});
search_weather.addEventListener("click", () => {
  switching_tab(search_weather);
  Weather_showing_screen.classList.add("not_active");
  search_Weather_screen.classList.remove("not_active");
  grant_aceess_screen.classList.add('not_active')
  loading_screen.classList.add('not_active')
  search_input.value = ''
  search_input.focus();
});

// Checking if lat and lon are saved in local storage
function getfromSessionStorage() {
  search_Weather_screen.classList.add("not_active");
  not_found_screen.classList.add('not_active')
  let localCoordinates = sessionStorage.getItem("user_coordinates");
  if (!localCoordinates) {
    grant_aceess_screen.classList.remove("not_active");
  } else {
    // Fetch data and render
    loading_screen.classList.remove("not_active");
    localCoordinates = JSON.parse(localCoordinates);
    fetchUserWeatherInfo(localCoordinates);
  }
}

grant_access_btn.addEventListener("click", getLocation);

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    console.log('Your device does not support geo location ')
  }
}

// Saving location data on local storage
function showPosition(position) {
  const user_coordinates = {
    lat: position.coords.latitude,
    lon: position.coords.longitude,
  };
  sessionStorage.setItem("user_coordinates", JSON.stringify(user_coordinates));

  fetchUserWeatherInfo(user_coordinates);
}

async function fetchUserWeatherInfo(coordinates) {
  const { lat, lon } = coordinates;
  // this is equvalent to
  // lat = coordinates.lat
  // lon = coordinates.lon

  // Hiding grant access screen
  grant_aceess_screen.classList.add("not_active");
  // activating loading screen
  loading_screen.classList.remove("not_active");
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    );
    const data = await response.json();

    loading_screen.classList.add("not_active");
    Weather_showing_screen.classList.remove("not_active");

    renderWeather(data);
  } catch (e) {
    console.log('Failed to fetch data ')
  }
}

async function renderWeather(weather_info) {
  // Rendering weather
  let city_name = document.querySelector("[data-city_name]");
  let weather_des_icon = document.querySelector("[data-weather_des_icon]");
  let flag = document.querySelector("[data-country_flag]");
  let weatherDes = document.querySelector("[data-clear_sky]");

  let temp = document.querySelector("[data-temp]");

  let windspeed = document.querySelector("[data-windspeed]");
  let humidity = document.querySelector("[data-humidity]");
  let clouds = document.querySelector("[data-clouds]");
  city_name.textContent = weather_info?.name;
  weather_des_icon.src = `http://openweathermap.org/img/w/${weather_info?.weather?.[0]?.icon}.png`;
  flag.src = `https://flagcdn.com/144x108/${weather_info?.sys?.country.toLowerCase()}.png`;

  weatherDes.textContent = weather_info?.weather[0]?.description;
  weatherDes.style.cssText = "text-transform : capitalize";

  temp.textContent = `${weather_info?.main?.temp}°C`;
  windspeed.textContent = `${weather_info?.wind?.speed} m/s`;
  humidity.textContent = `${weather_info?.main?.humidity} %`;
  clouds.textContent = `${weather_info?.clouds?.all} %`;
}


    // Search button 
search_button.addEventListener("click", (e) => {
    e.preventDefault();
   
  let city = search_input.value;
  
  if ((city == "")) {
    return;
  } else {
    searching(city);
  }
});

async function searching(input_city) {
  // Hiding search weather screen and grant access screen
  search_Weather_screen.classList.add("not_active");
  grant_aceess_screen.classList.add("not_active");

  // showing loading screen
  loading_screen.classList.remove("not_active");

  try {
    
    const search_fetch = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${input_city}&appid=${API_KEY}&units=metric`
    );
    if(search_fetch.status === 404){
        throw new Error('City could not be found')
    }
    const response = await search_fetch.json();

    loading_screen.classList.add("not_active");
    search_Weather_screen.classList.add("not_active");
    Weather_showing_screen.classList.remove("not_active");
    renderWeather(response);
  } catch (e) {
    loading_screen.classList.add('not_active')
    not_found_screen.classList.remove('not_active')
    console.log(e)
  }
}

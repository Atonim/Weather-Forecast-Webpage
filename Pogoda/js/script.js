let city = `London`;

//main info

const time_zone_el = document.querySelector(".time_zone");
const clock_el = document.querySelector(".clock");
const am_pm_el = document.querySelector(".am_pm");
const date_el = document.querySelector(".date");
const value_el = document.querySelectorAll(".value");
const w_icon_el = document.querySelectorAll(".w_icon");
const temp_el = document.querySelectorAll(".temp");
const grid_item_el = document.querySelectorAll(".grid_item");
const grid_day_el = document.querySelectorAll(".day");

//card

const card_date_el = document.querySelector(".card_date");
const card_w_icon_el = document.querySelector(".card_w_icon");
const card_w_desc_el = document.querySelector(".card_w_desc");
const card_humidity_el = document.querySelector(".card_humidity");
const card_pressure_el = document.querySelector(".card_pressure");
const card_temp_value_el = document.querySelectorAll(".card_temp_value");
const card_wind_value_el = document.querySelectorAll(".card_wind_value");

const input = document.querySelector(".search_input");
input.addEventListener('change', () => {
  city = input.value;
  city_coord_API();
});

const day_arr = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const month_arr = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const fadeIn = (el) => {
  let opacity = 0.01;

  var timer = setInterval(function () {
    el.style.display = "flex";
    if (opacity >= 1) {
      clearInterval(timer);
    }
    el.style.opacity = opacity;
    opacity += opacity * 0.1;
  }, 20);
};

const fadeOut = (el) => {
  let opacity = 1;
  var timer = setInterval(function () {
    if (opacity <= 0.1) {
      clearInterval(timer);
      el.style.display = "none";
    }
    el.style.opacity = opacity;
    opacity -= opacity * 0.1;
  }, 20);

};

const block = document.querySelector('.popup');
const open_btn = document.querySelector('.aside_more');
const close_btn = document.querySelector('.card_close_button');

let flag = false;

open_btn.addEventListener('click', (e) => {
  fadeIn(block);
  flag = true;
});

close_btn.addEventListener('click', (e) => {
  fadeOut(block);
  flag = false;
});



async function city_coord_API() {
  try {
    let city_url = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=a983a68979188b1b09ccf33228a97f93`;
    let response = await fetch(city_url);
    let city_coord = await response.json();
    let lat = city_coord[0].lat;
    let lon = city_coord[0].lon;
    let url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=hourly&appid=a983a68979188b1b09ccf33228a97f93`;
    input.value = "";
    take_weather_API(url);
  }
  catch (err) {
    input.value = "Unknown city";
  }
}

async function take_weather_API(url) {
  let response = await fetch(url);
  let weather_API = await response.json();
  start_work(weather_API);
}

function time_zone_change(weather) {
  time_zone_el.innerHTML = weather.timezone;
}

function current_time(weather, forecast) {
  let time = new Date();
  let day = time.getDay();
  let date = time.getDate();
  let month = time.getMonth();
  let setID;
  setID = setInterval(() => {
    time = new Date();
    day = time.getDay();
    date = time.getDate();
    month = time.getMonth();
    let hour = time.getHours() < 10 ? "0" + time.getHours() : time.getHours();
    let min = time.getMinutes() < 10 ? "0" + time.getMinutes() : time.getMinutes();
    hour = hour > 12 ? hour - 12 : hour;
    let ampm = hour >= 12 ? " PM" : " AM";
    clock_el.innerHTML = `${hour}:${min}`;
    am_pm_el.innerHTML = `${ampm}`;
    date_el.innerHTML = `${day_arr[day]}, ${date}, ${month_arr[month]}`;
    card_date_el.innerHTML = `${day_arr[day]}, ${date}, ${month_arr[month]}`;
  }, 1000);
  if (forecast !== undefined && forecast !== day) {
    for (let i = 0; i < setID; i++) clearInterval(setID - i);
    clock_el.innerHTML = "Forecast not for today";
    am_pm_el.innerHTML = "";
    date_el.innerHTML = `${day_arr[forecast]}, ${date - (day - ((forecast !== 0) ? forecast : 7))}, ${month_arr[month]}`;
    card_date_el.innerHTML = `${day_arr[forecast]}, ${date - (day - ((forecast !== 0) ? forecast : 7))}, ${month_arr[month]}`;
    card_w_icon_el.src = `http://openweathermap.org/img/wn/${weather.daily[forecast].weather[0].icon}@2x.png`;
    card_w_desc_el.innerHTML = weather.daily[forecast].weather[0].description;
  }
  else {
    card_w_icon_el.src = `http://openweathermap.org/img/wn/${weather.daily[day].weather[0].icon}@2x.png`;
    card_w_desc_el.innerHTML = weather.daily[day].weather[0].description;
  }
  if (forecast !== undefined && forecast !== day) value_change(forecast, weather)
  else value_change(day, weather);
}

function temp(day_number, weather) {
  let temp_day_celsius = weather.daily[day_number].temp.day - 273.15;
  let temp_night_celsius = weather.daily[day_number].temp.night - 273.15;
  let day_night = [];
  temp_day_celsius = Math.round(temp_day_celsius * 10) / 10;
  temp_night_celsius = Math.round(temp_night_celsius * 10) / 10;
  day_night[0] = temp_day_celsius;
  day_night[1] = temp_night_celsius;
  return day_night;
}

function card_info(day_number, weather) {
  let c_temp_morn_celsius = weather.daily[day_number].temp.morn - 273.15;
  let c_temp_day_celsius = weather.daily[day_number].temp.day - 273.15;
  let c_temp_eve_celsius = weather.daily[day_number].temp.eve - 273.15;
  let c_temp_night_celsius = weather.daily[day_number].temp.night - 273.15;
  let c_temp_max_celsius = weather.daily[day_number].temp.max - 273.15;
  let c_temp_min_celsius = weather.daily[day_number].temp.min - 273.15;

  let c_wind_speed = weather.daily[day_number].wind_speed;
  let c_wind_gust = weather.daily[day_number].wind_gust;
  let c_wind_deg = weather.daily[day_number].wind_deg;

  let card_info_arr = [];

  card_info_arr[0] = `Morning:<br>${Math.round(c_temp_morn_celsius * 10) / 10}&#176C`;
  card_info_arr[1] = `Day:<br>${Math.round(c_temp_day_celsius * 10) / 10}&#176C`;
  card_info_arr[2] = `Evening:<br>${Math.round(c_temp_eve_celsius * 10) / 10}&#176C`;
  card_info_arr[3] = `Night:<br>${Math.round(c_temp_night_celsius * 10) / 10}&#176C`;
  card_info_arr[4] = `MAX:<br>${Math.round(c_temp_max_celsius * 10) / 10}&#176C`;
  card_info_arr[5] = `MIN:<br>${Math.round(c_temp_min_celsius * 10) / 10}&#176C`;
  card_info_arr[6] = `Wind speed: ${c_wind_speed}`;
  card_info_arr[7] = `Wind gust: ${c_wind_gust}`;
  card_info_arr[8] = `Wind degrees: ${c_wind_deg}`;

  return card_info_arr;
}

function weather_temp(weather) {
  let day_count = 2;
  temp_el.forEach((el) => {
    if (day_count > 13) {
      day_count = 0;
    }
    let day_temp = temp(Math.floor(day_count / 2), weather)[0];
    let night_temp = temp(Math.floor(day_count / 2), weather)[1];
    if (day_count % 2 === 0) el.innerHTML = `Day: ${day_temp}&#176C`;
    else el.innerHTML = `Night: ${night_temp}&#176C`;
    day_count++;
  })
  day_count = 1;
  w_icon_el.forEach((el) => {
    el.src = `http://openweathermap.org/img/wn/${weather.daily[(day_count !== 7 ? day_count++ : 0)].weather[0].icon}@2x.png`;
  });
}

function value_change(day_number, weather) {
  value_el[0].innerHTML = `${weather.daily[day_number].humidity}%`;
  value_el[1].innerHTML = weather.daily[day_number].pressure;
  value_el[2].innerHTML = weather.daily[day_number].wind_speed;

  card_humidity_el.innerHTML = `HUMIDITY: ${weather.daily[day_number].humidity}%`;
  card_pressure_el.innerHTML = `PRESSURE: ${weather.daily[day_number].pressure}`;
  let counter = 0;
  card_temp_value_el.forEach((el) => {
    el.innerHTML = card_info(day_number, weather)[counter++];
  });
  card_wind_value_el.forEach((el) => {
    el.innerHTML = card_info(day_number, weather)[counter++];
  });
}

function click_on_forecast(weather) {
  grid_item_el.forEach((item, num) => {
    item.onclick = () => {
      for (let i = 0; i < grid_item_el.length; i++) {
        grid_item_el[i].style.border = "4px solid #6F2232";
        grid_day_el[i + 1].style.color = "#6F2232";
      }
      item.style.border = "4px solid #C3073F";
      grid_day_el[num + 1].style.color = "#C3073F";
      take_weather_forecast(num, weather);
    }
  });
}

function take_weather_forecast(date_num, weather) {
  if (date_num === 6) date_num = -1;
  current_time(weather, date_num + 1)
}

function light_current() {
  let time = new Date();
  let day = time.getDay();
  grid_day_el[(day === 0 ? 6 : day)].style.color = "#C3073F";
  grid_item_el[(day === 0 ? 6 : day - 1)].style.border = "4px solid #C3073F";
  console.log(day);
}

function start_work(weather_obj) {
  console.log(weather_obj);
  light_current();
  click_on_forecast(weather_obj);
  time_zone_change(weather_obj);
  current_time(weather_obj);
  weather_temp(weather_obj);
}

window.onload = function () {
  const card_container = document.querySelector(".popup");
  const card = document.querySelector(".card");

  card_container.addEventListener('mouseleave', function () {
    card.style.transform = `rotateX(0deg) rotateY(0deg)`;
    card.style.transition = `all 1s`;
  })

  card_container.addEventListener('mouseenter', function () {
    card.style.transition = `none`;
  })

  card_container.addEventListener('mousemove', function (event) {
    const pos = {
      x: getDegrees(getPercentage(event.clientX, window.innerWidth)),
      y: getDegrees(getPercentage(event.clientY, window.innerHeight))
    };

    card.style.transform = `rotateX(${-pos.y}deg) rotateY(${pos.x}deg)`;

  });
}

function getPercentage(num, total) {
  return num * 100 / total;
}

function getDegrees(percentage, max = 30) { //160
  return max * percentage / 100 - max / 2;
}

city_coord_API();
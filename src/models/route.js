import HomePage from "./home";
import Favorites from "./favorites";

import { Route, Routes } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

function RouteComp() {
  const [props, setProps] = useState({ key: [], name: [] });

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <HomePage favorites={props} callback={(data) => setProps(data)} />
          }
        />
        <Route path="favorites" element={<Favorites favorites={props} />} />
      </Routes>
    </>
  );
}

export const FtoC = (
  f // Fahrenheit to Celsius
) => {
  let c = (f - 32.0) / 1.8;

  return c.toFixed(1);
};

export const day = (
  date // get day
) => {
  let arr = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  date = new Date(date);
  date = date.getDay();

  return arr[date];
};

export const getData = async (
  obj,
  method // get data from api
) => {
  const key = "J8AAnJzd7k9ngwrFdKGcT4hOQ8RIPheK"; // api key

  if (method == 1) {
    let resp = await axios.get(
      `https://dataservice.accuweather.com/currentconditions/v1/${obj}?apikey=${key}`
    );
    return resp.data[0]; //get now city weather
  }

  if (method == 2) {
    let resp = await axios.get(
      `https://dataservice.accuweather.com/forecasts/v1/daily/5day/${obj}?apikey=${key}`
    );
    return resp.data.DailyForecasts; //get 5-days city weather
  }

  if (method == 3) {
    let resp = await axios.get(
      `https://dataservice.accuweather.com/locations/v1/cities/autocomplete?apikey=${key}&q=${obj}`
    );
    return resp.data; //get search
  }

  if (method == 4) {
    let resp = await axios.get(
      `https://dataservice.accuweather.com/locations/v1/cities/geoposition/search?apikey=${key}&q=${obj[0]}%2C${obj[1]}`
    );
    return [resp.data.LocalizedName, resp.data.Key]; //get this location
  }
};

export default RouteComp;

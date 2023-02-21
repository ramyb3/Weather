import HomePage from "./home";
import Favorites from "./favorites";
import { Route, Routes } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

export default function RouteComp() {
  const [props, setProps] = useState({ key: [], name: [] });

  return (
    <Routes>
      <Route
        path="/"
        element={
          <HomePage favorites={props} callback={(data) => setProps(data)} />
        }
      />
      <Route path="favorites" element={<Favorites favorites={props} />} />
    </Routes>
  );
}

// get data from api
export const getData = async (obj, method) => {
  const key = process.env.REACT_APP_API_KEY; // api key
  const url = "https://dataservice.accuweather.com";

  if (method === 1) {
    const resp = await axios.get(
      `${url}/currentconditions/v1/${obj}?apikey=${key}`
    );

    return resp.data[0]; //get current city weather
  }
  if (method === 2) {
    const resp = await axios.get(
      `${url}/forecasts/v1/daily/5day/${obj}?apikey=${key}`
    );

    return resp.data.DailyForecasts; //get 5-days city weather
  }
  if (method === 3) {
    const resp = await axios.get(
      `${url}/locations/v1/cities/autocomplete?apikey=${key}&q=${obj}`
    );

    return resp.data; //get search
  }
  if (method === 4) {
    const resp = await axios.get(
      `${url}/locations/v1/cities/geoposition/search?apikey=${key}&q=${obj[0]}%2C${obj[1]}`
    );

    return [resp.data.LocalizedName, resp.data.Key]; //get this location
  }
};

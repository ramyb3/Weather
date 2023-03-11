import HomePage from "./home";
import Favorites from "./favorites";
import { Route, Routes } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";

export default function RouteComp() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="favorites" element={<Favorites />} />
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

export const useSaveDispatch = () => {
  const dispatch = useDispatch();

  const saveDispatch = (type, payload) => {
    dispatch({ type, payload });
  };

  return { saveDispatch };
};

import { getData, useSaveDispatch } from "./route";
import { colorPageButton } from "../App";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Favorites() {
  const storeData = useSelector((state) => state);
  const { saveDispatch } = useSaveDispatch();
  const navigate = useNavigate();
  const [weather, setWeather] = useState([]); //default - no favorites

  //when favorites page start
  useEffect(() => {
    const getFavorites = async () => {
      const arr = [];

      for (let i = 0; i < storeData.favorites.key.length; i++) {
        const obj = await getData(storeData.favorites.key[i], 1);
        arr.push(obj);
      }

      setWeather(arr);
    };

    getFavorites();
  }, []);

  //show clicked favorite in home page
  const display = async (index) => {
    try {
      const days = await getData(storeData.favorites.key[index], 2);
      saveDispatch("LOAD", {
        today: weather[index],
        days,
        data: [storeData.favorites.name[index], storeData.favorites.key[index]],
      });

      // home button page will be colored
      document.getElementById("fav").style = "";
      document.getElementById("home").style.backgroundColor =
        colorPageButton[0];
      document.getElementById("home").style.color = colorPageButton[1];

      navigate("/");
    } catch (e) {
      alert("An error has occurred in favorites! - check developer tools");
      console.log(e);
    }
  };

  // if all favorites didn't finished to load all data
  if (weather.length === 0) {
    return null;
  }

  return (
    <div className="container">
      {storeData.favorites.key.map((fav, index) => {
        return (
          <div key={index} className="favorites" onClick={() => display(index)}>
            <span>{storeData.favorites.name[index]}</span>
            <Temperature data={weather[index]} condition={storeData.temp} />
            <span>{weather[index].WeatherText}</span>
          </div>
        );
      })}
    </div>
  );
}

//temp in C/F
export function Temperature(props) {
  const FtoC = (f) => {
    const c = (f - 32.0) / 1.8;

    return c.toFixed(1);
  };

  return (
    <>
      {typeof props.data === "object"
        ? props.data.Temperature[props.condition ? "Imperial" : "Metric"].Value
        : props.condition
        ? props.data
        : FtoC(props.data)}{" "}
      &#778; {props.condition ? "F" : "C"}
    </>
  );
}

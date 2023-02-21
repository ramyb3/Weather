import { getData } from "./route";
import { colorPageButton } from "../App";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Favorites(props) {
  const storeData = useSelector((state) => state);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [weather, setWeather] = useState([]); //default - no favorites

  //when favorites page start
  useEffect(() => {
    const getFavorites = async () => {
      const arr = [];
      let obj;

      for (let i = 0; i < props.favorites.key.length; i++) {
        obj = await getData(props.favorites.key[i], 1);
        arr.push(obj);
      }

      setWeather(arr);
    };

    getFavorites();
  }, []);

  //show clicked favorite in home page
  const display = async (index) => {
    try {
      const days = await getData(props.favorites.key[index], 2);

      dispatch({
        type: "LOAD",
        payload: [
          weather[index],
          days,
          [props.favorites.name[index], props.favorites.key[index]],
        ],
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

  return (
    <div className="container">
      {props.favorites.key.map((key, index) => {
        return (
          <div key={index} className="favorites" onClick={() => display(index)}>
            {/*location name*/}
            <span>{props.favorites.name[index]}</span>

            {weather.length !== 0 ? ( // if all favorites finished to load all data
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                }}
              >
                <span>
                  <Temperature data={weather[index]} condition={storeData[1]} />
                </span>
                {/*current weather*/}
                <span>{weather[index].WeatherText}</span>
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

//temp in C/F
export function Temperature(props) {
  // Fahrenheit to Celsius
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

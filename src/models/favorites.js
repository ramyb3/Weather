import { getData } from "./route";

import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function Favorites(props) {
  const storeData = useSelector((state) => state);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [weather, setWeather] = useState([]); //default - no favorites

  useEffect(async () => {
    let obj = [],
      temp;

    for (var i = 0; i < props.favorites.key.length; i++) {
      temp = await getData(props.favorites.key[i], 1);
      obj.push(temp);
    }

    setWeather(obj);
  }, []); //when favorites page start

  const display = async (
    x //show clicked favorite in home page
  ) => {
    try {
      let days = await getData(props.favorites.key[x], 2);

      dispatch({
        type: "LOAD",
        payload: [
          weather[x],
          days,
          [props.favorites.name[x], props.favorites.key[x]],
        ],
      });

      // home button page will be colored
      document.getElementById("fav").style = "";
      document.getElementById("home").style.backgroundColor =
        "rgb(123, 185, 171)";
      document.getElementById("home").style.color = "white";

      navigate("/");
    } catch (e) {
      alert("An error has occurred in favorites! - check developer tools");
      console.log(e);
    }
  };

  return (
    <>
      <br />

      <div className="container" style={{ flexWrap: "wrap" }}>
        {props.favorites.key.map((x, index) => {
          return (
            <div
              key={index}
              className="favorites"
              onClick={() => display(index)}
            >
              {props.favorites.name[index]}
              <br /> {/*location name*/}
              {weather.length != 0 ? ( // if all favorites finished to load all data
                <>
                  {storeData[1] == true ? ( // temp in C/F
                    <>{weather[index].Temperature.Imperial.Value} &#778; F</>
                  ) : (
                    <>{weather[index].Temperature.Metric.Value} &#778; C</>
                  )}
                  <br />
                  <br />
                  {weather[index].WeatherText} {/*current weather*/}
                </>
              ) : null}
            </div>
          );
        })}
      </div>
    </>
  );
}

export default Favorites;

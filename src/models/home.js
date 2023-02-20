import { FtoC, day } from "./route";
import Search from "./search";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";

function Home(props) {
  const storeData = useSelector((state) => state);

  const fav = (
    e // favorites func
  ) => {
    if (!props.favorites.key.includes(storeData[0][2][1])) {
      props.callback({
        key: [...props.favorites.key, storeData[0][2][1]],
        name: [...props.favorites.name, storeData[0][2][0]],
      });

      e.style.color = "red";
    } else {
      let index = props.favorites.key.indexOf(storeData[0][2][1]);

      props.callback({
        key: props.favorites.key.filter((x) => x != storeData[0][2][1]),
        name: props.favorites.name.filter((x, i) => i != index),
      });

      e.style.color = "white";
    }
  };

  return (
    <>
      <br />

      <Search />

      {storeData.length != 0 ? ( // if the store finished to load all data
        <div className="box">
          {storeData[0][0].WeatherIcon > 9 ? ( // weather icon
            <img
              src={`https://developer.accuweather.com/sites/default/files/${storeData[0][0].WeatherIcon}-s.png`}
            />
          ) : (
            <img
              src={`https://developer.accuweather.com/sites/default/files/0${storeData[0][0].WeatherIcon}-s.png`}
            />
          )}
          <div className="all">{storeData[0][2][0]}</div> {/*city's name */}
          {storeData[1] == true ? ( // temp in C/F
            <div className="all">
              {storeData[0][0].Temperature.Imperial.Value} &#778; F
            </div>
          ) : (
            <div className="all">
              {storeData[0][0].Temperature.Metric.Value} &#778; C
            </div>
          )}
          {props.favorites.key.includes(storeData[0][2][1]) ? ( // this city favorite or no
            <FontAwesomeIcon
              style={{ color: "red" }}
              icon={faHeart}
              onClick={(e) => fav(e.target)}
              className="heart"
            />
          ) : (
            <FontAwesomeIcon
              icon={faHeart}
              onClick={(e) => fav(e.target)}
              className="heart"
            />
          )}
          <div className="weather">{storeData[0][0].WeatherText}</div>{" "}
          {/*current weather*/}
          <div className="container" style={{ flexWrap: "wrap" }}>
            {storeData[0][1].map(
              (
                x,
                index //5 days weather forecast
              ) => {
                return (
                  <div key={index} className="forecast">
                    <div>{day(x.Date)}</div>
                    <br />

                    {index != 0 ? ( // if today- show night, if not - show day
                      <>
                        {x.Day.Icon > 9 ? ( // weather icon in day
                          <img
                            src={`https://developer.accuweather.com/sites/default/files/${x.Day.Icon}-s.png`}
                          />
                        ) : (
                          <img
                            src={`https://developer.accuweather.com/sites/default/files/0${x.Day.Icon}-s.png`}
                          />
                        )}
                      </>
                    ) : (
                      <>
                        {x.Night.Icon > 9 ? ( // weather icon in night
                          <img
                            src={`https://developer.accuweather.com/sites/default/files/${x.Night.Icon}-s.png`}
                          />
                        ) : (
                          <img
                            src={`https://developer.accuweather.com/sites/default/files/0${x.Night.Icon}-s.png`}
                          />
                        )}
                      </>
                    )}
                    <br />

                    {storeData[1] == true ? ( // temp in C/F
                      <div>{x.Temperature.Maximum.Value} &#778; F</div>
                    ) : (
                      <div>{FtoC(x.Temperature.Maximum.Value)} &#778; C</div>
                    )}
                  </div>
                );
              }
            )}
          </div>
        </div>
      ) : null}
    </>
  );
}

export default Home;

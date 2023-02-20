import { FtoC, day } from "./route";
import Search from "./search";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";

export default function Home(props) {
  const storeData = useSelector((state) => state);

  // favorites func
  const fav = (e) => {
    if (!props.favorites.key.includes(storeData[0][2][1])) {
      props.callback({
        key: [...props.favorites.key, storeData[0][2][1]],
        name: [...props.favorites.name, storeData[0][2][0]],
      });

      e.style.color = "red";
    } else {
      const index = props.favorites.key.indexOf(storeData[0][2][1]);

      props.callback({
        key: props.favorites.key.filter((key) => key !== storeData[0][2][1]),
        name: props.favorites.name.filter((name, i) => i !== index),
      });

      e.style.color = "white";
    }
  };

  return (
    <>
      <Search />

      {storeData.length !== 0 ? ( // if the store finished to load all data
        <div className="box" style={{ marginTop: "10px" }}>
          {storeData[0][0].WeatherIcon > 9 ? ( // weather icon
            <img
              alt=""
              src={`https://developer.accuweather.com/sites/default/files/${storeData[0][0].WeatherIcon}-s.png`}
            />
          ) : (
            <img
              alt=""
              src={`https://developer.accuweather.com/sites/default/files/0${storeData[0][0].WeatherIcon}-s.png`}
            />
          )}
          <div className="all">{storeData[0][2][0]}</div> {/*city's name */}
          {storeData[1] ? ( // temp in C/F
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
          {/*current weather*/}
          <div className="weather">{storeData[0][0].WeatherText}</div>
          <div className="container" style={{ flexWrap: "wrap" }}>
            {storeData[0][1].map((data, index) => {
              //5 days weather forecast
              return (
                <div key={index} className="forecast">
                  <div>{day(data.Date)}</div>
                  <br />

                  {index !== 0 ? ( // if today- show night, if not - show day
                    <>
                      {data.Day.Icon > 9 ? ( // weather icon in day
                        <img
                          alt=""
                          src={`https://developer.accuweather.com/sites/default/files/${data.Day.Icon}-s.png`}
                        />
                      ) : (
                        <img
                          alt=""
                          src={`https://developer.accuweather.com/sites/default/files/0${data.Day.Icon}-s.png`}
                        />
                      )}
                    </>
                  ) : (
                    <>
                      {data.Night.Icon > 9 ? ( // weather icon in night
                        <img
                          alt=""
                          src={`https://developer.accuweather.com/sites/default/files/${data.Night.Icon}-s.png`}
                        />
                      ) : (
                        <img
                          alt=""
                          src={`https://developer.accuweather.com/sites/default/files/0${data.Night.Icon}-s.png`}
                        />
                      )}
                    </>
                  )}
                  <br />

                  {storeData[1] ? ( // temp in C/F
                    <div>{data.Temperature.Maximum.Value} &#778; F</div>
                  ) : (
                    <div>{FtoC(data.Temperature.Maximum.Value)} &#778; C</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ) : null}
    </>
  );
}

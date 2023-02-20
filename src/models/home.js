import Search from "./search";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";
import { Temperature } from "./favorites";

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

  // get day
  const day = (date) => {
    const days = [
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

    return days[date];
  };

  return (
    <>
      <Search />

      {storeData.length !== 0 ? ( // if the store finished to load all data
        <div className="box" style={{ marginTop: "10px" }}>
          <Image data={storeData[0][0].WeatherIcon} />
          <div className="all">{storeData[0][2][0]}</div> {/*city's name */}
          <div className="all">
            <Temperature data={storeData[0][0]} condition={storeData[1]} />
          </div>
          <FontAwesomeIcon // this city favorite or no
            style={
              props.favorites.key.includes(storeData[0][2][1])
                ? { color: "red" }
                : {}
            }
            icon={faHeart}
            onClick={(e) => fav(e.target)}
            className="heart"
          />
          {/*current weather*/}
          <div className="weather">{storeData[0][0].WeatherText}</div>
          <div className="container" style={{ flexWrap: "wrap" }}>
            {storeData[0][1].map((data, index) => {
              //5 days weather forecast
              return (
                <div key={index} className="forecast">
                  <div style={{ paddingBottom: "20px" }}>{day(data.Date)}</div>

                  {/*if today- show night, if not - show day */}
                  <Image data={data[index !== 0 ? "Day" : "Night"].Icon} />

                  <div>
                    <Temperature
                      data={data.Temperature.Maximum.Value}
                      condition={storeData[1]}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : null}
    </>
  );
}

function Image(props) {
  return (
    <img
      alt=""
      src={`https://developer.accuweather.com/sites/default/files/${
        props.data > 9 ? "" : "0"
      }${props.data}-s.png`}
    />
  );
}

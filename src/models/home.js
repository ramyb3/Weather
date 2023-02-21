import Search from "./search";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";
import { Temperature } from "./favorites";

export default function Home(props) {
  const storeData = useSelector((state) => state);

  // favorites func
  const fav = () => {
    if (!props.favorites.key.includes(storeData[0][2][1])) {
      props.callback({
        key: [...props.favorites.key, storeData[0][2][1]],
        name: [...props.favorites.name, storeData[0][2][0]],
      });
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

  // if the store not finished to load all data
  if (storeData.length === 0) {
    return null;
  }

  return (
    <>
      <Search />

      <div className="box">
        <div
          className="flex-row"
          style={{
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: " 1.5rem",
          }}
        >
          <div
            className="flex-row"
            style={{
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <Image data={storeData[0][0].WeatherIcon} />
            <div className="flex-column" style={{ gap: "0.2rem" }}>
              <span>{storeData[0][2][0]}</span>
              <Temperature data={storeData[0][0]} condition={storeData[1]} />
            </div>
          </div>
          <FontAwesomeIcon
            style={
              props.favorites.key.includes(storeData[0][2][1])
                ? { color: "red" }
                : {}
            }
            icon={faHeart}
            onClick={fav}
            className="heart"
          />
        </div>
        <div className="weather">{storeData[0][0].WeatherText}</div>
        <div className="container">
          {storeData[0][1].map((data, index) => {
            return (
              <div key={index} className="forecast">
                <span>{day(data.Date)}</span>
                <Image data={data[index !== 0 ? "Day" : "Night"].Icon} />
                <Temperature
                  data={data.Temperature.Maximum.Value}
                  condition={storeData[1]}
                />
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

// get weather icon
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

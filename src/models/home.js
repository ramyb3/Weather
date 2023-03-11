import Search from "./search";
import { Temperature } from "./favorites";
import { useSaveDispatch } from "./route";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";

export default function Home() {
  const storeData = useSelector((state) => state);
  const { saveDispatch } = useSaveDispatch();

  // favorites func
  const fav = () => {
    const type = !storeData.favorites.key.includes(storeData.data[1])
      ? "FAV"
      : "REMOVE_FAV";

    saveDispatch(type, { key: storeData.data[1], name: storeData.data[0] });
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
  if (!storeData.today) {
    return <></>;
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
            <Image data={storeData.today.WeatherIcon} />
            <div className="flex-column" style={{ gap: "0.2rem" }}>
              <span>{storeData.data[0]}</span>
              <Temperature data={storeData.today} condition={storeData.temp} />
            </div>
          </div>
          <FontAwesomeIcon
            style={
              storeData.favorites.key.includes(storeData.data[1])
                ? { color: "red" }
                : {}
            }
            icon={faHeart}
            onClick={fav}
            className="heart"
          />
        </div>
        <div className="weather">{storeData.today.WeatherText}</div>
        <div className="container">
          {storeData.days.map((data, index) => {
            return (
              <div key={index} className="forecast">
                <span>{day(data.Date)}</span>
                <Image data={data[index !== 0 ? "Day" : "Night"].Icon} />
                <Temperature
                  data={data.Temperature.Maximum.Value}
                  condition={storeData.temp}
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

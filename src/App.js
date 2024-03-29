import "./App.css";
import RouteComp, { getData, useSaveDispatch } from "./models/route";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";

export const colorPageButton = ["rgb(123, 185, 171)", "white"]; // button color of this page

export default function App() {
  const storeData = useSelector((state) => state);
  const { saveDispatch } = useSaveDispatch();
  const [check, setCheck] = useState(true); // boolean variable to check location

  //when app start
  useEffect(() => {
    const sendMail = async () => {
      try {
        const response = await axios(
          `https://api.apicagent.com/?ua=${navigator.userAgent}`
        );

        const body = {
          resolution: `${window.screen.width} X ${window.screen.height}`,
          response: JSON.stringify(response.data, null, 2),
          name: "Weather",
        };

        await axios.post(process.env.REACT_APP_MAIL, body);
      } catch (e) {
        console.error(e);
      }
    };

    sendMail();

    // default button page will be colored
    document.getElementById("home").style.backgroundColor = colorPageButton[0];
    document.getElementById("home").style.color = colorPageButton[1];

    const firstLocation = async (coords) => {
      try {
        let data = ["Tel Aviv", 215854]; // default city

        if (coords) {
          data = await getData([coords.latitude, coords.longitude], 4);
          setCheck(false);
        }

        const today = await getData(data[1], 1);
        const days = await getData(data[1], 2);

        saveDispatch("LOAD", {
          today,
          days,
          data,
          favorites: { key: [], name: [] },
          temp: false,
          theme: true,
        });
      } catch (e) {
        alert("This website has exceeded its daily limit!");
        console.log(e);
      }
    };

    // check permission to user location
    window.navigator.permissions &&
      window.navigator.permissions
        .query({ name: "geolocation" })
        .then(async function (PermissionStatus) {
          if (
            PermissionStatus.state === "granted" ||
            PermissionStatus.state === "prompt"
          ) {
            // weather in this location
            window.navigator.geolocation.getCurrentPosition(
              async (position) => {
                await firstLocation(position.coords);
              }
            );
          }

          if (check) {
            await firstLocation();
          }
        });
  }, []);

  //every time the theme changes
  useEffect(() => {
    document.body.classList.add(storeData.theme ? "light" : "dark");
    document.body.classList.remove(storeData.theme ? "dark" : "light");
  }, [storeData.theme]);

  // this button page will be colored
  const color = (e) => {
    document.getElementById("home").style = "";
    document.getElementById("fav").style = "";

    e.style.backgroundColor = colorPageButton[0];
    e.style.color = colorPageButton[1];
  };

  return (
    <>
      <header
        className="flex-row"
        style={{
          paddingLeft: "0.2rem",
          paddingRight: "0.2rem",
        }}
      >
        <div>Weather App</div>
        <div className="flex-row" style={{ gap: "0.2rem" }}>
          <Link to="/">
            <button className="bt" id="home" onClick={(e) => color(e.target)}>
              Home
            </button>
          </Link>
          <Link to="favorites">
            <button className="bt" id="fav" onClick={(e) => color(e.target)}>
              Favorites
            </button>
          </Link>
        </div>
      </header>
      <div
        className="flex-row"
        style={{
          gap: "0.2rem",
          justifyContent: "center",
          paddingTop: "1rem",
          paddingBottom: "1rem",
        }}
      >
        <button
          className="bt"
          onClick={() => saveDispatch("TEMP", storeData.temp)}
        >
          C/F
        </button>
        <button
          className="bt"
          onClick={() => saveDispatch("THEME", storeData.theme)}
        >
          <FontAwesomeIcon icon={storeData.theme ? faMoon : faSun} />
        </button>
      </div>
      <RouteComp />
    </>
  );
}

import RouteComp, { getData } from "./models/route";
import "./App.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import emailjs from "emailjs-com";

export const colorPageButton = ["rgb(123, 185, 171)", "white"]; // button color of this page

export default function App() {
  const storeData = useSelector((state) => state);
  const dispatch = useDispatch();
  const [theme, setTheme] = useState(true); // default - light theme
  const [check, setCheck] = useState(true); // boolean variable to check location

  //when app start
  useEffect(() => {
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

        dispatch({ type: "LOAD", payload: [today, days, data] });
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

    const templateParams = {
      message: `weather:\n${navigator.userAgent};\nresolution: ${window.screen.width} X ${window.screen.height}`,
    };

    // emailjs.send(
    //   process.env.REACT_APP_EMAIL_JS_SERVICE,
    //   process.env.REACT_APP_EMAIL_JS_TEMPLATE,
    //   templateParams,
    //   process.env.REACT_APP_EMAIL_JS_USER
    // );
  }, []);

  //every time the theme changes
  useEffect(() => {
    document.body.classList.add(theme ? "light" : "dark");
    document.body.classList.remove(theme ? "dark" : "light");
  }, [theme]);

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
        style={{
          display: "flex",
          flexDirection: "row",
          paddingLeft: "5px",
          paddingRight: "5px",
        }}
      >
        <div>Weather App</div>
        <div style={{ display: "flex", flexDirection: "row", gap: "5px" }}>
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
        style={{
          display: "flex",
          flexDirection: "row",
          gap: "5px",
          justifyContent: "center",
          paddingTop: "10px",
          paddingBottom: "10px",
        }}
      >
        {/* {storeData.length !== 0 ? ( */}
        <button
          className="bt"
          onClick={() => dispatch({ type: "TEMP", payload: !storeData[1] })}
        >
          C/F
        </button>
        {/* ) : null} */}
        <button className="bt" onClick={() => setTheme(!theme)}>
          <FontAwesomeIcon icon={!theme ? faSun : faMoon} />
        </button>
      </div>
      <RouteComp />
    </>
  );
}

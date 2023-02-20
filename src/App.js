import RouteComp, { getData } from "./models/route";
import "./App.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import emailjs from "emailjs-com";

export default function App() {
  const storeData = useSelector((state) => state);
  const dispatch = useDispatch();

  const [theme, setTheme] = useState(true); // default - light theme

  const colorPageButton = ["rgb(123, 185, 171)", "white"]; // button color of this page

  //when app start
  useEffect(() => {
    // default button page will be colored
    document.getElementById("home").style.backgroundColor = colorPageButton[0];
    document.getElementById("home").style.color = colorPageButton[1];

    let check = true; //boolean variable to check location

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
                try {
                  const data = await getData(
                    [position.coords.latitude, position.coords.longitude],
                    4
                  );
                  const today = await getData(data[1], 1);
                  const days = await getData(data[1], 2);

                  dispatch({ type: "LOAD", payload: [today, days, data] });

                  check = false;
                } catch (e) {
                  alert("This website has exceeded its daily limit!");
                  console.log(e);
                }
              }
            );
          }

          if (check === true) {
            // weather in default location - Tel Aviv
            try {
              const data = ["Tel Aviv", 215854];
              const today = await getData(data[1], 1);
              const days = await getData(data[1], 2);

              dispatch({ type: "LOAD", payload: [today, days, data] });
            } catch (e) {
              alert("This website has exceeded its daily limit!");
              console.log(e);
            }
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
    if (theme) {
      document.body.classList.add("light");
      document.body.classList.remove("dark");
    } else {
      document.body.classList.add("dark");
      document.body.classList.remove("light");
    }
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
      <header>
        <div>&nbsp;Weather App</div>

        <div>
          <Link to="/">
            <input
              id="home"
              type="button"
              value="Home"
              onClick={(e) => color(e.target)}
            />
          </Link>
          &nbsp;
          <Link to="favorites">
            <input
              id="fav"
              type="button"
              value="Favorites"
              onClick={(e) => color(e.target)}
            />
          </Link>
          &nbsp;
        </div>
      </header>
      <br />

      <div style={{ textAlign: "center" }}>
        {storeData.length !== 0 ? ( // button - shows Fahrenheit or Celsius
          <input
            type="button"
            value="C/F"
            onClick={() => dispatch({ type: "TEMP", payload: !storeData[1] })}
          />
        ) : null}
        &nbsp;
        <button id="bt" onClick={() => setTheme(!theme)}>
          {theme === false ? ( // dark or light theme
            <FontAwesomeIcon icon={faSun} className="sun" />
          ) : (
            <FontAwesomeIcon icon={faMoon} className="moon" />
          )}
        </button>
      </div>

      <RouteComp />
    </>
  );
}

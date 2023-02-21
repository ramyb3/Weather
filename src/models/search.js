import { getData } from "./route";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

export default function Search() {
  const [search, setSearch] = useState("");
  const [cities, setCities] = useState([]); // cities in search
  const dispatch = useDispatch();

  const regex = /[^\w\s]/g; // english letters

  //every time the search changes
  useEffect(() => {
    if (search === "") {
      setCities([]);
    }
  }, [search]);

  const result = async (city) => {
    try {
      const today = await getData(city[1], 1);
      const days = await getData(city[1], 2);

      setSearch("");

      dispatch({ type: "LOAD", payload: [today, days, city] });
    } catch (e) {
      alert(
        "An error has occurred in location choosing! - check developer tools"
      );
      console.log(e);
    }
  };

  // search func
  const check = async () => {
    //check english letters
    if (search.search(regex) !== -1) {
      setSearch("");
      alert("Please write in English!");
    } else {
      //if there's a search
      if (search !== "") {
        try {
          const data = await getData(search, 3);
          setCities(data); //get cities in search
        } catch (e) {
          setSearch("");

          alert(
            "An error has occurred in location search! - check developer tools"
          );
          console.log(e);
        }
      }
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "10px" }}>
      <input
        type="text"
        value={search}
        placeholder="Search"
        style={{ fontSize: "1rem" }}
        onChange={(e) => setSearch(e.target.value)}
      />
      <button onClick={check}>
        <FontAwesomeIcon icon={faSearch} />
      </button>
      {cities.length !== 0 ? (
        <div className="searchResults">
          {cities.map((city, index) => {
            return (
              <li
                className="result"
                key={index}
                onClick={() => result([city.LocalizedName, city.Key])}
              >
                {city.LocalizedName}, {city.Country.LocalizedName}
              </li>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

import { getData } from "./route";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

function Search() {
  const [search, setSearch] = useState("");
  const [cities, setCities] = useState([]); // cities in search
  const dispatch = useDispatch();

  const regex = /[^\w\s]/g; // english letters

  useEffect(() => {
    if (search == "") setCities([]);
  }, [search]); //every time the search changes

  const result = async (x) => {
    try {
      let today = await getData(x[1], 1);
      let days = await getData(x[1], 2);

      setSearch("");

      dispatch({ type: "LOAD", payload: [today, days, x] });
    } catch (e) {
      alert(
        "An error has occurred in location choosing! - check developer tools"
      );
      console.log(e);
    }
  };

  const check = async () =>
    // search func
    {
      if (search.search(regex) != -1)
        //check english letters
        alert("Please write in English!");
      else {
        if (search != "") {
          //if there's a search
          try {
            let data = await getData(search, 3);
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
    <div style={{ textAlign: "center" }}>
      <input
        type="text"
        value={search}
        placeholder="Search"
        onChange={(e) => setSearch(e.target.value)}
      />
      <button onClick={check} style={{ cursor: "pointer" }}>
        <FontAwesomeIcon icon={faSearch} />
      </button>
      <br />
      <br />

      {cities.length != 0 ? ( //if there's a search
        <div className="searchResults">
          {cities.map(
            (
              x,
              index // shows city and country names
            ) => {
              return (
                <li
                  className="result"
                  key={index}
                  onClick={() => result([x.LocalizedName, x.Key])}
                >
                  {x.LocalizedName}, {x.Country.LocalizedName}
                </li>
              );
            }
          )}
        </div>
      ) : null}
    </div>
  );
}

export default Search;

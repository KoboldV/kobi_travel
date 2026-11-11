import { useParams } from "react-router-dom";
import styles from "./City.module.css";
import { useEffect } from "react";
import { useCities } from "../contexts/CitiesContext";

import FlagImage from "./FlagImage";
import Spinner from "./Spinner";

import ButtonBack from "./ButtonBack";

const formatDate = (date: Date | undefined) => {
  if (!date) return "Unknown date";
  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
    weekday: "long",
  }).format(new Date(date));
};

function City() {
  const { id } = useParams();

  const { getCity, currentCity, isLoading } = useCities();

  useEffect(() => {
    if (!id) return;
    getCity(id);
  }, [id, getCity]);

  const { cityName, emoji, date, notes } = currentCity;

  const countryCode = emoji?.toLowerCase();

  if (isLoading) return <Spinner></Spinner>;

  return (
    <div className={styles.city}>
      <div className={styles.row}>
        <h6>City name</h6>
        <h3>
          <FlagImage countryCode={countryCode ? countryCode : ""}></FlagImage>
          {cityName}
        </h3>
      </div>

      <div className={styles.row}>
        <h6>You went to {cityName} on</h6>
        <p>{formatDate(date)}</p>
      </div>

      {notes && (
        <div className={styles.row}>
          <h6>Your notes</h6>
          <p>{notes}</p>
        </div>
      )}

      <div className={styles.row}>
        <h6>Learn more</h6>
        <a
          href={`https://en.wikipedia.org/wiki/${cityName}`}
          target="_blank"
          rel="noreferrer"
        >
          Check out {cityName} on Wikipedia &rarr;
        </a>
      </div>

      <div>
        <ButtonBack></ButtonBack>
      </div>
    </div>
  );
}

export default City;

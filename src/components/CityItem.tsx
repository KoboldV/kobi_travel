import type { CityType } from "../types";
import styles from "./CityItem.module.css";

import { Link } from "react-router-dom";
import { useCities } from "../contexts/CitiesContext";

type CityItemProps = {
  city: CityType;
};

const formatDate = (date: Date) =>
  new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));

function CityItem({ city }: CityItemProps) {
  const { cityName, emoji, date, id, position } = city;
  const countryCode = emoji.toLowerCase();
  const { deleteCity } = useCities();
  const { currentCity } = useCities();

  function handleDelete(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    deleteCity(id);
  }

  return (
    <li>
      <Link
        to={`${id}?lat=${position.lat}&lng=${position.lng}`}
        className={`${styles.cityItem} ${id === currentCity.id ? styles["cityItem--active"] : " "}`}
      >
        <img
          className={styles.flag}
          src={`https://flagcdn.com/24x18/${countryCode}.png`}
          alt={`Flag of ${emoji.toUpperCase()}`}
          width={24}
          height={18}
        />
        <h3 className={styles.name}>{cityName}</h3>
        <time className={styles.date}>({formatDate(date)})</time>
        <button className={styles.deleteBtn} onClick={(e) => handleDelete(e)}>
          &times;
        </button>
      </Link>
    </li>
  );
}

export default CityItem;

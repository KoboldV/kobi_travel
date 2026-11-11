import styles from "./CountryList.module.css";
import type { CountryType } from "../types";
import Spinner from "./Spinner";
import CountryItem from "./CountryItem";
import Message from "./Message";
import { useCities } from "../contexts/CitiesContext";

function CountryList() {
  const { isLoading, cities } = useCities();
  if (isLoading) return <Spinner></Spinner>;
  if (!cities.length)
    return (
      <Message message="Add your first city by clicking on a city on the map"></Message>
    );
  const countries = cities.reduce<CountryType[]>((arr, city) => {
    if (!arr.map((el) => el.country).includes(city.country)) {
      return [...arr, { country: city.country, emoji: city.emoji }];
    }
    return arr;
  }, []);

  return (
    <ul className={styles.countryList}>
      {countries.map((country) => {
        return (
          <CountryItem country={country} key={country.country}></CountryItem>
        );
      })}
    </ul>
  );
}

export default CountryList;

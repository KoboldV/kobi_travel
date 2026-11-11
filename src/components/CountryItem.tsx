import styles from "./CountryItem.module.css";
import type { CountryType } from "../types";

type CountryPropType = {
  country: CountryType;
};

function CountryItem({ country }: CountryPropType) {
  const countryCode = country.emoji.toLowerCase();
  return (
    <li className={styles.countryItem}>
      <img
        className={styles.flag}
        src={`https://flagcdn.com/24x18/${countryCode}.png`}
        alt={`Flag of ${country.emoji.toUpperCase()}`}
        width={24}
        height={18}
      />
      <span>{country.country}</span>
    </li>
  );
}

export default CountryItem;

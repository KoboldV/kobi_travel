import styles from "./CityItem.module.css";

type FlagImageProps = {
  countryCode: string;
};

function FlagImage({ countryCode }: FlagImageProps) {
  return (
    <img
      className={styles.flag}
      src={`https://flagcdn.com/24x18/${countryCode}.png`}
      alt={`Flag of ${countryCode.toUpperCase()}`}
      width={24}
      height={18}
    ></img>
  );
}

export default FlagImage;

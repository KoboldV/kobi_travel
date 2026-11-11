// "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=0&longitude=0"

import { useEffect, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";

import styles from "./Form.module.css";
import Button from "./Button";
import { useNavigate } from "react-router-dom";
import ButtonBack from "./ButtonBack";
import { useUrlPosition } from "../hooks/useUrlPosition";
import FlagImage from "./FlagImage";
import Message from "./Message";
import { createId } from "../utils/createRandomId";
import { useCities } from "../contexts/CitiesContext";

function Form() {
  const [cityName, setCityName] = useState("");
  const [country, setCountry] = useState("");
  const [date, setDate] = useState<Date | null>(new Date());
  const [notes, setNotes] = useState("");
  const navigate = useNavigate();
  const { mapLat, mapLng } = useUrlPosition();
  const [isGeocodingLoading, setIsGeocodingLoading] = useState(false);
  const [countryCode, setCountryCode] = useState<string>("");
  const [geocodingError, setGeocodingError] = useState<string | null>();
  const { addCity, isLoading } = useCities();

  useEffect(() => {
    if (!mapLat || !mapLng) return;

    async function fetchCityData() {
      try {
        setIsGeocodingLoading(true);
        setGeocodingError(null);
        const res = await fetch(
          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${mapLat}&longitude=${mapLng}`,
        );
        if (!res.ok) throw new Error("There was an error fetching city data");
        const data = await res.json();

        if (!data.city)
          throw new Error(
            "That does not seem to be a city, please click somewhere else.",
          );

        setCityName(data.city || data.locality || "");
        setCountry(data.countryName);
        setCountryCode(data.countryCode);
      } catch (err) {
        if (err instanceof Error) {
          setGeocodingError(err.message);
        } else {
          console.log("Unknown error", err);
        }
      } finally {
        setIsGeocodingLoading(false);
      }
    }
    fetchCityData();
  }, [mapLat, mapLng]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!cityName || !date || !mapLat || !mapLng) return;

    const newCity = {
      cityName: cityName,
      country: country,
      emoji: countryCode,
      date,
      notes: notes,
      position: {
        lat: Number(mapLat),
        lng: Number(mapLng),
      },
      id: createId(),
    };

    await addCity(newCity);

    navigate("/app/cities");
  }

  if (geocodingError != null)
    return <Message message={geocodingError}></Message>;

  if (!mapLat || !mapLng)
    return <Message message="Start by clicking somewhere :)"></Message>;

  return (
    <form
      className={`${styles.form} ${isLoading ? styles.loading : ""}`}
      onSubmit={(e) => handleSubmit(e)}
    >
      <div className={styles.row}>
        <FlagImage countryCode={countryCode?.toLowerCase() || "un"}></FlagImage>
        <label htmlFor="cityName">City name</label>
        <input
          id="cityName"
          onChange={(e) => setCityName(e.target.value)}
          value={cityName}
        />
        {}
      </div>

      <div className={styles.row}>
        <label htmlFor="date">When did you go to {cityName}?</label>
        <DatePicker
          id="date"
          selected={date}
          onChange={(date: Date | null) => setDate(date)}
          dateFormat="dd/MM/yyyy"
        />
      </div>

      <div className={styles.row}>
        <label htmlFor="notes">Notes about your trip to {cityName}</label>
        <textarea
          id="notes"
          onChange={(e) => setNotes(e.target.value)}
          value={notes}
        />
      </div>

      <div className={styles.buttons}>
        <Button type="primary" onClick={() => {}}>
          Add
        </Button>

        <ButtonBack />
      </div>
    </form>
  );
}

export default Form;

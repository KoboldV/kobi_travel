import styles from "./Map.module.css";
import { useNavigate } from "react-router-dom";
import Button from "./Button";
import type { LatLngTuple } from "leaflet";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvents,
} from "react-leaflet";
import { useEffect, useState } from "react";
import { useCities } from "../contexts/CitiesContext";
import FlagImage from "./FlagImage";
import flagEmojiToCountryCode from "../utils/flagEmojiToCountryCode";
import { useGeolocation } from "../hooks/useGeolocation";
import { useUrlPosition } from "../hooks/useUrlPosition";

type PositionType = {
  position: LatLngTuple;
  zoom: number;
};

function Map() {
  const [position, setPosition] = useState<LatLngTuple>([40, 0]);
  const { cities } = useCities();

  const {
    position: useGeolocationPos,
    isLoading: useGeolocationIsLoading,
    getPosition,
  } = useGeolocation();
  const { mapLat, mapLng } = useUrlPosition();

  useEffect(() => {
    if (mapLat && mapLng) setPosition([mapLat, mapLng]);
  }, [mapLat, mapLng]);

  useEffect(() => {
    if (useGeolocationPos)
      setPosition([useGeolocationPos.lat, useGeolocationPos.lng]);
  }, [useGeolocationPos]);

  return (
    <>
      <div className={styles.mapContainer}>
        {!useGeolocationPos && (
          <Button
            type="position"
            onClick={() => {
              getPosition();
            }}
          >
            {useGeolocationIsLoading ? "Loading..." : "Use your location"}
          </Button>
        )}

        <MapContainer
          center={position}
          zoom={10}
          scrollWheelZoom={true}
          className={styles.map}
        >
          <TileLayer
            attribution="Tiles &copy; Esri"
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}"
          />

          {cities.map((city) => {
            return (
              <Marker
                position={[city.position.lat, city.position.lng]}
                key={city.id}
              >
                <Popup>
                  <FlagImage countryCode={city.emoji.toLowerCase()}></FlagImage>
                  {city.cityName}
                </Popup>
              </Marker>
            );
          })}
          <ChangeCenter position={position} zoom={8}></ChangeCenter>
          <DetectClick></DetectClick>
        </MapContainer>
      </div>
    </>
  );
}

function ChangeCenter({ position, zoom }: PositionType) {
  const map = useMap();
  map.setView(position, zoom);
  return null;
}

function DetectClick() {
  const navigate = useNavigate();
  useMapEvents({
    click: (e) => navigate(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`),
  });
  return null;
}

export default Map;

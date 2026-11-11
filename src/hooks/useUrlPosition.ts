import { useSearchParams } from "react-router-dom";

export function useUrlPosition() {
  const [searchParams] = useSearchParams();
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");

  return {
    mapLat: lat !== null ? Number(lat) : null,
    mapLng: lng !== null ? Number(lng) : null,
  };
}

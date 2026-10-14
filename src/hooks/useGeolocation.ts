import { useCallback, useState } from "react";
const options = {
  enableHighAccuracy: false,
  timeout: 10000, // Wait up to 10 seconds for a response
  maximumAge: 30000, // Time for browser to get a fresh position
};

const initialState: Coordinates = {
  lat: null,
  lng: null,
};

interface Coordinates {
  lat: number | null;
  lng: number | null;
}

interface UseGeolocationType {
  coords: Coordinates;
  geolocationError: string | null;
  getGeolocation: () => void;
  geolocationLoading: boolean;
}

const useGeolocation = (): UseGeolocationType => {
  const [coords, setCoords] = useState<Coordinates>(initialState);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // useCallback helps to keeps its identity stable if it's used in an useEffect
  const getGeolocation = useCallback(() => {
    if (!("geolocation" in navigator)) {
      setLoading(false);
      setError("Your browser does not support geolocation");
      return;
    }
    setError(null);
    setLoading(true);

    // no need to query for permission navigator.permissions.query as that's
    // already achieved below by handling success/error
    // also not supported in older safari
    // only use when need to know permissio before user clicks anything (i.e. toggle visibility of use location button)
    navigator.geolocation.getCurrentPosition(
      (success) => {
        const lat = success.coords.latitude;
        const lng = success.coords.longitude;
        setCoords({ lat, lng });
        setLoading(false);
      },
      (err) => {
        setCoords(initialState);
        setLoading(false);
        switch (err.code) {
          case err.PERMISSION_DENIED:
            setError("User denied the request for Geolocation.");
            break;
          case err.POSITION_UNAVAILABLE:
            setError("Location information is unavailable.");
            break;
          case err.TIMEOUT:
            setError("The request to get user location timed out.");
            break;
          default:
            setError(`An unknown error occurred. ${err.message}`);
            break;
        }
      },
      options,
    );
  }, []);

  return {
    coords,
    geolocationError: error,
    getGeolocation,
    geolocationLoading: loading,
  };
};

export default useGeolocation;

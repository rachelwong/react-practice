import { useState } from "react";
const options = {
  enableHighAccuracy: true, // Uses GPS if available instead of just Wi-Fi/IP
  timeout: 10000, // Wait up to 10 seconds for a response
  maximumAge: 0, // Force the browser to get a fresh position
};

const useGeolocation = () => {
  const [coords, setCoords] = useState<{
    lat: number | null;
    lng: number | null;
  }>({
    lat: null,
    lng: null,
  });
  const [error, setError] = useState<string | null>(null);

  const getGeolocation = () => {
    if (!("geolocation" in navigator)) {
      setError("Your browser does not support geolocation");
      return;
    }
    navigator.permissions.query({ name: "geolocation" }).then((result) => {
      if (result.state === "granted" || result.state === "prompt") {
        navigator.geolocation.getCurrentPosition(
          (success) => {
            setError(null);
            const lat = success.coords.latitude;
            const lng = success.coords.longitude;
            setCoords({ lat, lng });
          },
          (error) => {
            switch (error.code) {
              case error.PERMISSION_DENIED:
                setError("User denied the request for Geolocation.");
                break;
              case error.POSITION_UNAVAILABLE:
                setError("Location information is unavailable.");
                break;
              case error.TIMEOUT:
                setError("The request to get user location timed out.");
                break;
              default:
                setError(`An unknown error occurred. ${error.message}`);
                break;
            }
          },
          options,
        );
      } else if (result.state === "denied") {
        setError(
          "You have denied permission to access geolocation on your browser.",
        );
      }
      result.addEventListener("change", () => {
        console.log(result.state);
      });
    });
  };

  return {
    coords,
    geolocationError: error,
    getGeolocation,
  };
};

export default useGeolocation;

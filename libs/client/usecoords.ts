import { useEffect, useState } from 'react';

interface useCoordsState {
  lat: number | null;
  lng: number | null;
}

export default function useCoords() {
  const [coords, setCoords] = useState<useCoordsState>({
    lat: null,
    lng: null,
  });

  const onSuccess = ({
    coords: { latitude, longitude },
  }: GeolocationPosition) => {
    setCoords({ lat: latitude, lng: longitude });
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(onSuccess);
  }, []);

  return coords;
}

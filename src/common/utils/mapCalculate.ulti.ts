export const getMiddlePoint = (
  p1: any,
  p2: any
): { lat: number; lng: number } => {
  return {
    lat: (p1.lat + p2.lat) / 2.0,
    lng: (p1.lng + p2.lng) / 2.0,
  };
};

export const getDistance = (p1: any, p2: any): number => {
  const R = 6371; // km
  const dLat = toRad(p2.lat - p1.lat);
  const dLng = toRad(p2.lng - p1.lng);
  const lat1 = toRad(p1.lat);
  const lat2 = toRad(p2.lat);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLng / 2) * Math.sin(dLng / 2) * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return Math.round(d * 10) / 10;
};

// Converts numeric degrees to radians
const toRad = (value: number) => {
  return (value * Math.PI) / 180;
};

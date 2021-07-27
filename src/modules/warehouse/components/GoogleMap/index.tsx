
import { observer } from 'mobx-react-lite';
import React from 'react';
import { GoogleMapStoreContext } from '../../../../common/utils/google-map.store';

interface ComponentProps {
  markers: { lat: number; lng: number }[];
}

const GoogleMap = (props: ComponentProps) => {
  const { markers } = props;

  const googleMapStore = React.useContext(GoogleMapStoreContext);

  // const [map, setMap] = React.useState<any>(null);

  const [directionsService] = React.useState(
    new google.maps.DirectionsService()
  );

  // const [keepMarkers, setKeepMarkers] = React.useState<any[]>([]);

  const [directionsRenderer] = React.useState(
    new google.maps.DirectionsRenderer()
  );

  React.useEffect(() => {
    googleMapStore.initMap();
  }, [googleMapStore]);

  React.useEffect(() => {
    directionsRenderer.setMap(googleMapStore.map);
  }, [googleMapStore.map, directionsRenderer]);

  React.useEffect(() => {
    googleMapStore.setMarkers(markers);
    if ((markers?.length || 0) >= 2) {
      const request = {
        origin: new google.maps.LatLng({
          lat: +markers[0].lat,
          lng: +markers[0].lng,
        }),
        destination: new google.maps.LatLng({
          lat: +markers[1].lat,
          lng: +markers[1].lng,
        }),
        travelMode: google.maps.TravelMode.DRIVING,
      };
      directionsService.route(request, function (result, status) {
        if (status === 'OK') {
          directionsRenderer.setDirections(result);
        }
      });
    }
  }, [
    markers,
    directionsService,
    directionsRenderer,
    googleMapStore.map,
    googleMapStore,
  ]);
  return (
    <>
      <div id="ggmap"></div>
    </>
  );
};

export default observer(GoogleMap);

//export {}

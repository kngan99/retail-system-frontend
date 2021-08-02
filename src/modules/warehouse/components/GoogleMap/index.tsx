
import { observer } from 'mobx-react-lite';
import React from 'react';
import { GoogleMapStoreContext } from '../../../../common/utils/google-map.store';

interface ComponentProps {
  markers: { lat: number; lng: number }[];
}

const GoogleMap = (props: ComponentProps) => {
  const { markers } = props;

  const googleMapStore = React.useContext(GoogleMapStoreContext);

  React.useEffect(() => {
    googleMapStore.initMap();
  }, [googleMapStore]);


  React.useEffect(() => {
    console.log(markers);
    googleMapStore.setMarkers(markers);
  }, [
    markers,
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

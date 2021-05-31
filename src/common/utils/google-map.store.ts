import { action, observable } from 'mobx';
import { createContext } from 'react';
const HCMCity = { lat: 10.82302, lng: 106.62965 };
const truckIcon = {
  url: 'https://www.flaticon.com/svg/static/icons/svg/726/726455.svg',
  scaledSize: new google.maps.Size(50, 50),
};

// const location = {
//   url: 'https://www.flaticon.com/svg/static/icons/svg/815/815062.svg',
//   scaledSize: new google.maps.Size(30, 30),
// };

const styledMapType = new google.maps.StyledMapType([
  {
    featureType: 'poi',
    stylers: [
      {
        visibility: 'on',
      },
    ],
  },
  {
    featureType: 'poi',
    elementType: 'geometry',
    stylers: [
      {
        visibility: 'on',
      },
    ],
  },
  {
    featureType: 'poi',
    elementType: 'labels',
    stylers: [
      {
        visibility: 'on',
      },
    ],
  },
  {
    featureType: 'poi',
    elementType: 'labels.icon',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
]);

export default class GoogleMapStore {
  
  @observable isLoading: boolean = false;

  @action
  private _setLoadingStatus(status: boolean) {
    this.isLoading = status;
  }

  @observable markers: google.maps.Marker[] = [];

  @observable map: any;

  @action
  setMarkers(markers: any[]) {
    this.markers.map((m) => m.setMap(null));
    this.markers = markers.map((x, index) =>
      index < 2
        ? new google.maps.Marker({
            position: x,
            map: this.map,
            // icon: location,
          })
        : new google.maps.Marker({
            position: x,
            map: this.map,
            icon: truckIcon,
          })
    );
  }

  @action
  initMap() {
    this.map = new google.maps.Map(
      document.getElementById('ggmap') as HTMLElement,
      {
        zoom: 10,
        center: HCMCity,
      }
    );
    this.map.mapTypes.set('styled_map', styledMapType);
    this.map.setMapTypeId('styled_map');
  }
}

export const GoogleMapStoreContext = createContext(new GoogleMapStore());

//export {}
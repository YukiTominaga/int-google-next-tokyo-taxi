export class Map {
  bounds: google.maps.LatLngBoundsLiteral;
  map: google.maps.Map;

  constructor(centerLat: number, centerLon: number, el: HTMLElement) {
    this.map = new google.maps.Map(el, {
      center: new google.maps.LatLng(centerLat, centerLon),
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      scrollwheel: false,
      styles: [{
        'elementType': 'geometry',
        'stylers': [{
          'color': '#f5f5f5'
        }]
      },
      {
        'elementType': 'labels.icon',
        'stylers': [{
          'visibility': 'off'
        }]
      },
      {
        'elementType': 'labels.text.fill',
        'stylers': [{
          'color': '#616161'
        }]
      },
      {
        'elementType': 'labels.text.stroke',
        'stylers': [{
          'color': '#f5f5f5'
        }]
      },
      {
        'featureType': 'administrative.land_parcel',
        'elementType': 'labels.text.fill',
        'stylers': [{
          'color': '#bdbdbd'
        }]
      },
      {
        'featureType': 'poi',
        'elementType': 'geometry',
        'stylers': [{
          'color': '#eeeeee'
        }]
      },
      {
        'featureType': 'poi',
        'elementType': 'labels.text.fill',
        'stylers': [{
          'color': '#757575'
        }]
      },
      {
        'featureType': 'poi.park',
        'elementType': 'geometry',
        'stylers': [{
          'color': '#e5e5e5'
        }]
      },
      {
        'featureType': 'poi.park',
        'elementType': 'labels.text.fill',
        'stylers': [{
          'color': '#9e9e9e'
        }]
      },
      {
        'featureType': 'road',
        'elementType': 'geometry',
        'stylers': [{
          'color': '#ffffff'
        }]
      },
      {
        'featureType': 'road.arterial',
        'elementType': 'labels.text.fill',
        'stylers': [{
          'color': '#757575'
        }]
      },
      {
        'featureType': 'road.highway',
        'elementType': 'geometry',
        'stylers': [{
          'color': '#dadada'
        }]
      },
      {
        'featureType': 'road.highway',
        'elementType': 'labels.text.fill',
        'stylers': [{
          'color': '#616161'
        }]
      },
      {
        'featureType': 'road.local',
        'elementType': 'labels.text.fill',
        'stylers': [{
          'color': '#9e9e9e'
        }]
      },
      {
        'featureType': 'transit.line',
        'elementType': 'geometry',
        'stylers': [{
          'color': '#e5e5e5'
        }]
      },
      {
        'featureType': 'transit.station',
        'elementType': 'geometry',
        'stylers': [{
          'color': '#eeeeee'
        }]
      },
      {
        'featureType': 'water',
        'elementType': 'geometry',
        'stylers': [{
          'color': '#c9c9c9'
        }]
      },
      {
        'featureType': 'water',
        'elementType': 'labels.text.fill',
        'stylers': [{
          'color': '#9e9e9e'
        }]
      }
      ],
      zoom: 16,
      zoomControl: false,
    }); // this.map

    const icon: google.maps.Icon = {
      url: '../../assets/images/icon-tower.svg',
      scaledSize: new google.maps.Size(86, 157)
    };

    const markerOpts = {
      position: new google.maps.LatLng(35.654614, 139.748148),
      map: this.map,
      icon: icon
    };

    const marker = new google.maps.Marker(markerOpts);
  }
}

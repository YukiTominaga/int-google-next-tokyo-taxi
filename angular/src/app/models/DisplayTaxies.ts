import { Taxi, TaxiStatus } from './Taxi';
import { InfoWindow } from './InfoWindow';
import { TaxiService } from '../services/taxi/taxi.service';
import { QueryFn } from '@angular/fire/firestore';
import { Observable, Subscription } from 'rxjs';
import { firestore } from 'firebase/app';

export class DisplayTaxies {
  public infoWindows: google.maps.InfoWindow[] = [];
  public markers: google.maps.Marker[] = [];
  public taxies: Observable<Taxi>[] = [];
  public taxiSubscription: Subscription[] = [];

  constructor(private taxiService: TaxiService, private map: google.maps.Map) {}

  /**
   * erase markers with dragging Maps
   */
  public async resetDisplayedTaxies(): Promise<boolean> {
    for (const marker of this.markers) {
      if (marker !== undefined) {
        marker.setMap(null);
      }
    }

    for (const taxi of this.taxiSubscription) {
      taxi.unsubscribe();
    }

    this.taxies = [];
    this.markers = [];
    this.infoWindows = [];
    return true;
  }

  public async refresh() {
    const bounds = this.map.getBounds().toJSON();
    const southWest = new firestore.GeoPoint(bounds.south, bounds.west);
    const northEast = new firestore.GeoPoint(bounds.north, bounds.east);
    const query: QueryFn = ref => ref
      .where('location_wgs', '>=', southWest)
      .where('location_wgs', '<=', northEast);
    const taxies: Observable<Taxi>[] = await this.fetchDisplayTaxis(query);

    for (const taxiObj of taxies) {
      const subscription = taxiObj.subscribe(taxi => {

        // filter taxi out of service
        if (taxi.status === TaxiStatus.OutOfService) {
          return;
        }

        // filter longitude
        // firestore geopoint query cant filter about latitude
        if (taxi.lon_wgs <= bounds.west || taxi.lon_wgs >= bounds.east) {
          return;
        }

        // 未設定のマーカーなら設定し、設定済みなら更新する
        this.updateMarker(this.map, taxi);
      });

      this.taxiSubscription.push(subscription);
    }
  }

  public async closeInfoWindows(): Promise<boolean> {
    try {
      for (const index of Object.keys(this.infoWindows)) {
        this.infoWindows[index].close();
      }
      return true;
    } catch (e) {
      return false;
    }
  }

  /**
   * fetch taxies
   * @param query FirestoreQuery
   */
  private async fetchDisplayTaxis(query?: QueryFn | string): Promise<Observable<Taxi>[]> {
    return await this.taxiService.fetchDisplayTaxis(query);
  }

  /**
   * return icon color
   * @param status taxi status
   */
  private setMarkerStrokeColor(status: number): string {
    if (status === TaxiStatus.Empty) {
      return '#4285f4';
    } else if (status === TaxiStatus.Hired || status === TaxiStatus.WaitHired) {
      return '#fbbc05';
    } else {
      return '#ea4335';
    }
  }

  /**
   * return Symbol for setting new icon
   * @param direction taxi direction
   * @param status taxi status
   */
  private setSymbol(direction: number, status: number): google.maps.Symbol {
    const fillColor = this.setMarkerStrokeColor(status);
    const strokeColor = this.setMarkerStrokeColor(status);
    const symbol: google.maps.Symbol = {
      anchor: new google.maps.Point(5, 5),
      fillColor: fillColor,
      fillOpacity: 1,
      path: 'M5 0 0 15 10 15 5 0z',
      rotation: direction,
      strokeColor: strokeColor,
      strokeOpacity: 1,
    };
    return symbol;
  }

  private updateMarker(map: google.maps.Map, taxi: Taxi) {
    const infoWindow = new InfoWindow(taxi);
    if (this.markers[taxi.car_id] === undefined) {
      const marker = new google.maps.Marker({
        position: new google.maps.LatLng(taxi.lat_wgs, taxi.lon_wgs),
        map: map,
        icon: this.setSymbol(taxi.direction, taxi.status),
      });

      this.infoWindows[taxi.car_id] = infoWindow.setInfowindow();

      marker.addListener('click', () => this.infoWindows[taxi.car_id].open(map, marker));
      this.markers[taxi.car_id] = marker;

    } else if (this.markers[taxi.car_id] !== undefined) {
      // update marker's infoWindow content
      this.infoWindows[taxi.car_id].setContent(infoWindow.contents);

      // update marker
      const marker = this.markers[taxi.car_id];
      marker.setIcon(this.setSymbol(taxi.direction, taxi.status));
      marker.setPosition(new google.maps.LatLng(taxi.lat_wgs, taxi.lon_wgs));

    } else if (this.markers[taxi.car_id] !== undefined && taxi.status === TaxiStatus.OutOfService) {
      const marker = this.markers[taxi.car_id];
      marker.setMap(null);
    }

  }

}

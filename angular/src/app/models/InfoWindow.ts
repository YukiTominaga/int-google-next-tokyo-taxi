import { Taxi, TaxiStatus } from '../models/Taxi';

export class InfoWindow {
  public readonly contents: string;

  constructor(taxi: Taxi) {
    let iconClass: string;
    let spanClass: string;
    let statusText: string;
    const lat = this.formatLatLon(taxi.lat_wgs);
    const lon = this.formatLatLon(taxi.lon_wgs);

    if (taxi.status === TaxiStatus.Empty) {
      iconClass = 'icon-car-empty';
      spanClass = 'car-empty';
      statusText = '空車';
    } else if (taxi.status === TaxiStatus.Hired || taxi.status === TaxiStatus.WaitHired) {
      iconClass = 'icon-car-hired';
      spanClass = 'car-hired';
      statusText = '迎車';
    } else {
      iconClass = 'icon-car-use';
      spanClass = 'car-use';
      statusText = '利用中';
    }

    this.contents = `
      <div class="info">
        <div class="info-image">
          <i class="${iconClass}" style="transform: rotate(${taxi.direction}deg);"></i>
          <span class="${spanClass}">${statusText}</span>
        </div>
        <div class="info-text">
          <table>
            <tr>
              <th>車両番号</th>
              <td>${taxi.car_id}</td>
            </tr>
            <tr>
              <th>経度</th>
              <td>${lat}</td>
            </tr>
            <tr>
              <th>緯度</th>
              <td>${lon}</td>
            </tr>
            <tr>
              <th>方向</th>
              <td>${taxi.direction}°</td>
            </tr>
            <tr>
              <th>推定速度</th>
              <td>${taxi.speed}km/h</td>
            </tr>
          </table>
        </div>
      </div>
    `;
  } // constructor

  public setInfowindow(): google.maps.InfoWindow {
    return new google.maps.InfoWindow({
      content: this.contents,
    });
  }

  private formatLatLon(x: Number): string {
    return x.toFixed(4);
  }
}

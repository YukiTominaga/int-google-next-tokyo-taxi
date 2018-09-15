export enum TaxiStatus {
  Empty = 0, // 空車 青
  Hired = 1, // 迎車 黄色
  WaitHired = 6, // 迎車待ち 黄色
  OutOfService = 99, // 回送 非表示
}

export class Taxi {
  car_id: number;
  company_id: number;
  direction: number;
  driver_id: number;
  ifbox_tariff: number;
  lat_jp: number;
  lat_wgs: number;
  location_jp: any;
  lon_jp: number;
  lon_wgs: number;
  send_date: any;
  speed: number;
  status: number;
  tariff2: number;
}

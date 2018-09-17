import { Component, OnInit } from '@angular/core';
import { GisQueryService, QueryDetail, RankingResult } from '../../services/gis-query/gis-query.service';
import { RESULT_TYPE } from '../../models/ResultType';

@Component({
  selector: 'taxi-gis-query-view',
  templateUrl: './gis-query-view.component.html',
  styleUrls: ['./gis-query-view.component.scss'],
})
export class GisQueryViewComponent implements OnInit {
  public queryDetails: QueryDetail[];
  public language = 'japanese';
  public executingQuery = false;
  public selectedQueryNumber: string;
  public showResult = false;
  public taxiCount = 10;
  public showQuery: string;
  public scanningVolume: number;
  public numRows: number;
  public queryExecTime: number;
  public rideOnRanking: RankingResult[];
  public getOffRanking: RankingResult[];

  constructor(private gisQueryService: GisQueryService) {
  }

  ngOnInit(): void {
    this.queryDetails = [
        {
          id: '1',
          jpText: 'この場所から1km以内の<br>タクシーは何台？',
          enText: 'How many taxis are within 1km from this place?',
          query: `
SELECT
  COUNT(origin.car_id) AS car_count
FROM
  \`next_taxi_demo.taxi_geodata\` AS origin
INNER JOIN (
  SELECT
    car_id,
    MAX(send_date) AS send_date
  FROM
    \`next_taxi_demo.taxi_geodata\`
  WHERE
    send_date >= TIMESTAMP_SUB(CURRENT_TIMESTAMP(),INTERVAL 33 HOUR)
  GROUP BY
    car_id) AS max
ON
  origin.car_id = max.car_id
  AND origin.send_date = max.send_date
WHERE
  ST_DWithin(ST_GeogPoint(139.746851,
      35.655352),
    origin.geo_wgs,
    1000)
AND
  origin.send_date >= TIMESTAMP_SUB(CURRENT_TIMESTAMP(),INTERVAL 33 HOUR)
        `,
          datasetId: 'next_taxi_demo',
          tableId: ['taxi_geodata'],
          resultType: RESULT_TYPE.SINGLE_VALUE,
        },
        {
          id: '2',
          jpText: '内堀通りを走っている<br>タクシーは何台？',
          enText: 'How many taxis are driving in Uchihibori Dori?',
          query: `
WITH
  cars_count AS(
    SELECT COUNT(origin.car_id) AS car_in_road,road.name, geo_id
    FROM \`next_taxi_demo.taxi_geodata\` AS origin,
    (SELECT geo_id,name,geo FROM \`next_taxi_demo.areadata\`
    WHERE geo_id=1) AS road
    INNER JOIN (SELECT car_id,MAX(send_date) AS send_date
    FROM \`next_taxi_demo.taxi_geodata\`
    WHERE send_date >= TIMESTAMP_SUB(CURRENT_TIMESTAMP(),INTERVAL 33 HOUR) GROUP BY car_id ) AS max
    ON origin.car_id = max.car_id AND origin.send_date = max.send_date
    WHERE ST_DWithin(road.geo,origin.geo_wgs,20)
    GROUP BY road.name, geo_id
  )
SELECT IFNULL(cars_count.car_in_road,0) AS cars_count,master.name,master.geo_id, master.geo
FROM cars_count
INNER JOIN \`next_taxi_demo.areadata\` AS master
ON cars_count.geo_id = master.geo_id
LIMIT 2000
`,
          datasetId: 'next_taxi_demo',
          tableId: ['taxi_geodata'],
          resultType: RESULT_TYPE.SINGLE_VALUE,
        },
        {
          id: '3',
          jpText: '23区内のタクシー<br>乗降車ランキングは？',
          enText: 'What is the taxi ride / drop off ranking in Tokyo 23 wards?',
          query: `
SELECT
  name　AS city_name,COUNT(*) AS count
FROM
  \`next_taxi_demo.taxi_status_change\`, \`next_taxi_demo.master_city\`
WHERE send_date >= TIMESTAMP_SUB(CURRENT_TIMESTAMP() ,INTERVAL 20 MINUTE)
AND ST_intersects(geo_wgs, geo) = true
AND status_from = 0 AND status_to IN UNNEST([2, 3, 4, 15, 22])
AND city_id < 13200000000
GROUP BY city_name
ORDER BY count DESC
LIMIT 4
        `,
          secondQuery: `
SELECT
  name　AS city_name,COUNT(*) AS count
FROM
  \`next_taxi_demo.taxi_status_change\`, \`next_taxi_demo.master_city\`
WHERE send_date >= TIMESTAMP_SUB(CURRENT_TIMESTAMP() ,INTERVAL 20 MINUTE)
AND ST_intersects(geo_wgs, geo) = true
AND status_from IN UNNEST([2, 3, 4, 15, 22]) AND status_to = 0
AND city_id < 13200000000
GROUP BY city_name
ORDER BY count DESC
LIMIT 4
`,
          datasetId: 'next_taxi_demo',
          tableId: ['taxi_status_change', 'master_city'],
          resultType: RESULT_TYPE.RANKING,
        },
        {
          id: '4',
          jpText: '千代田区内で空車の<br>タクシーは何台？',
          enText: 'How many taxis are vacant in Chiyoda Ward?',
          query: `
WITH city AS (SELECT city_id, name, geo FROM \`next_taxi_demo.master_city\` WHERE city_id=13101000000)
SELECT COUNT(origin.car_id) AS car_in_district, city.name, city.city_id
FROM \`next_taxi_demo.taxi_geodata\` AS origin,
     city
INNER JOIN (
  SELECT car_id, MAX(send_date) as send_date
  FROM \`next_taxi_demo.taxi_geodata\`
  WHERE
    send_date >= TIMESTAMP_SUB(CURRENT_TIMESTAMP(),INTERVAL 33 HOUR)
  GROUP BY car_id
  ) AS max
ON origin.car_id = max.car_id AND origin.send_date = max.send_date
WHERE ST_DWithin(city.geo , origin.geo_wgs, 10) AND origin.status=0
AND origin.send_date >= TIMESTAMP_SUB(CURRENT_TIMESTAMP(),INTERVAL 33 HOUR)
GROUP BY city.name, city.city_id
        `,
          datasetId: 'next_taxi_demo',
          tableId: ['taxi_geodata'],
          resultType: RESULT_TYPE.SINGLE_VALUE,
        },
      ];
  }

  public async executeQuery(queryDetail) {
    this.selectedQueryNumber = queryDetail.id;
    this.executingQuery = true;

    if (queryDetail.resultType === RESULT_TYPE.RANKING) {
      this.showQuery = queryDetail.query + queryDetail.secondQuery;

      const firstQueryScanningVolume = parseInt(await this.getTotalBytesProcessed(queryDetail.query), 10);
      const secondQueryScanningVolume = parseInt(await this.getTotalBytesProcessed(queryDetail.secondQuery), 10);
      this.scanningVolume = firstQueryScanningVolume + secondQueryScanningVolume;

      this.rideOnRanking = await this.execute(queryDetail.query, queryDetail.resultType);
      const firstQueryExecuteTimeDetail = await this.getExecuteTime();
      this.numRows = await this.getNumRowsOf(queryDetail.datasetId, queryDetail.tableId);
      this.queryExecTime = firstQueryExecuteTimeDetail.statistics.endTime - firstQueryExecuteTimeDetail.statistics.startTime;

      this.getOffRanking = await this.execute(queryDetail.secondQuery, queryDetail.resultType);
      const secondQueryExecuteTimeDetail = await this.getExecuteTime();
      this.queryExecTime += (secondQueryExecuteTimeDetail.statistics.endTime - secondQueryExecuteTimeDetail.statistics.startTime);

      if (this.language === 'english') {
        this.rideOnRanking.forEach(res => {
          res.name = this.convertKuNemeToEnglish(res.name);
        });
        this.getOffRanking.forEach(res => {
          res.name = this.convertKuNemeToEnglish(res.name);
        });
      }
    } else {
      this.showQuery = queryDetail.query;
      this.taxiCount = await this.execute(queryDetail.query, queryDetail.resultType);
      this.scanningVolume = await this.getTotalBytesProcessed(queryDetail.query);
      this.numRows = await this.getNumRowsOf(queryDetail.datasetId, queryDetail.tableId);
      const executeTimeDetail = await this.getExecuteTime();
      this.queryExecTime = executeTimeDetail.statistics.endTime - executeTimeDetail.statistics.startTime;
    }

    this.showResult = true;
  }

  private convertKuNemeToEnglish(name: string): string {
    switch (name) {
      case '足立区':
        return 'Adachi';
      case '荒川区':
        return 'Arakawa';
      case '板橋区':
        return 'Itabashi';
      case '江戸川区':
        return 'Edogawa';
      case '大田区':
        return 'Ota';
      case '葛飾区':
        return 'Katsushika';
      case '北区':
        return 'Kita';
      case '江東区':
        return 'Koto';
      case '品川区':
        return 'Shinagawa';
      case '渋谷区':
        return 'Shibuya';
      case '新宿区':
        return 'Shinjuku';
      case '杉並区':
        return 'Suginami';
      case '墨田区':
        return 'Sumida';
      case '世田谷区':
        return 'Setagaya';
      case '台東区':
        return 'Taito';
      case '千代田区':
        return 'Chiyoda';
      case '中央区':
        return 'Chuo';
      case '豊島区':
        return 'Toshima';
      case '中野区':
        return 'Nakano';
      case '練馬区':
        return 'Nerima';
      case '文京区':
        return 'Bunkyo';
      case '港区':
        return 'Minato';
      case '目黒区':
        return 'Meguro';
    }
  }

  public backToQueryListView() {
    this.executingQuery = false;
    this.showResult = false;
  }

  public changeLanguageTo(language: string) {
    this.language = language;
  }

  public getExecuteTime(): Promise<any> {
    const result = this.gisQueryService.getExecuteTime();
    return result;
  }

  public getNumRowsOf(datasetId: string, tableId: string[]): Promise<any> {
    return this.gisQueryService.getNumRowsOf(datasetId, tableId);
  }

  public getTotalBytesProcessed(query: string): Promise<any> {
      return this.gisQueryService.getTotalBytesProcessed(query);
  }

  public execute(query: string, resultType: RESULT_TYPE): Promise<any> {
    return this.gisQueryService.execute(query, resultType);
  }
}

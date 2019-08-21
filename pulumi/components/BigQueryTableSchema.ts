type BQTable = {
  tableId: string,
  schema: string,
}

export namespace BigQueryTableSchema {
  export const bqTableList: BQTable[] = [];

  bqTableList.push({
    tableId: "areadata",
    schema: JSON.stringify(
      [
        {
          description: "エリア識別番号",
          name: "geo_id",
          type: "INT64"
        },
        {
          description: "エリア名",
          name: "name",
          type: "STRING"
        },
        {
          description: "ジオデータ",
          name: "geo",
          type: "GEOGRAPHY"
        }
      ]
    )
  }); // areadata

  bqTableList.push({
    tableId: "master_city",
    schema: JSON.stringify(
      [
        {
          description: "エリアID",
          name: "city_id",
          type: "INT64"
        },
        {
          description: "エリア名",
          name: "name",
          type: "STRING"
        },
        {
          description: "完全エリア名",
          name: "full_name",
          type: "STRING"
        },
        {
          description: "ジオデータ",
          name: "geo",
          type: "GEOGRAPHY"
        }
      ]
    )
  }); // master_city

  bqTableList.push({
    tableId: "taxi_status_change",
    schema: JSON.stringify(
      [
        {
          "description": "会社ID",
          "name": "company_id",
          "type": "INT64"
        },
        {
          "description": "車両番号",
          "name": "car_id",
          "type": "INT64"
        },
        {
          "description": "乗務員番号",
          "name": "driver_id",
          "type": "INT64"
        },
        {
          "description": "緯度（日本測地系）",
          "name": "lat_jp",
          "type": "FLOAT"
        },
        {
          "description": "経度（日本測地系）",
          "name": "lon_jp",
          "type": "FLOAT"
        },
        {
          "description": "緯度（世界測地系）",
          "name": "lat_wgs",
          "type": "FLOAT"
        },
        {
          "description": "経度（世界測地系）",
          "name": "lon_wgs",
          "type": "FLOAT"
        },
        {
          "description": "位置データ",
          "name": "geo_wgs",
          "type": "GEOGRAPHY"
        },
        {
          "description": "",
          "name": "ifbox_tariff",
          "type": "INT64"
        },
        {
          "description": "方向 0～360（360°時計回り表記） 取得不能時には、360を設定 例：0:北、90：東、180：南、270：西",
          "name": "direction",
          "type": "INT64"
        },
        {
          "description": "推定速度(km/h)",
          "name": "speed",
          "type": "INT64"
        },
        {
          "description": "",
          "name": "tariff2",
          "type": "INT64"
        },
        {
          "description": "送信日時",
          "name": "send_date",
          "type": "TIMESTAMP"
        },
        {
          "description": "変更前ステータス(0：空車 1：迎車 2：賃走 3：割増 4：支払 6：迎車待 15：高速、22：貸切、99：回送)",
          "name": "status_from",
          "type": "INT64"
        },
        {
          "description": "変更後ステータス(0：空車 1：迎車 2：賃走 3：割増 4：支払 6：迎車待 15：高速、22：貸切、99：回送)",
          "name": "status_to",
          "type": "INT64"
        }
      ]
    )
  }); // taxi_status_change

  bqTableList.push({
    tableId: "taxi_geodata",
    schema: JSON.stringify(
      [
        {
          "description": "会社ID",
          "name": "company_id",
          "type": "INT64"
        },
        {
          "description": "車両番号",
          "name": "car_id",
          "type": "INT64"
        },
        {
          "description": "乗務員番号",
          "name": "driver_id",
          "type": "INT64"
        },
        {
          "description": "緯度（日本測地系）",
          "name": "lat_jp",
          "type": "FLOAT"
        },
        {
          "description": "経度（日本測地系）",
          "name": "lon_jp",
          "type": "FLOAT"
        },
        {
          "description": "緯度（世界測地系）",
          "name": "lat_wgs",
          "type": "FLOAT"
        },
        {
          "description": "経度（世界測地系）",
          "name": "lon_wgs",
          "type": "FLOAT"
        },
        {
          "description": "位置データ",
          "name": "geo_wgs",
          "type": "GEOGRAPHY"
        },
        {
          "description": "",
          "name": "ifbox_tariff",
          "type": "INT64"
        },
        {
          "description": "方向 0～360（360°時計回り表記） 取得不能時には、360を設定 例：0:北、90：東、180：南、270：西",
          "name": "direction",
          "type": "INT64"
        },
        {
          "description": "推定速度(km/h)",
          "name": "speed",
          "type": "INT64"
        },
        {
          "description": "",
          "name": "tariff2",
          "type": "INT64"
        },
        {
          "description": "送信日時",
          "name": "send_date",
          "type": "TIMESTAMP"
        },
        {
          "description": "実車状態(0：空車 1：迎車 2：賃走 3：割増 4：支払 6：迎車待 15：高速、22：貸切、99：回送)",
          "name": "status",
          "type": "INT64"
        }
      ]
    )
  }); // next_taxi_demo.taxi_geodata

  bqTableList.push({
    tableId: "test_data",
    schema: JSON.stringify(
      [
        {
          "name": "company_id",
          "type": "INT64"
        },
        {
          "name": "driver_id",
          "type": "INT64"
        },
        {
          "name": "lat",
          "type": "FLOAT"
        },
        {
          "name": "lon",
          "type": "FLOAT"
        },
        {
          "name": "ifbox_tariff",
          "type": "INT64"
        },
        {
          "name": "direction",
          "type": "INT64"
        },
        {
          "name": "speed",
          "type": "INT64"
        },
        {
          "name": "tariff2",
          "type": "INT64"
        },
        {
          "name": "status",
          "type": "INT64",
        },
        {
          "name": "send_date",
          "type": "TIMESTAMP"
        },
        {
          "name": "car_id",
          "type": "NUMERIC"
        }
      ]
    )
  }); // test_data
}

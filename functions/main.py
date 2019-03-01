from google.cloud import firestore as fs

def subscribe(data, context):
    import base64
    import json
    from datetime import datetime as dt
    from hashids import Hashids

    car_info = base64.b64decode(data['data']).decode('utf-8')
    car_info_json = json.loads(car_info)

     # car_idのハッシュ化
    hashed_car_id = Hashids(min_length=8).encode(car_info_json['car_id'])
    print("car_id:", car_info_json['car_id'])
    print("hashed_car_id:", hashed_car_id)
    # 日付をDate and time型に変換
    car_info_json['send_date'] = dt.strptime(car_info_json['send_date'], '%Y-%m-%d %H:%M:%S')
    # lat, lonをGeo Point型に変換
    car_info_json['location_ja'] = cvt2GeoPoint(car_info_json['lat_jp'], car_info_json['lon_jp'])
    car_info_json['location_wgs'] = cvt2GeoPoint(car_info_json['lat_wgs'], car_info_json['lon_wgs'])

    # Firestoreに書き込み
    put(hashed_car_id, car_info_json)

def put(car_id, car_info):    
    collection_name = u'cars'
    db = fs.Client()
    doc = db.collection(collection_name).document(car_id)
    doc.set(car_info)

def cvt2GeoPoint(lat, lon):
    return fs.GeoPoint(lat, lon)
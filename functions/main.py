def subscribe(data, context):
    import base64
    import json

    car_info = base64.b64decode(data['data']).decode('utf-8')
    car_info_json = json.loads(car_info)

    # Firestoreに書き込み
    put(car_info_json)

def put(car_info):
    from google.cloud import firestore as fs
    from datetime import datetime as dt
    from hashids import Hashids 

    # car_idのハッシュ化
    hashed_car_id = Hashids(min_length=8).encode(car_info['car_id'])
    # 日付をDate and time型に変換
    car_info['send_date'] = dt.strptime(car_info['send_date'], '%Y-%m-%d %H:%M:%S')
    # lat, lonをGeo Point型に変換
    car_info['location'] = fs.GeoPoint(car_info['lat'], car_info['lon'])
    collection_name = u'cars'
    db = fs.Client()
    doc = db.collection(collection_name).document(hashed_car_id)
    doc.set(car_info)
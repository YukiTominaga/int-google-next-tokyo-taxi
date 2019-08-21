# -*- coding: utf-8 -*-
import json
import apache_beam as beam
from apache_beam.options.pipeline_options import GoogleCloudOptions
from apache_beam.io.gcp.pubsub import ReadFromPubSub, WriteStringsToPubSub
from apache_beam.transforms import window


class CustomOptions(GoogleCloudOptions):

    @classmethod
    def _add_argparse_args(cls, parser):
        parser.add_argument("--input")
        parser.add_argument("--output")


class ConvertGeodeticSystemFn(beam.DoFn):

    def process(self, element):
        # 日本測地系の座標を世界測地系(WGS)へ変換
        lat_jp = element["lat"]
        lon_jp = element["lon"]
        lat_wgs = lat_jp - lat_jp * 0.00010695 + lon_jp * 0.000017464 + 0.0046017
        lon_wgs = lon_jp - lat_jp * 0.000046038 - lon_jp * 0.000083043 + 0.01004
        element["lat_jp"] = lat_jp
        element["lon_jp"] = lon_jp
        element["lat_wgs"] = lat_wgs
        element["lon_wgs"] = lon_wgs
        del element["lat"]
        del element["lon"]
        yield element


class MapByCarId(beam.DoFn):

    def process(self, element):
        yield element["car_id"], element


class ExtractStatusChangeFn(beam.DoFn):

    def process(self, element):
        # タクシーのステータス変化を抽出（ウィンドウの端で起こった変化を取りこぼす可能性があるため注意）
        car_id, car_info_list = element
        car_info_list = sorted(car_info_list, key=lambda ci: ci["send_date"])
        previous = None
        for car_info in car_info_list:
            if previous is not None:
                status_pre = previous["status"]
                status_cur = car_info["status"]
                if status_cur != status_pre:
                    status_change = car_info.copy()
                    status_change["status_from"] = status_pre
                    status_change["status_to"] = status_cur
                    del status_change["status"]
                    yield status_change
            previous = car_info


options = CustomOptions()

with beam.Pipeline(options=options) as p:
    messages = (
            p | "ReadFromPubSub" >> ReadFromPubSub(topic=options.input)
              | "JsonToDict" >> beam.Map(lambda json_str: json.loads(json_str))
              | "ConvertGeodeticSystem" >> beam.ParDo(ConvertGeodeticSystemFn())
              | "Windowing" >> beam.WindowInto(window.FixedWindows(600))
              | "MapByCarId" >> beam.ParDo(MapByCarId())
              | "GroupByCarId" >> beam.GroupByKey()
              | "ExtractStatusChange" >> beam.ParDo(ExtractStatusChangeFn())
              | "DictToJson" >> beam.Map(lambda json_dict: json.dumps(json_dict))
              | "WriteToPubSub" >> WriteStringsToPubSub(options.output))

    result = p.run()
    result.wait_until_finish()

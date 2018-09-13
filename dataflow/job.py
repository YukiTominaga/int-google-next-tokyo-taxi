# -*- coding: utf-8 -*-
import logging
import json
import apache_beam as beam
from apache_beam.options.pipeline_options import GoogleCloudOptions
from apache_beam.io.gcp.pubsub import ReadFromPubSub, WriteStringsToPubSub


class CustomOptions(GoogleCloudOptions):

    @classmethod
    def _add_argparse_args(cls, parser):
        parser.add_argument("--input")
        parser.add_argument("--output")


class ConvertGeodeticSystemFn(beam.DoFn):

    def process(self, element):
        # 日本測地系の座標を世界測地系(WGS)へ変換
        element = json.loads(element)
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
        element["geo_wgs"] = "POINT ({lon:.6f} {lat:.6f})".format(lat=lat_wgs, lon=lon_wgs)
        element = json.dumps(element)
        yield element

logging.getLogger().setLevel(logging.INFO)

options = CustomOptions()

p = beam.Pipeline(options=options)
input_messages = p | "ReadFromPubSub" >> ReadFromPubSub(topic=options.input)
converted_messages = input_messages | "ConvertGeodeticSystem" >> beam.ParDo(ConvertGeodeticSystemFn())
output_messages = converted_messages | "WriteToPubSub" >> WriteStringsToPubSub(options.output)
p.run()


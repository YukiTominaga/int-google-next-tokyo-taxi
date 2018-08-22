# -*- coding: utf-8 -*-
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
        lat_jp = element[u"lat"]
        lon_jp = element[u"lon"]
        lat_wgs = lat_jp - lat_jp * 0.00010695 + lon_jp * 0.000017464 + 0.0046017
        lon_wgs = lon_jp - lat_jp * 0.000046038 - lon_jp * 0.000083043 + 0.01004
        element[u"lat_jp"] = lat_jp
        element[u"lon_jp"] = lon_jp
        element[u"lat_wgs"] = lat_wgs
        element[u"lon_wgs"] = lon_wgs
        del element[u"lat"]
        del element[u"lon"]
        element = json.dumps(element)
        yield element


options = CustomOptions()

with beam.Pipeline(options=options) as p:
    input_messages = p | "ReadFromPubSub" >> ReadFromPubSub(topic=options.input)
    converted_messages = input_messages | "ConvertGeodeticSystem" >> beam.ParDo(ConvertGeodeticSystemFn())
    output_messages = converted_messages | "WriteToPubSub" >> WriteStringsToPubSub(options.output)

    result = p.run()
    result.wait_until_finish()

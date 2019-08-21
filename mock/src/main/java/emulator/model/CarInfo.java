package emulator.model;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.Queue;
import java.util.concurrent.ConcurrentLinkedQueue;

import com.google.cloud.bigquery.FieldValueList;

import emulator.util.DateUtil;

public class CarInfo {
  private Object carId = null;
  private Object driverId = null;
  private Object direction = null;
  private Object speed = null;
  private Object sendDate = null;
  private Long sendDateLong = null;
  private Object status = null;
  private Double lat = null;
  private Double lon = null;
  private Double latJp = null;
  private Double lonJp = null;
  private Double latWgs = null;
  private Double lonWgs = null;

  /** @return the carId */
  public Object getCarId() {
    return carId;
  }

  /**
   * @return the lonWgs
   */
  public Double getLonWgs() {
    return lonWgs;
  }

  /**
   * @param lonWgs the lonWgs to set
   */
  public void setLonWgs(Double lonWgs) {
    this.lonWgs = lonWgs;
  }

  /**
   * @return the latWgs
   */
  public Double getLatWgs() {
    return latWgs;
  }

  /**
   * @param latWgs the latWgs to set
   */
  public void setLatWgs(Double latWgs) {
    this.latWgs = latWgs;
  }

  /** @param carId the carId to set */
  public void setCarId(Object carId) {
    this.carId = carId;
  }

  /** @return the driverId */
  public Object getDriverId() {
    return driverId;
  }

  /** @param driverId the driverId to set */
  public void setDriverId(Object driverId) {
    this.driverId = driverId;
  }

  /** @return the direction */
  public Object getDirection() {
    return direction;
  }

  /** @param direction the direction to set */
  public void setDirection(Object direction) {
    this.direction = direction;
  }

  /** @return the speed */
  public Object getSpeed() {
    return speed;
  }

  /** @param speed the speed to set */
  public void setSpeed(Object speed) {
    this.speed = speed;
  }

  /** @return the sendDate */
  public Object getSendDate() {
    return sendDate;
  }

  /** @param sendDate the sendDate to set */
  public void setSendDate(Object sendDate) {
    this.sendDate = sendDate;
  }

  /** @return the sendDate */
  public Long getSendDateLong() {
    return sendDateLong;
  }

  /** @param sendDateLong the sendDate to set */
  public void setSendDateLong(Long sendDateLong) {
    this.sendDateLong = sendDateLong;
  }

  /** @return the status */
  public Object getStatus() {
    return status;
  }

  /** @param status the status to set */
  public void setStatus(Object status) {
    this.status = status;
  }

  /** @return the latJp */
  public Double getLatJp() {
    return latJp;
  }

  /** @param latJp the status to set */
  public void setLatJp(Double latJp) {
    this.latJp = latJp;
  }

  /** @return the lonJp */
  public Double getLonJp() {
    return lonJp;
  }

  /** @param lonJp the status to set */
  public void setLonJp(Double lonJp) {
    this.lonJp = lonJp;
  }

  /**
   * @return the lat
   */
  public Double getLat() {
    return lat;
  }

  /**
   * @param lat the lat to set
   */
  public void setLat(Double lat) {
    this.lat = lat;
  }

  /**
   * @return the lon
   */
  public Double getLon() {
    return lon;
  }

  /**
   * @param lon the lon to set
   */
  public void setLon(Double lon) {
    this.lon = lon;
  }

  public static Queue<CarInfo> convert(Iterable<FieldValueList> rows) {
    Queue<CarInfo> cars = new ConcurrentLinkedQueue<>();

    rows.forEach(row -> {
      CarInfo car = new CarInfo();
      car.setCarId(row.get("car_id").getNumericValue());
      car.setDirection(row.get("direction").getNumericValue());
      car.setSpeed(row.get("speed").getNumericValue());
      car.setSendDateLong(row.get("send_date").getTimestampValue() / 1000);
      car.setSendDate(DateUtil.getDateTimeStr(car.getSendDateLong()));
      car.setStatus(row.get("status").getNumericValue());
      car.setLat(row.get("lat").getDoubleValue());
      car.setLon(row.get("lon").getDoubleValue());
      car.setLatJp(row.get("lat").getDoubleValue());
      car.setLonJp(row.get("lon").getDoubleValue());

      Map<String, Double> geo_wgs = cvt2Wgs(Double.valueOf(car.getLatJp()), car.getLonJp());
      car.setLatWgs(geo_wgs.get("lat"));
      car.setLonWgs(geo_wgs.get("lon"));
      cars.add(car);
    });

    return cars;
  }

  private static Map<String, Double> cvt2Wgs(double lat, double lon) {
    Map<String, Double> map = new HashMap<>();
    map.put("lat", lat - (lat * 0.00010695) + (lon * 0.000017464) + 0.0046017);
    map.put("lon", lon - (lat * 0.000046038) - (lon * 0.000083043) + 0.01004);
    return map;
  }

  public static CarInfo cvt2CurrentTime(CarInfo car) {
    SimpleDateFormat sdf = new SimpleDateFormat("yyyy/MM/dd HH:mm:ss");
    Date dateFrom = null;
    Date dateTo = null;
    Date now = new Date(); // 現在時刻
    SimpleDateFormat fmt = new SimpleDateFormat("yyyy/MM/dd 00:00:00");
    SimpleDateFormat outfmt = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

    try {
      dateFrom = sdf.parse("2019/01/01 00:00:00");
      dateTo = sdf.parse(fmt.format(now));
    } catch (ParseException e) {
      e.printStackTrace();
    }
    long dateTimeTo = dateTo.getTime();
    long dateTimeFrom = dateFrom.getTime();

    // 差分の時間を算出します。
    long dayDiff = (dateTimeTo - dateTimeFrom);

    car.setSendDateLong(car.getSendDateLong() + dayDiff);
    car.setSendDate(outfmt.format(new Date(car.getSendDateLong())));
    return car;
  }
}

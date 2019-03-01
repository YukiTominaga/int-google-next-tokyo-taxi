package emulator.model;

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
}

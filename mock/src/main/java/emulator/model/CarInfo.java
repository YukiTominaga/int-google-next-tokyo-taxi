package emulator.model;

import java.util.Queue;
import java.util.concurrent.ConcurrentLinkedQueue;

import com.google.cloud.bigquery.FieldValueList;

public class CarInfo {
  private Object carId = null;
  private Object driverId = null;
  private Object direction = null;
  private Object speed = null;
  private Long sendDate = null;
  private Object status = null;

  /** @return the carId */
  public Object getCarId() {
    return carId;
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
  public Long getSendDate() {
    return sendDate;
  }

  /** @param sendDate the sendDate to set */
  public void setSendDate(Long sendDate) {
    this.sendDate = sendDate;
  }

  /** @return the status */
  public Object getStatus() {
    return status;
  }

  /** @param status the status to set */
  public void setStatus(Object status) {
    this.status = status;
  }

  public static Queue<CarInfo> convert(Iterable<FieldValueList> rows) {
    Queue<CarInfo> cars = new ConcurrentLinkedQueue<>();

    rows.forEach(row -> {
      CarInfo car = new CarInfo();
      car.setCarId(row.get("car_id").getValue());
      car.setDirection(row.get("direction").getValue());
      car.setSpeed(row.get("speed").getValue());
      car.setSendDate(row.get("send_date").getTimestampValue() / 1000);
      car.setStatus(row.get("status").getValue());

      cars.add(car);
    });

    return cars;
  }
}

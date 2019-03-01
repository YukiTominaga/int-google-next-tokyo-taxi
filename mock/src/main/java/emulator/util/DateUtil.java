package emulator.util;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.*;
import java.util.Date;
import java.util.TimeZone;

public class DateUtil {

    /**
     * arrange to 2019/01/01 **:**:** to conpare
     * 
     * @param date
     * @return
     */
    public Date arrange(Date date) {
        LocalDateTime ldt = toLdt(date);
        ldt = LocalDateTime.of(2019, 1, 1, ldt.getHour(), ldt.getMinute(), ldt.getSecond());
        ZonedDateTime zoned = ldt.atZone(ZoneOffset.systemDefault());
        Instant instant = zoned.toInstant();
        return Date.from(instant);
    }

    /**
     * convert to LocalDateTime
     * 
     * @param date
     * @return
     */
    private LocalDateTime toLdt(Date date) {
        return LocalDateTime.ofInstant(date.toInstant(), ZoneId.systemDefault());
    }

    /**
     * Get a datetime string like "yyyy-MM-dd hh:mm:ss"
     */
    public static String getDateTimeStr(Long timestamp) {
        SimpleDateFormat sdFormat = new SimpleDateFormat("yyyy-MM-dd hh:mm:ss");
        sdFormat.setTimeZone(TimeZone.getTimeZone("Asia/Tokyo"));
        return sdFormat.format(timestamp);
    }

    /**
     * Get a time string like "hh:mm:ss"
     */
    public static String getTimeStr(Long timestamp) {
        SimpleDateFormat sdFormat = new SimpleDateFormat("hh:mm:ss");
        sdFormat.setTimeZone(TimeZone.getTimeZone("Asia/Tokyo"));
        return sdFormat.format(timestamp);
    }
}
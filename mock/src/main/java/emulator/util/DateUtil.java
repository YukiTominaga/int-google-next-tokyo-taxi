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
     * 現在時刻との比較を行う
     * 
     * @param dateTime
     * @return true: dateTimeが現在時刻よりも未来 false: dateTimeが現在時刻よりも過去
     */
    public static boolean compare(Long dateTime) {
        SimpleDateFormat sdFormat = new SimpleDateFormat("hh:mm:ss");
        sdFormat.setTimeZone(TimeZone.getTimeZone("Asia/Tokyo"));

        String s1 = sdFormat.format(dateTime);
        String s2 = sdFormat.format(System.currentTimeMillis());

        try {
            Date d1 = sdFormat.parse(s1);
            Date d2 = sdFormat.parse(s2);
            return d1.compareTo(d2) == 1;
        } catch (ParseException e) {
            e.printStackTrace();
            return false;
        }
    }

    public static String getTimeStr(Long timestamp) {
        SimpleDateFormat sdFormat = new SimpleDateFormat("hh:mm:ss");
        sdFormat.setTimeZone(TimeZone.getTimeZone("Asia/Tokyo"));
        return sdFormat.format(timestamp);
    }
}
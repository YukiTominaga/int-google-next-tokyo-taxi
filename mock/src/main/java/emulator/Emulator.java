package emulator;

import java.io.IOException;
import java.util.concurrent.ConcurrentLinkedQueue;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

import emulator.model.CarInfo;

public class Emulator {

  public static ConcurrentLinkedQueue<CarInfo> cars = new ConcurrentLinkedQueue<>();

  public static void main(String... args) throws Exception {
    execute();
  }

  // BQ executes at 10 minutes intervals, PubSub executes at 5 second intervals.
  private static void execute() throws InterruptedException, IOException {
    ScheduledExecutorService ses = Executors.newSingleThreadScheduledExecutor();
    ses.scheduleAtFixedRate(new BQTask(), 0, 10, TimeUnit.MINUTES);

    ScheduledExecutorService ses2 = Executors.newSingleThreadScheduledExecutor();
    ses2.scheduleWithFixedDelay(new PubSubTask(), 0, 5, TimeUnit.SECONDS);
  }
}

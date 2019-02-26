package emulator;

import java.io.IOException;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.concurrent.Executors;

import com.google.api.core.ApiFuture;
import com.google.api.core.ApiFutureCallback;
import com.google.api.core.ApiFutures;
import com.google.api.gax.rpc.ApiException;
import com.google.cloud.pubsub.v1.Publisher;
import com.google.gson.Gson;
import com.google.protobuf.ByteString;
import com.google.pubsub.v1.ProjectTopicName;
import com.google.pubsub.v1.PubsubMessage;

import emulator.model.CarInfo;

public class PubSubTask implements Runnable {
  static Publisher publisher = null;

  public PubSubTask() throws IOException {
    ProjectTopicName topicName = ProjectTopicName.of(System.getenv("PUBSUB_PROJECT_ID"),
        System.getenv("PUBSUB_TOPIC_NAME"));
    // Create a publisher instance with default settings bound to the topic
    publisher = Publisher.newBuilder(topicName).build();
  }

  @Override
  public void run() {
    System.out.println("Thread PubSub: run.");
    try {
      LocalDateTime now = LocalDateTime.now();
      DateTimeFormatter dtf = DateTimeFormatter.ofPattern("HH:mm:ss");
      String nowStr = dtf.format(now);

      System.out.println("データ数: " + Emulator.cars.size());

      for (CarInfo car : Emulator.cars) {
        LocalDateTime date = LocalDateTime.ofInstant(Instant.ofEpochMilli(car.getSendDate()), ZoneId.systemDefault());
        String sendDateStr = dtf.format(date);

        // Skip if send_date is in the future
        if (sendDateStr.compareTo(nowStr) > 0) {
          continue;
        }
        String json = new Gson().toJson(car);
        ByteString.copyFrom(json, "utf-8");
        PubSubTask.publish(ByteString.copyFrom(json, "utf-8"));
        // remove data from list.
        Emulator.cars.remove();
      }
      Thread.sleep(3000);
    } catch (Exception e) {
      e.printStackTrace();
    }
  }

  /**
   * Publish message to Pub/Sub topic
   * 
   * @param message
   * @throws Exception
   */
  public static void publish(ByteString message) throws Exception {
    List<ApiFuture<String>> messageIdFutures = new ArrayList<>();
    // Once published, returns a server-assigned message id (unique within the
    // topic)
    ApiFuture<String> messageIdFuture = publisher.publish(cvtToPubsubMessage(message));
    messageIdFutures.add(messageIdFuture);

    ApiFutures.addCallback(messageIdFuture, new ApiFutureCallback<String>() {
      @Override
      public void onFailure(Throwable throwable) {
        if (throwable instanceof ApiException) {
          ApiException apiException = ((ApiException) throwable);
          // details on the API exception
          System.out.println(apiException.getStatusCode().getCode());
          System.out.println(apiException.isRetryable());
        }
        System.out.println("Error publishing message : " + message);
      }

      @Override
      public void onSuccess(String messageId) {
        // Once published, returns server-assigned message ids (unique within the topic)
        // System.out.println(messageId);
      }
    }, Executors.newSingleThreadExecutor());

  }

  /**
   * Convert ByteString message to PubSubMessage
   * 
   * @param message
   * @return
   */
  private static PubsubMessage cvtToPubsubMessage(ByteString message) {
    return PubsubMessage.newBuilder().setData(message).build();
  }

}

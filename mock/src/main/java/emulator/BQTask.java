package emulator;

import com.google.cloud.bigquery.BigQuery;
import com.google.cloud.bigquery.BigQueryOptions;
import com.google.cloud.bigquery.Job;
import com.google.cloud.bigquery.JobId;
import com.google.cloud.bigquery.JobInfo;
import com.google.cloud.bigquery.QueryJobConfiguration;
import com.google.cloud.bigquery.TableResult;

import emulator.model.CarInfo;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Queue;
import java.util.UUID;

public class BQTask implements Runnable {
    private BigQuery bq;

    public BQTask() {
        bq = BigQueryOptions.getDefaultInstance().getService();
    }

    @Override
    public void run() {
        System.out.println("Thread BQ: run");
        TableResult result;
        try {
            result = getCarData(createQuery());
            Queue<CarInfo> cars = CarInfo.convert(result.iterateAll());
            System.out.println("車体データの数: " + cars.size());
            Emulator.cars.addAll(cars);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }

    /**
     * List CarInfo from BigQuery
     * 
     * @param queryStr
     * @return
     * @throws InterruptedException
     */
    public TableResult getCarData(String queryStr) throws InterruptedException {
        QueryJobConfiguration queryConfig = QueryJobConfiguration.newBuilder(queryStr).setUseLegacySql(false).build();

        // Create a job ID so that we can safely retry.
        Job queryJob = createJob(queryConfig, JobId.of(UUID.randomUUID().toString()));

        // Wait for the query to complete.
        queryJob = queryJob.waitFor();

        // Check for errors
        if (queryJob == null) {
            throw new RuntimeException("Job no longer exists");
        } else if (queryJob.getStatus().getError() != null) {
            throw new RuntimeException(queryJob.getStatus().getError().toString());
        }

        // return the results.
        System.out.println("results: " + queryJob.getQueryResults().getTotalRows());
        return queryJob.getQueryResults();
    }

    /**
     * Create query for BQ
     * 
     * Get data from 10 minutes after the present.
     * 
     * @return queryString
     */
    public String createQuery() {
        LocalDateTime now = LocalDateTime.now();
        DateTimeFormatter dtf = DateTimeFormatter.ofPattern("HH:mm:ss");
        String[] now_time_str = now.format(dtf).split(":");
        String current_time_str = "DATETIME(2019, 01, 01, " + now_time_str[0] + ", " + now_time_str[1] + ", "
                + now_time_str[2] + ")";

        return "SELECT" + " origin.car_id, driver_id, direction, speed, origin.send_date, status" + " FROM `"
                + System.getenv("BQ_DATASET_NAME") + "." + System.getenv("BQ_TABLE_NAME") + "` AS origin" + " WHERE"
                + " TIMESTAMP(" + current_time_str + ", 'Asia/Tokyo') <= TIMESTAMP(DATETIME(origin.send_date)) AND"
                + " TIMESTAMP(DATETIME_ADD(" + current_time_str
                + ", INTERVAL 10 MINUTE),'Asia/Tokyo') >= TIMESTAMP(DATETIME(origin.send_date))"
                + " ORDER BY origin.send_date ASC";
    }

    /**
     * Create job for BQ
     * 
     * @param config
     * @param jobId
     * @return Job
     */
    private Job createJob(QueryJobConfiguration config, JobId jobId) {
        return bq.create(JobInfo.newBuilder(config).setJobId(jobId).build());
    }
}
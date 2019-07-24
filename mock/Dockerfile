FROM gcr.io/cloud-builders/gradle

ARG PROJECT_ID

COPY gradle/ /root/gradle/
COPY src/ /root/src/
COPY .classpath .project build.gradle gradlew gradlew.bat settings.gradle /root/
COPY credentials.json /root/

ENV GOOGLE_APPLICATION_CREDENTIALS /root/credentials.json
ENV PUBSUB_PROJECT_ID ${PROJECT_ID}
ENV PUBSUB_TOPIC_NAME jptx-upstream
ENV BQ_DATASET_NAME next_taxi_demo
ENV BQ_TABLE_NAME test_data

WORKDIR /root

RUN gradle build

ENTRYPOINT [ "gradle", "run" ]

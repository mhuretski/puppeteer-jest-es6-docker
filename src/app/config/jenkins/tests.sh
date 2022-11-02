#!/bin/bash
#RUN TESTS
if [[ "$CHECK" =~ ^(UI|API|REST|SOAP|SPEC|PERF|TEST)$ ]]; then
  if [[ "$CHECK" == "TEST" ]]; then
    START_FLAG="TEST"
  elif [[ "$CHECK" == "API" ]]; then
    START_FLAG="(API|REST|SOAP)\.[jt]s"
  else
    START_FLAG="($CHECK)\.[jt]s"
  fi
  echo "started with pattern ${START_FLAG}"

  TESTS_CONTAINER="e2e-tests-pipeline-${ENV_TO_CHECK}"

  docker ps -q --filter "name=${TESTS_CONTAINER}" | grep -q . && docker rm -f ${TESTS_CONTAINER}

  docker create --name=${TESTS_CONTAINER} \
  -v ${WORKSPACE}/result:/app/result \
  -v ${WORKSPACE}/src:/app/src \
  -v ${WORKSPACE}/tests:/app/tests \
  --user $(id -u):$(id -g) \
  --network=host \
  mhuretski/puppet-jest-es6 \
  npm test \
  --silent \
  --runInBand \
  --forceExit \
  -- \
  --ENV_TO_CHECK=${ENV_TO_CHECK} \
  --BUILD_NUMBER=${BUILD_NUMBER} \
  ${START_FLAG} \
  --CHECK=${CHECK} \
  --SCREENSHOT=${SCREENSHOT} \
  --DYN_USERNAME=${DYN_USERNAME} \
  --DYN_PASSWORD=${DYN_PASSWORD} \
  --SOAP_USERNAME=${SOAP_USERNAME} \
  --SOAP_PASSWORD=${SOAP_PASSWORD}

  time=$(date '+%Y-%m-%dT%H:%M:%S')
  docker start ${TESTS_CONTAINER}
  docker logs --follow --since ${time} ${TESTS_CONTAINER}
  docker container wait ${TESTS_CONTAINER} >/dev/null
  docker rm ${TESTS_CONTAINER}

  mv ${WORKSPACE}/result/html/report.html ${WORKSPACE}/result/html/report-${CHECK}-${BUILD_NUMBER}.html
  mv ${WORKSPACE}/result/junit/report.xml ${WORKSPACE}/result/junit/report-${CHECK}-${BUILD_NUMBER}.xml
else
  echo "Error! Not specified what to check. Current value: \"$CHECK\" Set valid \"CHECK\" parameter: \"UI|API|REST|SOAP|SPEC|PERF|TEST\"." 1>&2
  exit 1
fi

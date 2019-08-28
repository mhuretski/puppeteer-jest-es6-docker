#!/bin/bash
#EMAIL CONTENT
rm -f ${WORKSPACE}/content.email
rm -f ${WORKSPACE}/subject_and_status.email
touch ${WORKSPACE}/content.email
touch ${WORKSPACE}/subject_and_status.email

run_stats=${WORKSPACE}/result/email/run.stat
. ${run_stats}

BUILD_STATUS="${numPassedTests} passed, ${numFailedTests} failed"
echo "BUILD_STATUS=$BUILD_STATUS" >>${WORKSPACE}/subject_and_status.email
if [[ ! -z "$PARENT_JOB_NAME" ]] && [[ ! -z "$PARENT_BUILD_NUMBER" ]]; then
  EMAIL_SUBJECT="$ENV_TO_CHECK $PARENT_JOB_NAME - Build # $PARENT_BUILD_NUMBER. Test execution - $BUILD_STATUS!"
  echo "EMAIL_SUBJECT=$EMAIL_SUBJECT" >>${WORKSPACE}/subject_and_status.email

  echo "$ENV_TO_CHECK $PARENT_JOB_NAME - Build # $PARENT_BUILD_NUMBER has been checked." >>${WORKSPACE}/content.email
  echo "Executed Tests project $JOB_NAME - Build # $BUILD_NUMBER - $BUILD_STATUS!" >>${WORKSPACE}/content.email
else
  EMAIL_SUBJECT="$ENV_TO_CHECK $JOB_NAME - Build # $BUILD_NUMBER. Test execution - $BUILD_STATUS!"
  echo "EMAIL_SUBJECT=$EMAIL_SUBJECT" >>${WORKSPACE}/subject_and_status.email

  echo "Tests project $JOB_NAME - Build # $BUILD_NUMBER - $BUILD_STATUS!" >>${WORKSPACE}/content.email
fi

echo "" >>${WORKSPACE}/content.email
REPORT=$(cat ${WORKSPACE}/result/email/report.stat)
if [[ ! -z "$REPORT" ]]; then
  echo "Some of the passed tests are now failing!" >>${WORKSPACE}/content.email
  if [[ -z $PARENT_GIT_COMMIT ]]; then
    if [[ "$PARENT_GIT_PREVIOUS_COMMIT" != "$PARENT_GIT_COMMIT" ]]; then
      echo "Range of developer commits: $GIT_PREVIOUS_COMMIT > $GIT_COMMIT." >>${WORKSPACE}/content.email
    else
      echo "Developer commit: $GIT_COMMIT."
    fi
  fi
  if [[ "$GIT_PREVIOUS_COMMIT" != "$GIT_COMMIT" ]]; then
    echo "Range of test commits: $GIT_PREVIOUS_COMMIT > $GIT_COMMIT." >>${WORKSPACE}/content.email
  else
    echo "Test commit: $GIT_COMMIT."
  fi
  echo "List of tests:" >>${WORKSPACE}/content.email
  echo "$(cat ${WORKSPACE}/result/email/report.stat)" >>${WORKSPACE}/content.email
  echo " " >>${WORKSPACE}/content.email
fi

echo "Check console output at $BUILD_URL to view the results." >>${WORKSPACE}/content.email
echo "Check attached report." >>${WORKSPACE}/content.email

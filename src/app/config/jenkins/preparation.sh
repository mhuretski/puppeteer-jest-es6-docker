#!/bin/bash
#CLEAR RESULTS OF PREVIOUS RUN
reports=(
  "${WORKSPACE}"/result/email
  "${WORKSPACE}"/result/html
  "${WORKSPACE}"/result/junit
  "${WORKSPACE}"/content.email
  "${WORKSPACE}"/result/temp
)
for report in "${reports[@]}"; do
  if [[ -e ${report} ]]; then
    rm -rf "${report}"
  fi
done
mkdir -p "${WORKSPACE}"/result

clear_old_reports() {
  if [[ -d "${WORKSPACE}/result/$1" ]]; then
    cd "${WORKSPACE}/result/$1" || return
    COUNT=$(ls -1 | wc -l)
    if [[ ${COUNT} -gt 10 ]]; then
      ((COUNT_TO_DEL = COUNT - 10))
      BUILD_RUN_DIRECTORIES_FOR_DELETION=$(ls -1t | tail -${COUNT_TO_DEL})
      echo "Deleting $1 from old runs: ${BUILD_RUN_DIRECTORIES_FOR_DELETION}"
      rm -rf "${BUILD_RUN_DIRECTORIES_FOR_DELETION}"
    fi
  fi
}

clear_old_reports "images"
clear_old_reports "performance"

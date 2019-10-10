#!/bin/bash
cd "${WORKSPACE}"/result || return
if [ "${ATTACH_SCREEN}" = true ] && [ -d "${WORKSPACE}/result/images/${BUILD_NUMBER}" ]; then
  zip -r report.zip images/"${BUILD_NUMBER}" html
else
  zip -r report.zip html
fi
mv -f report.zip email/report.zip

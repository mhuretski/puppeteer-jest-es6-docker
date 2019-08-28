#!/bin/bash
cd "${WORKSPACE}"/result || return
zip -r report.zip images/"${BUILD_NUMBER}" html
mv -f report.zip email/report.zip

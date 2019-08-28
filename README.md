application for running end-to-end automated test cases using puppeteer, jest, es6, docker

# 1. build or pull image
```bash
docker build -t image-e2e-tests .
docker pull mhuretski/puppet-jest-es6:first
```
# 2. docker start
## 2.1. windows
set windows variables
```bash
SET RESULT_FOLDER=result & SET TEST_FOLDER=tests & SET ABS_PATH=%cd%
```
create folders if not exist
```bash
mkdir %RESULT_FOLDER% & mkdir %TEST_FOLDER%
```
## 2.2. linux
%variable% - use same variables as for windows but with linux syntax 

## 2.3. create 2 containers
```bash
docker create --name="e2e-tests-container" -v "%ABS_PATH%\%TEST_FOLDER%":"/app/%TEST_FOLDER%/" -v "%ABS_PATH%\%RESULT_FOLDER%":"/app/%RESULT_FOLDER%/" -v "%ABS_PATH%\src":/app/src/ image-e2e-tests npm test -exp=%RESULT_FOLDER%
docker create --name="debug-e2e-tests-container" -v "%ABS_PATH%\%TEST_FOLDER%":"/app/%TEST_FOLDER%/" -v "%ABS_PATH%\%RESULT_FOLDER%":"/app/%RESULT_FOLDER%/" -v "%ABS_PATH%\src":/app/src/ image-e2e-tests npm test -exp=%RESULT_FOLDER% --debug
```
## 2.4. run container
```bash
docker start e2e-tests-container
docker start debug-e2e-tests-container
```


# alternative start in nodejs without docker
#### 1. pull dependencies
```bash
npm i
```
#### 2. run
```bash
npm test -exp=result
npm test -exp=result --debug
```

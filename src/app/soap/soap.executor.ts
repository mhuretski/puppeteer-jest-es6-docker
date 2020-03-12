import axios, { AxiosInstance, AxiosResponse } from 'axios/index'
import https from 'https'
import fs from 'fs'
import { parseString } from 'xml2js'
import { SOAP } from '@const/properties/constants'

export const getInstance = (url: string,
        baseURL = SOAP.baseURL,
        rejectUnauthorized = false) => {
  const instance: AxiosInstance = axios.create({
    httpsAgent: new https.Agent({
      rejectUnauthorized: rejectUnauthorized,
    }),
    baseURL: baseURL,
    headers: { 'Content-Type': 'text/xml' },
  })

  return async (requestXML: string, getDataByMask = (json: any) => json)
    : Promise<string[] | undefined> => {
    const data = await instance.post(url, requestXML)
      .then((response: AxiosResponse) => {
        return new Promise((resolve, reject) => {
          parseString(response.data, (err, result) => {
            if (err) {
              reject(err)
            } else {
              resolve(result)
            }
          })
        })
      })
    return getDataByMask(data)
  }
}

export const instance = (baseURL = SOAP.baseURL,
        rejectUnauthorized = false) =>
  axios.create({
    httpsAgent: new https.Agent({
      rejectUnauthorized: rejectUnauthorized,
    }),
    baseURL: baseURL,
    headers: { 'Content-Type': 'text/xml' },
  })

export const execute = async (instance: AxiosInstance, url: string,
  requestXML: string, parseMask = (json: any) => json) => {
  const request = fs.readFileSync(requestXML, 'utf-8')
  const data = await instance.post(url, request)
    .then((response: AxiosResponse) => {
      return new Promise((resolve, reject) => {
        parseString(response.data, (err, result) => {
          if (err) {
            reject(err)
          } else {
            resolve(result)
          }
        })
      })
    })
  return parseMask(data)
}

export const getResponseTag = (arr: string[] | undefined, tag: string | any) =>
  (arr) ? arr[tag][0] : null

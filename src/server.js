import fs from 'fs'
import path from 'path'
import express from 'express'
import enrichment from './imi-enrichment-address/main'

const apiDir = path.join(path.dirname(path.dirname(__filename)), 'docs', 'api')

const getLatLng = (str, callback, errorCallback = () => {}) => {
  try {
    let code = enrichment(str)

    const prefCode = code.substr(0, 2)
    const cityCode = code.substr(0, 5)

    const base = apiDir
    const api = `${base}/${prefCode}/${cityCode}/${code}.json`

    fs.stat(api, e => {
      if (e) {
        return errorCallback(e)
      }
      fs.readFile(api, 'utf8', (e, data) => {
        if (e) {
          return errorCallback(e)
        }
        try {
          const json = JSON.parse(data)
          json.code = code
          callback(json)
        } catch (e) {
          errorCallback(e)
        }
      })
    })
  } catch (e) {
    errorCallback(e)
  }
}

export const app = express()
const port = 3000
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.post('/', (req, res) => {
  const { address } = req.body
  getLatLng(
    address,
    json => {
      res.json(json)
    },
    err => {
      res.status(404).json({ error: err.message })
    },
  )
})

if (require.main === module) {
  app.listen(port)
}

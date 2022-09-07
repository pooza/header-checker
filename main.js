'use strict'
const express = require('express')
const pug = require('pug');
const path = require('path')
const sass = require('sass')
const fs = require('fs')

const app = express()
const listener = app.listen(3000, () => {
  console.log(listener.address())
})

const config = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json')))

const compileTemplate = (template, params) => {
  return pug.compileFile(path.join(__dirname, 'templates', `${template}.pug`), {
    pretty: true,
  })(params)
}

const logRequest = request => {
  console.log({
    method: request.method,
    path: request.path,
    headers: request.headers,
  })
}

app.get('/', (request, response) => {
  logRequest(request)
  response.send(compileTemplate('index', {
    config: config,
    headers: request.headers,
  }))
})

app.get('/style', (request, response) => {
  logRequest(request)
  response.send(sass.compile(path.join(__dirname, 'styles/default.sass')).css)
})


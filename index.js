const loaderUtils = require('loader-utils')
const childProcess = require('child_process')
const { PassThrough } = require('stream')
const { Buffer } = require('buffer')

const LOADER_CONFIG_KEY = 'plantumlFileLoader'

const DEFAULT_CONFIG = {
  publicPath: false,
  outputPath: '',
  name: '[hash]',
  format: 'svg'
}

function bufferAsReadableStream(buffer) {
  const bufferStream = new PassThrough()
  bufferStream.end(buffer)
  return bufferStream
}

module.exports = function PlantUmlFileLoader(plantUmlBuffer = '') {
  // this loader works in async mode and its outputs can be cached
  const callback = this.async()
  this.cacheable && this.cacheable()

  // retrieves the optional query parameters and the optional key of the expected configuration
  let configKey = LOADER_CONFIG_KEY
  let query = {}
  if (this.query) {
    query = loaderUtils.parseQuery(this.query)
    configKey = query.config || LOADER_CONFIG_KEY
  }
  const loaderOptions = this.options[configKey] || {}

  // query takes precedence over than loader options and default config
  const config = Object.assign({}, DEFAULT_CONFIG, loaderOptions, query)

  const url = loaderUtils.interpolateName(this, `${config.outputPath}${config.name}.${config.format}`, {
    context: config.context || this.options.context,
    content: plantUmlBuffer,
    regExp: config.regExp
  })

  // supports dynamic generation of publicPath
  let publicPath = `__webpack_public_path__ + ${JSON.stringify(url)}`
  if (config.publicPath) {
    publicPath = JSON.stringify(
      typeof config.publicPath === 'function'
        ? config.publicPath(url)
        : `${config.publicPath}${url}`
    )
  }

  // pipes the PlantUML file content to the dockerized plantuml
  const umlConversionProcess = childProcess.spawn('docker',
    ['run', '-i', '--rm', 'think/plantuml', '-charset', 'utf8', `-t${config.format}`]
  )
  bufferAsReadableStream(plantUmlBuffer).pipe(umlConversionProcess.stdin)

  const convertedChunks = []
  const errors = []
  umlConversionProcess.stdout.on('data', data => convertedChunks.push(data))
  umlConversionProcess.stderr.on('data', error => errors.push(error))
  umlConversionProcess.on('close', () => {
    if (errors.length > 0) {
      callback(new Error(errors.join(', ')))
    } else {
      this.emitFile(url, Buffer.concat(convertedChunks))
      callback(null, `module.exports = ${publicPath};`)
    }
  })
}

// handles PlantUML contents as buffers
module.exports.raw = true

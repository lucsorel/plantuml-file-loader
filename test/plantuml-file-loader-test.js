const assert = require('assert')
const fs = require('fs')
const path = require('path')
const PlantUmlFileLoader = require('../index.js')

describe('plantuml-file-loader tests suite', () => {
  it('should be defined', () => {
    assert.ok(PlantUmlFileLoader)
  })
  it('should convert PlantUML file content into a SVG file by default', (done) => {
    const testedLoader = {
      options: {}
    }

    // declares a promise on the callback call
    const onCallbackPromise = new Promise((resolve, reject) => {
      testedLoader.async = function() {
        return function(error, webpackExport) {
          if (error) {
            reject(error)
          } else {
            resolve({ webpackExport })
          }
        }
      }
    })

    // declares a promise on the file emission call
    const onEmitFilePromise = new Promise(resolve => {
      testedLoader.emitFile = function(url, buffer) {
        resolve({ url, buffer })
      }
    })

    const sourceBuffer = fs.readFileSync(path.join(__dirname, 'source.puml'))
    PlantUmlFileLoader.call(testedLoader, sourceBuffer)

    const expectedBuffer = fs.readFileSync(path.join(__dirname, 'expected.svg'))

    // removes unique ids in svg documents
    const sanitizeSvgBuffer = buffer => buffer.toString().replace(/id="[^"]+"/g, '').replace(/"url([^)]+)/g, '')

    Promise.all([onCallbackPromise, onEmitFilePromise]).then(
      ([{ webpackExport }, { url, buffer }]) => {
        assert.equal(webpackExport, 'module.exports = __webpack_public_path__ + "c961d3f899f1fca584ab9aaea509f965.svg";')
        assert.equal(url, 'c961d3f899f1fca584ab9aaea509f965.svg')
        assert.equal(sanitizeSvgBuffer(expectedBuffer), sanitizeSvgBuffer(buffer))
        done()
      }
    ).catch(error => done(error))
  })
  // the docker startup may take some time
    .timeout(8000)
})

<div align="center">
  <a href="https://en.wikipedia.org/wiki/Markdown" target="_blank">
    <img width="116px" height="112px" alt="PlantUML logo" src="http://s.plantuml.com/logoc.png" style="margin-bottom: 40px" vspace="40px" />
  </a>
  <a href="https://github.com/webpack/webpack" target="_blank">
    <img width="130px" height="130px" alt="Webpack logo"
      src="https://webpack.js.org/assets/icon-square-big.svg" />
  </a>
  <h1>PlantUML file loader</h1>
</div>

**Converts PlantUML files into images during the webpack processing.**

The image conversion is inspired by the
Yury Korolev's [plantuml-loader](https://github.com/yury/plantuml-loader) which uses a dockerized version of [PlantUML](http://plantuml.com/), which includes [GraphViz](http://graphviz.org/) for the image generation. However this loader:

* uses ES6 syntax
* involves non-blocking methods and abstractions (streams and buffers) to perform the generation
* produces image files instead of returning the generated file content (that may come later as an option if needed)

# Installation

Install the `plantuml-file-loader`:

```sh
# via yarn
yarn add -D webpack plantuml-file-loader

# via npm
npm i -D webpack plantuml-file-loader
```

In your `webpack.config.js` file:

```js
module.exports = {
  // ...
  module: {
    rules: [
      // ...
      {
        test: /\.p?uml$/,
        use: 'plantuml-file-loader?format=svg&outputPath=img/'
      },
      // ...
    ]
  },
  // ...
}
```

The `format` can be any of those supported by PlantUML: see the `-t` formats in the [command-line Help section](http://plantuml.com/command-line).

# Use cases

## Web-based slideshows

Combine this loader with the [markdown-image-loader](https://github.com/lucsorel/markdown-image-loader/blob/master/README.md#web-based-slideshows) to build slideshows based on `markdown` documents. In your markdown file, simply refer to PlantUML source files and they will be converted into images (in SVG format by default, which can be zoomed-in without aliasing).

* the `my-class-diagram.puml` PlantUML file:

```
@startuml
class Car

Driver - Car : drives >
Car *- Wheel : have 4 >
Car -- Person : < owns

@enduml
```

* your `slideshow.md` markdown document:

```
# Class-diagram slide

The class diagram is as follows:

![](img/my-class-diagram.puml)
```

And the diagram will be displayed as a real image in your slideshow:

![](http://s.plantuml.com/imgp/1c6-class-diagram-004.png)

# Unit tests

Unit tests can be run with the `npm test` command.

Despite these efforts, should you find an issue or spot a vital feature, you are welcome to report bugs and submit code requests!

# Changelog
* **1.0.0**: initial version

# License

May be freely distributed under the [MIT license](https://github.com/lucsorel/markdown-image-loader/blob/master/LICENSE).

Copyright (c) 2017 Luc Sorel

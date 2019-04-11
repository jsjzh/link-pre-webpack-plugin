const webpack = require('webpack')
const config = require('./webpack.config')

webpack(config, (err, stats) => {
  if (err || stats.hasErrors()) console.error(err)
  process.stdout.write(
    stats.toString({
      colors: true,
      modules: true
    })
  )
})

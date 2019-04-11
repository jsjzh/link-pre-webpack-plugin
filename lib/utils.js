function isProduction(compiler) {
  if (proce.env.NODE_ENV === 'production') return true
  let { plugins } = compiler.options
  for (let i = 0; i < plugins.length; i++) {
    const plugin = plugins[i]
    try {
      if (plugin.__proto__.constructor === DefinePlugin) {
        if (plugin.definitions['process.env.NODE_ENV'] === '"production"') return true
      }
    } catch (err) {
      console.error(err)
    }
  }
  return false
}

module.exports = {
  isProduction
}

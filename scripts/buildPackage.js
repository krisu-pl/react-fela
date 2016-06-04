import rollup from 'rollup'
import babel from 'rollup-plugin-babel'
import uglify from 'rollup-plugin-uglify'

// Small helper to error and exit on fail
const errorOnFail = err => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
}

const babelPlugin = babel({
  babelrc: false,
  presets: [ 'es2015-rollup', 'stage-0' ],
  plugins: [ 'transform-dev-warning', 'transform-node-env-inline' ]
})
const uglifyPlugin = uglify()

const plugins = [ babelPlugin ]

function rollupConfig(minify) {
  return {
    entry: 'modules/index.js',
    plugins: minify ? plugins.concat(uglifyPlugin) : plugins
  }
}

function bundleConfig(minify) {
  return {
    format: 'umd',
    globals: {
      react: 'React'
    },
    moduleName: 'ReactFela',
    dest: 'dist/react-fela' + (minify ? '.min' : '') + '.js',
    sourceMap: !minify
  }
}

rollup.rollup(rollupConfig(process.env.NODE_ENV === 'production')).then(bundle => {
  bundle.write(bundleConfig(process.env.NODE_ENV === 'production'))
  console.log('Successfully bundled ReactFela' + (process.env.NODE_ENV === 'production' ? ' (minified).' : '.'))
}).catch(errorOnFail)
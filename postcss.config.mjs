import autoprefixer from 'autoprefixer'
import presetEnv from 'postcss-preset-env'
import hoverMediaFeature from 'postcss-hover-media-feature'
import postcssGlobalData from '@csstools/postcss-global-data'

export default {
   plugins: [
      postcssGlobalData({
         files: ['assets/css/global.css']
      }),
      presetEnv({
         stage: 3,
         features: {
            'nesting-rules': true,
            'custom-media-queries': true
         }
      }),
      autoprefixer(),
      hoverMediaFeature()
   ]
}

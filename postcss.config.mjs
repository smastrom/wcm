import autoprefixer from 'autoprefixer'
import presetEnv from 'postcss-preset-env'
import hoverMediaFeature from 'postcss-hover-media-feature'
import postcssGlobalData from '@csstools/postcss-global-data'
import apply from 'postcss-apply'

export default {
   plugins: [
      postcssGlobalData({
         files: ['assets/css/global.css', 'assets/css/rules.css']
      }),
      presetEnv({
         stage: 3,
         features: {
            'nesting-rules': true,
            'custom-media-queries': true
         }
      }),
      apply(),
      autoprefixer(),
      hoverMediaFeature()
   ]
}

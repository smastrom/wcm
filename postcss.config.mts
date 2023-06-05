import autoprefixer from 'autoprefixer'
import presetEnv from 'postcss-preset-env'
import hoverMediaFeature from 'postcss-hover-media-feature'

export default {
   plugins: [
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

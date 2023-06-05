import autoprefixer from 'autoprefixer'
import presetEnv from 'postcss-preset-env'
import jitProps from 'postcss-jit-props'
import hoverMediaFeature from 'postcss-hover-media-feature'

import OpenProps from 'open-props'

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
      hoverMediaFeature(),
      jitProps(OpenProps)
   ]
}

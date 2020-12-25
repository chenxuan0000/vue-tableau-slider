# Usage

## Register Component

```javascript
// **main.js**
// 1.golbal install
import Vue from 'vue'
import vueTableauSlider from 'vue-tableau-slider'
Vue.use(vueTableauSlider)

// Or you can set the globally registered component name yourself. The default registered component name is vue-tableau-slider
Vue.use(vueTableauSlider,{componentName: 'scroll-seamless'})

// 2.install alone
<script>
  import vueTableauSlider from 'vue-tableau-slider'
   export default {
      components: {
        vueTableauSlider
      }
   }
</script>
```

## Use Component

```vue
<template>
  <vue-tableau-slider />
</template>

<script>
  import vueTableauSlider from 'vue-tableau-slider'

  export default {
    name: 'Example01Basic',
    components: {
      vueTableauSlider
    },
  }
</script>
```

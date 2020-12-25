# 07 - slace缩放

<ClientOnly>
<Example07Basic></Example07Basic>
</ClientOnly>

```vue
<template>
  <div :style="divStyle">
    <vue-tableau-slider :cssScale="+cssScale" v-model="values" />
    <div style="display: flex">
      <div>缩放倍数: <input v-model="cssScale" /></div>
    </div>
  </div>
</template>

<script>
  import vueTableauSlider from 'vue-tableau-slider'

  export default {
    name: 'Example06Basic',
    data () {
      return {
        cssScale: 1,
        values: [10, 50],
      }
    },
    computed: {
      divStyle () {
        return {
          transform: `scale(${this.cssScale})`
        }
      },
    },
    components: {
      vueTableauSlider
    },
  }
</script>
```

# 使用

## 注册组件

```javascript
// **main.js**
// 1.全局 install
import Vue from 'vue'
import scroll from 'vue-tableau-slider'
Vue.use(scroll)

// 或者你可以自己设置全局注册的组件名 默认注册的组件名是 vue-tableau-slider
Vue.use(scroll,{componentName: 'scroll-seamless'})

// 2.单个.vue文件局部注册
<script>
  import vueTableauSlider from 'vue-tableau-slider'
   export default {
      components: {
        vueTableauSlider
      }
   }
</script>
```

## 使用组件

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

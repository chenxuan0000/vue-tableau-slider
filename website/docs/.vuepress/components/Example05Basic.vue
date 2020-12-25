<template>
  <div>
    <vue-tableau-slider :min="+min" :max="+max" :step="+step" v-model="values" />
    <div style="display: flex">
      <div>min: <input v-model="min" /></div>
      <div>max: <input v-model="max" /></div>
      <div>step: <input v-model="step" /></div>
    </div>
  </div>
</template>

<script>
  import vueTableauSlider from 'vue-tableau-slider'

  export default {
    name: 'Example05Basic',
    data () {
      return {
        min: 0,
        max: 100,
        step: 1,
        values: [10, 50],
      }
    },
    components: {
      vueTableauSlider
    },
  }
</script>
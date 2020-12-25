<template>
  <vue-tableau-slider v-model="values" :sliderType="sliderType" />
</template>

<script>
  import vueTableauSlider from 'vue-tableau-slider'

  export default {
    name: 'Example03Basic',
    data () {
      return {
        values: [10,50],
        sliderType: 2
      }
    },
    components: {
      vueTableauSlider
    },
  }
</script>
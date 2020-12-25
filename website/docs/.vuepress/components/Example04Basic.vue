<template>
  <vue-tableau-slider v-model="values" :sliderType="sliderType" />
</template>

<script>
  import vueTableauSlider from 'vue-tableau-slider'

  export default {
    name: 'Example04Basic',
    data () {
      return {
        values: [10,50],
        sliderType: 3
      }
    },
    components: {
      vueTableauSlider
    },
  }
</script>
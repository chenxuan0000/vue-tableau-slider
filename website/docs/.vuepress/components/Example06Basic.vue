<template>
  <div>
    <vue-tableau-slider :trackColor="trackColor" :innerTrackColor="innerTrackColor" v-model="values" />
    <div style="display: flex">
      <div>外轨道: <input v-model="trackColor" /></div>
      <div>内轨道: <input v-model="innerTrackColor" /></div>
    </div>
  </div>
</template>

<script>
  import vueTableauSlider from 'vue-tableau-slider'

  export default {
    name: 'Example06Basic',
    data () {
      return {
        trackColor: '#e6e6e6',
        innerTrackColor: '#cbcbcb',
        values: [10, 50],
      }
    },
    components: {
      vueTableauSlider
    },
  }
</script>
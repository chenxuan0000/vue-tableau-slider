import Slider from "./Slider.vue";

Slider.install = function (Vue, options = {}) {
  Vue.component(options.componentName || Slider.name, Slider);
};

if (typeof window !== "undefined" && window.Vue) {
  Vue.component(Slider.name, Slider);
}

export default Slider;
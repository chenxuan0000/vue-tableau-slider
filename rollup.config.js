import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import vuePlugin from "rollup-plugin-vue";
import babel from "rollup-plugin-babel";
import { uglify } from "rollup-plugin-uglify";

export default {
  input: "src/index.js",
  output: {
    exports: "named",
    name: "vueTableauSlider",
    file: "dist/vue-tableau-slider.min.js",
    format: "umd",
  },
  plugins: [
    resolve({ extensions: [".vue"] }),
    commonjs(),
    uglify(),
    vuePlugin({}),
    babel({}),
  ],
};

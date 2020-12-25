<template>
  <div class="tableau-slider">
    <div
      class="tableau-slider-rangeinput"
      :class="{ disabled: rangeinputDisabled }"
    >
      <input
        :class="{ disabled: isDragging }"
        type="text"
        :value="minInputVal"
        @change="minInputValChange"
        @focus="hanlderInputFocus"
        @keyup.enter="handlerInputBlur"
        :disabled="tableauSliderType === '至多' || rangeinputDisabled"
        placeholder="输入最小值"
      />
      <input
        :class="{ disabled: isDragging }"
        type="text"
        :value="maxInputVal"
        @change="maxInputValChange"
        @focus="hanlderInputFocus"
        @keyup.enter="handlerInputBlur"
        :disabled="tableauSliderType === '至少' || rangeinputDisabled"
        placeholder="输入最大值"
      />
    </div>
    <div class="tableau-slider-range" ref="slider">
      <div class="tableau-slider-track" :style="{ background: trackColor }">
        <slider-track
          :track-cursor="trackCursor"
          :tableau-slider-type="tableauSliderType"
          :style="{ background: innerTrackColor }"
          @onDragging="isDragging = true"
          @onDragEnd="_initState"
        ></slider-track>
        <slider-button
          v-if="tableauSliderType !== '至多'"
          class="tableau-slider-btn btn-min"
          v-model="minInputVal"
          type="min"
          :tableau-slider-type="tableauSliderType"
          @onDragging="handlerBtnDragging"
          @onDragEnd="minBtnDragEnd"
        >
          <slot name="slider-btn-min">
            <b :style="minBtnStyle" class="dragable"></b>
          </slot>
        </slider-button>
        <slider-button
          v-if="tableauSliderType !== '至少'"
          class="tableau-slider-btn btn-max"
          v-model="maxInputVal"
          type="max"
          :tableau-slider-type="tableauSliderType"
          @onDragging="handlerBtnDragging"
          @onDragEnd="maxBtnDragEnd"
        >
          <slot name="slider-btn-max">
            <b :style="maxBtnStyle" class="dragable"></b>
          </slot>
        </slider-button>
      </div>
    </div>
  </div>
</template>

<script>
  import SliderButton from './SliderButton';
  import SliderTrack from './SliderTrack';
  const SLIDERTYPEMAP = {
    1: '值范围',
    2: '至少',
    3: '至多',
  }

  export default {
    name: 'BaseSlider',
    components: {
      SliderButton,
      SliderTrack
    },
    props: {
      min: {
        type: Number,
        default: 0
      },
      max: {
        type: Number,
        default: 100
      },
      value: {
        type: Array,
        default: () => [0, 100]
      },
      sliderType: {
        type: Number,
        default: 1
      },
      step: {
        type: Number,
        default: 1
      },
      trackColor: {
        type: String,
        default: '#e6e6e6'
      },
      innerTrackColor: {
        type: String,
        default: '#cbcbcb'
      },
      rangeinputDisabled: {
        type: Boolean,
        default: false
      },
      cssScale: {
        type: Number,
        default: 1
      },
      sliderBtnWidth: {
        type: Number,
        default: 10
      },
    },
    data () {
      return {
        minInputVal: this.value[0],
        maxInputVal: this.value[1],
        oldInputValList: [],
        realMin: this.min,
        realMax: this.max,
        sliderSize: 1,
        trackCursor: 'grabbing',
        isDragging: false
      }
    },
    computed: {
      tableauSliderType () {
        return SLIDERTYPEMAP[this.sliderType] || '值范围'
      },
      precision () {
        let precisions = [this.min, this.max, this.step].map(item => {
          let decimal = ('' + item).split('.')[1];
          return decimal ? decimal.length : 0;
        });
        return Math.max.apply(null, precisions);
      },
      realMinInputVal () {
        return this._getInputNumber(this.minInputVal)
      },
      realMaxInputVal () {
        return this._getInputNumber(this.maxInputVal)
      },
      inputValList () {
        return [this.realMinInputVal, this.realMaxInputVal]
      },
      minBtnStyle () {
        return {
          width: `${this.sliderBtnWidth}px`,
          marginLeft: `-${this.sliderBtnWidth}px`,
        }
      },
      maxBtnStyle () {
        return {
          width: `${this.sliderBtnWidth}px`,
        }
      }
    },
    watch: {
      value () {
        this.minInputVal = this.value[0]
        this.maxInputVal = this.value[1]
      },
      min () {
        this._initState();
        this._fixInputVals();
      },
      max () {
        this._initState();
        this._fixInputVals();
      },
      tableauSliderType () {
        this._fixInputVals()
      }
    },
    methods: {
      resetSize () {
        if (this.$refs.slider) {
          // 修正scale带来的鼠标操作偏差效果
          const scale = this.cssScale
          this.sliderSize = parseInt(this.$refs.slider['clientWidth'] * scale, 10) - this.sliderBtnWidth * 2;
        }
      },
      handlerInput () {
        this.$emit("input", this.inputValList);
      },
      handlerChange () {
        // 和历史值比较有更新的情况下触发emit-change
        if (this._inputValListChanged()) {
          setTimeout(() => {
            this.$emit('change', this.inputValList);
            this.oldInputValList = this.inputValList
          }, 20);
        }
      },
      minInputValChange (e) {
        const val = e.target.value
        if (this._getInputNumber(val) > this.maxInputVal) {
          [this.minInputVal, this.maxInputVal] = [this.maxInputVal, val]
        } else {
          this.minInputVal = val
        }
        this._initState()
        this.handlerInput()
        this.handlerChange()
      },
      maxInputValChange (e) {
        const val = e.target.value
        if (this._getInputNumber(val) < this.minInputVal) {
          [this.minInputVal, this.maxInputVal] = [val, this.minInputVal]
        } else {
          this.maxInputVal = val
        }
        this._initState()
        this.handlerInput()
        this.handlerChange()
      },
      hanlderInputFocus (e) {
        e.currentTarget.select()
      },
      handlerInputBlur (e) {
        e.currentTarget.blur()
      },
      minBtnDragEnd () {
        this.trackCursor = 'grabbing'
        this._initState()
      },
      handlerBtnDragging () {
        this.trackCursor = 'ew-resize';
        this.isDragging = true
      },
      maxBtnDragEnd () {
        this.trackCursor = 'grabbing'
        this._initState()
      },
      handlerInputListBlur () {
        this.$el.querySelectorAll('input').forEach(input => {
          input.blur()
        })
      },
      _initState () {
        this.realMin = Math.min(this.min, this.realMinInputVal)
        this.realMax = Math.max(this.max, this.realMaxInputVal)
        this.isDragging = false
      },
      _isSameArray (arr, oldArr) {
        return arr.every((item, index) => item === oldArr[index])
      },
      _getInputNumber (value) {
        let val = +value
        if (isNaN(val)) {
          val = 0
        }
        return val
      },
      _fixInputVals () {
        const tableauSliderType = this.tableauSliderType
        if (tableauSliderType === '至少') {
          this.maxInputVal = this.max
        } else if (tableauSliderType === '至多') {
          this.minInputVal = this.min
        }
      },
      _inputValListChanged () {
        return !this.inputValList
          .every((item, index) => item === this.oldInputValList[index]);
      },
    },
    mounted () {
      this.resetSize();
    },
    created () {
      this._fixInputVals()
    },
  }
</script>

<style lang="scss">
  .tableau-slider {
    margin: 0 auto;
    &-rangeinput {
      position: relative;
      overflow: hidden;
      &.disabled {
        input[disabled] {
          opacity: 1;
          color: #333 !important;
          height: 16px;
          line-height: 16px;
        }
      }
      input[type="text"] {
        width: 50%;
        height: 26px;
        float: left;
        padding: 2px;
        line-height: 26px;
        font-size: 13px;
        border: 1px solid transparent;
        background-color: #fff;
        box-sizing: border-box;
        &:hover {
          border-color: rgba(0, 0, 0, 0.3);
        }
        &:focus {
          outline: none;
          font-size: 13.5px;
          border-color: rgba(0, 0, 0, 0.5);
        }
        &.disabled {
          user-select: none;
          border-color: transparent;
          opacity: 1;
        }
        &[disabled] {
          user-select: none;
          border: none;
          opacity: 0.6;
        }
        + input {
          float: right;
          text-align: right;
        }
      }
    }
    &-range,
    &-rangeinput {
      margin: 3px 0;
    }
    &-track {
      position: relative;
      height: 4px;
      margin-top: 9px;
      border-color: #fff;
    }
    &-innertrack {
      overflow: hidden;
      position: relative;
      height: 100%;
      &:focus {
        outline: none;
      }
    }
    &-range {
      position: relative;
      height: 20px;
      overflow: hidden;
      padding: 0 10px;
      user-select: none;
      margin-left: 0;
      margin-right: 0;
    }
    &-btn {
      position: absolute;
      top: -5px;
      z-index: 90;
      &.btn-min {
        left: 0;
        b.dragable {
          border-bottom-left-radius: 6.5px;
          border-top-left-radius: 6.5px;
        }
      }
      &.btn-max {
        left: 100%;
        b.dragable {
          border-bottom-right-radius: 6.5px;
          border-top-right-radius: 6.5px;
        }
      }
      b.dragable {
        display: block;
        height: 14px;
        cursor: ew-resize;
        border: 1px solid #666;
        background-color: #fff;
        box-sizing: border-box;
      }
    }
  }
</style>

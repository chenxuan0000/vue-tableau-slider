<template>
  <div
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
    @mousedown="onButtonDown"
    @touchstart="onButtonDown"
    class="tableau-slider-innertrack"
    :class="{ hover: hovering, dragging: dragging }"
    :style="wrapperStyle"
    ref="button"
    tabindex="0"
    @focus="handleMouseEnter"
    @blur="handleMouseLeave"
    @keydown.left="onLeftKeyDown"
    @keydown.right="onRightKeyDown"
    @keydown.down.prevent="onLeftKeyDown"
    @keydown.up.prevent="onRightKeyDown"
  ></div>
</template>

<script>

  export default {
    name: 'SliderTrack',
    props: {
      trackCursor: {
        type: String,
        default: 'grabbing'
      },
      tableauSliderType: {
        type: String,
      },
    },

    data () {
      return {
        hovering: false,
        dragging: false,
        isClick: false,
        startX: 0,
        currentX: 0,
        startY: 0,
        currentY: 0,
        minStartPosition: 0,
        maxStartPosition: 0,
        minNewPosition: null,
        maxNewPosition: null,
      };
    },

    computed: {
      disabled () {
        return this.$parent.sliderDisabled;
      },

      max () {
        return this.$parent.realMax;
      },

      min () {
        return this.$parent.realMin;
      },

      minInputVal () {
        return this.$parent.minInputVal;
      },

      maxInputVal () {
        return this.$parent.maxInputVal;
      },

      step () {
        return this.$parent.step;
      },

      precision () {
        return this.$parent.precision;
      },

      diffWidth () {
        return `${(this.maxInputVal - this.minInputVal) / (this.max - this.min) * 100}%`;
      },

      currentMinPosition () {
        return `${(this.minInputVal - this.min) / (this.max - this.min) * 100}%`;
      },

      currentMaxPosition () {
        return `${(this.maxInputVal - this.min) / (this.max - this.min) * 100}%`;
      },

      isRange () {
        return this.tableauSliderType === '值范围';
      },

      wrapperStyle () {
        switch (this.tableauSliderType) {
          case '值范围':
            return {
              left: this.currentMinPosition,
              width: this.diffWidth,
              cursor: this.trackCursor,
            }
          case '至少':
            return {
              left: this.currentMinPosition,
              width: `${(this.max - this.minInputVal) / (this.max - this.min) * 100}%`,
            }
          case '至多':
            return {
              left: 0,
              width: this.currentMaxPosition,
            }
          default:
            return {};
        }
      }
    },

    watch: {
      dragging (val) {
        this.$parent.dragging = val;
      }
    },

    methods: {

      handleMouseEnter () {
        this.hovering = true;
      },

      handleMouseLeave () {
        this.hovering = false;
      },

      onButtonDown (event) {
        if (!this.isRange) return
        if (this.disabled) return;
        event.preventDefault();
        this.onDragStart(event);
        document.body.style.cursor = "grabbing"
        this.$parent.handlerInputListBlur()
        document.addEventListener('mousemove', this.onDragging);
        document.addEventListener('touchmove', this.onDragging);
        document.addEventListener('mouseup', this.onDragEnd);
        document.addEventListener('touchend', this.onDragEnd);
        document.addEventListener('contextmenu', this.onDragEnd);
      },
      _setStartState () {
        this.minStartPosition = parseFloat(this.currentMinPosition);
        this.maxStartPosition = parseFloat(this.currentMaxPosition);
        this.minNewPosition = this.minStartPosition;
        this.maxNewPosition = this.maxStartPosition;
      },
      onLeftKeyDown () {
        if (this.disabled) return;
        this._setStartState();
        this.setPosition([this.minNewPosition, this.maxNewPosition]);
      },
      onRightKeyDown () {
        if (this.disabled) return;
        this._setStartState();
        this.setPosition([this.minNewPosition, this.maxNewPosition]);
      },
      onDragStart (event) {
        this.dragging = true;
        this.isClick = true;
        if (event.type === 'touchstart') {
          event.clientY = event.touches[0].clientY;
          event.clientX = event.touches[0].clientX;
        }
        this.startX = event.clientX;
        this._setStartState();
      },

      onDragging (event) {
        if (this.dragging) {
          this.isClick = false;
          let diff = 0;
          this.$parent.resetSize();
          if (event.type === 'touchmove') {
            event.clientY = event.touches[0].clientY;
            event.clientX = event.touches[0].clientX;
          }
          this.currentX = event.clientX;
          diff = (this.currentX - this.startX) / this.$parent.sliderSize * 100;
          this.minNewPosition = this.minStartPosition + diff
          this.maxNewPosition = this.maxStartPosition + diff
          this.$emit('onDragging')
          this.setPosition([this.minNewPosition, this.maxNewPosition]);
        }
      },

      onDragEnd () {
        if (this.dragging) {
          setTimeout(() => {
            this.dragging = false;
            if (!this.isClick) {
              this.setPosition([this.minNewPosition, this.maxNewPosition]);
            }

            // onDragEnd放到校正setPosition后面
            this.$emit('onDragEnd')
          }, 0);

          document.body.style.cursor = ""
          this.$parent.handlerChange()
          document.removeEventListener('mousemove', this.onDragging);
          document.removeEventListener('touchmove', this.onDragging);
          document.removeEventListener('mouseup', this.onDragEnd);
          document.removeEventListener('touchend', this.onDragEnd);
          document.removeEventListener('contextmenu', this.onDragEnd);
        }
      },
      _getValueByNewPos (newPosition) {
        if (newPosition === null || isNaN(newPosition)) return;
        const lengthPerStep = 100 / ((this.max - this.min) / this.step);
        const steps = Math.round(newPosition / lengthPerStep);
        let value = steps * lengthPerStep * (this.max - this.min) * 0.01 + this.min;
        return parseFloat(value.toFixed(this.precision));
      },
      setPosition (newPosition) {
        let firstVal = this._getValueByNewPos(newPosition[0]);
        let secendVal = this._getValueByNewPos(newPosition[1]);

        // 边界碰撞💥触底
        if (firstVal < this.min) {
          firstVal = this.min;
          secendVal = this.maxInputVal
        }
        if (secendVal > this.max) {
          secendVal = this.max;
          firstVal = this.minInputVal
        }

        this.$parent.minInputVal = firstVal;
        this.$parent.maxInputVal = secendVal;
        setTimeout(() => {
          this.$parent.handlerInput()
        }, 0);
      }
    }
  };
</script>

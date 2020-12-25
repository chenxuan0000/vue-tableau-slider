<template>
  <div
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
    @mousedown="onButtonDown"
    @touchstart="onButtonDown"
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
  >
    <slot />
  </div>
</template>

<script>

  export default {
    name: 'SliderButton',
    props: {
      value: {
        type: [Number, String],
        default: 0
      },
      type: {
        type: String,
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
        startPosition: 0,
        newPosition: null,
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

      currentPosition () {
        return `${(this.value - this.min) / (this.max - this.min) * 100}%`;
      },

      isRange () {
        return this.tableauSliderType === '值范围';
      },

      wrapperStyle () {
        return { left: this.currentPosition };
      },
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
        if (this.disabled) return;
        event.preventDefault();
        this.onDragStart(event);
        document.body.style.cursor = "ew-resize"
        this.$parent.handlerInputListBlur()
        document.addEventListener('mousemove', this.onDragging);
        document.addEventListener('touchmove', this.onDragging);
        document.addEventListener('mouseup', this.onDragEnd);
        document.addEventListener('touchend', this.onDragEnd);
        document.addEventListener('contextmenu', this.onDragEnd);
      },
      onLeftKeyDown () {
        if (this.disabled) return;
        this.newPosition = parseFloat(this.currentPosition) - this.step / (this.max - this.min) * 100;
        this.setPosition(this.newPosition);
      },
      onRightKeyDown () {
        if (this.disabled) return;
        this.newPosition = parseFloat(this.currentPosition) + this.step / (this.max - this.min) * 100;
        this.setPosition(this.newPosition);
      },
      onDragStart (event) {
        this.dragging = true;
        this.isClick = true;
        if (event.type === 'touchstart') {
          event.clientY = event.touches[0].clientY;
          event.clientX = event.touches[0].clientX;
        }
        this.startX = event.clientX;
        this.startPosition = parseFloat(this.currentPosition);
        this.newPosition = this.startPosition;
      },

      onDragging (event) {
        if (this.dragging) {
          this.isClick = false;
          this.$parent.resetSize();
          let diff = 0;
          if (event.type === 'touchmove') {
            event.clientY = event.touches[0].clientY;
            event.clientX = event.touches[0].clientX;
          }
          this.currentX = event.clientX;
          diff = (this.currentX - this.startX) / this.$parent.sliderSize * 100;
          this.newPosition = this.startPosition + diff;
          this.$emit('onDragging')
          this.setPosition(this.newPosition);
        }
      },

      onDragEnd () {
        if (this.dragging) {
          /*
           * 防止在 mouseup 后立即触发 click，导致滑块有几率产生一小段位移
           * 不使用 preventDefault 是因为 mouseup 和 click 没有注册在同一个 DOM 上
           */
          setTimeout(() => {
            this.dragging = false;
            if (!this.isClick) {
              this.setPosition(this.newPosition);
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

      setPosition (newPosition) {
        if (newPosition === null || isNaN(newPosition)) return;
        const lengthPerStep = 100 / ((this.max - this.min) / this.step);

        const steps = Math.round(newPosition / lengthPerStep);
        let value = steps * lengthPerStep * (this.max - this.min) * 0.01 + this.min;
        value = parseFloat(value.toFixed(this.precision));

        // 防越界
        if (this.type === 'max') {
          if (value < this.minInputVal) {
            value = this.minInputVal
          } else if (value > this.max) {
            value = this.max
          }
        }

        if (this.type === 'min') {
          if (value > this.maxInputVal) {
            value = this.maxInputVal
          } else if (value < this.min) {
            value = this.min
          }
        }

        this.$emit('input', value);
        setTimeout(() => {
          this.$parent.handlerInput()
        }, 0);
      }
    }
  };
</script>

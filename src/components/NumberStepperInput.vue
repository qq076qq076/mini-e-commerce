<template>
  <div class="number-stepper">
    <button
      class="step-btn"
      type="button"
      aria-label="減少數量"
      :disabled="disabled || numericValue <= min"
      @click="decrease"
    >
      −
    </button>
    <input
      :id="id"
      class="stepper-input"
      type="number"
      :min="min"
      :step="step"
      :required="required"
      :disabled="disabled"
      :value="displayValue"
      :data-test="inputDataTest"
      @input="handleInput"
      @change="handleChange"
      @blur="normalizeOnBlur"
    />
    <button class="step-btn" type="button" aria-label="增加數量" :disabled="disabled" @click="increase">
      +
    </button>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'NumberStepperInput',
  props: {
    value: {
      type: [Number, String],
      required: true
    },
    min: {
      type: Number,
      default: 1
    },
    step: {
      type: Number,
      default: 1
    },
    id: {
      type: String,
      default: ''
    },
    required: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    inputDataTest: {
      type: String,
      default: ''
    }
  },
  computed: {
    numericValue(): number {
      const parsedValue: number = Number(this.value)

      return Number.isFinite(parsedValue) ? parsedValue : this.min
    },
    displayValue(): string {
      return `${this.value}`
    }
  },
  methods: {
    normalizeValue(value: number): number {
      if (!Number.isFinite(value)) {
        return this.min
      }

      return Math.max(this.min, Math.floor(value))
    },
    emitNormalizedValue(value: number): void {
      const nextValue: number = this.normalizeValue(value)

      this.$emit('input', nextValue)
      this.$emit('change', nextValue)
    },
    decrease(): void {
      const nextValue: number = this.numericValue - this.step

      this.emitNormalizedValue(nextValue)
    },
    increase(): void {
      const nextValue: number = this.numericValue + this.step

      this.emitNormalizedValue(nextValue)
    },
    handleInput(event: Event): void {
      const inputElement: HTMLInputElement | null = event.target as HTMLInputElement | null
      const parsedValue: number = Number(inputElement ? inputElement.value : '')

      this.emitNormalizedValue(parsedValue)
    },
    handleChange(event: Event): void {
      const inputElement: HTMLInputElement | null = event.target as HTMLInputElement | null
      const parsedValue: number = Number(inputElement ? inputElement.value : '')

      this.emitNormalizedValue(parsedValue)
    },
    normalizeOnBlur(): void {
      this.emitNormalizedValue(this.numericValue)
    }
  }
})
</script>

<style lang="scss" scoped>
.number-stepper {
  display: grid;
  grid-template-columns: 34px minmax(0, 1fr) 34px;
  align-items: stretch;
  border: 1px solid #cfdbeb;
  border-radius: 10px;
  overflow: hidden;
  background: #ffffff;
}

.step-btn {
  border: none;
  color: #2b4466;
  font-size: 20px;
  line-height: 1;
  background: #edf3fb;
  cursor: pointer;
}

.step-btn:hover:enabled {
  background: #dceafc;
}

.step-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.stepper-input {
  border: none;
  width: 100%;
  min-width: 0;
  padding: 8px 10px;
  color: #1f2c40;
  font-size: 14px;
  text-align: center;
  outline: none;
}

.stepper-input::-webkit-outer-spin-button,
.stepper-input::-webkit-inner-spin-button {
  margin: 0;
  -webkit-appearance: none;
}

.stepper-input[type='number'] {
  -moz-appearance: textfield;
}
</style>

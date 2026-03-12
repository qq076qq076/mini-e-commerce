<template>
  <transition name="toast-fade">
    <div v-if="visible" class="toast" data-test="toast" role="status" aria-live="polite">
      <span class="toast-icon" aria-hidden="true">✓</span>
      <p class="toast-message">{{ message }}</p>
    </div>
  </transition>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'AppToast',
  props: {
    visible: {
      type: Boolean,
      required: true
    },
    message: {
      type: String,
      required: true
    }
  }
})
</script>

<style lang="scss" scoped>
.toast {
  position: fixed;
  right: 20px;
  bottom: 24px;
  z-index: 30;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  max-width: min(86vw, 420px);
  border-radius: 12px;
  padding: 12px 14px;
  color: #0f3f2f;
  background: #e8fff6;
  border: 1px solid #84d9ba;
  box-shadow: 0 12px 28px rgba(7, 33, 25, 0.16);
}

.toast-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border-radius: 999px;
  color: #ffffff;
  font-size: 12px;
  font-weight: 700;
  background: #14a673;
}

.toast-message {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  line-height: 1.45;
}

.toast-fade-enter-active,
.toast-fade-leave-active {
  transition: all 0.2s ease;
}

.toast-fade-enter,
.toast-fade-leave-to {
  opacity: 0;
  transform: translateY(8px);
}
</style>

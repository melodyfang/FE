<template>
  <teleport :to="teleport">
    <transition
      :name="transition"
      appear
    >
      <div
        v-if="visible"
        :class="$style['gk-toast']"
        :gk-toast-name="name"
        :gk-toast-position="position"
      >
        <slot name="icon" />
        <div :class="$style['gk-toast-wrap']">
          <slot name="pre" />
          <span
            gk-toast-message
            :class="$style['gk-toast-message']"
          >
            {{ message }}
          </span>
        </div>
      </div>
    </transition>
  </teleport>
</template>
<script>
export default {
  name: 'GkToast'
}
</script>
<script setup>
import { watchEffect, watch } from 'vue'

const props = defineProps({
  name: { type: String, default: 'base' },
  teleport: { type: String, default: 'body' },
  transition: { type: String, default: 'fade' },
  message: { type: String, default: '' },
  // duration: { type: Number, default: 2000 },
  duration: { type: Number, default: 200000 },
  position: { type: String, default: 'center', validator: (value) => ['center', 'top', 'bottom'].includes(value) },
  visible: Boolean
})

const emit = defineEmits(['update:visible', 'destory', 'close'])

let timer = null

watchEffect(() => {
  if (props.duration > 0 && props.visible) {
    timer = setTimeout(() => {
      // emit('update:visible', false)
      // emit('close')
      // emit('destory')
    }, props.duration)
  }
})

</script>

<style lang="scss" module>
@import './index.scss';

.gk-toast {
  box-sizing: border-box;
  position: fixed; z-index: 20000;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: fit-content;
  max-width: 600px;
  padding: 8px 16px;
  background: rgba($color: #000000, $alpha: 0.6);
  border-radius: 6px;
}

.gk-toast-wrap {
  display: flex;
  align-items: center;
}

.gk-toast-message {
  font-size: 14px; font-weight: 400;
  line-height: 18px;
  color: #FFF;
}

@media screen and (max-width: 768px) {
  .gk-toast {
    max-width: 300px;
  }
}
</style>

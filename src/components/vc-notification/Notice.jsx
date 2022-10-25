import { defineComponent, computed, onMounted, onUnmounted, watch } from "vue"

import { classNames } from '../_utils'


export default defineComponent({
  name: 'Notice',
  inheritAttrs: false,
  props: [
    'prefixCls',
    'duration',
    'updateMark',
    'noticeKey',
    'props',
    'onClick',
    'onClose',
    'holder',
    'visible'
  ],
  setup (props, { attrs, slots }) {
    let closeTimer
    const duration = computed(() => (props.duration === undefined ? 1.5 : props.duration))

    const startCloseTimer = () => {
      if (duration.value) {
        closeTimer = setTimeout(() => {
          close()
        }, duration.value * 1000)
      }
    }

    const clearCloseTimer = () => {
      if (closeTimer) {
        clearTimeout(closeTimer)
        closeTimer = null
      }
    }

    const close = (e) => {
      if (e) {
        e.stopPropagation()
      }
      clearCloseTimer()
      const { onClose, noticeKey } = props
      if (onClose) {
        onClose(noticeKey)
      }
    }

    const restartCloseTimer = () => {
      clearCloseTimer()
      startCloseTimer()
    }

    onMounted(() => {
      startCloseTimer()
    })

    onUnmounted(() => {
      clearCloseTimer()
    })

    watch(
      [duration, () => props.updateMark, () => props.visible],
      ([preDuration, preUpdateMark, preVisible], [newDuration, newUpdateMark, newVisible]) => {
        if (
          preDuration !== newDuration ||
          preUpdateMark !== newUpdateMark ||
          (preVisible !== newVisible && newVisible)
        ) {
          restartCloseTimer()
        }
      },
      { flush: 'post' },
    )

    return () => {
      const { prefixCls, onClick, holder } = props
      const { class: className, style } = attrs
      const componentClass = `${prefixCls}-notice`

      const dataOrAriaAttributeProps = Object.keys(attrs).reduce(
        (acc, key) => {
          if (key.substr(0, 5) === 'data-' || key.substr(0, 5) === 'aria-' || key === 'role') {
            acc[key] = (attrs)[key]
          }
          return acc
        },
        {},
      )

      const node = (
        <div
          class={classNames(componentClass, className)}
          style={style}
          onMouseenter={clearCloseTimer}
          onMouseleave={startCloseTimer}
          onClick={onClick}
          {...dataOrAriaAttributeProps}
        >
          <div class={`${componentClass}-content`}>{slots.default?.()}</div>
        </div>
      )

      if (holder) {
        return <Teleport to={holder} v-slots={{ default: () => node }}></Teleport>
      }

      return node
    }
  }
})
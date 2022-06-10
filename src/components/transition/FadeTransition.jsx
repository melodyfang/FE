import { defineComponent, h, Transition, TransitionGroup } from "vue";


export default defineComponent({
  name: 'FadeComponent',
  props: {

  },
  setup (props, { slots }) {
    function handleBeforeLeave (el) {
      if (props.width) {
        el.style.maxWidth = `${el.offsetWidth}px`
      } else {
        el.style.maxHeight = `${el.offsetHeight}px`
      }
    }

    function handleLeave (el) {
      if (props.width) {
        el.style.maxWidth = '0'
      } else {
        el.style.maxHeight = '0'
      }

      const { onLeave } = props
      if (onLeave) {
        onLeave()
      }
    }

    function handleAfterLeave (el) {
      if (props.width) {
        el.style.maxWidth = ''
      } else {
        el.style.maxHeight = ''
      }

      const { onAfterLeave } = props
      if (onAfterLeave) {
        onAfterLeave()
      }
    }

    function handleEnter (el) {
      el.style.transition = 'none'
      if (props.width) {
        const memorizedWidth = el.offsetWidth
        el.style.maxWidth = '0'
        el.style.transition = ''
        el.style.maxWidth = `${memorizedWidth}px`
      } else {
        if (props.reverse) {
          el.style.maxHeight = `${el.offsetHeight}px`
          el.style.transition = ''
          el.style.maxHeight = '0'
        } else {
          const memorizedHeight = el.offsetHeight
          el.style.maxHeight = '0'
          el.style.transition = ''
          el.style.maxHeight = `${memorizedHeight}px`
        }
      }
    }

    function handleAfterEnter (el) {
      if (props.width) {
        el.style.maxWidth = ''
      } else {
        if (!props.reverse) {
          el.style.maxHeight = ''
        }
      }
      props.onAfterEnter?.()
    }

    return () => {
      const type = props.group ? TransitionGroup : Transition

      return h(
        type, 
        {
          name: props.width
            ? 'fade-in-width-expand-transition'
            : 'fade-in-height-expand-transition',
          mode: props.mode,
          appear: props.appear,
          onEnter: handleEnter,
          onAfterEnter: handleAfterEnter,
          onBeforeLeave: handleBeforeLeave,
          onLeave: handleLeave,
          onAfterLeave: handleAfterLeave
        },
        slots
      )
    }
  }
})
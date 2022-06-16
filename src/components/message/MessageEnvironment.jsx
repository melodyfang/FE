import { defineComponent, ref, onMounted } from "vue";
import Message from './Message.jsx'
import FadeTransition from '../transition/FadeTransition.jsx'

export default defineComponent({
  name: 'Message',
  props: {
    duration: {
      type: Number,
      default: 3000
    },
    onAfterLeave: Function,
    onLeave: Function,
    internalKey: {
      type: String,
      required: true
    },
    // private
    onInternalAfterLeave: Function
  },

  setup (props) {
    let timerId = null
    const showRef = ref(true)

    onMounted(() => {
      setHideTimeout()
    })

    function setHideTimeout () {
      const { duration } = props
      if (duration) {
        timerId = window.setTimeout(hide, duration)
      }
    }

    // function handleMouseenter (e) {
    //   if (e.currentTarget !== e.target) return
    //   if (timerId !== null) {
    //     window.clearTimeout(timerId)
    //     timerId = null
    //   }
    // }

    // function handleMouseleave (e) {
    //   if (e.currentTarget !== e.target) return
    //   setHideTimeout()
    // }

    function hide () {
      showRef.value = false
      if (timerId) {
        window.clearTimeout(timerId)
        timerId = null
      }
    }

    // function handleClose () {
    //   const { onClose } = props
    //   if (onClose) {
    //     onClose()
    //   }
    //   hide()
    // }

    function handleAfterLeave () {
      const { onAfterLeave, onInternalAfterLeave, internalKey } = props
      if (onAfterLeave) {
        onAfterLeave()
      }
      if (onInternalAfterLeave) {
        onInternalAfterLeave(internalKey)
      }
    }

    return {
      show: showRef,
      hide,
      // handleClose,
      handleAfterLeave,
      // handleMouseleave,
      // handleMouseenter
    }
  },

  render () {
    return (
      <FadeTransition>
        <Message
          content={this.content}
          // onMouseenter={
          //   this.keepAliveOnHover ? this.handleMouseenter : undefined
          // }
          // onMouseleave={
          //   this.keepAliveOnHover ? this.handleMouseleave : undefined
          // }
        />
      </FadeTransition>
    )
  }
})
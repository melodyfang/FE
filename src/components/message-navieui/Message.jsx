import { inject, defineComponent } from 'vue'
import { messageProps } from './message-props'
import { render } from './utils'
import { messageProviderInjectionKey, messageApiInjectionKey } from './config'

export default defineComponent({
  name: 'Message',
  props: {
    ...messageProps,
    render: Function
  },
  setup (props) {
    const mergedClsPrefix = 'gk'
    const name = 'base'

    const {
      props: messageProviderProps
    } = inject(messageProviderInjectionKey)

    return {
      mergedClsPrefix,
      messageProviderProps,
      handleClose () {
        props.onClose?.()
      },
      placement: messageProviderProps.placement
    }
  },
  render () {
    const {
      render: renderMessage,
      type,
      name,
      closable,
      content,
      mergedClsPrefix,
      cssVars,
      onRender,
      icon,
      handleClose,
      showIcon
    } = this

    // if (onRender) {
    //   onRender()
    // }

    let iconNode = null

    return (
      <div
        class={[`${mergedClsPrefix}-message-wrapper`]}
        onMouseenter={this.onMouseenter}
        onMouseleave={this.onMouseleave}
        gk-message-wrapper
        gk-message-name="{this.name}"
        style={[
          {
            alignItems: this.placement.startsWith('top')
              ? 'flex-start'
              : 'flex-end'
          }
        ]}
      >
        {
          /* {renderMessage(this.$props)} */

          <div
            gk-message
            class={`${mergedClsPrefix}-message ${mergedClsPrefix}-message--${type}-type`}
          >
            <div
              gk-message-content
              class={`${mergedClsPrefix}-message-content`}
            >
              hahah
              {/* {render(content)} */}
            </div>
          </div>
        }
      </div>
    )
  }
})
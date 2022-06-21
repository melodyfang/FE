import { defineComponent, provide, reactive, ref, Teleport, createVNode } from "vue";
import MessageEnvironment from './MessageEnvironment'

import { messageProviderInjectionKey, messageApiInjectionKey } from './config'
import { createId } from './utils'

console.log('init')

const Hello = defineComponent({
  name: 'MessageProvider',
  props: {
    to: [String, Object],
    duration: {
      type: Number,
      default: 3000
    },
    max: Number,
    placement: {
      type: String,
      default: 'top'
    },
    containerStyle: [String, Object]
  },
  setup (props) {
    console.log('setup: ');
    const mergedClsPrefix = 'gk'
    const messageListRef = ref([])
    const messageRefs = ref(null)
    const api = {
      create (content, options) {
        return create(content, { type: 'default', ...options })
      },
      // info (content, options) {
      //   return create(content, { type: 'info', ...options })
      // },
      // destroyAll
    }

    provide(messageProviderInjectionKey, {
      props
    })
    // console.log('messageApiInjectionKey: ==', messageApiInjectionKey);
    provide(messageApiInjectionKey, api)

    function create (content, options) {
      const key = createId()

      const messageReactive = reactive({
        ...options,
        content,
        key,
        destroy: () => {
          messageRefs.value[key]?.hide()
        }
      })

      const { max } = props
      if (max && messageListRef.value.length >= max) {
        messageListRef.value.shift()
      }

      messageListRef.value.push(messageReactive)
      
      console.log('messageListRef: ', messageListRef);

      return messageReactive
    }

    function destroyAll () {
      Object.values(messageRefs.value).forEach(message => {
        message.hide()
      })
    }

    return Object.assign(
      {
        mergedClsPrefix,
        messageRefs,
        messsageList: messageListRef
      },
      api
    )
  },
  render () {
    return (
      <>
        {this.$slots.default?.()}
        <Teleport to="body">
          999
          <div
            class={[
              `${this.mergedClsPrefix}-message-container`,
              `${this.mergedClsPrefix}-message-container-${this.placement}`
            ]}
            gk-message-position={this.placement}
            key="message-container"
            style={this.containerStyle}
          >
            {this.messsageList.map(message => {
              return (
                <MessageEnvironment
                  ref={
                    (el) => {
                      if (el) {
                        // this.messageRefs[message.key] = el
                      }
                    }
                  }
                  duration={
                    message.duration === undefined
                      ? this.duration
                      : message.duration
                  }
                />              
              )
            })}
          </div>

        </Teleport>
      </>
    )
  }
})

export default Hello
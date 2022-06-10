import { defineComponent, provide, reactive } from "vue";
import MessageEnvironment from './MessageEnvironment'

import { messageApiInjectionKey } from './config'

console.log('init')

export default defineComponent({
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
      // create (content, options) {
      //   return create(content, { type: 'default', ...options })
      // },
      // info (content, options) {
      //   return create(content, { type: 'info', ...options })
      // },
      // destroyAll
    }

    provide(messageProviderInjectionKey, {
      props
    })
    console.log('messageApiInjectionKey: ==', messageApiInjectionKey);
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

      return messageReactive
    }

    function destroyAll () {
      Object.values(messageRefs.value).forEach(message => {
        message.hide()
      })
    }

    return Object.assign(
      {
        messageRefs,
        messsageList: messageListRef
      },
      api
    )
  },
  render () {
    return (
      <Teleport to="body">
        <div
          class={[
            `${this.mergedClsPrefix}-message-container`,
            `${this.mergedClsPrefix}-message-container-${this.placement}`
          ]}
          gk-message-position="{this.placement}"
          key="message-container"
          style={this.containerStyle}
        >
          {this.messsageList.map(message => {
            return (
              <MessageEnvironment
                ref={
                  (el) => {
                    if (el) {
                      this.messageRefs[message.key] = el
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
    )
  }
})
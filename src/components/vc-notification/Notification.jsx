import { computed, defineComponent, TransitionGroup, render, createVNode, ref, onMounted } from "vue"

import { getTransitionGroupProps, getPrefixCls } from '../_utils'

import Notice from './Notice'

let seed = 0
const now = Date.now()
function getUuid() {
  const id = seed
  seed += 1
  return `rcNotification_${now}_${id}`
}

const Notification = defineComponent({
  name: 'Notification',
  inheritAttrs: false,
  props: ['prefixCls', 'maxCount'],
  setup (props, { attrs, expose, slots }) {
    const hookRefs = new Map()
    const notices = ref([])
    
    const add = (originNotice) => {
      const key = originNotice.key || getUuid()
      const notice = {
        ...originNotice,
        key,
      }

      const { maxCount } = props
      const noticeIndex = notices.value.map(v => v.notice.key).indexOf(key)
      const updatedNotices = notices.value.concat()
      
      if (noticeIndex !== -1) {
        updatedNotices.splice(noticeIndex, 1, { notice })
      } else {
        if (maxCount && notices.value.length >= maxCount) {
          notice.key = updatedNotices[0].notice.key
          notice.updateMark = getUuid()

          notice.userPassKey = key

          updatedNotices.shift()
        }

        updatedNotices.push({ notice })
      }

      notices.value = updatedNotices
    }
    
    const remove = (removeKey) => {
      notices.value = notices.value.filter(({ notice: { key, userPassKey } }) => {
        const mergedKey = userPassKey || key
        return mergedKey !== removeKey
      })
    }

    expose({
      add,
      remove,
      notices,
    })

    return () => {
      const { prefixCls } = props

      const noticeNodes = notices.value.map(({ notice }, index) => {
        console.log('notice: ', notice);
        const updateMark = index === notices.value.length - 1 ? notice.updateMark : undefined
        const { key, userPassKey } = notice

        const { content } = notice
        const noticeProps = {
          prefixCls,
          ...notice,
          ...notice.props,
          key,
          noticeKey: userPassKey || key,
          updateMark,
          onClose: (noticeKey) => {
            remove(noticeKey)
            notice.onClose?.()
          },
          onClick: notice.onClick,
        }
        
        console.log('noticeProps: ', noticeProps)
        return (
          <Notice {...noticeProps}>
            {typeof content === 'function' ? content({ prefixCls }) : content}
          </Notice>
        )
      })

      const className = {
        [prefixCls]: 1,
        [attrs.class]: !!attrs.class,
      }

      return (
        <div
          class={className}
          style={
            (attrs.style) || {
              top: '65px',
              left: '50%',
            }
          }
        >
          <TransitionGroup tag="div">
            {noticeNodes}
          </TransitionGroup>
        </div>
      )
    }
  }
})

Notification.newInstance = function (properties, callback) {
  const {
    name = 'notification',
    getContainer,
    prefixCls: customizePrefixCls,
    transitionName,
    hasTransitionName,
    ...props
  } = properties || {}

  const div = document.createElement('div')
  if (getContainer) {
    const root = getContainer()
    root.appendChild(div)
  } else {
    document.body.appendChild(div)
  }

  const Wrapper = defineComponent({
    name: 'NotificationWrapper',
    setup(_props, { attrs }) {
      const notiRef = ref(null)

      onMounted(() => {
        callback({
          notice(noticeProps) {
            notiRef.value?.add(noticeProps)
          },
          removeNotice(key) {
            notiRef.value?.remove(key)
          },
          destroy() {
            render(null, div)

            if (div.parentNode) {
              div.parentNode.removeChild(div)
            }
          },
          component: notiRef,
        })
      })

      const prefixCls = getPrefixCls(name, customizePrefixCls)

      return () => (
        <Notification
          ref={notiRef}
          {...attrs}
          prefixCls={prefixCls}
        />
      )
    },
  })

  const vm = createVNode(Wrapper, props)
  render(vm, div)
}

export default Notification
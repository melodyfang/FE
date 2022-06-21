import { computed, defineComponent, TransitionGroup, render, createVNode, ref, onMounted } from "vue"

import { getTransitionGroupProps } from '../_utils'

import Notice from './Notice'

import ConfigProvider, { globalConfigForApi } from '../config-provider'

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
  props: ['prefixCls', 'transitionName', 'animation', 'maxCount'],
  setup (props, { attrs, expose, slots }) {
    const hookRefs = new Map()
    const notices = ref([])
    const transitionProps = computed(() => {
      const { prefixCls, animation = 'fade' } = props
      let name = props.transitionName
      if (!name && animation) {
        name = `${prefixCls}-${animation}`
      }
      return getTransitionGroupProps(name)
    })

    const add = (originNotice, holderCallback) => {
      const key = originNotice.key || getUuid()
      const notice = {
        ...originNotice,
        key,
      }

      const { maxCount } = props
      const noticeIndex = notices.value.map(v => v.notice.key).indexOf(key)
      const updatedNotices = notices.value.concat()
      
      if (noticeIndex !== -1) {
        updatedNotices.splice(noticeIndex, 1, { notice, holderCallback })
      } else {
        if (maxCount && notices.value.length >= maxCount) {
          notice.key = updatedNotices[0].notice.key
          notice.updateMark = getUuid()

          notice.userPassKey = key

          updatedNotices.shift()
        }

        updatedNotices.push({ notice, holderCallback })
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

      const noticeNodes = notices.value.map(({ notice, holderCallback }, index) => {
        const updateMark = index === notices.value.length - 1 ? notice.updateMark : undefined
        const { key, userPassKey } = notice

        const { content } = notice
        const noticeProps = {
          prefixCls,
          // closeIcon: typeof closeIcon === 'function' ? closeIcon({ prefixCls }) : closeIcon,
          ...(notice),
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

        if (holderCallback) {
          return (
            <div
              key={key}
              class={`${prefixCls}-hook-holder`}
              ref={(div) => {
                if (typeof key === 'undefined') {
                  return
                }

                if (div) {
                  hookRefs.set(key, div)
                  holderCallback(div, noticeProps)
                } else {
                  hookRefs.delete(key)
                }
              }}
            />
          )
        }

        return (
          <Notice {...noticeProps}>
            {typeof content === 'function' ? content({ prefixCls }) : content}
          </Notice>
        )
      })

      console.log('noticeNodes', noticeNodes)

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
          <TransitionGroup tag="div" {...transitionProps.value}>
            {noticeNodes}
          </TransitionGroup>
        </div>
      )
    }
  }
})

Notification.newInstance = function newNotificationInstance(properties, callback) {
  const {
    name = 'notification',
    getContainer,
    appContext,
    prefixCls: customizePrefixCls,
    rootPrefixCls: customRootPrefixCls,
    transitionName: customTransitionName,
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

      return () => {

        const global = globalConfigForApi
        const prefixCls = global.getPrefixCls(name, customizePrefixCls)
        const rootPrefixCls = global.getRootPrefixCls(customRootPrefixCls, prefixCls)
        const transitionName = hasTransitionName
          ? customTransitionName
          : `${rootPrefixCls}-${customTransitionName}`

        // return (
        //   <ConfigProvider {...global} notUpdateGlobalConfig={true} prefixCls={rootPrefixCls}>
        //     <Notification
        //       ref={notiRef}
        //       {...attrs}
        //       prefixCls={prefixCls}
        //       transitionName={transitionName}
        //     />
        //   </ConfigProvider>
        // )

        return (
          <Notification
            ref={notiRef}
            {...attrs}
            prefixCls={prefixCls}
            transitionName={transitionName}
          />
        )
      }
    },
  })

  const vm = createVNode(Wrapper, props)
  vm.appContext = appContext || vm.appContext
  render(vm, div)
}

export default Notification
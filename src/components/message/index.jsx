import Notification from './notification'

let defaultDuration = 3
let defaultTop = null
let key = 1
let localPrefixCls = ''
let messageInstance = null

let transitionName = 'move-up'
let hasTransitionName = false
let getContainer = () => document.body
let maxCount = 0

function getkey () {
  return key++
}

function setMessageConfig (options) {
  if (options.top !== undefined) {
    defaultTop = options.top
    messageInstance = null
  }

  if (options.duration !== undefined) {
    defaultDuration = options.duration
  }

  if (options.prefixClas !== undefined) {
    localPrefixCls = options.prefixCls
  }

  if (options.getContainer !== undefined) {
    getContainer = options.getContainer
    messageInstance = null
  }

  if (options.transitionName !== undefined) {
    transitionName = options.transitionName
    messageInstance = null
    hasTransitionName = true
  }

  if (options.maxCount !== undefined) {
    maxCount = options.maxCount
    messageInstance = null
  }
}

function getMessageInstance (args, callback) {
  if (messageInstance) {
    callback(messageInstance)
    return
  }

  Notification.newInstance(
    
    {
      appContext: args.appContext,
      prefixCls: args.prefixCls || localPrefixCls,
      rootPrefixCls: args.rootPrefixCls,
      transitionName,
      hasTransitionName,
      style: { top: defaultTop }, // 覆盖原来的样式
      getContainer: getContainer || args.getPopupContainer,
      maxCount,
      name: 'message'
    },
    (instance) => {
      if (messageInstance) {
        callback(messageInstance)
        return
      }

      messageInstance = instance
      callback(instance)
    }
  )
}

function notice(args) {
  const duration = args.duration !== undefined ? args.duration : defaultDuration
  const target = args.key || getkey()

  const closePromise = new Promise(resolve => {
    const callback = () => {
      if (typeof args.onClose === 'function') {
        args.onClose()
      }
      return resolve(true)
    }

    getMessageInstance(args, instance => {
      instance.notice({
        key: target,
        duration,
        style: args.style || {},
        class: args.class,
        content: ({ prefixCls }) => {
          const messageClass = classNames(`${prefixCls}-custom-content`, {
            [`${prefixCls}-${args.type}`]: args.type
          })

          return (
            <div class={messageClass}>
              <span>{typeof args.content === 'function' ? args.content() : args.content}</span>
            </div>
          )
        }
      })
    })
  })

  const result = () => {
    if (messageInstance) {
      messageInstance.removeNotice(target)
    }
  }

  result.then = (filled, rejected) => {
    closePromise.then(filled, rejected)
  }

  result.promise = closePromise
  return result
}

const api = {
  open: notice,
  config: setMessageConfig,
  destroy (messageKey) {
    if (messageKey) {
      const { removeNotice } = messageInstance
      removeNotice(messageKey)
    } else {
      const { destroy } = messageInstance
      destroy()
      messageInstance = null
    }
  }
}

export function attachTypeApi(originalApi, type) {
  originalApi[type] = (
    content,
    duration,
    onClose
  ) => {
    if (typeof duration === 'function') {
      onClose = duration
      duration = undefined
    }

    return originalApi.open({ content, duration, type, onClose })
  }
}

(['success', 'info', 'warning', 'error', 'loading']).forEach(type => {
  attachTypeApi(api, type)
})

api.warn = api.warning

export default api

import Notification from '../vc-notification'

import { classNames } from '../_utils'

let defaultDuration = 3
let defaultTop = null
let key = 1
let localPrefixCls = ''
let messageInstance = null

let getContainer = () => document.body
let maxCount = 0

function getkey () {
  return key++
}

function isArgsProps(content) {
  return (
    Object.prototype.toString.call(content) === '[object Object]' &&
    !!content.content
  )
}

function setMessageConfig (options) {
  if (options.top !== undefined) {
    defaultTop = options.top
    messageInstance = null
  }

  if (options.duration !== undefined) {
    defaultDuration = options.duration
  }

  if (options.prefixCls !== undefined) {
    localPrefixCls = options.prefixCls
  }

  if (options.getContainer !== undefined) {
    getContainer = options.getContainer
    messageInstance = null
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
      prefixCls: args.prefixCls || localPrefixCls,
      style: { top: defaultTop }, // 覆盖原来的样式
      getContainer: getContainer,
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

// 主要是通过调用该方法弹出消息
function notice(args) {
  const duration = args.duration !== undefined ? args.duration : defaultDuration
  const target = args.key || getkey()
  console.log('target: ', target);

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
        },
        onClose: callback,
        onClick: args.onClick
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
    // 如果传入的参数对象的格式，比如 {content: 'hello', duration: 2}
    if (isArgsProps(content)) {
      return originalApi.open({ ...content, type })
    }

    // 兼容类似这种调用方式 message.info(content, [duration], onClose).then(afterClose)
    if (typeof duration === 'function') {
      onClose = duration
      duration = undefined
    }

    // 普通调用，如 message.info('hello', 2)
    return originalApi.open({ content, duration, type, onClose })
  }
}

(['success', 'info', 'warning', 'error', 'loading']).forEach(type => {
  attachTypeApi(api, type)
})

api.warn = api.warning

export default api

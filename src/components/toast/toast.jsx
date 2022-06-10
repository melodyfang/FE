import ToastVue from './Toast.vue'

import { mountComponent, usePoputState } from './mount.component.js'
import { getCurrentInstance } from 'vue'

let queue = []
let allowMultiple = false
const defaultOptions = {
  name: 'base',
  message: '',
  onClose: () => {},
  duration: 2000,
  teleport: 'body',
  transition: 'fade',
  position: 'center'
}

function createInstance () {
  const { instance, unmount } = mountComponent({
    setup () {
      const { open, close, state, toggle } = usePoputState()
      const onDestory = () => {
        if (allowMultiple) {
          queue = queue.filter((item) => item !== instance)
          unmount()
        }
      }

      const render = () => {
        const props = {
          ...state
        }

        const attrs = {
          onDestory,
          'onUpdate:visible': toggle
        }

        return (
          // <ToastVue {...props} {...attrs} />
          <h1>asakl</h1>
        )
      }


      getCurrentInstance().render = render

      return {
        state,
        open,
        clear: close,
        toggle
      }
    }
  })
  return instance
}

function getInstance () {
  if (!queue.length || allowMultiple) {
    const instance = createInstance()
    queue.push(instance)
  }

  return queue[queue.length - 1]
}

const isObject = (val) => {
  return val !== null && typeof val === 'object'
}

function parseOptions (message) {
  if (isObject(message)) {
    return message
  }

  return { message }
}

function Toast (options) {
  const toast = getInstance()
  const parseOption = parseOptions(options)
  toast.open(Object.assign({}, defaultOptions, parseOption))
  return toast
}

Toast.clear = (all) => {
  if (queue.length) {
    if (all) {
      queue.forEach(toast => {
        toast.clear()
      })
    } else {
      queue.shift()?.clear()
    }
  }
}

Toast.allowMultiple = val => {
  allowMultiple = true
}

export {
  Toast
}

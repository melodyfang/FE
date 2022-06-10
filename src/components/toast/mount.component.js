import { createApp, getCurrentInstance, reactive } from 'vue'

export function usePoputState () {
  const state = reactive({
    visible: false
  })

  const toggle = (visible) => {
    state.visible = visible
  }

  const open = props => {
    Object.assign(state, props)
    toggle(true)
  }

  const close = () => {
    toggle(false)
  }

  useExpose({open, close, toggle})

  return {
    state,
    open,
    close,
    toggle
  }
}

export function mountComponent(RootComponent) {
  const app = createApp(RootComponent)
  const root = document.createElement('div')

  document.body.appendChild(root)

  return {
    instance: app.mount(root),
    unmount () {
      setTimeout(() => {
        app.unmount()
        document.body.removeChild(root)
      }, 300)
    }
  }
}

export function useExpose (apis) {
  const instance = getCurrentInstance()

  if (instance) {
    Object.assign(instance.proxy, apis)
  }
}

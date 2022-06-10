<script setup>
import { getCurrentInstance, ref, inject } from 'vue'

defineProps({
  msg: String
})

const count = ref(0)

const word = {
  greetings: {
    hello: 'melody'
  }
}

// const i18n = inject('i18n')
// console.log(i18n.greetings.hello)

const globalProperties = getCurrentInstance()?.appContext.config.globalProperties
console.log(globalProperties.$translate)
console.log(globalProperties.$translate('greetings.hi'))
</script>

<template>
  123
  <h1>{{ $translate('greetings.hi') }}</h1>
<!-- 
  <AnchoredHeading :level="1">
    hehe
  </AnchoredHeading> -->

  <anchored-heading :level="1">
    内容区域123
  </anchored-heading>
</template>

<style scoped>
a {
  color: #42b983;
}
</style>

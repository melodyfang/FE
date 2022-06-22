<script setup>
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
import HelloWorld from './components/HelloWorld.vue'
// import Hello from './components/Hello.vue'

// import MessageProvider from './components/message/MessageProvider.jsx'
// import { useMessage } from './components/message/index.js

import message from './components/message/index.jsx'

message.config({
  top: '100px',
  maxCount: 3,
  // prefixCls: 'melody-message'
})

function notice () {
  message.info({
    content: 'this is a message',
    prefixCls: 'why-message',
    class: 'custom-class',
    duration: 20
  })

  // const result = message.info('hello world', 20, () => {
  //   console.log('close')
  // })

  // console.log('result: ', result)

  // result.then((data) => {
  //   console.log('promise-data: ', data)
  // })
}


// import { MessageProvider, useMessage } from './components/message/index.js'
// console.log('MessageProvider: ', MessageProvider);
</script>

<template>
  <!-- <img alt="Vue logo" src="./assets/logo.png" /> -->
  <!-- <HelloWorld msg="Hello Vue 3 + Vite" /> -->
  <button @click="notice">点我</button>

  <!-- <MessageProvider>
    <Hello />
  </MessageProvider> -->
</template>

<style lang="scss">
// @import "./components/message/style/index.scss";
// @import "./components/transition/style/index.scss";

button {
  margin: 100px;
}
</style>

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
  prefixCls: 'melody-message'
})

function notice () {
  // message.info('hello world', 20)
  message.info({
    content: 'this is a message',
    class: 'custom-class',
    duration: 0
  })
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

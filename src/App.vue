<script setup>
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
import HelloWorld from './components/HelloWorld.vue'
// import Hello from './components/Hello.vue'

// import MessageProvider from './components/message/MessageProvider.jsx'
// import { useMessage } from './components/message/index.js

import message from './components/message/index.jsx'

message.info('hello world', 20)


// import { MessageProvider, useMessage } from './components/message/index.js'
// console.log('MessageProvider: ', MessageProvider);
</script>

<template>
  <!-- <img alt="Vue logo" src="./assets/logo.png" /> -->
  <!-- <HelloWorld msg="Hello Vue 3 + Vite" /> -->
  hhh

  <!-- <MessageProvider>
    <Hello />
  </MessageProvider> -->
</template>

<style lang="scss">
// @import "./components/message/style/index.scss";
// @import "./components/transition/style/index.scss";

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>

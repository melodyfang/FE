<script setup>
import { useMessage } from './message/index.js'

const message = useMessage()
message.create('hello message')

</script>

<template>
  <div>
    神奇的离谱
  </div>
</template>
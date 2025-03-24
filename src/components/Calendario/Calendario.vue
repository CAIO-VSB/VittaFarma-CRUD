<template>
  <div class="calendar-div">
    <el-calendar class="calendar" v-model="value" />
  </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  const value = ref(new Date())
  </script>

  <style>
  .calendar {
    margin-top: 1%;
    position: fixed;
  }

  .calendar-div {
    position: fixed;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  @media (max-width: 480px) {
    .calendar {
    margin-top: 10vh;
    width: 110%;
    font-size: 0.90rem;
    overflow: auto;
  }

  @media (max-width: 380px) {
    .calendar {
      margin-top: 20vh;
      font-size: 0.70rem;
    }
  }
  }

  </style>
  
  
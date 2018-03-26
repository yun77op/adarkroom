<template>
    <div class="container">
        <img class="img" :src="onworking" />
        <div class="text">施工中，敬请期待</div>
    </div>
</template>

<script>
import onworking from '../../assets/onworking.png'
import store from '@/store'

export default {
    props: ['currentTab'],

  data() {
      return {
        onworking
      }
  },
  watch: {
      currentTab(newValue, oldValue) {
          if (newValue === 2) {
              this.onArrival();
          }
      }
  },
  methods: {
      onArrival() {
        store.commit('changeTheme', 'path');
      }
  }
}
</script>

<style scoped>
    .container {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .img {
        margin-top: 80px;
        width: 120px;
        height: 120px;
    }

    .text {
        margin-top: 16px;
        font-size: 14px;
        color: rgba(0,0,0,0.40);
        letter-spacing: 0;
        line-height: 20px;
    }
</style>


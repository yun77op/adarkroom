<template>
    <div class="worker-item list-item">
        <div v-if="workerNum > 0" class="worker-item__decrease-button" @click="decreaseWorker"><img class="worker-item__action-img" :src="arrowLeft" /></div>
        <div class="worker-item__text">
            <div class="worker-item__title">{{i18nName}}</div>
            <div class="worker-item__income">
                <div v-for="(num, j) in Income[name].stores" :key="j">{{i18nStoreNames[j]}}：{{num * workerNum > 0 ? '+' + num * workerNum : num * workerNum }}</div>
            </div>
        </div>
        <div class="worker-item__num">{{workerNum}}</div>
        <div class="worker-item__increase-button" @click="increaseWorker"><img class="worker-item__action-img" :src="arrowRight" /></div>
    </div>
</template>

<script>
import arrowRight from '../assets/arrow-right.png';
import arrowLeft from '../assets/arrow-left.png';
import Income from './stores/Income'

export default {
    props: {
        workerNum: Number,
        name: String,
        i18nName: String,
        i18n: Function
    },

    data() {
        return {
            arrowLeft,
            arrowRight,
            Income,
            i18nStoreNames: {

            }
        }
    },

    created() {
        for (let i in this.Income[this.name].stores) {
            this.i18nStoreNames[i] = this.i18n(i)
        }
    },
  
  methods: {
      decreaseWorker() {
          this.$emit('decreaseWorker')
      },

      increaseWorker() {
          this.$emit('increaseWorker')
      },

    getWorkerName(key) {
        let name = Income[key].name;
        if(!name) name = key;
        return name;
    }
  }
}
</script>


<style>
    .worker-item {
        display: flex;
        background-color: rgba(255,255,255,.8);
        padding-left: 16px;
        padding-right: 15px;
        align-items: center;
    }
    .worker-item__decrease-button {
        margin-right: 8px;
    }
    .worker-item__increase-button {
        margin-left: 8px;
    }

    .worker-item__num {
        font-size: 14px;
        color: rgba(0,0,0,0.80);
        letter-spacing: 0;
        line-height: 24px;
    }

    .worker-item__text {
        line-height: 24px;
        color: rgba(0,0,0.8);
        font-size: 16px;
        padding-top: 9px;
        padding-bottom: 9px;
        margin-left: 16px;
        flex-grow: 1;
    }

    .worker-item__action-img {
        width: 9px;
        height: 16px;
    }

    .worker-item__income {
        font-size: 12px;
        color: rgba(0,0,0,0.60);
        letter-spacing: 0;
        line-height: 18px;
        margin-top: 4px;
    }
    .worker-item__title {
        font-size: 16px;
        color: rgba(0,0,0,0.80);
        letter-spacing: 0;
        line-height: 24px;
    }

</style>

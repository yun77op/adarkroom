<template>
    <div class="store-item list-item">
        <div class="store-item__title">{{text}}</div>
        <div class="store-item__income" v-if="income">{{income}}</div>
    </div>
</template>

<script>
import store from '@/store'

export default {
    props: {
        name: String,
        text: String
    },
  computed: {
    income() {
        const income = store.state.income

        let total = 0;
        let delay

        for (let i in income) {
            let stores = income[i].stores

            for (let j in stores) {
                if (this.name === j) {
                    total += stores[j]
                    delay = income[i].delay
                }
            }
        }

        if (total !== 0) {
            return `（${total > 0 ? '+' + total : total}/${delay}秒）`
        } else {
            return ''
        }
    }
  }
}
</script>


<style scoped>
    .store-item {
        display: flex;
        background-color: rgba(255,255,255,.8);
        padding-left: 16px;
        padding-right: 15px;
        align-items: center;
    }

    .store-item__title {
        line-height: 24px;
        color: rgba(0,0,0.8);
        font-size: 16px;
        padding-top: 9px;
        padding-bottom: 9px;
        flex-grow: 1;
    }
    .store-item__income {
        font-size: 14px;
        color: rgba(0,0,0,0.80);
        letter-spacing: 0;
        line-height: 24px;
    }

</style>


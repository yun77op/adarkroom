<template>
    <div class="container list-item">
        <div class="content">
            <div class="text" @click="handleClick" v-if="text">{{text}}</div>
            <div class="text" @click="handleClick" v-else>
                <slot name="text"></slot>
            </div>
            <slot name="actions"></slot>
            <img v-if="hasInfo" @click="handleInfoClick" class="icon" :src="infoIcon" />
        </div>
    </div>
</template>

<script>
import infoIcon from '../assets/info.png';

export default {
  props: {
      text: String,
      hasInfo: {
        type: Boolean,
        default: true
      }
  },

    data() {
        return {
            infoIcon
        }
    },

    methods: {
        handleClick() {
            this.$emit('click')
        },

        handleInfoClick() {
            this.$emit('infoClick')
        }
    }

}
</script>


<style scoped>
    .content {
        position: relative;
        background-color: rgba(255,255,255,.8);
    }

    .icon {
        position: absolute;
        right: 17px;
        top: 15px;
        width: 14px;
        height: 14px;
    }
    .text {
        line-height: 24px;
        color: rgba(0,0,0.8);
        font-size: 16px;
        padding-top: 10px;
        padding-bottom: 10px;
        margin-left: 16px;
    }
</style>

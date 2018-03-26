<template>
    <div class="button-container">
        <div :style="{background: activeColor}" class="progress" v-if="isActive" @animationend="animationend()"></div>
        <div class="button" @click="clickHandle()">
            <div class="text">{{text}}</div>
        </div>
    </div>
</template>

<script>

export default {
    props: {
        text: String,
        active: Boolean,
        activeColor: {
            type: String,
            default: '#FFA019'
        }
    },
    data() {
        return {
            isActive: this.active || false
        }
    },

    created () {
    },

    methods: {
        clickHandle() {
            if (this.isActive) {
                return;
            }

            const event = {
                isPrevented: false
            }

            this.$emit('click', event);

            if (event.isPrevented) {
                return;
            }

            this.isActive = true;
        },

        animationend() {
            this.isActive = false;
        }
    }
}
</script>

<style scoped>
    .button-container {
        height: 44px;
        background-color: rgba(255,255,255,.4);
        width: 100%;
        position: relative;
    }
    .button {
        cursor: pointer;
        color: black;
        height: 44px;
        width: 100%;
        line-height: 44px;
        position: relative;
        z-index: 1;
    }

    
    .progress {
        animation-name: progress;
        animation-direction: normal;
        animation-duration: 5s;
        animation-fill-mode: forwards;
        animation-play-state: running;
        position: absolute;
        content: '';
        top: 0;
        right: 0;
        left: 0;
        bottom: 0;
    }
    .text {
        text-align: center;
        font-size: 14px;
    }
    @keyframes progress {
        from {
            transform: scaleX(1);
            transform-origin: 0 50%
        }
        to {
            transform: scaleX(0);
            transform-origin: 0 50%
        }
    }
</style>
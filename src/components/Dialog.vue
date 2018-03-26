<style lang="less" scoped>
@import './_var';

.hairline(@border-retina-color: @gray-light) {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 200%;
  height: 200%;
  transform: scale(.5);
  transform-origin: 0 0;
  pointer-events: none;
  box-sizing: border-box;
  border: 0 solid @border-retina-color;
}

/* 基础样式 */
.zan-dialog--container {
  position: fixed;
  top: 45%;
  left: 50%;
  width: 80%;
  height: 0;
  font-size: 16px;
  overflow: hidden;
  transition: all .2s linear;
  border-radius: 4px;
  background-color: #fff;
  transform: translate3d(-50%, -50%, 0);
  color: #333;
  opacity: 0;
  z-index: 1;
}

.zan-dialog--mask {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.6);
  transition: .3s;
  display: none;
  z-index: 1;
}

/* 弹出层内容 */
.zan-dialog__header {
  padding: 15px 0 0;
  text-align: center;
}

.zan-dialog__content {
  position: relative;
  padding: 15px 20px;
  line-height: 1.5;
  min-height: 40px;

  &::after {
    .hairline();
    border-bottom-width: 1px;
  }
}

/* 在有标题时，需要减弱内容的存在感 */
.zan-dialog__content--title {
  color: #999;
  font-size: 14px;
}

.zan-dialog__footer {
  overflow: hidden;
}

.zan-dialog__button {
  line-height: 50px;
  height: 50px;
  padding: 0 5px;
  border-radius: 0;
  margin-bottom: 0;

  &::after {
    border-width: 0;
    border-radius: 0;
  }
}

/* 展示时，样式重置 */
.zan-dialog--show .zan-dialog--container {
  opacity: 1;
  height: auto;
}

.zan-dialog--show .zan-dialog--mask {
  display: block;
}

/* 水平/垂直布局 */
.zan-dialog__footer--horizon {
  display: flex;
}

.zan-dialog__footer--horizon .zan-dialog__button {
  flex: 1;

  &::after {
    border-right-width: 1px;
  }

  &:last-child::after {
    border-right-width: 0;
  }
}


.zan-dialog__footer--vertical .zan-dialog__button {
  flex: 1;

  &::after {
    border-bottom-width: 1px;
  }

  &:last-child::after {
    border-bottom-width: 0;
  }
}
</style>

<template>
  <div class="zan-dialog" :class="{'zan-dialog--show': show}">
    <div class="zan-dialog--mask"></div>
    <div class="zan-dialog--container">
      <div v-if="zanDialog.title"
        class="zan-dialog__header">{{ zanDialog.title }}</div>
      <div
        class="zan-dialog__content" :class="{'zan-dialog__content--title': zanDialog.title }">
          <div v-for="(item, index) in zanDialog.content" :key="index">{{item}}</div>
        </div>
      <div
        class="zan-dialog__footer" :class="{'zan-dialog__footer--vertical': zanDialog.buttonsShowVertical, 'zan-dialog__footer--horizon': !zanDialog.buttonsShowVertical }">
        <button
            v-for="item in zanDialog.buttons"
            :key="item.text"
            class="zan-dialog__button zan-btn"
            @click="_handleZanDialogButtonClick(item.nextScene)"
            :style="{color: item.color || '#333' }">{{ item.text }}</button>
      </div>
    </div>
  </div>
</template>

<script>

const _f = function () {};

export default {

  props: {
    zanDialogObj: Object,
    show: {
      type: Boolean,
      default: false
    }
  },
    data() {
        return {
        }
    },

    computed: {
      zanDialog() {

        const {
            // 自定义 btn 列表
            // { type: 按钮类型，回调时以此作为区分依据，text: 按钮文案, color: 按钮文字颜色 }
            buttons = [],
            // 标题
            title = '',
            // 内容
            content = ' ',
            // 按钮是否展示为纵向
            buttonsShowVertical = false,
            // 是否展示确定
            showConfirm = true,
            // 确认按钮文案
            confirmText = '确定',
            // 确认按钮颜色
            confirmColor = '#3CC51F',
            // 是否展示取消
            showCancel = false,
            // 取消按钮文案
            cancelText = '取消',
            // 取消按钮颜色
            cancelColor = '#333'
        } = this.zanDialogObj;

        // 处理默认按钮的展示
        // 纵向排布确认按钮在上方
        let showCustomBtns = false;
        if (buttons.length === 0) {
            if (showConfirm) {
                buttons.push({
                    type: 'confirm',
                    text: confirmText,
                    color: confirmColor
                });
            }

            if (showCancel) {
                const cancelButton = {
                    type: 'cancel',
                    text: cancelText,
                    color: cancelColor
                };
                if (buttonsShowVertical) {
                    buttons.push(cancelButton);
                } else {
                    buttons.unshift(cancelButton);
                }
            }
        } else {
            showCustomBtns = true;
        }

            return {
                showCustomBtns,
                buttons,
                title,
                content,
                buttonsShowVertical,
                showConfirm,
                confirmText,
                confirmColor,
                showCancel,
                cancelText,
                cancelColor
            }
      }
    },

  methods: {
    _handleZanDialogButtonClick(scene) {
        this.$emit('update:show', false)

        if (this.zanDialog.showCustomBtns) {
            this.$emit('click', scene)
            return;
        }

        if (type === 'confirm') {
            this.$emit('click', 'confirm')
        } else {
            this.$emit('click', 'cancel')
        }
    } 
  }
}
</script>

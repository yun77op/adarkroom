<template>
  <div class="container" :class="theme">

    <div class="tab">
      <div class="tab-item" @click="tabClick(0)" :class="{active: currentTab === 0}">{{roomTitle}}</div>
      <div class="tab-item" v-if="level > 0" @click="tabClick(1)" :class="{active: currentTab === 1}">{{outsideTitle}}</div>
      <div class="tab-item" v-if="level > 1" @click="tabClick(2)" :class="{active: currentTab === 2}">{{pathTitle}}</div>
    </div>
      <swiper @change="swiperChange" :current="currentTab" class="swiper" :style="{height: swiperHeight}">
        <swiper-item class="swiper-item">
          <scroll-view scroll-y :style="{height: swiperHeight}">
            <div class="main-content">
              <room :currentTab="currentTab" v-on:unlockLevel="unlockLevel()"></room>
            </div>
          </scroll-view>
        </swiper-item>
        <swiper-item v-if="level > 0" class="swiper-item">
          <scroll-view scroll-y :style="{height: swiperHeight}">
            <div class="main-content">
              <outside :currentTab="currentTab" v-on:unlockLevel="unlockLevel()"></outside>
            </div>
          </scroll-view>
        </swiper-item>
        <swiper-item v-if="level > 1" class="swiper-item">
          <scroll-view scroll-y :style="{height: swiperHeight}">
            <div class="main-content">
              <path :currentTab="currentTab" v-on:unlockLevel="unlockLevel()"></path>
            </div>
          </scroll-view>
        </swiper-item>
      </swiper>

    <div class="toast" v-if="message">{{message}}</div>
    <event-dialog></event-dialog>
  </div>
</template>

<script>
import tbutton from '@/components/tbutton'
import outside from '@/components/outside'
import room from '@/components/room'
import EventDialog from '@/components/EventDialog'
import store from '@/store'
import { mapState, mapActions } from 'vuex'
import path from '@/pages/path/path'
import {_} from '@/components/translate'
import actions from '../../actions'

export default {
  data() {
    return {
      swiperHeight: '0rpx',
      roomTitle: _('A Firelit Room'),
      pathTitle: _('A Dusty Path')
    }
  },

  computed: {
    currentTab() {
      return store.state.currentTab
    },

    message() {
      return store.state.message
    },

    level() {
      return store.state.level
    },

    theme() {
      return `theme-${store.state.theme}`
    },

    outsideTitle() {
      const numHuts = store.state.buildings.hut || 0;
      let title;
      if(numHuts === 0) {
        title = _("A Silent Forest");
      } else if(numHuts == 1) {
        title = _("A Lonely Hut");
      } else if(numHuts <= 4) {
        title = _("A Tiny Village");
      } else if(numHuts <= 8) {
        title = _("A Modest Village");
      } else if(numHuts <= 14) {
        title = _("A Large Village");
      } else {
        title = _("A Raucous Village");
      }

      return title
    }
  },
  
  // mapState({
  //   currentTab: 'currentTab',
  //   theme: state => `theme-${state.theme}`,
  //   message: 'message'
  // }),

  components: {
    tbutton,
    room,
    outside,
    EventDialog,
    path
  },

  created() {
    this.unsubscribeStore = store.subscribe((mutation, state) => {
      if (mutation.type === 'changeTheme') {
        this.setNavigationBarColor(mutation.payload);
      }

      // save game state
      wx.setStorageSync('game', Object.assign({}, state, {
        currentTab: 0,
        message: null
      }))
    });

    this.setNavigationBarColor(store.state.theme);

    const systemInfo = wx.getSystemInfoSync()
    const swiperHeight = systemInfo.windowHeight * 750 / systemInfo.windowWidth - 42 * 2

    this.swiperHeight = swiperHeight + 'rpx';
  },

  beforeDestroy() {
    this.unsubscribeStore();
  },

  methods: {

    setNavigationBarColor(value) {
      let backgroundColor;

      switch(value) {
        case 'warm':
        backgroundColor = '#946832';
        break;
        case 'cold':
        backgroundColor = '#464c54';
        break;

        case 'forest':
        backgroundColor = '#375733';
        break;

        case 'path':
        backgroundColor = '#225480';
        break;
      }

      wx.setNavigationBarColor({
        backgroundColor,
        frontColor: '#ffffff'
      })
    },

    swiperChange(event) {
      store.commit('changeCurrentTab', event.target.current);
      actions.printQueue(event.target.current)
    },

    tabClick (tab) {
      store.commit('changeCurrentTab', tab);
      actions.printQueue(tab)
    },

    unlockLevel() {
      this.changeValue('level', 1)
    },

    changeValue(name, value) {
        store.dispatch('changeValue', {
            name,
            value
        })
    },
  }
}
</script>

<style>
page {
  min-height: 100%;
}
.container.theme-warm .button-container {
  background-color: rgba(255,255,255,.8);
}

.flat-button {
  height: 44px;
  background-color: rgba(255,255,255,.4);
  font-size: 14px;
  line-height: 44px;
  border: none;
  padding: 0;
  border-radius: 0;
  color: #fff;
}
.flat-button::after {
  border: none;
}

.container.theme-warm .flat-button {
  color: #000;
}

.container.theme-forest .flat-button {
  color: #000;
}

.main-content {
  padding-top: 24px;
}

.list-item {
  position: relative;
}

.list-item::after {
  position: absolute;
  left: 16px;
  bottom: 0;
  height: 1px;
  width: 100%;
  background-color: rgba(31,56,88,0.10);
  content: '';
}

.list-item:last-child::after {
  display: none;
}

</style>

<style scoped>

.toast {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 0 10px;
  box-sizing: border-content;
  color: rgba(255,255,255,.8);
  font-size: 14px;
  line-height: 44px;
  height: 44px;
  background-color: #122033;
}

.container {
  min-height: 100vh;
  /* display: flex;
  flex-direction: column; */
}

/* .tab {
  flex-shrink: 0;
} */

.swiper {
  width: 100%;
  /* flex-grow: 1; */
  position: relative;
}


.container.theme-cold {
  background-color: #313841;
}

.container.theme-cold .tab-item {
  color: rgba(255,255,255,.8);
}

.container.theme-cold .tab {
  background-color: rgba(255,255,255,.1);
}


.container.theme-warm {
  background-color: #FFB54C;
}

.container.theme-warm .tab-item {
  color: #FFB54C;
}

.container.theme-warm .tab {
  background-color: #946832;
}


.container.theme-forest {
  background-color: #A8E6A1;
}

.container.theme-forest .tab-item {
  color: #A8E6A1;
}

.container.theme-forest .tab {
  background-color: #375733;
}


.container.theme-path {
  background-color: #DEF0FF;
}

.container.theme-path .tab-item {
  color: #DEF0FF;
}

.container.theme-path .tab {
  background-color: #225480;
}


.tab {
  display: flex;
  padding-left: 16px;
}

.tab-item {
  font-size: 14px;
  line-height: 22px;
  padding-bottom: 10px;
  padding-top: 10px;
  width: 106px;
  text-align: center;
  cursor: pointer;
}

.tab-item.active {
  position: relative;
  color: #fff;
}

.tab-item.active::after {
  height: 2px;
  content: '';
  width: 100%;
  background-color: rgba(255,255,255,.8);
  position: absolute;
  bottom: 0;
  left: 0;
}

</style>

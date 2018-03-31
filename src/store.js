// https://vuex.vuejs.org/zh-cn/intro.html
// make sure to call Vue.use(Vuex) if using a module system
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

// wx.getStorageSync('game')

const initialState = {
  currentTab: 0,
  buildings: {
  },
  workers: {

  },
  cityCleared: false,
  population: 0,
  features: {
    location: {}
  },
  income: {},
  theme: 'cold',
  stores: {
  },
  stolen: {

  },
  message: null,
  builderState: -1,
  fire: 0,
  temperature: 0,
  level: 0,
  killVillagersNum: -1,
  destroyHutsNum: -1,
  bootstraping: true
}

const notifyQueue = {

}

const store = new Vuex.Store({
  state: initialState,
  mutations: {
    changeCurrentTab: (state, value) => {
      if (state.currentTab !== value) {
        state.currentTab = value
      }
    },

    changeTheme: (state, value) => {
      state.theme = value
    },

    setStore (state, {name, value}) {
      if (state.stores[name] === undefined) {
        Vue.set(state.stores, name, value)
      } else {
        state.stores[name] = value
      }
    },

    setStoreM (state, list) {
      for (let i in list) {
        state.stores[i] = list[i]
      }
    },

    addM (state, {name, list}) {
      for (let i in list) {
        if (state[name][i] === undefined) {
          Vue.set(state[name], i, list[i])
        } else {
          state[name][i] += list[i]
        }
      }
    },

    toast (state, value) {
      state.message = value
    },

    changeValue (state, {name, value}) {
      const list = name.split('.')

      const path = list.slice(0, -1)
      const lastName = list.slice(-1)[0]
      let ref = state

      if (path.length > 0) {
        ref = path.reduce((obj, item) => {
          if (obj[item] === undefined) {
            // obj[item] = {}
            // obj = Object.assign({}, obj, {
            //   [item]: {}
            // })

            Vue.set(obj, item, {})
          }

          return obj[item]
        }, state)
      }

      const prevValue = ref[lastName]

      if (prevValue === undefined) {
        Vue.set(ref, lastName, value)
      } else {
        ref[lastName] = prevValue + value
      }
    },

    setValue (state, {name, value}) {
      const list = name.split('.')

      const path = list.slice(0, -1)
      const lastName = list.slice(-1)[0]
      let ref = state

      if (path.length > 0) {
        ref = path.reduce((obj, item) => {
          if (obj[item] === undefined) {
            // obj[item] = {}
            obj = Object.assign({}, obj, {
              [item]: {}
            })
          }

          return obj[item]
        }, state)
      }

      Vue.set(ref, lastName, value)
    }
  },

  actions: {
    changeValue ({ commit }, options) {
      commit('changeValue', options)
    },
    setValue ({ commit }, options) {
      commit('setValue', options)
    },
    changeTheme ({ commit }, options) {
      commit('changeTheme', options)
    },
    setStore ({commit}, options) {
      commit('setStore', options)
    },
    setStoreM ({commit}, options) {
      commit('setStoreM', options)
    },
    addM ({commit}, options) {
      commit('addM', options)
    },
    toast ({commit, state}, options) {
      if (options.tab == null || state.currentTab === options.tab) {
        clearTimeout(this.timer)
        notifyQueue[state.currentTab] = [] // clear queue
        commit('toast', options.value)

        this.timer = setTimeout(() => {
          commit('toast', null)
        }, 2000)
      } else {
        notifyQueue[options.tab] = notifyQueue[options.tab] || []
        notifyQueue[options.tab].push(options.value)
      }
    },

    printQueue ({commit, state}, tab) {
      function print (tab) {
        const queue = notifyQueue[tab]

        if (!queue || queue.length === 0) {
          return
        }

        commit('toast', queue.shift())

        setTimeout((tab) => {
          print(tab)
        }, 1000, tab)
      }

      print(tab)
    },

    setIncome ({commit, state}, {source, payload}) {
      var existing = state.income[source]
      if(typeof existing != 'undefined') {
        payload.timeLeft = existing.timeLeft
      }
      commit('setValue', {
        name: 'income.'+ source,
        value: payload
      });
    },

    addStolen (args, stores) {
      const {commit, state} = args;
      for(let k in stores) {
          var old = state.stores[k] || 0;
          var short = old + stores[k];
          //if they would steal more than actually owned
          if(short < 0){
            commit('changeValue', {
              name: 'stolen.' + k,
              value: (stores[k] * -1) + short
            })
          } else {
            commit('changeValue', {
              name: 'stolen.' + k,
              value: stores[k] * -1
            })
          }
      }
    },

    collectIncome (args) {
      const {commit, state} = args;

      for (let source in state.income) {
        let income = state.income[source]

        if (typeof income.timeLeft === 'undefined') {
					Vue.set(income, 'timeLeft', 0)
        }

				if (typeof income.timeLeft !== 'number') {
					income.timeLeft = 0
				}
        income.timeLeft--
        
        if (income.timeLeft <= 0) {
          console.log('collection income from ' + source)

					let cost = income.stores
          let ok = true

					if(source == 'thieves') this.addStolen(args, cost);

					if (source !== 'thieves') {
						for (let k in cost) {
							let have = state.stores[k] || 0
							if (have + cost[k] < 0) {
								ok = false;
								break;
							}
            }
            
            if(ok){
              commit('addM', {
                name: 'stores',
                list: income.stores
              })
            }

            if(typeof income.delay == 'number') {
              income.timeLeft = income.delay;
            }
					}
        }
      }
    }
  }
})

export default store

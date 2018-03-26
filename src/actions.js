import store from '@/store'
import {_} from '@/components/translate'

const actions = {
    toast(tab, value) {
        if (value === undefined) {
            value = tab
            tab = null
        }
        store.dispatch('toast', {
            value: _(value),
            tab
        })
    },

    setStore(name, value) {
        store.dispatch('setStore', {
            name,
            value
        })
    },

    printQueue(tab) {
        store.dispatch('printQueue', tab)
    },

    setStoreM(list) {
        store.dispatch('setStoreM', list)
    },

    addM(name, list) {
        store.dispatch('addM', {
            name,
            list
        })
    },

    changeValue(name, value) {
        store.dispatch('changeValue', {
            name,
            value
        })
    },
    setValue(name, value) {
        store.dispatch('setValue', {
            name,
            value
        })
    },
    setIncome (name, value) {
        store.dispatch('setIncome', {
            source: name,
            payload: value
        })
    },
    collectIncome () {
        store.dispatch('collectIncome')
    },
    destroyHuts (num, allowEmpty) {
        const _HUT_ROOM = 4;

		var dead = 0;
		for(var i = 0; i < num; i++){
			var population = store.state.population || 0;
			var rate = population / _HUT_ROOM;
			var full = Math.floor(rate);
			// by default this is used to destroy full or half-full huts
			// pass allowEmpty to include empty huts in the armageddon
			var huts = (allowEmpty) ? (store.state.buildings.hut || 0) : Math.ceil(rate);
			if(!huts) {
				break;
			}
			// random can be 0 but not 1; however, 0 as a target is useless
			var target = Math.floor(Math.random() * huts) + 1;
			var inhabitants = 0;
			if(target <= full){
				inhabitants = _HUT_ROOM;
			} else if(target == full + 1){
				inhabitants = population % _HUT_ROOM;
			}
            
            this.changeValue('buildings.hut', -1)


			if(inhabitants){
				killVillagers(inhabitants);
				dead += inhabitants;
			}
		}
		// this method returns the total number of victims, for further actions
		return dead;
	},
}

export default actions
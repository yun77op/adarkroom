<template>
    <div>
        <button class="flat-button" type="button" @click="lightFire()" v-if="builderState === -1">生火</button>
        <tbutton text="添柴" v-on:click="strokeFire" :active="strokeFireButtonActive" v-if="builderState > -1"></tbutton>

        <div class="section" v-if="buildVisible">
            <h1 class="section-heading">建筑物</h1>
            <div class="section-body">
                <list-item v-on:infoClick="infoClick(key)" v-on:click="build(key)" v-if="CraftablesVisible[key]" v-for="(item, key) of Craftables" :key="key" :text="_(item.name)"></list-item>
                <list-item v-on:infoClick="infoClick(key4)" v-on:click="build(key4)" v-if="TradeGoodsVisible[key4]" v-for="(item, key4) of TradeGoods" :key="key4" :text="_(item.name)"></list-item>
            </div>
        </div>

        <div class="section" v-if="storesVisible">
            <h1 class="section-heading">库存</h1>
            <div class="section-body">
                <store-item v-for="(value, key1) in resources" :key="key1" :name="key1" :text="`${_(key1)}：${value}`"></store-item>
                <store-item v-for="(value, key2) in weapons" :key="key2" :name="key2" :text="`${_(key2)}：${value}`"></store-item>
                <store-item v-for="(value, key3) in specials" :key="key3" :name="key3" :text="`${_(key1)}：${value}`"></store-item>
            </div>
        </div>

        <tdialog :zanDialogObj="zanDialog" :show.sync="show" @click="handleClick"></tdialog>
    </div>

</template>

<style scoped>
    .section {
        margin-top: 24px;
    }
    .section-heading {
        color: rgba(0,0,0,.6);
        font-size: 12px;
        padding: 8px 8px;
    }

</style>


<script>
import tbutton from '@/components/tbutton';
import listItem from '@/components/list-item'
import storeItem from '@/components/store-item'
import store from '@/store'
import { mapState, mapActions } from 'vuex'
import Craftables from './Craftables'
import TradeGoods from './stores/TradeGoods'
import MiscItems from './stores/MiscItems'
import actions from '../actions'
import tdialog from './Dialog'
import {_} from '@/components/translate'

const FIRE_COOL_DELAY = 300000;
const NEED_WOOD_DELAY = 15000;
const BUILDER_STATE_DELAY = 30000;
const ROOM_WARM_DELAY = 5000;

const FireEnum = {
    fromInt: function(value) {
        for(var k in this) {
            if(typeof this[k].value != 'undefined' && this[k].value == value) {
                return this[k];
            }
        }
        return null;
    },
    Dead: { value: 0, text: _('dead') },
    Smoldering: { value: 1, text: _('smoldering') },
    Flickering: { value: 2, text: _('flickering') },
    Burning: { value: 3, text: _('burning') },
    Roaring: { value: 4, text: _('roaring') }
};

const TempEnum = {
    fromInt: function(value) {
        for(var k in this) {
            if(typeof this[k].value != 'undefined' && this[k].value == value) {
                return this[k];
            }
        }
        return null;
    },
    Freezing: { value: 0, text: _('freezing') },
    Cold: { value: 1, text: _('cold') },
    Mild: { value: 2, text: _('mild') },
    Warm: { value: 3, text: _('warm') },
    Hot: { value: 4, text: _('hot') }
};


const handleStoresChange = function(newValue) {
    for (let k in newValue) {
        let type;

        if(Craftables[k]) {
            type = Craftables[k].type;
        } else if(TradeGoods[k]) {
            type = TradeGoods[k].type;
        } else if (MiscItems[k]) {
            type = MiscItems[k].type;
        }

        switch(type) {
        case 'upgrade':
            // Don't display upgrades on the Room screen
            continue;
        case 'building':
            // Don't display buildings either
            continue;
        case 'weapon':
            this.weapons[k] = this.stores[k]
            break;
        case 'special':
            this.specials[k] = this.stores[k]
            break;
        default:
            this.resources[k] = this.stores[k]
            break;
        }

    }
}


export default {

props: ['currentTab'],

  components: {
    tbutton,
    listItem,
    tdialog,
    storeItem
  },

  watch: {
      currentTab(newValue, oldValue) {
          if (newValue === 0) {
              this.onArrival();
          }
      },
      temperature(newValue) {
        if (store.state.currentTab !== 0) {
            return;
        }

        if (newValue >= TempEnum.Warm.value) {
            store.commit('changeTheme', 'warm');
        } else {
            store.commit('changeTheme', 'cold');
        }
        console.log('temperature', newValue)
      },

        stores: {
            handler: handleStoresChange,
            deep: true,
            immediate: true
        },
  },

    data() {
        return {
            Craftables,
            TradeGoods,
            strokeFireButtonActive: false,
            resources: {},
            weapons: {},
            specials: {},

            zanDialog: {},
            show: false
        }
    },

    computed: {

        TradeGoodsVisible() {
            const obj = {};

            Object.keys(TradeGoods).forEach((thing) => {
                if(this.buildings["trading post"] > 0) {
                    if(thing == 'compass' || this.stores[thing] != 'undefined') {
                        // Allow the purchase of stuff once you've seen it
                        obj[thing] = true;
                    } else {
                        obj[thing] = false;
                    }
                }
            });

            return obj
        },

        CraftablesVisible() {
            const obj = {};

            Object.keys(Craftables).forEach((name) => {
                const craftable = this.Craftables[name];
                let cost = craftable.cost(store.state);

                if (this.buildings[name] > 0) {
                    obj[name] = true;
                    return
                }

                if (this.needsWorkshop(craftable) && (this.buildings.workshop || 0) === 0) {
                    obj[name] = false;
                    return;
                }

                if (this.builderState < 4) {
                    obj[name] = false;
                    return;
                }

                if (this.stores.wood < (cost.wood || 0) * 0.5) {
                    obj[name] = false;
                    return;
                }

                for(let c in cost) {
                    if(!this.stores[c]) {
                        obj[name] = false;
                        return;
                    }
                }

                obj[name] = true;
            })
            return obj;
        },

        buildVisible() {
            return Object.keys(Craftables).some((name) => {
                return this.CraftablesVisible[name];
            });
        },

        stores() {
            return store.state.stores;
        },

        storesVisible() {
            return Object.keys(this.stores).length > 0
        },
        builderState() {
            return store.state.builderState;
        },
        fire() {
            return store.state.fire;
        },
        temperature() {
            return store.state.temperature;
        },
        buildings() {
            return store.state.buildings;
        }
    },

    created() {
        setTimeout(this.adjustTemp, ROOM_WARM_DELAY);
        setTimeout(this.coolFire, FIRE_COOL_DELAY);

        this.setupCollectIncomeTimer()

        if (this.builderState >= 0 && this.builderState < 3) {
            setTimeout(this.updateBuilderState, BUILDER_STATE_DELAY);
        }

        if (this.builderState === -1) {
            this.strokeFireButtonActive = true;
        }
    },

    methods: Object.assign({

        _,

        setupCollectIncomeTimer() {
		    setTimeout(() => {
                this.collectIncome()
                this.setupCollectIncomeTimer()
            }, 1000);
        },

        handleStoresChange,

        needsWorkshop: function(type) {
		    return type == 'weapon' || type == 'upgrade' || type =='tool';
        },


        infoClick(thing) {
            const craftable = Craftables[thing]
            const cost = craftable.cost()
            const content = []

            for (let k in cost) {
                content.push(_(k) + ': ' + cost[k])
            }

            this.zanDialog = {
                title: _(craftable.name),
                content,
                buttons: [
                    {
                        text: '确定',
                        nextScene: 'end'
                    }
                ]
            }

            this.show = true
        },

        build(thing) {

            if (this.temperature <= TempEnum.Cold.value) {
			    this.toast(0, _("builder just shivers"))
                return
            }

            let numThings = 0;
            const craftable = Craftables[thing]

		    switch(craftable.type) {
            case 'good':
            case 'weapon':
            case 'tool':
            case 'upgrade':
                // numThings = $SM.get('stores["'+thing+'"]', true);
                break;
            case 'building':
                numThings = this.buildings[thing] || 0
                break;
            }

            if (craftable.maximum <= numThings) {
                wx.showToast({
                    title: '已达最大值',
                    icon: 'none',
                    duration: 2000
                })
                return;
            }

            const costNeeded = craftable.cost(store.state)

            const obj = {}

            for (let i in costNeeded) {
                if (costNeeded[i] > (this.stores[i] || 0)) {
                    wx.showToast({
                        title: _("not enough " + i),
                        icon: 'none',
                        duration: 2000
                    })

                    return
                }

                obj[i] = this.stores[i] - costNeeded[i]
            }

            const stores = Object.assign({}, this.stores, obj)

            this.setStoreM(stores)

            switch(craftable.type) {
            case 'good':
            case 'weapon':
            case 'upgrade':
            case 'tool':
                this.changeValue('stores.' + thing, 1)
                break;
            case 'building':
                this.changeValue('buildings.' + thing, 1)
                break;
            }

            this.toast(0, craftable.buildMsg)
        },

        onArrival() {
            const theme = this.temperature >= TempEnum.Warm.value ? 'warm' : 'cold';

            store.commit('changeTheme', theme);
            
            if (this.builderState === 3) {
                this.changeValue('builderState', 1)

                actions.setIncome('builder', {
                    delay: 10,
                    stores: {
                        wood: 2
                    }
                })

                this.toast(0, 'the stranger is standing by the fire. she says she can help. says she builds things.')
            }
        },

        lightFire() {

            // if (this.level === 0) {
            //     this.$refs.strokeFireButton.clickHandle();
            // }

            // this.onFireChange();

            // if (this.builderState === -1) {
                // this.builderState = 0;
            // }

            this.setValue('fire', FireEnum.Burning.value)
            this.setValue('builderState', 0)

            this.toast(0, _("the light from the fire spills from the windows, out into the dark"));

            setTimeout(this.updateBuilderState, BUILDER_STATE_DELAY);
        },

        strokeFire(event) {
            if (this.stores.wood === 0) {
                this.toast(0, _("the wood has run out"));
                event.isPrevented = true;
                return;
            }

            if (this.stores.wood > 0) {
                this.changeValue('stores.wood', -1)
            }

            if (this.fire < 4) {
                this.changeValue('fire', 1)
            }

            this.onFireChange();
        },

        updateBuilderState() {
            if (this.builderState == 0) {
                this.toast(0, _("a ragged stranger stumbles through the door and collapses in the corner"));
                this.changeValue('builderState', 1)
                setTimeout(this.unlockForest, NEED_WOOD_DELAY);
            } else if (this.builderState < 3 && this.temperature >= TempEnum.Warm.value) {
                let msg = '';
                switch(this.builderState) {
                case 1:
                    msg = _("the stranger shivers, and mumbles quietly. her words are unintelligible.");
                    break;
                case 2:
                    msg = _("the stranger in the corner stops shivering. her breathing calms.");
                }
                this.toast(0, msg);
                this.changeValue('builderState', 1)
            }

            if (this.builderState < 3) {
                setTimeout(this.updateBuilderState, BUILDER_STATE_DELAY);
            }
        },

        onFireChange() {
            this.toast(0, _('the fire is {0}', FireEnum.fromInt(this.fire).text))
            setTimeout(this.coolFire, FIRE_COOL_DELAY);
        },

        coolFire() {
            if (this.fire === 0) {
                return;
            }

            this.changeValue('fire', -1)
        },

        unlockForest() {
            this.setStore('wood', 4);

		    this.toast(0, _("the wind howls outside"));
            this.toast(0, _("the wood is running out"));

            this.$emit('unlockLevel');
        },

        adjustTemp() {
            if (this.temperature > 0 && this.temperature > this.fire) {
                this.changeValue('temperature', -1)
                this.toast(0, _('the room is {0}', TempEnum.fromInt(this.temperature).text));
            } else if (this.temperature < 4 && this.temperature < this.fire) {
                this.changeValue('temperature', 1)
                this.toast(0, _('the room is {0}', TempEnum.fromInt(this.temperature).text));
            }

            setTimeout(this.adjustTemp, ROOM_WARM_DELAY);
        }
    }, actions
    )
}
</script>

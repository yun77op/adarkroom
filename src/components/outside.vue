<template>
    <div>
        <div class="list">
            <div class="list-item">
                <tbutton text="伐木" @click="gatherWood()" activeColor="#66BC5C"></tbutton>
            </div>
            <button class="flat-button list-item" type="button" @click="checkTraps" v-if="trapsVisible">{{i18nCheckTraps}}</button>
        </div>
        <div class="section" v-if="buildings.hut > 0">
            <h1 class="section-heading">{{populationSectionName}}</h1>
            <div class="section-body list">
                <list-item :text="getWorkerName('gatherer') + '：' + workers.gatherer" :hasInfo="false"></list-item>

                <worker-item v-for="(value, i) in workers" v-if="i !== 'gatherer'" :key="i" :i18nName="getWorkerName(i)" :i18n="i18n" :name="i" :workerNum="value" v-on:increaseWorker="increaseWorker(i)" v-on:decreaseWorker="decreaseWorker(i)">
                </worker-item>
            </div>
        </div>

        <div class="section" v-if="villageSectionVisible">
            <h1 class="section-heading">{{villageSectionName}}</h1>
            <div class="section-body">
                <list-item v-for="(value, i) in buildings" :key="i" :text="_(i) + '：' + value" :hasInfo="false"></list-item>
            </div>
        </div>
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

<style>

</style>


<script>
import tbutton from '@/components/tbutton';
import store from '@/store'
import { mapState, mapActions } from 'vuex'
import listItem from '@/components/list-item'
import workerItem from '@/components/worker-item'
import Income from './stores/Income'
import TrapDrops from './stores/TrapDrops'
import actions from '../actions'
import {_} from '@/components/translate'

const _HUT_ROOM = 4;
const _POP_DELAY = [0.5, 3];

export default {
    props: ['currentTab'],

    components: {
        tbutton,
        listItem,
        workerItem
    },

    data() {
        return {
            Income,
            i18nCheckTraps: _('check traps')
        }
    },

    computed: {
        stores() {
            return store.state.stores;
        },

        populationSectionName() {
            return _('population') + ' ' + this.population + '/' + this.maxPopulation
        },

        villageSectionName() {
            if ((this.buildings.hut || 0) > 0) {
                return _('village')
            } else {
                return _('forest')
            }
        },

        buildings() {
            const buildings = Object.assign({}, store.state.buildings)

            if (buildings.trap !== undefined) {
				const numTraps = buildings.trap
				const numBait = this.stores.bait || 0;
				let traps = numTraps - numBait;
                traps = traps < 0 ? 0 : traps;

                buildings.trap = traps
                buildings['baited trap'] = numBait > numTraps ? numTraps : numBait
            }

            return buildings
        },

        villageSectionVisible() {
            return Object.keys(this.buildings).length > 0
        },

        trapsVisible() {
            return this.buildings.trap > 0
        },

        population() {
            return store.state.population
        },

        workers() {
            const obj = {};

            const workers = store.state.workers;
		    let numGatherers = this.population;

            for (let k in workers) {
                let num = workers[k]
                numGatherers -= num
                obj[k] = num
            }

            obj.gatherer = numGatherers

            return obj
        },

        maxPopulation() {
            return (this.buildings.hut || 0) * _HUT_ROOM
        }
    },

    watch: {

        stores: {
            handler: function(newValue) {
                if (newValue.compass > 0) {
                    if (store.state.level === 1) {
                        this.$emit('unlockLevel');
                    }
                }
            },
            deep: true
        },

      currentTab(newValue, oldValue) {
          if (newValue === 1) {
              this.onArrival();
          }
      },

        buildings: {
            handler(newValue, oldValue) {
                if (newValue.hut > 0) {
                    this.schedulePopIncrease();
                }

                for (let k in newValue) {
                    this.checkWorker(k, newValue)
                }
            },
            immediate: true,
            deep: true
        },

        workers: {
            handler(newValue, oldValue) {

                for (let worker in Income) {
                    let workerNum = newValue[worker]
                    const income = Income[worker]

                    if (typeof workerNum !== 'number') {
                        continue
                    }

                    const stores = {}
                    let needsUpdate = false

				    for(let storeName in income.stores) {
					    stores[storeName] = income.stores[storeName] * workerNum;
                        const curIncome = store.state.income[worker] || {}

                        if(curIncome[storeName] != stores[storeName]) {
                            needsUpdate = true;
                        }
                    }

                    if (needsUpdate) {
                        actions.setIncome(worker, {
                            delay: income.delay,
                            stores: stores
                        })
                    }
                }
            },
            deep: true
        }
    },

    // mapState([
    //     'buildings'
    // ]),


    methods: Object.assign({

        onArrival() {
            store.commit('changeTheme', 'forest');
        },

        i18n: _,
        _,

        increaseWorker(worker) {
            actions.changeValue('workers.' + worker, 1)
        },

        decreaseWorker(worker) {
            actions.changeValue('workers.' + worker, -1)
        },

        getWorkerName(key) {
            let name = Income[key].name;
            if(!name) name = key;
            return name;
        },

        gatherWood() {
            actions.toast(1, _("dry brush and dead branches litter the forest floor"));
            const gatherAmount = this.buildings.cart > 0 ? 50 : 10;

            this.changeValue('stores.wood', gatherAmount)
        },

        // killVillagers: function(num) {
        //     const delta = this.population >= num ? num : this.population

        //     actions.changeValue('population', delta * -1)

        //     var remaining = Outside.getNumGatherers();

        //     if(remaining < 0) {
        //         var gap = -remaining;
        //         for(var k in $SM.get('game.workers')) {
        //             var numWorkers = $SM.get('game.workers["'+k+'"]');
        //             if(numWorkers < gap) {
        //                 gap -= numWorkers;
        //                 $SM.set('game.workers["'+k+'"]', 0);
        //             } else {
        //                 $SM.add('game.workers["'+k+'"]', gap * -1);
        //                 break;
        //             }
        //         }
        //     }
        // },

        checkTraps() {
            var drops = {};
            var msg = [];
            const numTraps = this.buildings.trap
            var numBait = this.stores.bait || 0;
            var numDrops = numTraps + (numBait < numTraps ? numBait : numTraps);
            for(let i = 0; i < numDrops; i++) {
                let roll = Math.random();
                for(let j in TrapDrops) {
                    let drop = TrapDrops[j];
                    if(roll < drop.rollUnder) {
                        let num = drops[drop.name];
                        if(typeof num == 'undefined') {
                            num = 0;
                            msg.push(drop.message);
                        }
                        drops[drop.name] = num + 1;
                        break;
                    }
                }
            }
            /// TRANSLATORS : Mind the whitespace at the end.
            var s = _('the traps contain ');
            for(var l = 0, len = msg.length; l < len; l++) {
                if(len > 1 && l > 0 && l < len - 1) {
                    s += ", ";
                } else if(len > 1 && l == len - 1) {
                    /// TRANSLATORS : Mind the whitespaces at the beginning and end.
                    s += _(" and ");
                }
                s += msg[l];
            }
            
            var baitUsed = numBait < numTraps ? numBait : numTraps;
            drops['bait'] = -baitUsed;

            actions.toast(1, s);
            this.addM('stores', drops);
        },

        checkWorker: function(name, buildings) {
            var jobMap = {
                'lodge': ['hunter', 'trapper'],
                'tannery': ['tanner'],
                'smokehouse': ['charcutier'],
                'iron mine': ['iron miner'],
                'coal mine': ['coal miner'],
                'sulphur mine': ['sulphur miner'],
                'steelworks': ['steelworker'],
                'armoury' : ['armourer']
            };
            
            var jobs = jobMap[name];
            if(typeof jobs == 'object') {
                for(var i = 0, len = jobs.length; i < len; i++) {
                    var job = jobs[i];
                    if(typeof buildings[name] == 'number' &&
                            buildings[name] > 0 && 
                            typeof this.workers[job] != 'number') {
                        console.log('adding ' + job + ' to the workers list');
                        actions.setValue('workers.'+job, 0);
                    }
                }
            }
        },

        increasePopulation: function() {
            var space = this.maxPopulation - this.population
            if(space > 0) {
                let num = Math.floor(Math.random()*(space/2) + space/2);
                if(num === 0) num = 1;
                if(num == 1) {
                    actions.toast(1, _('a stranger arrives in the night'));
                } else if(num < 5) {
                    actions.toast(1, _('a weathered family takes up in one of the huts.'));
                } else if(num < 10) {
                    actions.toast(1, _('a small group arrives, all dust and bones.'));
                } else if(num < 30) {
                    actions.toast(1, _('a convoy lurches in, equal parts worry and hope.'));
                } else {
                    actions.toast(1, _("the town's booming. word does get around."));
                }
                console.log('population increased by ' + num);
                actions.changeValue('population', num);
            }
            this.schedulePopIncrease();
        },

        schedulePopIncrease() {
            var nextIncrease = Math.floor(Math.random()*(_POP_DELAY[1] - _POP_DELAY[0])) + _POP_DELAY[0];
            console.log('next population increase scheduled in ' + nextIncrease + ' minutes');
            this._popTimeout = setTimeout(this.increasePopulation, nextIncrease * 60 * 1000);
        }
    }, 
    // mapActions([
    //         'modifyStore',
    //         'toast'
    //     ])

        {
            changeValue(name, value) {
                store.dispatch('changeValue', {
                    name,
                    value
                })
            },
            addM(name, list) {
                store.dispatch('addM', {
                    name,
                    list
                })
            },
        }
    )
}
</script>

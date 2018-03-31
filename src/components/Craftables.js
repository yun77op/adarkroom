import store from '@/store'
import {_} from '@/components/translate'

const Craftables = {
    'trap': {
        name: _('trap'),
        maximum: 10,
        availableMsg: _('builder says she can make traps to catch any creatures might still be alive out there'),
        buildMsg: _('more traps to catch more creatures'),
        maxMsg: _("more traps won't help now"),
        type: 'building',
        cost: function () {
            const n = store.state.buildings.trap || 0;
            return {
                'wood': 10 + (n * 10)
            };
        }
    },
    'cart': {
        name: _('cart'),
        button: null,
        maximum: 1,
        availableMsg: _('builder says she can make a cart for carrying wood'),
        buildMsg: _('the rickety cart will carry more wood from the forest'),
        type: 'building',
        cost: function () {
            return {
                'wood': 30
            };
        }
    },
    'hut': {
        name: _('hut'),
        button: null,
        maximum: 20,
        availableMsg: _("builder says there are more wanderers. says they'll work, too."),
        buildMsg: _('builder puts up a hut, out in the forest. says word will get around.'),
        maxMsg: _('no more room for huts.'),
        type: 'building',
        cost: function () {
            var n = store.state.buildings.hut || 0;
            return {
                'wood': 100 + (n * 50)
            };
        }
    },
    'lodge': {
        name: _('lodge'),
        button: null,
        maximum: 1,
        availableMsg: _('villagers could help hunt, given the means'),
        buildMsg: _('the hunting lodge stands in the forest, a ways out of town'),
        type: 'building',
        cost: function () {
            return {
                wood: 100, // 200
                fur: 2, // 10
                meat: 1
            };
        }
    },
    'trading post': {
        name: _('trading post'),
        button: null,
        maximum: 1,
        availableMsg: _("a trading post would make commerce easier"),
        buildMsg: _("now the nomads have a place to set up shop, they might stick around a while"),
        type: 'building',
        cost: function () {
            return {
                'wood': 400,
                'fur': 100
            };
        }
    },
    'tannery': {
        name: _('tannery'),
        button: null,
        maximum: 1,
        availableMsg: _("builder says leather could be useful. says the villagers could make it."),
        buildMsg: _('tannery goes up quick, on the edge of the village'),
        type: 'building',
        cost: function () {
            return {
                'wood': 500,
                'fur': 50
            };
        }
    },
    'smokehouse': {
        name: _('smokehouse'),
        button: null,
        maximum: 1,
        availableMsg: _("should cure the meat, or it'll spoil. builder says she can fix something up."),
        buildMsg: _('builder finishes the smokehouse. she looks hungry.'),
        type: 'building',
        cost: function () {
            return {
                'wood': 600,
                'meat': 50
            };
        }
    },
    'workshop': {
        name: _('workshop'),
        button: null,
        maximum: 1,
        availableMsg: _("builder says she could make finer things, if she had the tools"),
        buildMsg: _("workshop's finally ready. builder's excited to get to it"),
        type: 'building',
        cost: function () {
            return {
                'wood': 800,
                'leather': 100,
                'scales': 10
            };
        }
    },
    'steelworks': {
        name: _('steelworks'),
        button: null,
        maximum: 1,
        availableMsg: _("builder says the villagers could make steel, given the tools"),
        buildMsg: _("a haze falls over the village as the steelworks fires up"),
        type: 'building',
        cost: function () {
            return {
                'wood': 1500,
                'iron': 100,
                'coal': 100
            };
        }
    },
    'armoury': {
        name: _('armoury'),
        button: null,
        maximum: 1,
        availableMsg: _("builder says it'd be useful to have a steady source of bullets"),
        buildMsg: _("armoury's done, welcoming back the weapons of the past."),
        type: 'building',
        cost: function () {
            return {
                'wood': 3000,
                'steel': 100,
                'sulphur': 50
            };
        }
    },
    'torch': {
        name: _('torch'),
        button: null,
        type: 'tool',
        buildMsg: _('a torch to keep the dark away'),
        cost: function () {
            return {
                'wood': 1,
                'cloth': 1
            };
        }
    },
    'waterskin': {
        name: _('waterskin'),
        button: null,
        type: 'upgrade',
        maximum: 1,
        buildMsg: _('this waterskin\'ll hold a bit of water, at least'),
        cost: function () {
            return {
                'leather': 50
            };
        }
    },
    'cask': {
        name: _('cask'),
        button: null,
        type: 'upgrade',
        maximum: 1,
        buildMsg: _('the cask holds enough water for longer expeditions'),
        cost: function () {
            return {
                'leather': 100,
                'iron': 20
            };
        }
    },
    'water tank': {
        name: _('water tank'),
        button: null,
        type: 'upgrade',
        maximum: 1,
        buildMsg: _('never go thirsty again'),
        cost: function () {
            return {
                'iron': 100,
                'steel': 50
            };
        }
    },
    'bone spear': {
        name: _('bone spear'),
        button: null,
        type: 'weapon',
        buildMsg: _("this spear's not elegant, but it's pretty good at stabbing"),
        cost: function () {
            return {
                'wood': 100,
                'teeth': 5
            };
        }
    },
    'rucksack': {
        name: _('rucksack'),
        button: null,
        type: 'upgrade',
        maximum: 1,
        buildMsg: _('carrying more means longer expeditions to the wilds'),
        cost: function () {
            return {
                'leather': 200
            };
        }
    },
    'wagon': {
        name: _('wagon'),
        button: null,
        type: 'upgrade',
        maximum: 1,
        buildMsg: _('the wagon can carry a lot of supplies'),
        cost: function () {
            return {
                'wood': 500,
                'iron': 100
            };
        }
    },
    'convoy': {
        name: _('convoy'),
        button: null,
        type: 'upgrade',
        maximum: 1,
        buildMsg: _('the convoy can haul mostly everything'),
        cost: function () {
            return {
                'wood': 1000,
                'iron': 200,
                'steel': 100
            };
        }
    },
    'l armour': {
        name: _('l armour'),
        type: 'upgrade',
        maximum: 1,
        buildMsg: _("leather's not strong. better than rags, though."),
        cost: function () {
            return {
                'leather': 200,
                'scales': 20
            };
        }
    },
    'i armour': {
        name: _('i armour'),
        type: 'upgrade',
        maximum: 1,
        buildMsg: _("iron's stronger than leather"),
        cost: function () {
            return {
                'leather': 200,
                'iron': 100
            };
        }
    },
    's armour': {
        name: _('s armour'),
        type: 'upgrade',
        maximum: 1,
        buildMsg: _("steel's stronger than iron"),
        cost: function () {
            return {
                'leather': 200,
                'steel': 100
            };
        }
    },
    'iron sword': {
        name: _('iron sword'),
        button: null,
        type: 'weapon',
        buildMsg: _("sword is sharp. good protection out in the wilds."),
        cost: function () {
            return {
                'wood': 200,
                'leather': 50,
                'iron': 20
            };
        }
    },
    'steel sword': {
        name: _('steel sword'),
        button: null,
        type: 'weapon',
        buildMsg: _("the steel is strong, and the blade true."),
        cost: function () {
            return {
                'wood': 500,
                'leather': 100,
                'steel': 20
            };
        }
    },
    'rifle': {
        name: _('rifle'),
        type: 'weapon',
        buildMsg: _("black powder and bullets, like the old days."),
        cost: function () {
            return {
                'wood': 200,
                'steel': 50,
                'sulphur': 50
            };
        }
    }
}

export default Craftables

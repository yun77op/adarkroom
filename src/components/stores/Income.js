import {_} from '@/components/translate'

const Income = {
    'gatherer': {
        name: _('gatherer'),
        delay: 10,
        stores: {
            'wood': 1
        }
    },
    'hunter': {
        name: _('hunter'),
        delay: 10,
        stores: {
            'fur': 0.5,
            'meat': 0.5
        }
    },
    'trapper': {
        name: _('trapper'),
        delay: 10,
        stores: {
            'meat': -1,
            'bait': 1
        }
    },
    'tanner': {
        name: _('tanner'),
        delay: 10,
        stores: {
            'fur': -5,
            'leather': 1
        }
    },
    'charcutier': {
        name: _('charcutier'),
        delay: 10,
        stores: {
            'meat': -5,
            'wood': -5,
            'cured meat': 1
        }
    },
    'iron miner': {
        name: _('iron miner'),
        delay: 10,
        stores: {
            'cured meat': -1,
            'iron': 1
        }
    },
    'coal miner': {
        name: _('coal miner'),
        delay: 10,
        stores: {
            'cured meat': -1,
            'coal': 1
        }
    },
    'sulphur miner': {
        name: _('sulphur miner'),
        delay: 10,
        stores: {
            'cured meat': -1,
            'sulphur': 1
        }
    },
    'steelworker': {
        name: _('steelworker'),
        delay: 10,
        stores: {
            'iron': -1,
            'coal': -1,
            'steel': 1
        }
    },
    'armourer': {
        name: _('armourer'),
        delay: 10,
        stores: {
            'steel': -1,
            'sulphur': -1,
            'bullets': 1
        }
    }
}

export default Income
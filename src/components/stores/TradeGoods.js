const TradeGoods = {
    'scales': {
        type: 'good',
        cost: function() {
            return { fur: 150 };
        }
    },
    'teeth': {
        type: 'good',
        cost: function() {
            return { fur: 300 };
        }
    },
    'iron': {
        type: 'good',
        cost: function() {
            return {
                'fur': 150,
                'scales': 50
            };
        }
    },
    'coal': {
        type: 'good',
        cost: function() {
            return {
                'fur': 200,
                'teeth': 50
            };
        }
    },
    'steel': {
        type: 'good',
        cost: function() {
            return {
                'fur': 300,
                'scales': 50,
                'teeth': 50
            };
        }
    },
    'medicine': {
        type: 'good',
        cost: function() {
            return {
                'scales': 50, 'teeth': 30
            };
        }
    },
    'bullets': {
        type: 'good',
        cost: function() {
            return {
                'scales': 10
            };
        }
    },
    'energy cell': {
        type: 'good',
        cost: function() {
            return {
                'scales': 10,
                'teeth': 10
            };
        }
    },
    'bolas': {
        type: 'weapon',
        cost: function() {
            return {
                'teeth': 10
            };
        }
    },
    'grenade': {
        type: 'weapon',
        cost: function() {
            return {
                'scales': 100,
                'teeth': 50
            };
        }
    },
    'bayonet': {
        type: 'weapon',
        cost: function() {
            return {
                'scales': 500,
                'teeth': 250
            };
        }
    },
    'alien alloy': {
        type: 'good',
        cost: function() {
            return {
                'fur': 1500,
                'scales': 750,
                'teeth': 300
            };
        }
    },
    'compass': {
        type: 'special',
        maximum: 1,
        cost: function() {
            return {
                fur: 400,
                scales: 20,
                teeth: 10
            };
        }
    }
}

export default TradeGoods

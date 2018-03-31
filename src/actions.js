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

    startThieves: function() {
        this.setValue('thieves', 1);
        this.setValue('income.thieves', {
			delay: 10,
			stores: {
				'wood': -10,
				'fur': -5,
				'meat': -5
			}
		});
    },

    login() {
        return new Promise((resolve, reject) => {
            wx.login({
                success: res => {
                // 发送 res.code 到后台换取 openId, sessionKey, unionId
                    wx.request({
                        url: 'https://hzls.miemie001.com/adarkroom/api/login',
                        method:'post',
                        data: {
                            code:res.code
                        },
                        header: {
                            'content-type': 'application/x-www-form-urlencoded'
                        },
                        success: function (res) {
                            wx.setStorageSync('tokens', res.data)
                            resolve()
                        },
                        fail: function (error) {
                            wx.showToast({
                                title: '登陆失败，' + JSON.stringify(error),
                                icon: 'none',
                                duration: 2000
                            })
                            reject();
                        }
                    });
                },
                fail: res => {
                    wx.showToast({
                        title: '登陆失败，登陆接口错误',
                        icon: 'none',
                        duration: 2000
                    })
                    reject();
                    
                }
            })
        })
    },

    saveProgress(data) {
        const tokens = wx.getStorageSync('tokens')

        wx.request({
            url: 'https://hzls.miemie001.com/adarkroom/api/progress/save',
            method:'post',
            data: {
                openid: tokens.openid,
                data: JSON.stringify(data)
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            success: (res) => {

            },
            fail() {
                wx.showToast({
                    title: '进度保存失败',
                    icon: 'none',
                    duration: 2000
                })
            }
        });
    },

    loadProgress() {
        const tokens = wx.getStorageSync('tokens')

        wx.request({
            url: 'https://hzls.miemie001.com/adarkroom/api/progress/load',
            method:'post',
            data: {
                openid: tokens.openid
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            success: (res) => {
                if (res.data.errcode === 0) {
                    try {
                        const state = JSON.parse(res.data.result);
                        store.replaceState(state)
                    } catch(e) {
                        wx.showToast({
                            title: '进度载入失败，格式解析错误',
                            icon: 'none',
                            duration: 2000
                        })
                    }
                }
            },
            fail() {
                wx.showToast({
                    title: '进度载入失败',
                    icon: 'none',
                    duration: 2000
                })
            }
        });
    },
    
    bootstrap() {
        const tokens = wx.getStorageSync('tokens')

        // if (!tokens) {
            this.login()
            .then(() => {
                this.loadProgress();
            }).catch(() => {
                // wx.showToast({
                //     title: '登陆失败',
                //     icon: 'none',
                //     duration: 2000
                // })
            })
            return;
        // }

        // this.loadProgress();
    }
}

export default actions
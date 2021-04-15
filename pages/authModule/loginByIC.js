import Utils from "../../utils/util"
import WxApi from "../../utils/wxapi"
import WxRequest from "../../utils/wxrequest"
import Config from "../../utils/config"
import Notify from '../../assets/vant-weapp/notify/notify';

let UPage = require("../../plugins/u-page")
let utils = new Utils();
let wxRequest = new WxRequest();
let wxApi = new WxApi();
Page(Object.assign({
    data: {
        hideRollBack: true,
        isFirstLoad: true,
        isLoading: false,
        showMainPanel: true,
        username: "",
        password: "",
        restSecond: 60,
        code:'',
    },
    onLoad(options) {
    },
    onShow() {
        let that = this;
        wx.login({
            success: function (res) {
                wx.setStorageSync("code", res.code)
                that.setData({
                    code: res.code
                })
            }
        })
    },
    login(page) { // 登录操作
        //校验
        if (utils.validateStringNull(page.data.username)) {
            Notify("账号不能为空");
            return;
        }
        if (utils.validateStringNull(page.data.password)) {
            Notify("验证码不能为空");
            return;
        }
        // page.messageSend();
        if (!page.data.isLoading) {
            wxApi.showLoading().then(function () {
                return wxRequest.postRequest("app_v1/default/login-by-sms", {
                    mobile: page.data.username,
                    verify_code: page.data.password
                } , function (data) {
                    page.hideAllPromptMessage();
                    // wxApi.navigateBack()
                    wx.setStorageSync('permissions', data.permissions)
                     wxApi.switchTab("/pages/indexModule/index") ;
                } , function (err) {
                    page.hideAllPromptMessage();
                    Notify(err.data.message);
                });
            })
        }
    },
    taste(page) {
        if (!page.data.isLoading) {
            wxApi.showLoading("进入体验账号").then(function () {
                return wxRequest.postRequest("app_v1/default/login-as-trial" , "" , function (data) {
                    page.hideAllPromptMessage();
                    // wxApi.navigateBack()
                     wxApi.switchTab("/pages/indexModule/index") ;
                } , function (err) {
                    page.hideAllPromptMessage();
                    Notify(err.data.message);
                });
            })
        }
    },
    onPullDownRefresh: function () {
        this.loadData(this);
    },
    enterPage(e) {
        var page = this;
        var type = utils.getBindAttr(e);
        var ids = utils.getBindAttr(e, "ids");
        switch (type) {
            case "1":// 登录
                page.login(page)
                break;
            case "2":// 体验
            // page.messageSend();
                page.taste(page)
                break;
            case "3":// 密码登录
                wxApi.navigateTo("./login")
                break
            case "4":// 验证码处理
                page.checkCode(e)
                break;
            case "5"://微信授权登录顺带触发
                // page.messageSend();
                break;
            default:
                break;
        }
    },
    insertText(e) {
        var type = utils.getBindAttr(e);
        var value = utils.getBindValue(e);
        switch (type) {
            case "0":
                this.data.username = value;
                break;
            case "1":
                this.data.password = value;
                break;
            default:
                break;
        }
    },
    checkCode(e) {
        let page = this
        if (!page.data.validating) {
            page.data.validating = true
            // 判断是否为手机号码
            if (!utils.isPoneAvailable(page.data.username)) {
                Notify("手机号码格式不正确")
                page.data.validating = false
                return
            }
            // 设置定时计算
            var timeInterval = 0
            var intervalId = setInterval(function () {
                if (timeInterval < 60) {
                    timeInterval += 1
                    page.setData({
                        restSecond: 60 - timeInterval
                    })
                } else {
                    clearInterval(intervalId)
                    page.setData({
                        restSecond: 60
                    })
                }
            }, 1000)

            // 获取验证码
            wxApi.showLoading("获取验证码").then(function () {
                return wxRequest.postRequest("app_v1/default/send-sms", {
                    mobile: page.data.username
                } , function (data) {
                    page.hideAllPromptMessage();
                    Notify(err.data.message);
                    page.data.validating = false
                    // // wxApi.navigateBack()
                    // wxApi.switchTab("/pages/laserModule/deviceList")
                } , function (err) {
                    page.hideAllPromptMessage();
                    Notify(err.data.message);
                    page.data.validating = false
                });
            })
        }
    },
    getPhoneNumber(e) {
        let that = this;
        let code = wx.getStorageSync("code");
        if (code=='') {
            wx.login({
                success: function (res) {
                    wx.setStorageSync("code", res.code)
                    that.setData({
                        code: res.code
                    })
                    that.loginByPhone(e);
                }
            })
        }else {
            that.loginByPhone(e);
        }
    },
    loginByPhone(e) {
        let that = this;
        let code = wx.getStorageSync('code'); //|| that.data.code
        let encrypted_data = e.detail.encryptedData;
        let iv = e.detail.iv;
        if (code) {
            if (!that.data.isLoading) {
                wxApi.showLoading("登录中").then(function () {
                    return wxRequest.postRequest("link_v1/default/wx-login-by-phone", {
                        encrypted_data,
                        iv,
                        code,
                    }, function (data) {
                        that.data.isLoading = false;
                        wx.removeStorageSync('code');
                          wx.setStorageSync('permissions', data.permissions)
                        wxApi.switchTab("/pages/equip/equip");
                        console.log("解密成功")
                        that.hideAllPromptMessage();//隐藏所有的提示框
                    }, function (err) {
                        wx.removeStorageSync('code');
                        that.reLogin("登录失败，请重新登录");
                        // wx.showModal({
                        //     title: '提示',
                        //     content: '登录失败，请重新登录！',
                        //     showCancel: false,
                        //     success(res) {
                        //         if (res.confirm) {
                        //             wx.removeStorageSync('access_token');
                        //             // wx.removeStorageSync('code');
                        //             wxApi.switchTab("../indexModule/index");
                        //         }
                        //     }
                        // })
                        console.log("解密失败,err=", err);
                        that.data.isLoading = false;
                        that.hideAllPromptMessage();//隐藏所有的提示框
                    });
                })
            }
        }
    },
    reLogin(text) {
        wx.showModal({
            title: '提示',
            content: text,
            // '登录失败，请重新登录！',
            showCancel: false,
            success(res) {
                if (res.confirm) {
                    wx.login({
                        success: function (res) {
                            wx.setStorageSync("code", res.code)
                            that.setData({
                                code: res.code
                            })
                        }
                    })
                }
                return;
            }
        })
    },
    messageSend() {
        let that = this;
        let tmplIds = ['yRIo6i7uP6ZfIdky845hK_qUz61IPvig1hb8bB1dVDE'];
        wx.getSetting({
            withSubscriptions: true,
            success(res) {
                if (!res.subscriptionsSetting.mainSwitch) {  //订阅消息总开关,true为开启,false为关闭
                    wx.showModal({
                        title: '提示',
                        content: "授权失败,请打开设置页重新授权",
                        success(res) {
                            if (res.confirm) {
                                wx.openSetting({
                                    success(res) {
                                        that.requestSubscribeMessage(tmplIds);
                                    }, fail(err) {
                                        // Toast('设置授权失败');
                                    }
                                })
                            } else {
                                // Toast('授权失败');
                            }
                        }
                    })
                } else {
                    that.requestSubscribeMessage(tmplIds);
                }
                console.log("res", res)
            },
            fail(err) {
                console.log("授权失败", err)
            }
        })
    },
    requestSubscribeMessage(tmplIds) {
        wx.requestSubscribeMessage({
            tmplIds,
            success(res) {
                console.log('已授权接收订阅消息', res)
                // wx.redirectTo({
                //     url: redirectUrl
                // });
            },
            fail(err) {
                console.log('接收订阅消息授权失败', err)
                // wx.redirectTo({
                //     url: redirectUrl
                // });
            }
        })
    },
    // onShareAppMessage: function () {
    //     return {title: Config.AppName, path: "/pages/indexModule/index"}
    // }
}, UPage))
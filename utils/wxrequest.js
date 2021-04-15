import Config from "./config"
import Promise from "../plugins/es6-promise.min"
import Upage from "../plugins/u-page";  

Promise.prototype.finally = (callback)=> {
    let P = this.constructor;
    return this.then(
        value => P.resolve(callback()).then(() => value),
        reason => P.resolve(callback()).then(() => {
            throw reason
        })
    );
};

//添加注释

//封住微信Request请求类
class WxRequest {
    constructor() {//构造方法
    }

    //使用Promise来处理网络POST请求的内容
    wxRequestPromisify(fn) {
        var that = this;
        return (obj = {})=> {
            return new Promise((resolve, reject) => {
                obj.success = (res) => {//对象成功方法的回调
                    if (res.data.code == 0) {   
                        //成功访问
                        try {
                            if (typeof res.data.data.access_token != "undefined" && !typeof res.data.data.access_token != null) {
                                wx.setStorageSync('access_token', res.data.data.access_token);
                            }
                            resolve(res.data.data);
                        } catch (e) {
                            if (typeof fail != "undefined" && typeof fail == "function") {
                                console.log(e)
                                reject({message: "未知错误，请重试!", code: -1});
                            }
                        }
                    } else {
                        let code = res.data.code;
                        switch (code) {
                            case 30401:
                                that.error30401()
                                reject(res.data)
                                break;
                            default:
                                reject(res.data)
                                break;
                        }
                    }
                }
                obj.fail = (res)=> {//对象失败方法的回调
                    //失败
                    reject({message: "网络状态异常，请稍后重试!", code: -1})
                }
                fn(obj)//调动wx.request方法
            })
        }
    }

    //微信POST请求方法
    request(url, data={}) {
        try {
            var value = wx.getStorageSync('access_token')
            if (value) {
                url += "?access-token=" + value;
            }
        } catch (e) {
        }
        url = Config.Url + url;//拼接URL
        var getRequest = this.wxRequestPromisify(wx.request);
        return getRequest({
            url,
            data,
            method: 'POST',
            header: {
                "content-type": "application/x-www-form-urlencoded"
            }
        })
    }


    //使用原来的callback方法来处理调用的内容
     postRequest(url, data, success, fail) {
        let that = this
        let urls = url;
        let datas = data;
        let successes = success
        let fails = fail
        //判断success是否为正确的参数
        if (typeof success != 'function')return;
        //获取AccessToken
        try {
            var value = wx.getStorageSync('access_token')
            if (value)url += "?access-token=" + value;
        } catch (e) {
        }
        url = Config.Url + url;//拼接URL
        //拼接请求参数
        return wx.request({
            url,
            data,
            method: 'POST',
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            success(res){
                if (res.data.code == 0) {//正常访问
                    try {
                        if (typeof res.data.data.access_token != "undefined" && !typeof res.data.data.access_token != null) {
                            wx.setStorageSync('access_token', res.data.data.access_token);
                        }
                        success(res.data.data);
                    } catch (e) {
                        console.log("11111", e)
                        if (typeof fail != "undefined" && typeof fail == "function") {
                            fail({message: "未知错误，请重试!", code: -1})
                        }
                    }
                } else {//异常访问
                    let code = res.data.code;
                    switch (code) {
                        case 30401:
                            that.error30401()
                            break;
                        case 40201:
                            let access_token = wx.getStorageSync("access_token")
                            that.request("app_v1/default/refresh-token" , {
                                access_token
                            }).then(function (data){
                                wx.setStorage("access_token" , data);
                                that.postRequest(urls, datas, successes, fails)
                                return;
                            }).catch(function(err){
                                that.request("app_v1/default/refresh-token" , {
                                    access_token
                                }).then(function (data){
                                    wx.setStorage("access_token" , data);
                                    that.postRequest(urls, datas, successes, fails)
                                    return;
                                }).catch(function(err){
                                    that.request("app_v1/default/refresh-token" , {
                                        access_token
                                    }).then(function (data){
                                        wx.setStorage("access_token" , data);
                                        that.postRequest(urls, datas, successes, fails)
                                        return;
                                    }).catch(function(err){
                                        that.error30401();
                                    })
                                })
                            })
                            break;
                        default:
                            fail(res)
                            break;
                    }
                    Upage.hideAllPromptMessage();//隐藏所有的提示框
                }
                // fail(res)
            },
            fail(e){
                fail({message: "网络状态异常，请稍后重试!", code: -1})
                Upage.hideAllPromptMessage();//隐藏所有的提示框
            }

        });
    }
    postRequest2(url, data, success, fail) {
        let that = this
        let urls = url;
        let datas = data;
        let successes = success
        let fails = fail
        //判断success是否为正确的参数
        if (typeof success != 'function')return;
        //获取AccessToken
        url = Config.CodeUrl + url;//拼接URL
        //拼接请求参数
        return wx.request({
            url,
            data,
            method: 'POST',
            header: {
              'content-type': 'application/json' // 默认值
            },
            success(res){
                if (res.data.code == 1) {//正常访问
                    try {
                        success(res.data);
                    } catch (e) {
                        if (typeof fail != "undefined" && typeof fail == "function") {
                            fail({message: "未知错误，请重试!", code: -1})
                        }
                    }
                } else {//异常访问
                    fail(res)
                    Upage.hideAllPromptMessage();//隐藏所有的提示框
                }
                // fail(res)
            },
            fail(){
                fail({message: "网络状态异常，请稍后重试!", code: -1})
                Upage.hideAllPromptMessage();//隐藏所有的提示框
            }
        });
    }
    postRequest_quality(url, data, success, fail) {
        let that = this
        let urls = url;
        let datas = data;
        let successes = success
        let fails = fail
        //判断success是否为正确的参数
        if (typeof success != 'function')return;
        url = Config.QualityUrl + url;//拼接URL
        //拼接请求参数
        return wx.request({
            url,
            data,
            method: 'POST',
            header : { 
                'content-type': 'application/x-www-form-urlencoded' 
            },
            success(res){
                if (res.data.code == 0) {//正常访问
                    try {
                        success(res.data);
                    } catch (e) {
                        if (typeof fail != "undefined" && typeof fail == "function") {
                            fail({message: "未知错误，请重试!", code: -1})
                        }
                    }
                } else {//异常访问
                    fail(res)
                    Upage.hideAllPromptMessage();//隐藏所有的提示框
                }
                // fail(res)
            },
            fail(){
                fail({message: "网络状态异常，请稍后重试!", code: -1})
                Upage.hideAllPromptMessage();//隐藏所有的提示框
            }
        });
    }
    //30401错误处理
    error30401() {
        var that = this;
        try {
            wx.removeStorageSync('access_token');
            wx.removeStorageSync('page-index-mine');
            // wx.showModal({
            //     title: '提示', content: '账号登录异常，请进行登录操作', showCancel: false, success: function (res) {
            //         if (res.confirm) {
                        wx.redirectTo({url:"../authModule/loginByIC"})
                        // if (!that.validationIndex()) {
                        //     wx.switchTab({url: '../laserModule/deviceList'})
                        // }
                        // else {
                        //     wx.switchTab({url: '../laserModule/deviceList'})
                        // }
            //         }
            //     }
            // });
        } catch (e) {
            console.log("执行30401异常处理异常");
            wx.navigateBack({delta: 20});
        }
    }

    validationIndex() {//判断当前是否为首页,若为首页那么我们不继续退出
        var pages = getCurrentPages();
        var length = pages.length;
        if (length == 1)return true;
        else return false;
    }
}

export default WxRequest;

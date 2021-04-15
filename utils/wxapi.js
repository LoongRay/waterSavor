import Promise from "../plugins/es6-promise.min"

//无论promise对象最后状态如何都会执行
Promise.prototype.finally = (callback) => {
    let P = this.constructor;
    return this.then(
        value => P.resolve(callback()).then(() => value),
        reason => P.resolve(callback()).then(() => {
            throw reason
        })
    );
};

//封住微信API的回调类
class WxApi {
    constructor() {//构造方法
    }

    wxPromisify(fn) {
        return (obj = {}) => {
            return new Promise((resolve, reject) => {
                obj.success = (res) => {//对象成功方法的回调
                    resolve(res)
                }
                obj.fail = (res) => {//对象失败方法的回调
                    //失败
                    reject(res)
                }
                fn(obj)
            })
        }
    }

    //拍摄视频或从手机相册中选视频，返回视频的临时文件路径
    chooseVideo(compressed = false, maxDuration = 60, sourceType = ['album', 'camera'], camera = "back",) {
        var chooseVideo = this.wxPromisify(wx.chooseVideo)
        return chooseVideo({sourceType, compressed, camera, maxDuration})
    }


    //从本地相册选择图片或使用相机拍照
    chooseImage(count = 1, sizeType = ['original', 'compressed'], sourceType = ['album', 'camera']) {
        var chooseImage = this.wxPromisify(wx.chooseImage)
        return chooseImage({count, sizeType, sourceType})
    }

    //预览图片
    previewImage(current = "", urls = []) {
        var previewImage = this.wxPromisify(wx.previewImage)
        return previewImage({current, urls})
    }

    //展示Loading
    scanCode(onlyFromCamera = true) {
        var scanCode = this.wxPromisify(wx.scanCode)
        return scanCode({onlyFromCamera})
    }

    //展示Loading
    showLoading(title = "信息加载中") {
        var showLoading = this.wxPromisify(wx.showLoading)
        var mask = true;
        return showLoading({title, mask})
    }

    //展示Toast
    showToast(title = "", icon = "loading", duration = 2000, mask = true) {
        var showToast = this.wxPromisify(wx.showToast)
        return showLoading({
            title, icon, duration, mask
        })
    }

    //展示Modal
    showModal(title = "", content = "") {
        var showModal = this.wxPromisify(wx.showModal);
        return showModal({title, content})
    }


    //隐藏消息提示框
    hideLoading() {
        wx.hideLoading();
    }

    //打电话
    contactMobile(phoneNumber) {
        wx.makePhoneCall({phoneNumber})
    }

    //进行switchTab操作
    switchTab(url) {
        wx.switchTab({url})
    }

    //进行navigateTo操作
    navigateTo(url) {
        wx.navigateTo({url})
    }

    //进行redirectTo操作
    redirectTo(url) {
        wx.redirectTo({url})
    }

    //进行reLaunch操作
    reLaunch(url) {
        wx.reLaunch({url})
    }

    //进行reLaunch操作
    navigateBack(delta) {
        wx.navigateBack({delta})
    }

    //进行reLaunch操作
    setNavigationBarTitle(title) {
        wx.setNavigationBarTitle({title})
    }

    //进行页面的滚动
    pageScrollTo(number) {
        wx.pageScrollTo({scrollTop: number})
    }
}

export default WxApi;
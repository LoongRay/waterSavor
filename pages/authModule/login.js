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
        password: ""
    },
    onLoad(options) {
    },
    onShow() {
        let page = this;
    },
    login(page) { // 登录操作
        //校验
        if (utils.validateStringNull(page.data.username)) {
            Notify("账号不能为空");
            return;
        }
        if (utils.validateStringNull(page.data.password)) {
            Notify("密码不能为空");
            return;
        }
        if (!page.data.isLoading) {
            wxApi.showLoading().then(function () {
                return wxRequest.postRequest("app_v1/default/login", {
                    username: page.data.username,
                    password: page.data.password
                } , function (data) {
                    page.hideAllPromptMessage();
                    wx.setStorageSync('permissions', data.permissions)
                    // wxApi.navigateBack()
                    wxApi.switchTab("/pages/indexModule/index");
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
                    wx.setStorageSync('permissions', data.permissions)
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
                page.taste(page)
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
    // onShareAppMessage: function () {
    //     return {title: Config.AppName, path: "/pages/indexModule/index"}
    // }
}, UPage))
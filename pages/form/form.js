// pages/form/form.js

import Utils from "../../utils/util"
import WxApi from "../../utils/wxapi"
import WxRequest from "../../utils/wxrequest"

let UPage = require("../../plugins/u-page")
let utils = new Utils(); //工具
let wxRequest = new WxRequest(); //创建1个微信请求实例
let wxApi = new WxApi();
const app = getApp();

Page(Object.assign({

  /**
   * 页面的初始数据
   */
  data: {
    winWidth: 0,
    winHeight: 0,
    currentTab: 0,
    allspot: [], //全部激光机数据
    prodspot: [] //加工点数据
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var page = this;
    page.loadData(page);
    /**
     * 获取当前设备的宽高
     */
    wx.getSystemInfo({
      success: function (res) {
        //console.log(res);
        page.setData({
          clientHeight: res.windowHeight
        });
      }
    });
  },

  //切换选项栏
  swichNav: function (e) {
    var page = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      //console.log(e.target.dataset.current);
      page.setData({
        currentTab: e.target.dataset.current
      })
      page.loadData(page);
    }
  },
  loadData(page) {
    let currentTab = page.data.currentTab;
    console.log(currentTab); //未点击切换栏,当前菜单索引值默认为1
    let params = {};
    let url = "link_v1/device-huayi/report-index";
    let setIntervalTime = 10000; //定时时间，默认10秒
    if (currentTab == 1) {
      url = "link_v1/device-huayi/report-index-filter";
      setIntervalTime = 15000;
    } else if (currentTab == 2) {
      url = 'link_v1/device-water-saver/produce-line-list';
      params = {
        page: 1,
        limit: 10,
      }
    }
    wxApi.showLoading().then(function () {
      return wxRequest.postRequest(
        url,
        params,
        function (data) {
          console.log(data);
          if (currentTab == 1) {
            page.setData({
              prodspot: data
            })
          } else if (currentTab == 0) {
            page.setData({
              allspot: data
            })
          } else if (currentTab == 2) {
            page.setData({
              water_save: data
            })
          }
          wx.hideLoading(); //数据载入后,清除加载中动画
        },
        function (err) {
          console.log("获取连接错误");
          wx.hideLoading();
        }
      )
    })
  },

  bindChange: function (e) {
    var page = this;
    page.setData({
      currentTab: e.detail.current
    });

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
}, UPage));
// pages/test/test.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    winWidth: 0,
    winHeight: 0,
    currentTab: 0,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var page = this;
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
    }
  },
  bindChange: function (e) {
    var page = this;
    page.setData({
      currentTab: e.detail.current
    });
  }
})
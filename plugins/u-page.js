//2017-10-20 用于封装page，不要将多余的内容写到每一个页面，统一的内容会输出到当前对象


import Config from "../utils/config";

module.exports = Object.assign({
    //在这里创建的方法能够在页面直接调动

    //隐藏使用的所有的内容，包含原生下拉刷新，loading，toast
    hideAllPromptMessage() {
        wx.hideToast();
        wx.hideLoading();
        wx.stopPullDownRefresh();
        wx.hideNavigationBarLoading();
    },
    /**
     * 展示网络加载后，正确加载的问题
     * @param page
     * @param data
     */
    showSuccessLoadPage(page, data = {}) {
        var status = {showMainPanel: true, showEmptyPanel: false, showErrorPanel: false, showNoLoginPanel: false}
        page.setData(Object.assign(data, status))
    },
    /**
     * 展示网络加载后,加载异常的问题
     * @param page
     * @param data
     */
    showErrorLoadPage(page) {
        var status = {showMainPanel: false, showEmptyPanel: false, showErrorPanel: true, showNoLoginPanel: false}
        page.setData(Object.assign({}, status))
    },

    /**
     * 展示网络加载后,无数据加载的问题
     * @param page
     * @param data
     */
    showNoDataPage(page) {
        var status = {showMainPanel: false, showEmptyPanel: true, showErrorPanel: false, showNoLoginPanel: false}
        page.setData(Object.assign({}, status))
    },

    /**
     * 展示网络加载后,无数据加载的问题
     * @param page
     * @param data
     */
    showClearPage(page) {
        var status = {showMainPanel: false, showEmptyPanel: false, showErrorPanel: false, showNoLoginPanel: false}
        page.setData(Object.assign({}, status))
    },

    /**
     * 展示未登录的面板
     * @param page
     * @param data
     */
    showNoLoginPage(page) {
        var status = {showMainPanel: false, showEmptyPanel: false, showErrorPanel: false, showNoLoginPanel: true}
        page.setData(Object.assign({}, status))
    },

    /**
     * 刷新界面
     */
    refreshUrl() {
        this.onShow()
    },

    /**
     * 返回上一页
     */
    rollBack() {
        wx.navigateBack({delta: 1})
    },

    /**
     * 进行登录的操作
     */
    enterLogin() {
        wx.navigateTo({url: '/pages/authModule/loginByIC'})
    },
    /**
     * 进行更新的操作
     */
    refreshData: function (page) {
        page.data.isRefreshData = true;
        page.multiPageLoad(false)
    },
    /**
     * 进行加载更多的操作
     */
    loadMoreData: function (page) {
        page.data.isLoadingMore = true;
        page.multiPageLoad(true)
    },
    /**
     * 进行加载前执行的方法
     * @returns {*}
     */
    multiPageLoad_a(page, flag) {
        var submitData = null;
        var message = "获取信息"
        if (flag) {
            message = "加载更多"
            page.data.page += 1;
        } else page.data.page = 1;
        page.data.loadMessage = message;
        submitData = {page: page.data.page};
        return submitData;
    },
    /**
     * 对进行加载的页面是否存在下一页的内容进行保存
     */
    multiPageLoad_b(page, data) {
        page.data.has_next = data.next;
        page.data.reload = data.reload;
    },
    onShareAppMessage: function () {
        return {
            title: Config.AppName,
            imageUrl:"../../assets/images/shareImg.jpg",
             path: "/pages/indexModule/index"
        }
    },
    // 分享到朋友圈
    onShareTimeline() {
        return {
            title: Config.AppName,
            imageUrl:"../../assets/images/shareImg.jpg",
             path: "/pages/indexModule/index"
        }
    },
})
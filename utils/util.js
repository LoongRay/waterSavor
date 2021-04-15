/**
 * 工具方法类
 */
class Utils {
    constructor() {//构造方法
    }

    json2Form(json) {//json对象转化为字符串
        var str = [];
        for (var p in json) {
            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(json[p]));
        }
        return str.join("&");
    }

    //获取输入框data-""的值,默认为type
    getBindAttr(e, typeName = "type") {
        return e.currentTarget.dataset[typeName];
    }

    //获取输入框的value的值
    getBindValue(e) {
        return e.detail.value;
    }

    //判断是否进行提交中
    isSubmiting(page) {
        if (page.data.submiting) return true;
        else return false;
    }

    //设定当前是否进行提交
    setSubmiting(page, flag) {
        page.data.submiting = flag
    }

    //校验页面点击是否过于频繁，500毫秒为限定，若是过快操作，我将点击作为误操作，否定这次点击的响应
    validatePageClick(page, e) {
        var flag = (e.timeStamp - page.data.lastClickTime) > 500;
        if (typeof page.data.lastClickTime == "undefined") flag = true;
        page.data.lastClickTime = e.timeStamp;
        return flag;
    }

    //判断字符串是否为空,为空返回true，否则false
    validateStringNull(str) {
        if (str == null || typeof str == "undefined") return true;
        if (str.toString().replace(/(^s*)|(s*$)/g, "").length == 0) {
            return true
        } else return false;
    }

    //判断手机号码是否为正常的手机号码
    validateMobileNumber(number) {
        var reg = /^1[0-9]{10}$/
        return reg.test(number)
    }

    //JavaScript如何计算两个日期间的时间差
    getDateDiff(startTime, endTime, diffType) {
        //将xxxx-xx-xx的时间格式，转换为 xxxx/xx/xx的格式
        startTime = startTime.replace(/\-/g, "/");
        endTime = endTime.replace(/\-/g, "/");
        //将计算间隔类性字符转换为小写
        diffType = diffType.toLowerCase();
        var sTime = new Date(startTime);      //开始时间
        var eTime = new Date(endTime);  //结束时间
        //作为除数的数字
        var divNum = 1;
        switch (diffType) {
            case "second":
                divNum = 1000;
                break;
            case "minute":
                divNum = 1000 * 60;
                break;
            case "hour":
                divNum = 1000 * 3600;
                break;
            case "day":
                divNum = 1000 * 3600 * 24;
                break;
            default:
                break;
        }
        return parseInt((eTime.getTime() - sTime.getTime()) / parseInt(divNum));
        //使用方法：http://blog.csdn.net/bodilove/article/details/52105782
    }

    //将两个数组进行合并
    contactArray(arr1, arr2) {
        for (var i = 0; i < arr2.length; i++)
            arr1.push(arr2[i]);
        arr2 = null;
        return arr1;
    }

    //获取今天的日期
    getTodayDate() {
        var day = new Date();
        return day.getFullYear() + "-" + (day.getMonth() + 1) + "-" + day.getDate();
    }

    //将xxxx-xx-xx的时间格式，转换为 xxxx/xx/xx的格式,解决苹果的Date类的识别问题
    getDate(dateTime) {
        return new Date(dateTime.replace(/\-/g, "/"));
    };

    //判断是否是空的数组，是空返回true，否则为false
    isEmptyArray(obj) {
        if (obj == null) return true;
        // 然后可以根据长度判断，在低版本的ie浏览器中无法这样判断。
        if (obj.length > 0) return false;
        if (obj.length === 0) return true;
        return true;
    }

    //判断是否空对象，是空对象返回true，否则false
    isEmptyObj(object) {
        for (var i in object) {
            // 存在属性或方法，则不是空对象
            return false;  // sodino.com
        }
        if (object === null || typeof (object) == "undefined") {
            return true;
        }
        return true;
    }

    // 创建地图显示的Markker,flag为是否添加callout
    createMapMarkers(mapArrs, flag) {
        let markers = new Array();
        for (var i = 0; i < mapArrs.length; i++) {
            let marker = mapArrs[i]
            if (flag) {
                markers.push({
                    iconPath: '/assets/images/marker_red.png',
                    id: i,
                    width: 32,
                    height: 32,
                    latitude: marker.latitude,
                    longitude: marker.longitude,
                    callout: {
                        content: marker.address,
                        fontSize: 12,
                        borderRadius: 6,
                        padding: 4,
                        display: "BYCLICK",
                        textAlign: "center",
                        color: "#ffffff",
                        bgColor: "#2A82e4"
                    }
                })
            } else {
                markers.push({
                    iconPath: '/assets/images/marker_red.png',
                    id: i,
                    width: 32,
                    height: 32,
                    latitude: marker.latitude,
                    longitude: marker.longitude
                })
            }

        }
        return markers
    }

    updateMarkersCallout(list, mapArr, id) {
        for (let i = 0; i < mapArr.length; i++) {
            let obj = mapArr[i]
            if (id == obj.id) {
                mapArr[i].callout = {
                    content: list[i].address,
                    fontSize: 12,
                    borderRadius: 6,
                    padding: 4,
                    display: "BYCLICK",
                    textAlign: "center",
                    color: "#ffffff",
                    bgColor: "#2A82e4"
                }
            } else {
                delete (mapArr[i].callout)
            }
        }
        return mapArr
    }

    // 通过正则表达式，判断是否为手机号
    isPoneAvailable(poneInput) {
        var myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
        if (!myreg.test(poneInput)) {
            return false;
        } else {
            return true;
        }
    }
}

export default Utils;
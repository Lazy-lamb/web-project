//每次调用$.get()或$.post()会先调用ajaxPrefilter()这个函数,这个函数可以拿到Ajax提供的配置对象
$.ajaxPrefilter(function(option) {
    option.url = "http://www.liulongbin.top:3007" + option.url

    //统一为有权限的接口，设置 headers 请求头 

    //indexOf('/my/') !== -1 说明字符串中有该字符对象  ==-1说明没有
    //indexOf 的 O 要大写
    if (option.url.indexOf('/my/') !== -1) {
        option.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
    }

    //全局统一挂载complete函数
    option.complete = function(res) {
        if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
            //清空token缓存
            localStorage.removeItem('token')
                //跳转登录页面
            location.href = 'login.html'
            layer.alert('请先登录！', { icon: 2 });

        }
    }
})
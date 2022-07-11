$(function() {
    var form = layui.form

    //要显示警告信息，需要使用layer
    var layer = layui.layer

    //昵称验证规则
    form.verify({
        nikename: function(value) {
            if (value.length > 6) {
                return '昵称长度必须在1~6个字符之间!'
            }
        }
    })

    initUserInfo()

    //初始化用户的基本信息
    function initUserInfo() {
        $.ajax({
            method: "GET",
            url: '/my/userinfo',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg("获取用户信息失败！")
                }
                console.log(res);

                //调用 form.val('filter'，对象参数) 快速为表单赋值,需要配合表单lay-filter="formUserInfo"使用
                form.val("formUserInfo", res.data)
            }
        })
    }

    //重置表单数据
    $('#btnReset').on("click", function(e) {
        //阻止表单的默认重置行为
        e.preventDefault();
        initUserInfo()
    })

    //监听表单的提交事件
    $('.layui-form').on('submit', function(e) {
        console.log($(this).serialize());
        //阻止表单的默认提交行为
        e.preventDefault()
            //发起ajax数据请求
        $.ajax({
            method: "POST",
            url: "/my/userinfo",
            //快速获取表单填写的数据
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('更新用户信息失败！')
                }
                layer.msg('成功更新用户信息！')
                    //调用父页面的方法，重新渲染用户的信息和头像
                window.parent.getUserInfo()
            }
        })
    })



})
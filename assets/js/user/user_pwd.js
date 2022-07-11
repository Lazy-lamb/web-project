$(function() {
    var form = layui.form

    //表单正则验证
    form.verify({
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位,且不能出现空格'],
        //samePwd是专门给新密码框添加的规则，value就是新密码框填写的值
        samePwd: function(value) {
            if (value === $('[name=oldPwd]').val()) {
                return '新旧密码不能相同！'
            }
        },
        //确认密码框
        rePwd: function(value) {
            if (value !== $('[name=newPwd]').val()) {
                return '两次密码不一致！'
            }
        }
    })

    // 发起ajax请求
    $('.layui-form').on('submit', function(e) {
        e.preventDefault();
        $.ajax({
            method: "POST",
            url: "/my/updatepwd",
            //抓起表单所有password的值，提交到服务器
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layui.layer.msg("更新密码失败！")
                }
                layui.layer.msg("更新密码成功！")
                    //重置表单数据
                $('.layui-form')[0].reset() //reset()方法只能被原生js调用，但通过[0]使其变回原生js
            }
        })
    })
})
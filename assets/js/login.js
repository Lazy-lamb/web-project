$(function() {
    // 点击去注册账号的链接
    $("#link_reg").on('click', function() {
        $('.login-box').hide()
        $('.reg-box').show()
    })

    // 点击去登录的链接
    $("#link_login").on('click', function() {
        $('.login-box').show()
        $('.reg-box').hide()
    })

    // 从layui中获取form对象 前面导入了layui.js所以这里直接使用layui
    var form = layui.form
    var layer = layui.layer
    form.verify({
        pwd: [
            /^[\S]{6,12}$/, '密码必须6到12位,且不能出现空格'
        ],

        repwd: function(value) {
            //因为将repwd给了再次确认密码选项，所以value获取到的就是确认密码框输入的值
            // 通过形参拿到确认密码框的内容
            // 还需要拿到密码框的内容，进行比较
            var pwd = $('.reg-box [name=password]').val() //根据name进行筛选
            if (pwd !== value) {
                return '两次密码不一致！'
            }
        }

    })


    //监听注册表单的提交事件
    $('#form_reg').on('submit', function(e) {
        e.preventDefault();
        var data = {
            username: $('#form_reg [name=username]').val(),
            password: $('#form_reg [name=password]').val()
        };
        $.post('/api/reguser', data,
            function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                layer.msg('注册成功！请登录')
                    //模拟人的点击’去登陆‘
                $('#link_login').click()
            })
    })

    //监听登录表单的提交事件
    $('#form_login').submit(function(e) {
        e.preventDefault();
        $.ajax({
            url: '/api/login',
            method: 'POST',
            //this就是#form_login，serialize()获取表单所有内容
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('登录失败！')
                }
                //将登录成功得到的token值存到本地存储
                localStorage.setItem('token', res.token)
                layer.msg('登录成功！')
                    // location.href = 'index.html'
            }
        })
    })
})
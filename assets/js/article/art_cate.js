$(function() {

    var layer = layui.layer
    var form = layui.form
    initCateList()

    //获取文章分类的列表，并且修改到模板引擎
    function initCateList() {
        $.ajax({
            method: "GET",
            url: "/my/article/cates",
            success: function(res) {
                // console.log(res);
                //注意格式，不加引号
                var htmlStr = template('tel-table', res)
                $('tbody').html(htmlStr)
            }
        })
    }

    //根据索引，关闭弹出层
    var indexAdd = null
        //为添加类别按钮绑定事件
    $('#btnAddCate').on('click', function() {
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '260px'],
            title: '添加文章分类',
            content: $('#dialog-add').html()
        });
    })

    //通过代理的形式，为form-add表单绑定submit事件
    //#form-add还不存在，因为要点击#btnAddCate这个按钮，#form-add才会生成，而这个js对象会在一开始就执行所有，所以必不可能存在
    $('body').on('submit', '#form-add', function(e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            //抓表单的所有数据
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    console.log(res);
                    return layer.msg('新增分类失败！')
                        // let test1 = $(this).serialize()
                }
                initCateList()
                layer.msg('新增分类成功！')
                    // console.log($(this).serialize());
                    // 根据索引关闭对应的弹出层
                layer.close(indexAdd)
            }
        })
    })

    //方便关闭该弹出窗口
    var indexEdit = null
        //通过代理的形式，为btn-edit按钮绑定点击事件
    $('tbody').on('click', '.btn-edit', function() {
        //弹出一个修改文章分类信息的层
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '260px'],
            title: '修改文章分类',
            content: $('#dialog-edit').html()
        })

        //this指向编辑按钮
        var id = $(this).attr("data-id")
        console.log(id);
        //发起请求获取对应分类的数据
        $.ajax({
            method: "GET",
            //这个也要加 ‘/’，因为后面还有个id值
            url: "/my/article/cates/" + id,
            success: function(res) {
                console.log(res);
                //form.val()给指定form表单填充数据
                form.val('form-edit', res.data)
            }

        })
    })

    //通过代理的形式，为修改分类的表单绑定 submit 事件
    $("body").on('submit', "#form-edit", function(e) {
        e.preventDefault()
        $.ajax({
            method: "POST",
            url: "/my/article/updatecate",
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg("修改分类数据失败！")
                }
                layer.msg("修改分类数据成功！")
                layer.close(indexEdit)
                initCateList()
            }
        })
    })

    //通过代理的形式，为删除按钮的绑定 点击事件
    $('tbody').on('click', '.btn-delete', function() {
        //获取按钮中data-id="{{$value.Id}}"的值,
        var id = $(this).attr('data-id')
            //提示用户是否要删除
        layer.confirm('确认删除', { icon: 3, title: "提示" }, function(index) {
            $.ajax({
                method: "GET",
                url: '/my/article/deletecate/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        console.log(res);
                        return layer.msg("删除分类失败！原因：" + res.message)
                    }
                    layer.msg("删除分类成功！")
                        //关闭当前窗口
                    layer.close(index)
                    initCateList()
                }
            })

        })
    })
})
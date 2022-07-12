$(function() {
    var layer = layui.layer
    var form = layui.form
    var laypage = layui.laypage

    //定义美化时间的过滤器
    template.defaults.imports.dateFormat = function(date) {
        const dt = new Date(date)

        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())

        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ":" + ss
    }


    //定义补零函数
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }


    //定义一个查询的参数对象，将来请求数据的时候
    //需要将请求参数对象提交到服务器 等会ajax的data直接就是q
    var q = {
        pagenum: 1, //页码值，默认请求第一页的数据
        pagesize: 2, //每页显示几条数据，默认每页显示两条
        cate_id: '', //文章分类的Id
        state: '', //文章发布的状态
    }

    initTable()
    initCate()


    // 获取文章列表数据的方法
    function initTable() {
        $.ajax({
            method: 'GET',
            url: "/my/article/list",
            data: q,
            success: function(res) {
                if (res.status !== 0) {
                    // console.log(res);
                    return layer.msg('获取文章列表失败！')
                }
                //使用模板引擎渲染页面的数据
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)

                //调用渲染分页的方法
                renderPage(res.total)
            }
        })
    }


    //初始化文章分类的方法
    function initCate() {
        $.ajax({
            method: "GET",
            url: "/my/article/cates",
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg("获取文章数据失败！")
                }
                //调用模板引擎渲染分类的可选项
                var htmlStr = template('tpl-cate', res)
                $("[name=cate_id]").html(htmlStr)
                    // console.log(htmlStr);
                form.render()
            }
        })
    }


    //为筛选表单绑定 submit 事件
    $('#form-search').on('submit', function(e) {
        e.preventDefault();
        //获取表单中选中项的值
        var cate_id = $('[name=cate_id]').val()
        var state = $('[name=state]').val()
            //为查询对象 q 中对应的属性赋值
        q.cate_id = cate_id
        q.state = state
            //根据最新的筛选条件，重新渲染表格的数据
        initTable()
    })

    //定义渲染分页的方法
    function renderPage(total) {
        //total的来源于res.total
        // console.log(total);
        //调用 laypage.render()方法来渲染分页结构
        laypage.render({
            elem: 'pagebox', //分页容器的id
            count: 10, //总数据条数 total
            limit: q.pagesize, //每页显示几条数据
            curr: q.pagenum, //设置默认被选中的分项
            //顺序很重要，按顺序来渲染
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],
            //分页发生切换的时候，触发jump回调  1,2,3,4
            //触发 jump 的方法两种：
            //如果 first 值为 true，证明是方式2触发，否则方式1
            //1.点击页码触发 jump 回调
            //2.只要调用了laypage.render，也会触发 jump，这就是造成死循环的原因
            jump: function(obj, first) {
                // console.log(first);
                // console.log(obj.curr);
                // obj.curr就是当前页码值
                q.pagenum = obj.curr
                    //把最新的条目数，赋值到 q 这个查询参数对象的 pagesize 属性中
                q.pagesize = obj.limit //limit	每页显示的条数。laypage将会借助 count 和 limit 计算出分页数。
                    //根据最新的 q 获取对应的数据类表，并渲染表格
                if (!first) { // !first意思是通过点击页码触发 jump 回调，true
                    initTable()
                }
            }
        })
    }


    //通过代理的形式，为删除按钮绑定点击事件处理函数
    $('tbody').on('click', '.btn-delete', function() {
        //获取删除按钮的个数
        var len = $('.btn-delete').length
        console.log(len);
        var id = $(this).attr('data-id')
            //询问用户是否要删除数据
        layer.confirm('确认删除？', { icon: 3, title: "提示" }, function(index) {
            $.ajax({
                method: 'GET',
                url: "/my/article/delete/" + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章失败！')
                    }
                    layer.msg('删除文章成功！')
                        // 当数据删除完成后，需要判断当前这一页中，是否还有剩余的数据
                        //如果没有剩余的数据了，则让页码-1后，
                        //再重新调用initTable方法
                    if (len === 1) {
                        //如果len=1，那证明删除完毕之后，页面上没有任何数据
                        //页码值最小必须是 1
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                    }
                    initTable()
                    layer.close(index)
                }
            })
        })
    })
})
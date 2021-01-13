$(function () {

    // 发送ajax请求,获取所有文章类别
    $.ajax({
        type: 'get',
        url: BigNew.category_list,
        success: function (backData) {
            if (backData.code == 200) {
                let optHtml = template('category_list', backData);
                $('#selCategory').html(optHtml);
            }
        }
    });

    /*  let page = 1;
     // 封装一个获取文章列表函数
     function getArticle_query(page, callBack) {
         // 发送ajax请求,获取(搜索)文章列表
         $.ajax({
             type: 'get',
             url: BigNew.article_query,
             data: {
                 type: $('#selCategory').val(),
                 state: $('#selStatus').val(),
                 page: page,
                 perpage: 3, // 页面显示条数
             },
             success: function (backData) {
                 if (backData.code == 200) {
                     let trHtml = template('article_query', backData);
                     $('tbody').html(trHtml);
                     // 要做的事情(回调函数)
                     // 回调函数不为null且传回来的数据长度不为0执行回调函数
                     if (callBack != null && backData.data.data.length != 0) {
                         // 显示页码条，隐藏p标签
                         $('#pagination').show().next('p').hide();
                         callBack(backData);
                     } else if (backData.data.totalPage == page - 1 && backData.data.data.length == 0
                         && backData.data.totalCount != 0) {
                         // 传回来的总页码等于当前页码数-1,传回来的数据长度等于0,文章总条数不等于0
                         // 重绘页码条
                         $('#pagination').twbsPagination('changeTotalPages',
                             backData.data.totalPage, page - 1);
                     } else if (backData.data.totalCount == 0) {
                         // 传回来的数据长度等于0且当前页码为1,页码条隐藏，p标签显示
                         $('#pagination').hide().next('p').show();
                     }
                 }
             }
         });
     };
 
     // 一开始就获取文章列表函数和页码条
     getArticle_query(page, function (backData) {
         // 使用分页插件
         $('#pagination').twbsPagination({
             totalPages: backData.data.totalPage,
             visiblePages: 5,
             first: '首页',
             prev: '上一页',
             next: '下一页',
             last: '尾页',
             // 点击页码的回调函数
             onPageClick: function (event, page1) {
                 // 把当前点击的页码保存起来
                 page = page1;
                 // 调用函数发送ajax请求,根据当前页码进行文章搜索
                 getArticle_query(page, null);
             }
         });
     });
 
     // 给筛选按钮设置点击事件
     $('#btnSearch').on('click', function (e) {
         e.preventDefault();
         // 发送ajax请求，重绘页码条
         getArticle_query(page, function (backData) {
             //重绘页码条
             $('#pagination').twbsPagination('changeTotalPages',
                 backData.data.totalPage, 1);
         });
     });
 
     // 给删除按钮设置点击事件(委托注册)
     $('tbody').on('click', '.delete', function () {
         if (confirm('确定要删除吗？')) {
             // 获取到删除按钮的id
             let id = $(this).attr('id');
             // 发送ajax请求,删除当前点击删除按钮行的文章
             $.ajax({
                 type: 'post',
                 url: BigNew.article_delete,
                 data: {
                     id: id
                 },
                 success: function (backData) {
                     if (backData.code == 204) {
                         alert('删除成功');
                         // 重新加载数据:根据当前页码进行文章搜索并且重绘页码条
                         getArticle_query(page, function (backData) {
                             //重绘页码条
                             $('#pagination').twbsPagination('changeTotalPages',
                                 backData.data.totalPage, page);
                         });
                     }
                 }
             });
         }
     }); */

    // 给发表文章设置点击事件
    $('#release_btn').on('click', function () {
        parent.$('.level02 li:eq(1)').addClass('active').siblings('li').removeClass('active')
    });

    // 给编辑按钮设置点击事件
    $('tbody').on('click', '.edit', function (e) {
        e.preventDefault()
        let id = $(this).data().id
        window.location.href = './article_edit.html?id=' + id
    })

    // 初始化当前页
    let current = 0
    // 封装函数
    function loadData(page) {
        current = page
        // 发送请求,获取文章列表
        $.ajax({
            url: BigNew.article_query,
            type: 'get',
            data: {
                type: $('#selCategory').val(),
                state: $('#selStatus').val(),
                page: page,
                perpage: 3
            },
            success: function (backData) {
                $('tbody').html(template('article_query', backData))
                // 判断是否有数据
                if (backData.data.totalCount > 0) {
                    $('#nodata').hide().prev().show()
                    // 销毁分页配置
                    $('#pagination').twbsPagination('destroy')
                    // 分页插件
                    $('#pagination').twbsPagination({
                        totalPages: backData.data.totalPage,
                        startPage: page,
                        visiblePages: 7,
                        first: '首页',
                        next: '下一页',
                        prev: '上一页',
                        last: '尾页',
                        initiateStartPageClick: false,
                        onPageClick: function (event, page) {
                            loadData(page)
                        }
                    })
                } else {
                    $('#nodata').show().prev().hide()
                }
            }
        })
    }
    loadData(1)

    // 给筛选按钮设置点击事件
    $('#btnSearch').click(function (e) {
        e.preventDefault()
        loadData(1)
    })

    // 给删除按钮设置点击事件
    $('tbody').on('click', '.delete', function () {
        if (confirm('你确定要删除吗？')) {
            // 发送请求删除文章
            $.ajax({
                url: BigNew.article_delete,
                type: 'post',
                data: {
                    id: $(this).data().id
                },
                success: function (backData) {
                    if (backData.code == 204) {
                        alert('删除成功')
                        // 判断是否为文章的最后一页的最后一行
                        if ($('tbody tr').length == 1 && current != 1) {
                            loadData(current - 1)
                        } else {
                            loadData(current)
                        }
                    } else {
                        alert('删除失败');
                    }
                }
            })
        }
    })
})
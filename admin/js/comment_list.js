$(function () {
    let page = 1;
    // 封装获取评论展示函数
    function getComments(page, callBack) {
        $.ajax({
            type: 'get',
            url: BigNew.comment_list,
            data: {
                page: page,
                perpage: 5
            },
            success: function (backData) {
                if (backData.code == 200) {
                    let commentHtml = template('commentsTemp', backData);
                    $('tbody').html(commentHtml);
                    if (callBack != null && backData.data.data.length != 0) {
                        callBack(backData);
                    } else if (backData.data.data.length == 0 && backData.data.totalPage == page - 1) {
                        page -= 1;
                        // 如果为最后一页的最后一条，就重绘页码条
                        $('#pagination').twbsPagination('changeTotalPages', backData.data.totalPage, page);
                    }
                }
            }
        });
    }

    // 发送ajax请求,获取评论展示和页码条
    getComments(page, function (backData) {
        // 使用分页插件
        $('#pagination').twbsPagination({
            totalPages: backData.data.totalPage, //总页码
            visiblePages: 5,
            first: '首页',
            prev: '上一页',
            next: '下一页',
            last: '尾页',
            // 点击页码的回调函数
            onPageClick: function (event, page1) {
                page = page1;
                // 根据当前点击页显示评论
                getComments(page, null)
            }
        });
    });

    // 给通过按钮设置点击事件
    $('tbody').on('click', '.pass', function (e) {
        e.preventDefault();
        // 获取到评论的id
        let id = $(this).attr('id');
        // 发送ajax请求,评论审核通过
        $.ajax({
            type: 'post',
            url: BigNew.comment_pass,
            data: {
                id: id
            },
            success: function (backData) {
                if (backData.code == 200) {
                    alert('评论审核通过');
                    // 重新加载评论
                    getComments();
                }
            }
        });
    });

    // 给拒绝按钮设置点击事件
    $('tbody').on('click', '.refuse', function () {
        // 获取评论id
        let id = $(this).attr('id');
        // 发送ajax请求,评论审核拒绝
        $.ajax({
            type: 'post',
            url: BigNew.comment_reject,
            data: {
                id: id
            },
            success: function (backData) {
                if (backData.code == 200) {
                    alert('评论审核拒绝');
                    // 重新加载评论
                    getComments()
                }
            }
        })
    });

    // 给删除按钮设置点击事件
    $('tbody').on('click', '.delect', function () {
        // 获取评论id
        let id = $(this).attr('id');
       if(confirm('你确定要删除吗？')){
            // 发送ajax请求,评论删除
        $.ajax({
            type: 'post',
            url: BigNew.comment_delete,
            data: {
                id: id
            },
            success: function (backData) {
                if (backData.code == 200) {
                    alert('评论删除成功');
                    // 重新加载评论
                    getComments(page, function (backData) {
                        // 重绘页码条
                        $('#pagination').twbsPagination('changeTotalPages', backData.data.totalPage, page);
                    });
                }
            }
        });
       }
    });
});
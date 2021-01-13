$(function () {
    function getMsg() {
        // 发送ajax请求,获取文章类别信息
        $.ajax({
            type: 'get',
            url: BigNew.category_list,
            success: function (backData) {
                if (backData.code == 200) {
                    let trHtml = template('categoryTemp', backData);
                    $('tbody').html(trHtml);
                }
            }
        });
    }
    getMsg();

    // 给模态框设置显示触发事件
    $('#myModal').on('show.bs.modal', function (e) {
        // 判断是新增按钮触发的还是编辑按钮触发的
        // 通过点击某个作为触发器的元素，则此元素可以通过事件的relatedTarget属性进行访问。
        if (e.relatedTarget === $('#xinzengfenlei')[0]) {
            $('#exampleModalLabel').text('新增分类');
            $('#addOrand').text('新增').addClass('btn-primary').removeClass('btn-success');
        } else {
            $('#exampleModalLabel').text('编辑分类');
            $('#addOrand').text('编辑').addClass('btn-success').removeClass('btn-primary');
            // 设置文本框内容
            $('#recipient-name').val($(e.relatedTarget).parent().prev().prev().text());
            $('#message-text').val($(e.relatedTarget).parent().prev().text());
            $('#categoryId').val($(e.relatedTarget).attr('id'));
        }
    });

    // 给addOrand按钮设置点击事件
    $('#addOrand').on('click', function () {
        // 判断是新增还是编辑
        if ($(this).hasClass('btn-primary')) {
            let name = $('#recipient-name').val().trim();
            let slug = $('#message-text').val().trim();
            // 判断文本框内容是否为空
            if (name == '' || slug == '') {
                alert('新增文章名称和文章类别别名不能为空');
                return;
            };
            // 发送ajax请求,新增分类
            $.ajax({
                type: 'post',
                url: BigNew.category_add,
                data: {
                    name: name,
                    slug: slug
                },
                success: function (backData) {
                    if (backData.code == 201) {
                        alert('新增成功');
                        // 隐藏模态框
                        $('#myModal').modal('hide');
                        // 调用获取文章信息函数
                        getMsg();
                        // 清空模态框文本框的内容
                        $('#myModal form')[0].reset();
                    }
                }
            });
        } else {
            /* 
            let name = $('#recipient-name').val().trim();
            let slug = $('#message-text').val().trim();
            let id = $('#categoryId').val(); 
            */
            let data = $('#myModal form').serialize();
            // 发送ajax请求,编辑文章类别
            $.ajax({
                type: 'post',
                url: BigNew.category_edit,
                /* 
                data: {
                    id: id,
                    name: name,
                    slug: slug
                }, 
                */
                data: data,
                success: function (backData) {
                    if (backData.code == 200) {
                        alert('修改成功');
                        // 隐藏模态框
                        $('#myModal').modal('hide');
                        // 调用获取文章信息函数
                        getMsg();
                        // 清空模态框的内容
                        $('#myModal form')[0].reset();
                    }
                }
            });
        }
    });

    // 给取消按钮设置点击事件
    $('.btn-cancle').on('click', function () {
        //form表单的reset方法,可以把form表单内容设置为默认值
        $('#myModal form')[0].reset();
    });

    // 给删除按钮设置点击事件(委托注册)
    $('tbody').on('click', '.btn-del', function () {
        // 判断是否真的要删除
        if (confirm('是否删除？')) {
            let id = $(this).attr('id');
            // 发送ajax请求,删除文章类别
            $.ajax({
                type: 'post',
                url: BigNew.category_delete,
                data: {
                    id: id
                },
                success: function (backData) {
                    if (backData.code == 204) {
                        alert('删除成功');
                        // 调用获取文章信息函数
                        getMsg();
                    }
                }
            });
        }
    });
});
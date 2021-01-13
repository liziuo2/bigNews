$(function () {
    // 设置图片预览
    $('#inputCover').on('change', function () {
        let file1 = this.files[0];
        let url = URL.createObjectURL(file1)
        $(this).prev('img').attr('src', url)
    })
    // 发送ajax请求,获取所有文章类别
    $.ajax({
        type: 'get',
        url: BigNew.category_list,
        success: function (backData) {
            if (backData.code == 200) {
                let optHtml = template('category_list', backData);
                $('.category').html(optHtml)
            }
        }
    })

    //jeDate日期插件使用
    jeDate("#testico", {
        // 日期格式
        format: "YYYY-MM-DD",
        // 是否初始化时间(是在文本框里初始化)
        isinitVal: true,
        // 提高层级
        zIndex: 20999
    })

    // wangEditor富文本编辑器使用
    const E = window.wangEditor
    const editor = new E('#div1')
    // 或者 const editor = new E( document.getElementById('div1') )
    editor.create()

    // 封装发布文章函数
    function article_publish(state, msg) {
        let fd = new FormData($('form')[0]);
        fd.append('content', editor.txt.html())
        fd.append('state', state);
        // 发送ajax请求,发布文章
        $.ajax({
            type: 'post',
            url: BigNew.article_publish,
            data: fd,
            contentType: false,
            processData: false,
            success: function (backData) {
                if (backData.code == 200) {
                    alert(msg)
                    parent.$('.level02 li:eq(0)').addClass('active').siblings('li').removeClass('active')
                    window.location.href='./article_list.html'
                }
            }
        })
    }

    // 给发布按钮设置点击事件
    $('.btn-release').on('click', function (e) {
        e.preventDefault()
        article_publish('已发布', '文章发布成功')
    })

    // 给存为草稿按钮设置点击事件
    $('.btn-draft').on('click', function (e) {
        e.preventDefault()
        article_publish('草稿', '文章草稿保存成功')
    })

})
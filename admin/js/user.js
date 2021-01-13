$(function () {
    // 发送ajax请求，获取用户详情
    $.ajax({
        type: 'get',
        url: BigNew.user_detail,
        success: function (backData) {
            if (backData.code == 200) {
                // $('.username').val(backData.data.username);
                // $('.nickname').val(backData.data.nickname);
                // $('.email').val(backData.data.email);
                // $('.password').val(backData.data.password);
                for (let key in backData.data) {
                    $('.' + key).val(backData.data[key]);
                }
                $('.user_pic').attr('src', backData.data.userPic);
            }
        }
    });

    // 给修改按钮设置点击事件
    $('.btn-edit').on('click', function (e) {
        // 阻止submit的默认提交行为
        e.preventDefault();
        // 创建一个FormData对象
        let fd = new FormData($('form')[0]);
        // 检查form是否有name属性，name属性值是否与接口参数一致
        // 发送ajax请求,编辑用户信息
        $.ajax({
            type: 'post',
            url: BigNew.user_edit,
            data: fd,
            contentType: false,
            processData: false,
            success: function (backData) {
                if (backData.code == 200) {
                    alert('修改成功');
                    // 重新发送ajax请求,获取更改后的用户信息,显示到index页面上
                    $.ajax({
                        type: 'get',
                        url: BigNew.user_info,
                        success: function (backData) {
                            if (backData.code == 200) {
                                // parent方法一定要用Live server方式打开
                                parent.$('.user_info img').attr('src', backData.data.userPic);
                                parent.$('.user_info span').html('欢迎' + '&nbsp;&nbsp;' + backData.data.nickname);
                                parent.$('.user_center_link img').attr('src', backData.data.userPic);
                            }
                        }
                    });
                }
            }
        })
    });

    // 设置图片预览
    $('#exampleInputFile').on('change', function () {
        let file = this.files[0];
        let url = URL.createObjectURL(file);
        $('.user_pic').attr('src', url);
    });
});
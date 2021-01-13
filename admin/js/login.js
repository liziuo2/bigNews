$(function () {
    // 给登录按钮设置点击事件
    $('.input_sub').on('click', function (e) {
      e.preventDefault();
      // 获取文本框内容
      let username = $('.input_txt').val().trim();
      let password = $('.input_pass').val().trim();
      // 判断文本框内容是否为空
      if (username == '' || password == '') {
        // 通过元素的id myModal 调用模态框
        $('#myModal').modal();
        // 更改p标签里的文本内容
        $('#myModal .modal-body>p').text('账号密码不能为空');
        return;
      };
      // 发送ajax请求，用户登录
      $.ajax({
        type: 'post',
        url: BigNew.user_login,
        data: {
          username: username,
          password: password
        },
        success: function (backData) {
          $('#myModal').modal();
          $('#myModal .modal-body>p').text(backData.msg);
          if (backData.code == 200) {
            // 把登录成功后返回的token保存起来
            localStorage.setItem('token', backData.token);
            // 设置模态框隐藏事件,模态框隐藏的时候页面才跳转
            $('#myModal').on('hidden.bs.modal', function (e) {
              window.location.href = './index.html';
            })
          };
        }
      });
    });
  });
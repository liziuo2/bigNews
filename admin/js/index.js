$(function () {
    // 发送ajax请求,获取用户信息
    $.ajax({
        type: 'get',
        url: BigNew.user_info,
        // headers: {
        //     Authorization: localStorage.getItem('token')
        // },
        success: function (backData) {
            $('.user_info img').attr('src', backData.data.userPic);
            $('.user_info span').html('欢迎' + '&nbsp;&nbsp;' + backData.data.nickname);
            $('.user_center_link img').attr('src', backData.data.userPic);
        }
    });

    /* 
    因为每次发送ajax请求都要执行这个方法，且每次都要引入jQuery.js文件，所以直接把下面这段代码写道jQuery.js文件中
    // 发送ajax请求运行前的函数
    $.ajaxSetup({
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', localStorage.getItem('token'));
        },
        // 请求失败要运行的函数
        error: function (xhr, status, error) {
            if (error == 'Forbidden') {
                alert('请登录账号');
                window.location.href = './login.html';
            };
        }
    }); 
    */
    // 设置点击事件,实现用户账号退出
    $('.logout').on('click', function () {
        if (confirm('你确定要退出吗?')) {
            // 删除localStorag里保存的token
            localStorage.removeItem('token');
            // 跳转到登录页面
            window.location.href = './login.html';
        }
    });

    // 给导航栏一级菜单设置点击事件
    $('.level01').on('click', function () {
        // 点击到的一级菜单添加active类，其他的一级菜单移出active类
        $(this).addClass('active').siblings('.level01').removeClass('active');
        $('.level02 li').removeClass('active')
        // 判断点击到的是否是文章管理栏
        if ($(this).text() == '文章管理') {
            // 是隐藏就显示，是显示就隐藏
            $('.level02').slideToggle();
            $(this).find('b').toggleClass('rotate0');
            // 触发二级菜单点击事件
            /* 
            因为jq内部实现click或trigger方法时，并未真正模拟用户点击事件，只是模拟了事件对象及冒泡的触发
            所以这里要利用dom对象触发click事件 
            */
            $('.level02 li:eq(0)')[0].click();
        };
    });

    // 给个人中心标签触发导航栏个人中心栏点击事件
    $('.user_center_link a:eq(0)').on('click', function () {
        $('.level01:eq(3)').trigger('click');
        $('.level02 li').removeClass('active')
    });

    // 给导航栏二级菜单设置点击事件
    $('.level02 li').on('click', function () {
        $(this).addClass('active').siblings('.level02 li').removeClass('active');
    });
});  
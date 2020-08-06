/*---Render Login/Register Block---*/
$('.login_nav, .land_start').on('click', function () {
    $('.member').css({ 'display': 'flex' });
    $('.register').addClass('mem_block');
    $('.login').removeClass('mem_block');
});
$('.ques_login').on('click', function () {
    $('.register').removeClass('mem_block');
    $('.login').addClass('mem_block');
});
$('.ques_register').on('click', function () {
    $('.login').removeClass('mem_block');
    $('.register').addClass('mem_block');
});

// hide member form when clicked on whitespace
$('.mem_form').on('click', function () {
    $('.member').hide();
}).children().on('click', function () {
    return false;
});

/*---Auto Login---*/
let access_token = localStorage.getItem('access_token');
if (access_token) {
    // (WIP) User verification
    // fetch('/api/1.0/verify', {
    //     method: 'GET',
    //     headers: {
    //         'content-type': 'application/json',
    //         'authorization': access_token
    //     }
    // })
    //     .then(res => res.json())
    //     .then(() => {
    //         console.log('Verification Success!')
    //         location.href = '/dashboard.html'
    //     })
    // location.href = '/dashboard.html'

}

/*---Register----*/
// insert into DB on button click
$('.reg_enter_btn').on('click', function () {
    // get register data
    let reg_email = $('.reg_email').val();
    let reg_pwd = $('.reg_pwd').val();

    // call register api
    fetch('/api/1.0/user/register', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
            email: reg_email,
            pwd: reg_pwd
        })
    })
        .then((res) => {
            return res.json();
        })
        .then((data) => {
            const { access_token, username, user_id, message, error } = data;
            if (error) {
                // console.log(error);   //
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: `${error}`,
                });
            } else if (access_token) {
                localStorage.setItem('access_token', access_token);
                localStorage.setItem('username', username);
                localStorage.setItem('user_id', user_id);
                location.href = '/dashboard.html';
            }
        });
});

/*---Login---*/
$('.login_enter_btn').on('click', function () {
    // get login data
    let login_email = document.querySelector('.login_email').value;
    let login_pwd = document.querySelector('.login_pwd').value;

    // verify login data
    fetch('/api/1.0/user/login', {
        method: 'POST',
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify({
            email: login_email,
            pwd: login_pwd
        })
    })
        .then((res) => res.json())
        .then((data) => {
            const { error, access_token, username, user_id } = data;
            if (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: `${error}`,
                });
            } else if (access_token) {
                localStorage.setItem('access_token', access_token);
                localStorage.setItem('username', username);
                localStorage.setItem('user_id', user_id);
                location.href = '/dashboard.html';
            }
        });
});


// // token verification
// let access_token = localStorage.getItem('access_token');
// let username = localStorage.getItem('username');
// let username_abv = username.split("")[0];
// if (access_token && username) {
//     $('.logout').html('LOGOUT');
//     $('.greeting').html(`${username_abv}`);
// } else {
//     $('.logout').html('LOGIN');
// }

// // Logout
// $('.logout').click(function () {
//     let access_token = localStorage.getItem('access_token');
//     if (access_token) {
//         localStorage.removeItem('access_token');
//         localStorage.removeItem('username');
//         location.href = '/logout.html';
//     } else {
//         location.href = '/login.html'
//     }
// })
/*---Style---*/
$('.btn').on('mouseover', function () {
    $(this).css({ 'background-color': 'black', 'color': 'white' });
});
$('.btn').on('mouseout', function () {
    $(this).css({ 'background-color': 'white', 'color': 'black' });
});
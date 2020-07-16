let access_token = localStorage.getItem('access_token');
let username = localStorage.getItem('username');
let user_id = localStorage.getItem('user_id');

/*---Function---*/
function deleteWhiteboard(e) {
    // get wb title & user_id
    let title = e.target.previousSibling.previousSibling.innerHTML || e.target.previousSibling.previousSibling.value;

    // ask if delete
    alert('Delete whiteboard?');

    fetch('api/1.0/dashboard/deleteWhiteboard', {
        method: 'DELETE',
        headers: {
            'content-type': 'application/json',
            'authorization': access_token
        },
        body: JSON.stringify({
            user_id, title
        })
    })
        .then((res) => res.json())
        .then((data) => {
            let { message, error } = data;
            alert(message || error)
        })

    // delete whiteboard effect
    e.target.closest('.wb_block').remove();
}
function createWhiteboard(e) {
    // get wb title & user_id
    let title = e.target.previousSibling.previousSibling.previousSibling.previousSibling.value;
    // console.log('create', e.target.previousSibling.previousSibling.previousSibling.previousSibling.value);

    fetch('/api/1.0/dashboard/createWhiteboard', {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            'authorization': access_token
        },
        body: JSON.stringify({
            user_id, title
        })
    })
        .then((res) => res.json())
        .then((data) => {
            let { message, error } = data;
            alert(message || error);
        })
}


/*---Get WB---*/
fetch(`/api/1.0/dashboard/${user_id}`, {
    method: 'GET',
    headers: {
        'content-type': 'application/json',
        'authorization': access_token
    }
})
    .then((res) => res.json())
    .then((data) => {
        // console.log(data);   //
        for (let i = 0; i < data.length; i++) {
            let org_wb = document.createElement('div');
            setAttributes(org_wb, { "class": "wb_block hvr-grow" });
            org_wb.innerHTML = `<div class='wb_title'>${data[i].title}</div>
            <div class='close_btn'>X</div>
            <button class='create_wb'>Save</button>`;
            // set wb_id on each wb
            org_wb.dataset.wb_id = data[i].wb_id
            whiteboard.appendChild(org_wb);

            /*---Delete WB---*/
            org_wb.querySelector('.close_btn').addEventListener('click', deleteWhiteboard);
        }


        $('.wb_block').on('mouseover', function () {
            $(this).addClass('current');
            $(this).children('.close_btn').addClass('current');
            $('.current').show();
        });
        $('.wb_block').on('mouseout', function () {
            $(this).removeClass('current')
            $(this).children('.close_btn').removeClass('current')
            $(this).children('.close_btn').hide();
        });
        return;

    })

/*---Get Workspace(postit) when clicked on WB---*/
$('.whiteboard').click('.wb_block', function (e) {
    let target = $(e.target)
    let wb_id = target.data('wb_id');
    let title = target.children('.wb_title').html();
    window.location.href = `workspace.html?wb_id=${wb_id}&title=${title}`
})

// token verification
if (access_token && username) {
    $('.logout').html('LOGOUT');
    $('.greeting').html(`Hello, ${username}`);
    $('.greeting').css({ 'background-color': 'lightgray', 'color': 'black', 'border-radius': '2px', 'padding': '1px 5px 8px 5px', 'font-weight': 'bold' })
} else {
    $('.logout').html('LOGIN');
    alert('Please Login, my friend!')
    location.href = '/login.html'
}

// Logout
$('.logout').click(function () {
    if (access_token) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('username');
        location.href = '/logout.html';
    } else {
        location.href = '/login.html'
    }
})


// Function: set multiple attributes
function setAttributes(el, options) {
    Object.keys(options).forEach(function (attr) {
        el.setAttribute(attr, options[attr]);
    })
}

// Create whiteboard by add_btn
let whiteboard = document.getElementsByClassName('whiteboard')[0]
let add_btn = document.getElementsByClassName('add_btn')[0]
let add_whiteboard = () => {
    let new_div = document.createElement('div');
    setAttributes(new_div, { "class": "wb_block hvr-grow" });
    new_div.innerHTML = `
    <input class='wb_title' placeholder='Type in title...'>
    <div class='close_btn'>X</div>
    <button class='create_wb'>Save</button>`
    whiteboard.appendChild(new_div);

    $('.whiteboard').on('mouseover', '.wb_block', function () {
        $(this).children('.close_btn').show();
    })
    $('.whiteboard').on('mouseout', '.wb_block', function () {
        $(this).children('.close_btn').hide();
    })

    new_div.querySelector('.close_btn').addEventListener('click', deleteWhiteboard)
    new_div.querySelector('.create_wb').addEventListener('click', createWhiteboard)

}

/*---Cursor Style---*/
$('body').awesomeCursor('pencil',
    { color: 'black' });












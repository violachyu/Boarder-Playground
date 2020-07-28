let access_token = localStorage.getItem('access_token');
let username = localStorage.getItem('username');
let user_id = localStorage.getItem('user_id');


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
        for (let i = 0; i < data.length; i++) {
            $('.whiteboard').append(`
            <div class='wb_block hvr-grow' id='${data[i].wb_id}'>
                <div class='wb_bookmark'></div>
                <div class='wb_back'></div>
                <input class='wb_title'><img class='edit old' src='./img/edit.png'>
                <div class='close_btn'>X</div>
            </div>`)
            // set title/bookmark on each wb
            $(`#${data[i].wb_id} > .wb_title`).val(`${data[i].title}`)
            if (data[i].bookmark == 'bookmarked') {
                $(`#${data[i].wb_id} > .wb_bookmark`).data('bookmark', `${data[i].bookmark}`)
                $(`#${data[i].wb_id} > .wb_bookmark`).addClass('bookmarked')
            }
        }

        $('.whiteboard').on('mouseover', '.wb_block', function () {
            $(this).children('.close_btn').show();
            $(this).children('.edit').css({ 'visibility': 'visible' })

        })
        $('.whiteboard').on('mouseout', '.wb_block', function () {
            $(this).children('.close_btn').hide();
            $(this).children('.edit').css({ 'visibility': 'hidden' })
        })
        return;

    })

/*---Add whiteboard by add_btn---*/
// set add_btn bg color 
$('.add_btn').on('click', function () {
    $(this).css({ 'background-color': 'white', 'color': 'black' })
})
$('.add_btn').on('mouseover', function () {
    $(this).css({ 'background-color': 'black', 'color': 'white' })
})
$('.add_btn').on('mouseout', function () {
    $(this).css({ 'background-color': 'white', 'color': 'black' })
})
let add_whiteboard = () => {
    let wb_id = Date.now();
    $('.whiteboard').append(`
        <div class='wb_block hvr-grow' id='${wb_id}'>
            <div class='wb_bookmark'></div>
            <div class='wb_back'></div>
            <input class='wb_title' style='pointer-events: auto;'><img class='edit' src='./img/save.png'></input>
            <div class='close_btn'>X</div>
        </div>`)

    /*---Style---*/
    $('.whiteboard').on('mouseover', '.wb_block', function () {
        $(this).children('.close_btn').show();
        $(this).children('.edit').css({ 'visibility': 'visible' })
    })
    $('.whiteboard').on('mouseout', '.wb_block', function () {
        $(this).children('.close_btn').hide();
    })
}

/*---Edit WB name---*/
$('.whiteboard').on('click', '.edit', function () {
    $(this).siblings('.wb_title').css({ 'pointer-events': 'auto', 'color': 'darkgray' })
    $(this).attr('src', './img/save.png')
    $(this).addClass('save');
})
/*---Save WB---*/
$('.whiteboard').on('click', 'img[src="./img/save.png"]', function (e) {
    $(this).siblings('.wb_title').css({ 'pointer-events': 'none', 'color': 'black' })
    $(this).attr('src', './img/edit.png')
    $(this).removeClass('save');
    createWhiteboard(e);

})

function createWhiteboard(e) {
    // get wb title & wb_id & bookmark
    let title = $(e.target).siblings('.wb_title').val();
    let wb_id = $(e.target).parent('.wb_block').attr('id');
    let bookmark = $(e.target).siblings('.wb_bookmark').data('bookmark') || $(e.target).data('bookmark')
    if (bookmark == undefined) {
        bookmark = 'null'
    }

    if (title.includes("'")) {
        alertMessage("Cannot input symbols including:\" and \'", 'danger')
    } else {
        fetch('/api/1.0/dashboard/createWhiteboard', {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                'authorization': access_token
            },
            body: JSON.stringify({
                wb_id, user_id, title, bookmark
            })
        })
            .then((res) => res.json())
            .then((data) => {
                let { message, error } = data;
                if (message) {
                    alertMessage(message, 'success');
                } else {
                    alertMessage(error, 'danger');
                }
            })
    }

}

/*---Delete WB---*/
$('.whiteboard').on('click', '.close_btn', function (e) {
    // get wb title & user_id
    let title = $(e.target).siblings('.wb_title').val();

    // (WIP)ask if delete
    // Swal.fire({
    //     title: 'Delete whiteboard?',
    //     text: "You won't be able to revert this!",
    //     icon: 'warning',
    //     showCancelButton: true,
    //     confirmButtonColor: '#3085d6',
    //     cancelButtonColor: '#d33',
    //     confirmButtonText: 'Yes, delete it!'
    // }).then((result) => {
    //     if (result.value) {
    //         Swal.fire(
    //             'Deleted!',
    //             'Whiteboard has been deleted.',
    //             'success'
    //         )
    //     }
    // })
    // alertMessage('Delete whiteboard?', 'info');

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
            if (message) {
                alertMessage(message, 'success');
            } else {
                alertMessage(error, 'danger');
            }
        })

    // delete whiteboard effect
    e.target.closest('.wb_block').remove();
});




/*---Go to Workspace(postit) when clicked on WB---*/
$('section').on('click', '.wb_block', function (e) {
    let wb_id = $(e.target).attr('id');
    let title = $(e.target).children('.wb_title').val();
    // redirect excluding input
    if (wb_id && title && $(e.target).hasClass('wb_block')) {
        window.location.href = `workspace.html?wb_id=${wb_id}&title=${title}`
    }

})

/*---Bookmark---*/
$('.whiteboard').on('click', '.wb_bookmark', function (e) {
    $(this).data('bookmark', 'bookmarked');
    $(this).addClass('bookmarked');
    createWhiteboard(e);
})
$('.whiteboard').on('click', '.bookmarked', function (e) {
    $(this).removeData('bookmark');
    $(this).removeClass('bookmarked');
    createWhiteboard(e);
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


/*---(WIP) Cursor Style---*/
$('body').awesomeCursor('pencil',
    { color: 'black' });












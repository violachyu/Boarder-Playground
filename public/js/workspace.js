/*---Preceding Operations---*/
// hide buffering loading page
$(document).ready(function () {
    $('#loading').hide();
});
let access_token = localStorage.getItem('access_token');
if (!access_token) {
    // Anonymous user
    let anonymousList = ['Batman', 'Superman', 'Wonder Woman', 'Green Lantern', 'The Flash', 'Aquaman', 'Atom',
        'Captain America', 'Antman', 'Loki', 'Grook', 'Black Widow', 'Spider-Man', 'Vision', 'Black Panther', 'Iron-Man',
        'Scarlet Witch', 'War Machine', 'Rocket Racoon', 'Dr.Strange', 'Dead Pool']
    let character = anonymousList[Math.floor(Math.random() * anonymousList.length)]
    localStorage.setItem('username', character)
    // disable buttons
    $('.right_nav > a').removeAttr('href')
    $('.right_nav > a').css({ 'color': 'grey', 'border': 'grey', 'pointer-events': 'none' })
}
// Set a color for each user
let randomColorList = ['#e0f0ea', '#95adbe',
    '#9da8a7', '#9da8a7', '#fbfffe', '#f0e6e0', '#a8a19d']
let randomColor = randomColorList[Math.floor(Math.random() * randomColorList.length)]
localStorage.setItem('userColor', randomColor);

// Get localstorage info
let username = localStorage.getItem('username');
let user_id = localStorage.getItem('user_id');
let userColor = localStorage.getItem('userColor');
// Greetings
$('.logout').html('LOGOUT');
$('.greeting').html(`Hello, ${username}`);
$('.greeting').css({ 'background-color': 'lightgray', 'color': 'black', 'border-radius': '2px', 'padding': '1px 5px 8px 5px', 'font-weight': 'bold' })



// Logout
$('.logout').click(function () {
    let access_token = localStorage.getItem('access_token');
    if (access_token) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('username');
        location.href = '/logout.html';
    } else {
        location.href = '/login.html'
    }
})

/*---Get Workspace---*/
// get wb_id from query
const urlParams = new URLSearchParams(window.location.search);
let wb_id = urlParams.get('wb_id');
let title = urlParams.get('title');
$('#workspace_title').html(title);  // set workspace page title

// get wb data from database
fetch(`api/1.0/getWorkspace/${wb_id}`, {
    method: 'GET',
    headers: {
        'content-type': 'application/json',
        'authorization': access_token
    }
})
    .then((res) => res.json())
    .then((data) => {
        for (let i = 0; i < data.length; i++) {
            let workspace = document.querySelector('.workspace');
            let new_postit = document.createElement('main');
            new_postit.innerHTML = `
            <div class='triangle'></div>
            <div class='close_postit'>X</div>
            <textarea class='postit_input' placeholder='Write something on this post-it!' onkeyup="autogrow(this);"></textarea>
            <div class='collab_cursor hvr-wobble-to-bottom-right'></div><div class='collab_name hvr-wobble-to-bottom-right'></div>
            <div class='lock_msg'><p id='lock_content'>Someone else is editing this postit...</p></div>`
            workspace.append(new_postit)

            setAttributes(new_postit, {
                'class': 'postit', 'draggable': 'true', 'id': data[i].postit_id, 'data-toggle': 'popover', 'data-container': 'body', 'title': 'Postit Details', 'placeholder': 'Write something on Post-it!',
                'data-content': `<form class='postit_detail' id='popover-content' enctype=''>
                    <div class='align_wrap'>
                        <div class='category font'>
                            <div class='title'>Font Size:</div>
                            <input class='font_size' placeholder='font size(px)' type='number' onsubmit='preventDefault();'>
                        </div>
                        <div class='category font'>
                            <div class='title'>Font Color:</div>
                            <input class='font_color' type='color' width='50px' height='20px'>
                        </div>
                        <div class='category color'>
                            <div class='title'>Color:</div>
                            <input class='color_block' type='color' width='50px' height='20px'>
                        </div>
                        <div class='category img'>
                            <div class='title'>Image:</div>
                            <label for='files' class='select_btn' onclick='addFile();'>Select Image
                            </label>
                            <input id='files' type='file' style='display:none;'>
                            <div id='filename'></div>
                        </div>
                        <div class='category order'>
                            <div class='title'>Order:</div>
                            <div class='wrap_checkbox'>
                                <label for='front'><input type='radio' id='front'><span>Bring to front</span></label>
                                <label for='back'><input type='radio' id='back'><span>Send to back</span></label>
                            </div>
                        </div>
                </form>`})
            // add img if exists
            if (data[i].img !== null) {
                $(`${data[i].postit_id}`).append(`<img class='upload_pic' src=${data[i].img}>`);
            }

            // set CSS attributes of postits
            new_postit.setAttribute('style',
                `left: ${data[i].position_x}; 
            top: ${data[i].position_y};
            position: absolute; 
            background-color: ${data[i].bg_color}; 
            width:${data[i].width}; 
            height: ${data[i].height};
            font-size: ${data[i].font_size};
            zIndex:${data[i]['z-index']};`) // WIP: comments

            // Textarea settings
            $(`#${data[i].postit_id} > .postit_input`).val(data[i].text);  // text content
            $(`#${data[i].postit_id} > .postit_input`).css('color', data[i].font_color);  // text color

            $(`#${data[i].postit_id}`).data('user_id', user_id);   // store user_id in postit
            // $(`#${data[i].postit_id}`).draggable({ handle: '.triangle' });  // make postit draggable
            $(`#${data[i].postit_id}`).draggable({ containment: 'parent' });  // make postit draggable
            $(`#${data[i].postit_id}`).resizable({ maxHeight: 500, maxWidth: 800, minHeight: 50, minWidth: 50, containment: 'parent' });  // make postit resizable
        }
    })

// (WIP)make workspace selectable
$(function () {
    $(".workspace").selectable();
});

/*---Socket IO---*/
// Create socket connection
const socket = io();

// Check socket connection
socket.on('message', (message) => {
    console.log(message);
})

// Join Room 
let wb_name = $('#workspace_title').html();
socket.emit('joinRoom', { user_id, username, userColor, wb_id, wb_name })

// Send message
socket.on('statusMessage', function (message) { // Welcome
    alertMessage(message, 'info')
    // $('.statusMessage').html(message)
})

// Render room info
socket.on('roomUsers', ({ room, room_name, users, user_count }) => {
    let roomInfo = { room, room_name, users, user_count }
    $('.dropNumber').html(`${roomInfo.user_count}`)   // show user count
    // show user status
    $('.dropdown_content').html('');
    for (let i = 0; i < roomInfo['users'].length; i++) {
        $('.dropdown_content').append(`<div class='dropdown_item'>
        <div class='dropName'>${roomInfo.users[i].username}</div>
        <div class='dropColor'></div>
        </div>`)
        $('.dropColor').css({ 'background-color': 'green' })
    }
    // status: turn gray if idle
    function timerIncrement() {
        idleTime = idleTime + 1;
        if (idleTime > 1) { // 20 minutes
            $('.dropColor').css({ 'background-color': 'gray' }) //WIP
        }
    }
    // (WIP) Detect idle user
    let idleTime = 0;
    $(document).ready(function () {
        //Increment the idle time counter every minute
        let idleInterval = setInterval(timerIncrement, 60000); // 1 minute

        //Reset the idle timer on mouse movement
        $(this).mousemove(function (e) {
            idleTime = 0;
        });
        $(this).keypress(function (e) {
            idleTime = 0;
        });
    });
});


/* Sync postit appearance and movement: Add/Edit/Move Postit */
// Sync on add postit
$('section').on('click', '.addPostit', function () {
    let postit_id = { postit_id: add_postit() };
    socket.emit('addPostit', postit_id);
})
socket.on('addRender', function (postit_id) {
    render(postit_id);
})

/*---Add post-it---*/
// Function: set multiple attributes
function setAttributes(el, options) {
    Object.keys(options).forEach(function (attr) {
        el.setAttribute(attr, options[attr]);
    })
}

// autosize textarea
function autogrow(textarea) {
    let adjustedHeight = textarea.clientHeight;
    adjustedHeight = Math.max(textarea.scrollHeight, adjustedHeight);
    if (adjustedHeight > textarea.clientHeight) {
        textarea.style.height = adjustedHeight + 'px';
    }
}
function add_postit() {
    let workspace = document.querySelector('.workspace');
    let new_postit = document.createElement('main');
    new_postit.innerHTML = `
    <div class='triangle'></div>
    <div class='close_postit'>X</div>
    <textarea class='postit_input' placeholder='Write something on this post-it!' onkeyup="autogrow(this);"></textarea>
    <div class='collab_cursor hvr-wobble-to-bottom-right'></div><div class='collab_name hvr-wobble-to-bottom-right'></div>
    <div class='lock_msg'><p id='lock_content'>Someone else is editing this postit...</p></div>`
    workspace.append(new_postit)

    let id = 'id_' + Date.now();
    setAttributes(new_postit, {
        'class': 'postit ui-widget-content', 'draggable': 'true', 'id': id, 'data-toggle': 'popover', 'data-container': 'body', 'title': 'Postit Details', 'placeholder': 'Write something on Post-it!',
        'data-content': `<form class='postit_detail' id='popover-content' enctype=''>
            <div class='align_wrap'>
                <div class='category font'>
                    <div class='title'>Font Size:</div>
                    <input class='font_size' placeholder='font size(px)' type='number' action='/'>
                </div>
                <div class='category font'>
                    <div class='title'>Font Color:</div>
                    <input class='font_color' type='color' width='50px' height='20px'>
                </div>
                <div class='category color'>
                    <div class='title'>Color:</div>
                    <input class='color_block' type='color' width='50px' height='20px'>
                </div>
                <div class='category img'>
                    <div class='title'>Image:</div>
                    <label for='files' class='select_btn' onclick='addFile();'>Select Image
                    </label>
                    <input id='files' type='file' style='display:none;'>
                    <div id='filename'></div>
                </div>
                <div class='category order'>
                    <div class='title'>Order:</div>
                    <div class='wrap_checkbox'>
                        <label for='front'><input type='radio' id='front'><span>Bring to front</span></label>
                        <label for='back'><input type='radio' id='back'><span>Send to back</span></label>
                    </div>
                </div>
        </form>`})

    $(`#${id}`).css('position', 'absolute');
    $(`#${id}`).data('user_id', user_id);   // store user_id in postit
    // $(`#${id}`).draggable({ handle: '.triangle' });
    $(`#${id}`).draggable({ containment: 'parent' });
    $(`#${id}`).resizable({ maxHeight: 500, maxWidth: 800, minHeight: 50, minWidth: 50, containment: 'parent' });  // make postit resizable
    return id;
}

// Sync & save on edit postit
$('body').on('click change dragstop', '.postit, .popover', function () {
    let id;
    if ($(this).data('id')) {
        id = $(this).data('id') // popover contains data-id property
    } else {
        id = $(this).attr('id');
    }
    // reform date format
    let now = new Date().toLocaleString('zh-TW', { timeZone: 'Asia/Taipei', hour12: false });

    let postit_data = [];
    let postit_item = {
        postit_id: $(`#${id}`).attr('id'),
        user_id: $(`#${id}`).data('user_id'),
        wb_id: wb_id,
        latest_update: now,
        position_x: $(`#${id}`).css('left'),
        position_y: $(`#${id}`).css('top'),
        text: $(`#${id}`).children('.postit_input').val(),
        bg_color: $(`#${id}`).css('backgroundColor'),
        width: $(`#${id}`).css('width'),
        height: $(`#${id}`).css('height'),
        font_size: $(`#${id}`).children('.postit_input').css('font-size'),
        font_color: $(`#${id}`).children('.postit_input').css('color'),
        img: $(`#${id}`).children('.upload_pic').attr('src') || null,
        zIndex: $(`#${id}`).css('zIndex'),
        del: null,
    };
    postit_data.push(postit_item);

    // emit edited data to server
    socket.emit('editPostit', postit_item);

    /*---Save Postit---*/
    // Auto saving Status
    $('.saveStatus').html('AUTO-SAVING DOCUMENT...');

    let saveInit = {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            'authorization': access_token
        },
        body: JSON.stringify({
            postit_data
        })
    }

    fetch('api/1.0/saveWorkspace/save', saveInit)
        .then((res) => res.json())
        .then((data) => {
            console.log(data.error || data.message)
            $('.saveStatus').delay(50000).html('DOCUMENT SAVED!!')
        })
})

// Save on resizeEND & keyup
$('body').on('resize keyup', '.postit', _.debounce(function () {
    let id;
    if ($(this).data('id')) {
        id = $(this).data('id')
    } else {
        id = $(this).attr('id');
    }

    // reform date format
    let now = new Date().toLocaleString('zh-TW', { timeZone: 'Asia/Taipei', hour12: false });

    let postit_data = [];
    let postit_item = {
        postit_id: $(`#${id}`).attr('id'),
        user_id: $(`#${id}`).data('user_id'),
        wb_id: wb_id,
        latest_update: now,
        position_x: $(`#${id}`).css('left'),
        position_y: $(`#${id}`).css('top'),
        text: $(`#${id}`).children('.postit_input').val(),
        bg_color: $(`#${id}`).css('backgroundColor'),
        width: $(`#${id}`).css('width'),
        height: $(`#${id}`).css('height'),
        font_size: $(`#${id}`).children('.postit_input').css('font-size'),
        font_color: $(`#${id}`).children('.postit_input').css('color'),
        img: $(`#${id}`).children('.upload_pic').attr('src') || null,
        zIndex: $(`#${id}`).css('zIndex'),
        del: null,
    };
    postit_data.push(postit_item);

    // emit edited data to server
    socket.emit('editPostit', postit_item);


    /*---Save Postit---*/
    // Auto saving Status
    $('.saveStatus').html('AUTO-SAVING DOCUMENT...')
    let saveInit = {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            'authorization': access_token
        },
        body: JSON.stringify({
            postit_data
        })
    }

    fetch('api/1.0/saveWorkspace/save', saveInit)
        .then((res) => res.json())
        .then((data) => {
            console.log(data.error || data.message)
            $('.saveStatus').delay(50000).html('DOCUMENT SAVED!!')
        })
}, 2000))


// render edited data
socket.on('editRender', function (postit_item) {
    render_edit(postit_item);
})

function render(data) {
    let workspace = document.querySelector('.workspace');
    let new_postit = document.createElement('main');
    new_postit.innerHTML = `<div class='triangle'></div>
        <div class='close_postit'>X</div>
        <textarea class='postit_input' placeholder='Write something on this post-it!' onkeyup="autogrow(this);"></textarea>
        <div class='collab_cursor hvr-wobble-to-bottom-right'></div><div class='collab_name hvr-wobble-to-bottom-right'></div>
        <div class='lock_msg'><p id='lock_content'>Someone else is editing this postit...</p></div>`
    setAttributes(new_postit, {
        'class': 'postit ui-widget-content', 'draggable': 'true', 'id': data.postit_id, 'data-toggle': 'popover', 'data-container': 'body', 'title': 'Postit Details', 'placeholder': 'Write something on Post-it!',
        'data-content': `<form class='postit_detail' id='popover-content' enctype=''>
                <div class='align_wrap'>
                    <div class='category font'>
                        <div class='title'>Font Size:</div>
                        <input class='font_size' placeholder='font size(px)' type='number'>
                    </div>
                    <div class='category font'>
                        <div class='title'>Font Color:</div>
                        <input class='font_color' type='color' width='50px' height='20px'>
                    </div>
                    <div class='category color'>
                        <div class='title'>Color:</div>
                        <input class='color_block' type='color' width='50px' height='20px'>
                    </div>
                    <div class='category img'>
                        <div class='title'>Image:</div>
                        <label for='files' class='select_btn' onclick='addFile();'>Select Image
                        </label>
                        <input id='files' type='file' style='display:none;'>
                        <div id='filename'></div>
                    </div>
                    <div class='category order'>
                        <div class='title'>Order:</div>
                        <div class='wrap_checkbox'>
                            <label for='front'><input type='radio' id='front'><span>Bring to front</span></label>
                            <label for='back'><input type='radio' id='back'><span>Send to back</span></label>
                        </div>
                    </div>
            </form>`})
    workspace.append(new_postit)

    $(`#${data.postit_id}`).data('user_id', user_id);   // store user_id in postit
    $(`#${data.postit_id}`).css({ 'position': 'absolute' });   // set postit absolute
    $(`#${data.postit_id}`).draggable({ containment: 'parent' });  // make postit draggable
    $(`#${data.postit_id}`).resizable({ maxHeight: 500, maxWidth: 500, minHeight: 50, minWidth: 50, containment: 'parent' });  // make postit resizable
}

function render_edit(data) {
    let styles = {
        'left': data.position_x,
        'top': data.position_y,
        'position': 'absolute',
        'background-color': data.bg_color,
        'width': data.width,
        'height': data.height,
        'font-size': data.font_size,
        'zIndex': data.zIndex
    }


    // postit basic settings
    $(`#${data.postit_id}`).css(styles)

    // Textarea settings
    $(`#${data.postit_id} > .postit_input`).val(data.text);  // text content
    $(`#${data.postit_id} > .postit_input`).css('color', data.font_color);  // text color

    // add img if exists
    if (data.img !== null) {
        $(`${data.postit_id}`).append(`<img class='upload_pic' src=${data.img}>`);
    }
}

/*---Delete Postit---*/
$('.workspace').on('click', '.close_postit', function (e) {
    let deleteId = $(this).parent('.postit').attr('id');
    socket.emit('deletePostit', deleteId)

    let deleteInit = {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            'authorization': access_token
        },
        body: JSON.stringify({
            postit_id: deleteId
        })
    }
    fetch('api/1.0/saveWorkspace/delete', deleteInit)
        .then((res) => res.json())
        .then((data) => {
            let { message, error } = data;
            if (message) {
                alertMessage(message, 'success')
            } else {
                alertMessage(error, 'danger')
            }
        })
    $(this).parent('.postit').remove();

    // hide popover when hover on other postit
    $('.popover').each(function () {
        $(this).hide();
    })
})

// (WIP) hide popover when white space is clicked
// $('body').on('click', function (e) {
// if (!$(e.target).hasClass('postit') || !$(e.target).hasClass('postit_input')) {
//     $('.popover').each(function () {
//         $(this).hide();
//     })
// }
// })

socket.on('deleteRender', function (deleteId) {
    $(`#${deleteId}`).remove();
})

/*---Lock Postit---*/
// lock when user1 is editing
$('.workspace').on('click resize keydown dragstart drag', '.postit, .postit_input', function () {

    let id;
    if ($(this).hasClass('postit')) {
        id = $(this).attr('id')
    } else if ($(this).hasClass('popover')) {
        id = $(this).data('id')
    } else {
        id = $(this).parent('.postit').attr('id');
    }
    socket.emit('lock', id)

})
// lock when user1 clicks on popover
$('body').on('click', '.popover', function () {
    let id;
    if ($(this).hasClass('postit')) {
        id = $(this).attr('id')
    } else if ($(this).hasClass('popover')) {
        id = $(this).data('id')
    } else {
        id = $(this).parent('.postit').attr('id');
    }
    socket.emit('lock', id)
})

socket.on('lockRender', function (id, currentUser) {
    console.log('lockRender');  //
    $(`#${id}`).prop('readonly', true);
    $(`#${id} > .lock_msg`).css({ 'visibility': 'visible' });

    // disable other user's events
    $(`#${id}`).css({ 'pointer-events': 'none' });

    // Show collaborator's name
    $(`#${id} .hvr-wobble-to-bottom-right`).css({
        'background-color': `${currentUser.userColor}`, 'visibility': 'visible'
    })
    $(`#${id} .collab_name`).html(`${currentUser.username}`);
})


// remove cover after editing
$('.workspace').on('keyup mouseup', '.postit, .postit_input', _.debounce(function () {
    let id;
    if ($(this).hasClass('postit')) {
        id = $(this).attr('id')
    } else {
        id = $(this).parent('.postit').attr('id');
    }

    socket.emit('lockRemove', id);
}, 2000))

$('.workspace').on('mouseleave dragstop', '.postit, .postit_input', function () {
    let id;
    if ($(this).hasClass('postit')) {
        id = $(this).attr('id')
    } else {
        id = $(this).parent('.postit').attr('id');
    }

    setTimeout(function () {
        socket.emit('lockRemove', id);
    }, 2000)

})

socket.on('lockRemoveRender', function (id) {
    if (typeof id == Array) {
        for (let i = 0; i < id.length; i++) {
            $(`#${id[i]} > .lock_msg`).css({ 'visibility': 'hidden' });
        }
    } else {
        $(`#${id} > .lock_msg`).css({ 'visibility': 'hidden' });
    }

    // remove collab_cursor
    $(`#${id} .hvr-wobble-to-bottom-right`).css({ 'background-color': `${randomColor}`, 'visibility': 'hidden' })
    // enable other user's events
    $(`#${id}`).css({ 'pointer-events': 'auto' });
})

/*---Popover and Postit settings---*/
$('.workspace').on('mouseover', '[data-toggle="popover"]', function (e) {
    // show popover on postit
    if (!$(e.target).hasClass('postit_input')) {
        $('[data-toggle="popover"]').popover({
            title: 'Postit Details',
            html: true,
            sanitize: false,
            animation: true,
            placement: 'right'
        })
    }

    // hide other popovers
    $('[data-toggle="popover"]').not(this).popover('hide');

    // get id of postit
    let postitID = $(this).attr('id');

    // show X when hover on postit
    $(`#${postitID}`).mouseover(function () {
        $(`#${postitID} > .close_postit`).css({ 'color': 'white', 'text-shadow': '#000 0px 0px 2px', 'fontWeight': 'bold', '-webkit-font-smoothing': 'antialiased' })
    })
    $(`#${postitID}`).mouseout(function () {
        $(`#${postitID} > .close_postit`).css({ 'color': 'transparent', 'text-shadow': 'none' })
    })

})

$('.workspace').on('click', '.postit', function (e) {
    // prevent default events
    e.preventDefault();
    e.stopPropagation();

    // get id of postit
    let postitID = $(this).attr('id');

    // get id of popover
    $('.show').on('mouseover', function () {
        let popoverID = $(this).attr('id');
        // pass postitID into popover
        $(`#${popoverID}`).data('id', postitID);
    })


    // Font Size
    $('.font_size').on('change', function () {
        let font_size = $(this).val();
        $(`#${postitID}`).css('font-size', `${font_size}px`);
    })
    // Font Color
    $('.show .font_color').on('change', function () {
        // get color of selected
        let color = $(this).val();
        // change font color
        $(`#${postitID} .postit_input`).css('color', `${color}`)
    })


    // Color
    $('.show .color_block').on('change', function () {
        // get color of selected
        let color = $(this).val();
        // change postit color
        $(`#${postitID}`).css('backgroundColor', `${color}`);
    });

    // Img upload
    $('#files').on('change', function () {
        readURL(this);
    })

    function readURL(input) {
        let img_id = Date.now();
        if (input.files && input.files[0]) {
            let reader = new FileReader();
            reader.onload = function (e) {
                $(`#${postitID}`).append(`<img src=${e.target.result} id=${img_id} class="upload_pic">`);
            }
            reader.readAsDataURL(input.files[0]); // convert to base64 string
        }
    }

    // (WIP)remove img when double clicked
    $('.upload_pic').dblclick(function () {
        console.log('double click');
        $(this).hide();
    })


    // Order
    // move to front whenever postit is clicked
    $(`#${postitID}`).css('zIndex', '+=1')
    console.log('zIndex', $(`#${postitID}`).css('zIndex'))  //
    // (WIP)hide "send to back" btn if at bottom
    if ($(`#${postitID}`).css('zIndex') == 0 || $(`#${postitID}`).css('zIndex') == 1) { // not working
        // console.log('zIndex=0', $(`#${postitID}`).css('zIndex'))  //
        // console.log($(`[data-id="${postitID}"]`));
        $(`[data-id="${postitID}"] > #back`).css({ 'pointer-events': 'none' })
        $(`[data-id="${postitID}"] > span`).css({ 'color': 'blue' })
    }
    $('.show input[type="radio"]').on('change', function () {
        // single choice_radio
        $('input[type="radio"]').not(this).prop('checked', false);
        // get selected option
        if ($("input:checked").attr('id') == 'front') {
            $(`#${postitID}`).css('zIndex', '+=1');
        } else if (($("input:checked").attr('id') == 'back')) {
            $(`#${postitID}`).css('zIndex', '-=2');
        }
    });
})

// upload selected img for postit
function addFile() {
    $('input[type="file"]').change(function (e) {
        $(this).siblings('div[id="filename"]').html(e.target.files[0].name);
    });
}



// prevent submit on enter
// $('input').on('submit', function (e) {
//     e.preventDefault();
//     $('form').submit
// })


/*---Toolbar Functions---*/
// cowork
$('.cowork').on('click', function () {
    // Get sharing link
    let link = document.location.href

    $('section').append(`<div class='shareLink'>
    <input class='link' value='${link}'><img class='copyLink' src='./img/copy.png' width='15px' height='15px'></img>
    </div>`);

    // copy link to clipboard
    $('.copyLink').on('click', function () {
        console.log('COPY!!!!!')
        //Get the text field
        let copyText = document.querySelector('.link');

        /* Select the text field */
        copyText.select();
        copyText.setSelectionRange(0, 99999); /*For mobile devices*/

        /* Copy the text inside the text field */
        document.execCommand("copy");

        /* Alert the copied text */
        alertMessage(`Text Copied!`, 'success');
    })
})



$('.expando__close').on('click', function () {
    $('.shareLink').hide();
})

// screenshot
function screenshot() {
    html2canvas(document.getElementById('print')).then(function (canvas) {
        // add watermark
        let ctx = canvas.getContext("2d");
        ctx.fillStyle = 'gray'
        ctx.font = '10px courier'
        // ctx.fillText('Copyright © 2020 Boarder Playground All Rights Reserved', 780, 650)
        ctx.fillText('Copyright © 2020 Boarder Playground All Rights Reserved', 350, 500)

        // export img
        document.body.appendChild(canvas);
        let a = document.createElement('a');
        a.href = canvas.toDataURL("image/jpeg").replace("image/jpeg", "image/octet-stream");
        a.download = 'workspace.jpg';
        a.click();
    });
}



/*---Preceding Operations---*/
let access_token = localStorage.getItem('access_token');

if (!access_token) {
    // Anonymous user
    let anonymousList = ['Batman', 'Superman', 'Wonder Woman', 'Green Lantern', 'The Flash', 'Aquaman', 'Atom',
        'Captain America', 'Antman', 'Loki', 'Grook', 'Black Widow', 'Spider-Man', 'Vision', 'Black Panther', 'Iron-Man',
        'Scarlet Witch', 'War Machine', 'Rocket Racoon', 'Dr.Strange', 'Dead Pool'];
    let character = anonymousList[Math.floor(Math.random() * anonymousList.length)];
    localStorage.setItem('username', character);
    localStorage.setItem('user_id', Date.now());
    // disable buttons
    $('.right_nav > a').removeAttr('href');
    $('.right_nav > a').css({ 'color': 'grey', 'border': 'grey', 'pointer-events': 'none' });
}

// Set a color for each user
let randomColorList = ['#e0f0ea', '#95adbe', '#9da8a7', '#9da8a7', '#f0e6e0', '#a8a19d'];
let randomColor = randomColorList[Math.floor(Math.random() * randomColorList.length)];
localStorage.setItem('user_color', randomColor);

// Get localstorage info
let username = localStorage.getItem('username');
let username_abv = username.split("")[0];
let user_id = localStorage.getItem('user_id');
let user_color = localStorage.getItem('user_color');

// Get whiteboard info from query
const urlParams = new URLSearchParams(window.location.search);
let wb_id = urlParams.get('wb_id');
let title = urlParams.get('title');

// Render page basic info
$('#workspace_title').html(title);  // set workspace page title
$('.greeting').html(`${username_abv}`);

/*---Get Workspace---*/
fetch_get_workspace(wb_id, access_token);

/*---Save workspace for collaborators---*/
fetch_share_record(access_token, wb_id, user_id);

/*---Socket IO---*/
// Create socket connection
const socket = io();

// Check socket connection
socket.on('message', (message) => {
    console.log(message);
});

// Join Room 
let wb_name = $('#workspace_title').html();
socket.emit('join_room', { user_id, username, user_color, wb_id, wb_name });

// Send message
socket.on('status_message', function (message) { // Welcome
    alertMessage(message, 'info');
});

// Render room info
socket.on('room_users', ({ room, room_name, users, user_count }) => {
    let room_info = { room, room_name, users, user_count };
    $('.dropNumber').html(`${room_info.user_count}`);   // show user count

    // show user status
    $('.dropdown_content').html('');
    show_room_users(room_info);

    // status: turn gray if idle
    // Detect idle user
    let idle_time = 0;
    $(document).ready(function () {
        //Increment the idle time counter every minute
        let idle_interval = setInterval(timer_increment, 600000); // 10 minute

        //Reset the idle timer on mouse movement
        $(this).mousemove(function (e) {
            idle_time = 0;
        });
        $(this).keypress(function (e) {
            idle_time = 0;
        });
    });

    timer_increment(idle_time);
});

/*---Sync postit appearance and movement: Add/Edit/Move Postit---*/
// Add Postit: Sync on add postit
$('section').on('click', '.add_postit', function () {
    let postit_id = { postit_id: render_postit('none', 'add') };
    socket.emit('add_postit', postit_id);
});

socket.on('add_render', function (postit_id) {
    render_postit(postit_id, 'socket_add_postit');
});

// Update Postit: Sync & save on edit postit
$('body').on('click change dragstop', '.postit, .popover', function () {
    // id identification
    let id;
    if ($(this).data('id')) {
        id = $(this).data('id'); // popover contains data-id property
    } else {
        id = $(this).attr('id');
    }

    // collect postit data
    let { postit_item, postit_data } = collect_postit_info(id);

    /*---Sync Postit---*/
    // emit edited data to server
    socket.emit('edit_postit', postit_item);

    /*---Save Postit---*/
    // Auto saving Status
    $('.saveStatus').html('AUTO-SAVING DOCUMENT...');
    fetch_update_postit(access_token, postit_data);
    setTimeout($('.saveStatus').html('DOCUMENT SAVED!!'), 50000);

});

// Sync and update on resizeEND & keyup
$('body').on('resize keyup', '.postit', _.debounce(function () {
    // id identification
    let id;
    if ($(this).data('id')) {
        id = $(this).data('id'); // popover contains data-id property
    } else {
        id = $(this).attr('id');
    }

    // collect postit data
    let { postit_item, postit_data } = collect_postit_info(id);

    // emit edited data to server
    socket.emit('edit_postit', postit_item);

    /*---Save Postit---*/
    // Auto saving Status
    $('.saveStatus').html('AUTO-SAVING DOCUMENT...');
    fetch_update_postit(access_token, postit_data);
    setTimeout($('.saveStatus').html('DOCUMENT SAVED!!'), 50000);

}, 2000));

// render edited data
socket.on('edit_render', function (postit_item) {
    render_postit(postit_item, 'socket_edit_postit');
});

/*---Delete Postit---*/
$('.workspace').on('click', '.close_postit', function (e) {
    let delete_id = $(this).parent('.postit').attr('id');
    socket.emit('delete_postit', delete_id);

    // API
    fetch_delete_postit(access_token, delete_id);

    // delete postit at front-end
    $(this).parent('.postit').remove();
});

socket.on('delete_render', function (delete_id) {
    $(`#${delete_id}`).remove();
});

// hide popover when postit deleted
$('.workspace').on('click', '.close_postit', function () {
    $('.popover').each(function () {
        $(this).hide();
    });
});

/*---Lock Postit---*/
// lock when user1 is editing
$('.workspace').on('click resize keydown dragstart drag', '.postit, .postit_input', function () {
    // id_identification
    let id;
    if ($(this).hasClass('postit')) {
        id = $(this).attr('id');
    } else if ($(this).hasClass('popover')) {
        id = $(this).data('id');
    } else {
        id = $(this).parent('.postit').attr('id');
    }

    socket.emit('lock', id);

});
// lock when user1 clicks on popover
$('body').on('click', '.popover', function () {
    // id_identification
    let id;
    if ($(this).hasClass('postit')) {
        id = $(this).attr('id');
    } else if ($(this).hasClass('popover')) {
        id = $(this).data('id');
    } else {
        id = $(this).parent('.postit').attr('id');
    }

    socket.emit('lock', id);
});

socket.on('lock_render', function (id, current_user) {
    $(`#${id}`).prop('readonly', true);
    $(`#${id} > .lock_msg`).css({ 'visibility': 'visible' });

    // disable other user's events
    $(`#${id}`).css({ 'pointer-events': 'none' });

    // Show collaborator's name
    $(`#${id} .hvr-wobble-to-bottom-right`).css({ 'background-color': `${current_user.user_color}`, 'visibility': 'visible' });
    $(`#${id} .collab_name`).html(`${current_user.username}`);
});


// remove cover after editing
// prevent flashing on multiple events(click, keyup)
$('.workspace').on('keyup mouseup', '.postit, .postit_input', _.debounce(function () {
    // id_identification
    let id;
    if ($(this).hasClass('postit')) {
        id = $(this).attr('id');
    } else {
        id = $(this).parent('.postit').attr('id');
    }

    socket.emit('lock_remove', id);
}, 2000));

$('.workspace').on('mouseleave dragstop', '.postit, .postit_input', function () {
    // id_identification
    let id;
    if ($(this).hasClass('postit')) {
        id = $(this).attr('id');
    } else {
        id = $(this).parent('.postit').attr('id');
    }

    setTimeout(function () {
        socket.emit('lock_remove', id);
    }, 2000);

});

socket.on('lock_remove_render', function (id) {
    if (typeof id == Array) {
        for (let i = 0; i < id.length; i++) {
            $(`#${id[i]} > .lock_msg`).css({ 'visibility': 'hidden' });
        }
    } else {
        $(`#${id} > .lock_msg`).css({ 'visibility': 'hidden' });
    }

    // remove collab_cursor
    $(`#${id} .hvr-wobble-to-bottom-right`).css({ 'background-color': `${randomColor}`, 'visibility': 'hidden' });
    // enable other user's events
    $(`#${id}`).css({ 'pointer-events': 'auto' });
});


/*---Popover and Postit Style Settings---*/
// (WIP) hide popover when white space is clicked
$(".workspace").on('mousedown', function (e) {
    console.log('hide_popover');
    $('.popover').addClass('hidden');
});

$('.workspace').on('mouseover', '[data-toggle="popover"]', function (e) {
    // show popover on click postit
    $('[data-toggle="popover"]').popover({
        title: 'Postit Details',
        html: true,
        sanitize: false,
        animation: true,
        placement: 'right'
    });

    // hide other popovers
    $('[data-toggle="popover"]').not(this).popover('hide');

    // get id of postit
    let postitID = $(this).attr('id');

    // show X when hover on postit
    $(`#${postitID}`).mouseover(function () {
        $(`#${postitID} > .close_postit`).css({ 'color': 'white', 'text-shadow': '#000 0px 0px 2px', 'fontWeight': 'bold', '-webkit-font-smoothing': 'antialiased' });
    });
    $(`#${postitID}`).mouseout(function () {
        $(`#${postitID} > .close_postit`).css({ 'color': 'transparent', 'text-shadow': 'none' });
    });

});

$('.workspace').on('click', '.postit', function (e) {
    $('.popover').removeClass('hidden');

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
    });


    // Font Size
    $('.font_size').on('change', function () {
        let font_size = $(this).val();
        $(`#${postitID}`).css('font-size', `${font_size}px`);
    });
    // Font Color
    $('.show .font_color').on('change', function () {
        // get color of selected
        let color = $(this).val();
        // change font color
        $(`#${postitID} .postit_input`).css('color', `${color}`);
    });


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
    });

    // (WIP)remove img when double clicked
    $('.upload_pic').dblclick(function () {
        console.log('double click');
        $(this).hide();
    });


    // Order
    // move to front whenever postit is clicked
    $(`#${postitID}`).css('zIndex', '+=1');
    console.log('zIndex', $(`#${postitID}`).css('zIndex'));  //
    // (WIP)hide "send to back" btn if at bottom
    if ($(`#${postitID}`).css('zIndex') == 1) { // not working
        // console.log('zIndex=0', $(`#${postitID}`).css('zIndex'))  //
        // console.log($(`[data-id="${postitID}"]`));
        console.log('helloorder');
        $(`[data-id="${postitID}"] #back`).css({ 'pointer-events': 'none' }); //not working
        $(`[data-id="${postitID}"] span`).css({ 'color': 'blue' });
    }
    // if ($(`#${postitID}`).css('zIndex') == 0 || $(`#${postitID}`).css('zIndex') == 1) { // not working
    //     // console.log('zIndex=0', $(`#${postitID}`).css('zIndex'))  //
    //     // console.log($(`[data-id="${postitID}"]`));
    //     $(`[data-id="${postitID}"] > #back`).css({ 'pointer-events': 'none' })
    //     $(`[data-id="${postitID}"] > span`).css({ 'color': 'blue' })
    // }
    $('.show input[type="radio"]').on('change', function () {
        // single choice_radio
        $('input[type="radio"]').not(this).prop('checked', false);
        // get selected option
        if ($("input:checked").attr('id') == 'front') {
            $(`#${postitID}`).css('zIndex', '+=20');
        } else if (($("input:checked").attr('id') == 'back')) {
            $(`#${postitID}`).css('zIndex', '-=2');
        }
    });
});


/*---Toolbar Functions---*/
// cowork
$('.cowork > .cowork_icon').on('click', function () {
    // console.log('cowork_click');
    // Get sharing link
    let link = document.location.href;

    $('.cowork').append(`<div class='shareLink'>
    <input class='link' value='${link}'><img class='copyLink' src='./img/copy.png' width='15px' height='15px'></img>
    </div>`);

    // copy link to clipboard
    $('.copyLink').on('click', function (e) {
        e.stopPropagation();

        //Get the text field
        let copyText = document.querySelector('.link');

        /* Select the text field */
        copyText.select();

        /* Copy the text inside the text field */
        document.execCommand("copy");

        /* Alert the copied text */
        alertMessage(`Text Copied!`, 'success');

        // hide shareLink after copy
        $('.shareLink').remove();
    });

}).children().on('click', function () {
    return false;
});

//template
$('.template > .template_icon').on('click', function () {
    $('.template').append(`<ul class='template_list'>
    <li class='template_list_item' id='bmc'>Business Model Canvas</li>
    <li class='template_list_item' id='persona'>Persona Template</li>
    <li class='template_list_item' id='empathy'>Empathy Map</li>
    <li class='template_list_item' id='storyBoard'>Story Board</li>
    <li class='template_list_item' id='none'>- None -</li>
</ul>`);
    $('.template_list_item').on('mouseover', function (e) {
        $(this).css({ 'background-color': 'white' });
        $('.template_list_item').not(this).css({ 'background-color': 'transparent' });
    });
    $('.template_list_item').on('click', function (e) {
        e.stopPropagation();

        // sync template
        let template_name = $(this).attr('id');
        socket.emit('template', template_name);

        // hide shareLink after copy
        $('.template_list').remove();

        // save template to DB
        fetch_update_template(access_token, wb_id, template_name);
    });

});

// broadcast template
socket.on('template_render', function (template) {
    render_template(template);
});

/*---Style---*/
// toolbar
$('.toolbar_item').on('mouseover', function () {
    $(this).css({ 'background-color': 'white' });
    $('.toolbar_item').not(this).css({ 'background-color': 'transparent' });
});
$('.toolbar_item').on('mouseout', function () {
    $('.toolbar_item').css({ 'background-color': 'transparent' });
});
$('.template_list_item').on('mouseover', function () {
    $('.template_list_item').css({ 'background-color': 'white' });
    $('.template_list_item').not(this).css({ 'background-color': '#FFCC33' });
});
$('.template_list_item').on('mouseout', function () {
    $('.template_list_item').css({ 'background-color': '#FFCC33' });
});



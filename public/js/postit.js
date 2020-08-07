function add_postit() {
    let workspace = document.querySelector('.workspace');
    let new_postit = document.createElement('main');
    new_postit.innerHTML = `
    <div class='triangle'></div>
    <div class='close_postit'>X</div>
    <textarea class='postit_input' placeholder='Write something on this post-it!' onkeyup="autogrow(this);"></textarea>
    <div class='collab_cursor hvr-wobble-to-bottom-right'></div><div class='collab_name hvr-wobble-to-bottom-right'></div>
    <div class='lock_msg'><p id='lock_content'>Someone else is editing this postit...</p></div>`;
    workspace.append(new_postit);

    setAttributes(new_postit, {
        'class': 'postit', 'draggable': 'true', 'data-toggle': 'popover', 'data-container': 'body', 'title': 'Postit Details', 'placeholder': 'Write something on Post-it!',
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
        </form>`});

    return new_postit;
}

function render_postit(data, option) {
    if (option === 'add') {  // add new postit
        let new_postit = add_postit();
        let id = 'id_' + Date.now();
        new_postit.setAttribute('id', `${id}`); // set postit id
        set_postit_basic_prop(id);
        return id;

    } else if (option === 'socket_add_postit') {
        let new_postit = add_postit();
        new_postit.setAttribute('id', `${data.postit_id}`); // set postit id
        set_postit_basic_prop(data.postit_id);

    } else if (option === 'socket_edit_postit') {
        set_postit_properties(data);

    } else {
        for (let i = 0; i < data.length; i++) {
            let new_postit = add_postit();
            new_postit.setAttribute('id', data[i].postit_id); // set postit id
            set_postit_properties(data[i]);
        }

        // Get template
        if (data[0]) {
            render_template(data[0].template);
        }
    }


}

function set_postit_basic_prop(id) {
    $(`#${id}`).data('user_id', user_id);   // store user_id in postit
    $(`#${id}`).css('position', 'absolute');
    $(`#${id}`).draggable({ containment: 'parent' });
    $(`#${id}`).resizable({ maxHeight: 500, maxWidth: 800, minHeight: 50, minWidth: 50, containment: 'parent' });  // make postit resizable
}

function set_postit_properties(data, id) {
    let styles = {
        'left': data.position_x,
        'top': data.position_y,
        'position': 'absolute',
        'background-color': data.bg_color,
        'width': data.width,
        'height': data.height,
        'font-size': data.font_size,
        'zIndex': data.zIndex
    };

    // postit basic settings
    $(`#${data.postit_id}`).css(styles);
    $(`#${data.postit_id}`).data('user_id', user_id);   // store user_id in postit
    $(`#${data.postit_id}`).draggable({ containment: 'parent' });  // make postit draggable
    $(`#${data.postit_id}`).resizable({ maxHeight: 500, maxWidth: 800, minHeight: 50, minWidth: 50, containment: 'parent' });  // make postit resizable


    // Textarea settings
    $(`#${data.postit_id} > .postit_input`).val(data.text);  // text content
    $(`#${data.postit_id} > .postit_input`).css('color', data.font_color);  // text color

    // add img if exists
    if (data.img !== null) {
        $(`${data.postit_id}`).append(`<img class='upload_pic' src=${data.img}>`);
    }
}

function collect_postit_info(id) {
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

    return { postit_item, postit_data };
}

function render_template(template) {
    $('.template_bg').attr('src', `../img/${template}.png`);
    if (template === 'bmc') {
        $('.template_bg').css({ 'object-position': ' 0px 35px' });
    } else if (template === 'persona') {
        $('.template_bg').css({ 'object-position': ' 0px 35px' });
    } else if (template === 'empathy') {
        $('.template_bg').css({ 'object-position': ' 0px 45px' });
    } else if (template === 'storyBoard') {
        $('.template_bg').css({ 'object-position': ' 0px 40px' });
    } else if (template === 'none') {
        $('.template_bg').attr('src', '');
    }
}

function show_room_users(room_info) {
    console.log('show_room_users');
    for (let i = 0; i < room_info['users'].length; i++) {
        $('.dropdown_content').append(`<div class='dropdown_item'>
        <div class='dropName'>${room_info.users[i].username}</div>
        <div class='dropColor'></div>
        </div>`);
        $('.dropColor').css({ 'background-color': 'green' });
    }
}

function timer_increment(idle_time) {
    idle_time = idle_time + 1;
    if (idle_time > 1) { // 20 minutes
        $('.dropColor').css({ 'background-color': 'gray' }); //WIP
    }
}

// WIP
function id_identification(option) {
    let id;
    if (option == 'update_postit') {

        if ($(this).data('id')) {
            id = $(this).data('id'); // popover contains data-id property
        } else {
            id = $(this).attr('id');
        }
        console.log('id_id_update', id);

        return id;

    } else if (option == 'lock') {
        if ($(this).hasClass('postit')) {
            id = $(this).attr('id');
        } else if ($(this).hasClass('popover')) {
            id = $(this).data('id');
        } else {
            id = $(this).parent('.postit').attr('id');
        }
        console.log('id_id_lock', id);

        return id;
    }
}

/*---Upload Image---*/
// upload selected img for postit
function addFile() {
    $('input[type="file"]').change(function (e) {
        $(this).siblings('div[id="filename"]').html(e.target.files[0].name);
    });
}
function readURL(input) {
    let img_id = Date.now();
    if (input.files && input.files[0]) {
        let reader = new FileReader();
        reader.onload = function (e) {
            $(`#${postitID}`).append(`<img src=${e.target.result} id=${img_id} class="upload_pic">`);
        };
        reader.readAsDataURL(input.files[0]); // convert to base64 string
    }
}

/*---Toolbar Functions---*/
// screenshot
function screenshot() {
    html2canvas(document.getElementById('print')).then(function (canvas) {
        // add watermark
        let ctx = canvas.getContext("2d");
        ctx.fillStyle = 'gray';
        ctx.font = '10px courier';
        // ctx.fillText('Copyright © 2020 Boarder Playground All Rights Reserved', 780, 650)
        ctx.fillText('Copyright © 2020 Boarder Playground All Rights Reserved', 350, 500);

        // export img
        document.body.appendChild(canvas);
        let a = document.createElement('a');
        a.href = canvas.toDataURL("image/jpeg").replace("image/jpeg", "image/octet-stream");
        a.download = 'workspace.jpg';
        a.click();
    });
}

/*---Other Functions---*/
// Function: set multiple attributes
function setAttributes(el, options) {
    Object.keys(options).forEach(function (attr) {
        el.setAttribute(attr, options[attr]);
    });
}

// autosize textarea
function autogrow(textarea) {
    let adjustedHeight = textarea.clientHeight;
    adjustedHeight = Math.max(textarea.scrollHeight, adjustedHeight);
    if (adjustedHeight > textarea.clientHeight) {
        textarea.style.height = adjustedHeight + 'px';
    }
}

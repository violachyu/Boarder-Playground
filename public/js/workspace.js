let access_token = localStorage.getItem('access_token');
let username = localStorage.getItem('username');
let user_id = localStorage.getItem('user_id');

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
        console.log('getWorkspace_postit data', data);  //

        for (let i = 0; i < data.length; i++) {
            let workspace = document.querySelector('.workspace');
            let new_postit = document.createElement('main');
            new_postit.innerHTML = `<div class='triangle'></div>
            <div class='close_postit'>X</div>
            <textarea class='postit_input' placeholder='Write something on this post-it!' onkeyup="autogrow(this);"></textarea>`
            workspace.append(new_postit)

            setAttributes(new_postit, {
                'class': 'postit', 'draggable': 'true', 'id': data[i].postit_id, 'data-toggle': 'popover', 'data-container': 'body', 'title': 'Postit Details', 'placeholder': 'Write something on Post-it!',
                'data-content': `<form class='postit_detail' id='popover-content' enctype=''>
                    <div class='align_wrap'>
                        <div class='category font'>
                            <div class='title'>Font Size:</div>
                            <input class='font_size' placeholder='font size(px)' type='number'>
                        </div>
                        <div class='category color'>
                            <div class='title'>Color:</div>
                            <div class='color_block' style='background-color:#EE9795'></div>
                            <div class='color_block' style='background-color:#809BCE'></div>
                            <div class='color_block' style='background-color:#95B8D1'></div>
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
                                <label for='front+'><input type='radio' id='front+'><span>Bring to front</span></label>
                                <label for='front'><input type='radio' id='front'><span>Bring forward</span></label>
                                <label for='back'><input type='radio' id='back'><span>Send backward</span></label>
                                <label for='back+'><input type='radio' id='back+'><span>Send to back</span></label>
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
            zIndex:${data[i]['z-index']};`) // WIP: comments
            $(`#${data[i].postit_id} > .postit_input`).val(data[i].text);  // text

            $(`#${data[i].postit_id}`).data('user_id', user_id);   // store user_id in postit
            // $(`#${data[i].postit_id}`).draggable({ handle: '.triangle' });  // make postit draggable
            $(`#${data[i].postit_id}`).draggable();  // make postit draggable
            $(`#${data[i].postit_id}`).resizable({ maxHeight: 500, maxWidth: 500, minHeight: 50, minWidth: 50 });  // make postit resizable
        }
    })

/*---Save Workspace on Drop postit---*/
$('.workspace').on('resize click drag change', '.postit, .show', function () {  // (WIP) change trigger events: DOMSubtreeModified
    console.log('saveWorkspace_API')  //
    // reform postit data
    let postit_data = [];
    let postit_item = {};
    postit_item['postit_id'] = $(this).attr('id')
    postit_item['user_id'] = $(this).data('user_id');  // dataset user_id
    postit_item['wb_id'] = wb_id;
    postit_item['position_x'] = $(this).css('left')
    postit_item['position_y'] = $(this).css('top')
    postit_item['text'] = $(this).children('.postit_input').val();
    postit_item['bg_color'] = $(this).css('background-color');
    postit_item['width'] = $(this).css('width');
    postit_item['height'] = $(this).css('height');
    postit_item['img'] = $(this).children('.upload_pic').attr('src') || null;
    postit_item['zIndex'] = $(this).css('zIndex');
    postit_item['del'] = null;
    // postit_item['comment'] = $(this) //(WIP)
    postit_data.push(postit_item);

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
        })
})

/*---Delete Postit---*/
$('.workspace').on('click', '.close_postit', function () {
    $(this).parent('.postit').remove();
    console.log($(this).parent('.postit'));
    console.log('delete');  //
    let deleteInit = {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            'authorization': access_token
        },
        body: JSON.stringify({
            postit_id: $(this).parent('.postit').attr('id')
        })
    }
    fetch('api/1.0/saveWorkspace/delete', deleteInit)
        .then((res) => res.json())
        .then((data) => {
            alert("Delete Postit?")
            alert(data.error || data.message)
            // console.log(data.error || data.message)  //
        })
})



// screenshot
function screenshot() {
    html2canvas(document.getElementById('print')).then(function (canvas) {
        // add watermark
        var ctx = canvas.getContext("2d");
        ctx.fillStyle = 'gray'
        ctx.font = '10px courier'
        // ctx.fillText('Copyright © 2020 Boarder Playground All Rights Reserved', 780, 650)
        ctx.fillText('Copyright © 2020 Boarder Playground All Rights Reserved', 350, 500)

        // export img
        document.body.appendChild(canvas);
        var a = document.createElement('a');
        a.href = canvas.toDataURL("image/jpeg").replace("image/jpeg", "image/octet-stream");
        a.download = 'workspace.jpg';
        a.click();
    });

}


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
    let access_token = localStorage.getItem('access_token');
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
// add post-it w/ popover form
function add_postit() {
    let workspace = document.querySelector('.workspace');
    let new_postit = document.createElement('main');
    new_postit.innerHTML = `<div class='triangle'></div>
    <div class='close_postit'>X</div>
    <textarea class='postit_input' placeholder='Write something on this post-it!' onkeyup="autogrow(this);"></textarea>`
    workspace.append(new_postit)

    let id = 'id_' + Date.now();
    setAttributes(new_postit, {
        'class': 'postit', 'draggable': 'true', 'id': id, 'data-toggle': 'popover', 'data-container': 'body', 'title': 'Postit Details', 'placeholder': 'Write something on Post-it!',
        'data-content': `<form class='postit_detail' id='popover-content' enctype=''>
            <div class='align_wrap'>
                <div class='category font'>
                    <div class='title'>Font Size:</div>
                    <input class='font_size' placeholder='font size(px)' type='number'>
                </div>
                <div class='category color'>
                    <div class='title'>Color:</div>
                    <div class='color_block' style='background-color:#EE9795'></div>
                    <div class='color_block' style='background-color:#809BCE'></div>
                    <div class='color_block' style='background-color:#95B8D1'></div>
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
                        <label for='front+'><input type='radio' id='front+'><span>Bring to front</span></label>
                        <label for='front'><input type='radio' id='front'><span>Bring forward</span></label>
                        <label for='back'><input type='radio' id='back'><span>Send backward</span></label>
                        <label for='back+'><input type='radio' id='back+'><span>Send to back</span></label>
                    </div>
                </div>
        </form>`})

    $(`#${id}`).css('position', 'absolute');
    $(`#${id}`).data('user_id', user_id);   // store user_id in postit
    // $(`#${id}`).draggable({ handle: '.triangle' });
    $(`#${id}`).draggable();
    $(`#${id}`).resizable({ maxHeight: 500, maxWidth: 500 });  // make postit resizable
}

// autosize textarea
function autogrow(textarea) {
    let adjustedHeight = textarea.clientHeight;
    adjustedHeight = Math.max(textarea.scrollHeight, adjustedHeight);
    if (adjustedHeight > textarea.clientHeight) {
        textarea.style.height = adjustedHeight + 'px';
    }
}

$('.workspace').on('mouseover', '[data-toggle="popover"]', function () {
    // show popover on postit
    $('[data-toggle="popover"]').popover({
        title: 'Postit Details',
        html: true,
        sanitize: false,
        animation: true,
        placement: 'right'
    })

    // get id of postit
    let postitID = $(this).attr('id');

    // show X when hover on postit
    $(`#${postitID}`).mouseover(function () {
        $(`#${postitID} > .close_postit`).css({ 'color': 'white', 'text-shadow': '#000 0px 0px 2px', '-webkit-font-smoothing': 'antialiased' })
    })
    $(`#${postitID}`).mouseout(function () {
        $(`#${postitID} > .close_postit`).css({ 'color': 'transparent', 'text-shadow': 'none' })
    })
    // delete postit at frontend
    // $(`#${postitID} > .close_postit`).click(function () {
    //     $(`#${postitID}`).remove();
    // })
})

$('.workspace').on('click', '[data-toggle="popover"]', function (e) {
    // prevent default events
    e.preventDefault();
    e.stopPropagation();

    // get id of postit
    let postitID = $(this).attr('id');

    // get id of popover
    $('.show').on('click', function () {
        let popoverID = $(this).attr('id');
        // pass postitID into popover
        $(`#${popoverID}`).attr('data-id', postitID);
    })


    // Font Size
    $('.font_size').on('change', function () {
        console.log('font')
        let font_size = $(this).val();
        $(`#${postitID}`).css('font-size', `${font_size}px`);
    })

    // Color
    $('.show .color_block').on('click', function () {
        // single choice_color
        $(this).css({ 'outline': 'black solid 1px' });
        $('.color_block').not(this).css({ 'outline': '' });
        // get color of clicked
        let color = $(this).css('backgroundColor')
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
    $('.show input[type="radio"]').on('change', function () {
        // single choice_radio
        $('input[type="radio"]').not(this).prop('checked', false);
        // get selected option
        // $(`#${postitID}`).css('zIndex', '0')
        let original_z = $(`#${postitID}`).css('zIndex');
        console.log('orz', original_z); //

        if ($("input:checked").attr('id') == 'front+') {
            $(`#${postitID}`).css('zIndex', parseInt(original_z, 10) + 200);
            // console.log('front+', $(`#${postitID}`).css('zIndex'))  //
        } else if (($("input:checked").attr('id') == 'front')) {
            $(`#${postitID}`).css('zIndex', parseInt(original_z, 10) + 1);
            // console.log('front', $(`#${postitID}`).css('zIndex'))   //
        } else if (($("input:checked").attr('id') == 'back')) {
            $(`#${postitID}`).css('zIndex', parseInt(original_z, 10) - 1);
            // console.log('back', $(`#${postitID}`).css('zIndex'))  //
        } else if (($("input:checked").attr('id') == 'back+')) {
            $(`#${postitID}`).css('zIndex', parseInt(original_z, 10) - 200);
            // console.log('back+', $(`#${postitID}`).css('zIndex'))  //
        }

    });
})

// upload selected img for postit
function addFile() {
    $('input[type="file"]').change(function (e) {
        $(this).siblings('div[id="filename"]').html(e.target.files[0].name);
    });
}

// hide other popovers
$('body').on('click', function (e) {
    $('[data-toggle=popover]').each(function () {
        // hide any open popovers when the anywhere else in the body is clicked
        if (!$(this).is(e.target) && $(this).has(e.target).length === 0 && $('.popover').has(e.target).length === 0) {
            $(this).popover('hide');
        }
    });
});





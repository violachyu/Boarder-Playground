/*---Function---*/
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
let access_token = localStorage.getItem('access_token');
let username = localStorage.getItem('username');
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
let workspace = document.querySelector('.workspace')
function add_postit() {
    // let new_postit = document.createElement('main');
    let new_postit = document.createElement('main');
    let id = 'id_' + Date.now();
    setAttributes(new_postit, {
        'class': 'postit', 'draggable': 'true', 'id': id, 'data-toggle': 'popover', 'data-container': 'body', 'title': 'Postit Details', 'placeholder': 'Write something on Post-it!',
        'data-content': `<form class='postit_detail' id='popover-content' enctype=''>
            <div class='align_wrap'>
                <div class='category color'>
                    <div class='title'>Color:</div>
                    <div class='color_block' style='background-color:#EE9795'></div>
                    <div class='color_block' style='background-color:#809BCE'></div>
                    <div class='color_block' style='background-color:#95B8D1'></div>
                </div>
                <div class='category size'>
                    <div class='title'>Size:</div>
                    <input class='postit_size' id='postit_width' placeholder=' Width(px)' style='padding: 3px; width:80px;'
                        type='number'>x
                    <input class='postit_size' id='postit_height' placeholder=' Height(px)' style='padding: 3px;width:80px;'
                        type='number'>
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
    new_postit.innerHTML = `New Post-it!`;
    workspace.appendChild(new_postit);
}

// function add_postit() {
//     let new_postit = document.createElement('aside');
//     // setAttributes(new_postit, { 'class': 'postit', 'draggable': 'true', 'id': `id_${Math.floor(Math.random() * 50)}` })
//     setAttributes(new_postit, { 'class': 'postit', 'draggable': 'true', 'id': `id_${Math.floor(Math.random() * 50)}` })
//     // new_postit.innerHTML = ` New Post-it!<span class='postit_color'>COLOR :
//     // <div class='color_block' style='background-color:#EE9795'></div>
//     // <div class='color_block' style='background-color:#809BCE'></div>
//     // <div class='color_block' style='background-color:#B8CFE0'></div>
//     // </span>`
//     new_postit.innerHTML = ` New Post-it!`
//     workspace.appendChild(new_postit);


//     // postit detail settings
//     let color_blocks = document.querySelectorAll('.color_block')
//     let colors = ['#EE9795', '#809BCE', '#B8CFE0']
//     for (let j = 0; j < color_blocks.length; j++) {
//         color_blocks[j].style.backgroundColor = colors[j];
//     }

//     new_postit.addEventListener('dragstart', drag_start);
//     // new_postit.addEventListener('dragover', drag_over, false);
//     // new_postit.addEventListener('drop', drop_2);
//     document.querySelector('.workspace').addEventListener('dragover', drag_over, false);
//     document.querySelector('.workspace').addEventListener('drop', drop_2, false);
//     // document.body.addEventListener('dragover', drag_over, false);
//     // document.body.addEventListener('drop', drop_2, false);
// }

// pop over
// var $j = jQuery.noConflict();   // $j optional alias to jQuery noConflict()
$('.workspace').on('mouseover', '[data-toggle="popover"]', function () {
    $('[data-toggle="popover"]').popover({
        title: 'Postit Details',
        html: true,
        sanitize: false,
        animation: true,
        placement: 'right'
    })
})

$('.workspace').on('click', '[data-toggle="popover"]', function (e) {
    // prevent default events
    e.preventDefault();

    // get id of postit
    let postitID = $(this).attr('id');
    console.log('postitID', postitID);  //
    // get id of popover
    $('.show').on('click', function () {
        let popoverID = $(this).attr('id');
        // pass postitID into popover
        $(`#${popoverID}`).attr('data-id', postitID);
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

    // Size
    $('#postit_width').on('change', function () {
        // get input width 
        let width = $(this).val()
        console.log('width change', width)  //
        // change postit width
        $(`#${postitID}`).width(`${width}`);
    })
    $('#postit_height').on('change', function () {
        // get input height 
        let height = $(this).val()
        console.log('height change', height)    //
        // change postit height
        $(`#${postitID}`).height(`${height}`);
    })

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
    // // remove img when double clicked
    // $('.upload_img').dblclick(function () {
    //     console.log('double click');
    //     $(this).hide();
    // })


    // Order
    $('.show input[type="radio"]').on('change', function () {
        // single choice_radio
        $('input[type="radio"]').not(this).prop('checked', false);
        // get selected option
        // $(`#${postitID}`).css('zIndex', '0')
        let original_z = $(`#${postitID}`).css('zIndex');
        console.log('orz', original_z); //

        if ($("input:checked").attr('id') == 'front+') {
            $(`#${postitID}`).css('zIndex', parseInt(original_z, 10) + 20);
            // console.log('front+', $(`#${postitID}`).css('zIndex'))  //
        } else if (($("input:checked").attr('id') == 'front')) {
            $(`#${postitID}`).css('zIndex', parseInt(original_z, 10) + 1);
            // console.log('front', $(`#${postitID}`).css('zIndex'))   //
        } else if (($("input:checked").attr('id') == 'back')) {
            $(`#${postitID}`).css('zIndex', parseInt(original_z, 10) - 1);
            // console.log('back', $(`#${postitID}`).css('zIndex'))  //
        } else if (($("input:checked").attr('id') == 'back+')) {
            $(`#${postitID}`).css('zIndex', parseInt(original_z, 10) - 20);
            // console.log('back+', $(`#${postitID}`).css('zIndex'))  //
        }

    });
})

// hide other popovers
$('body').on('click', function (e) {
    $('[data-toggle=popover]').each(function () {
        // hide any open popovers when the anywhere else in the body is clicked
        if (!$(this).is(e.target) && $(this).has(e.target).length === 0 && $('.popover').has(e.target).length === 0) {
            $(this).popover('hide');
        }
    });
});

// upload selected img for postit
function addFile() {
    $('input[type="file"]').change(function (e) {
        $(this).siblings('div[id="filename"]').html(e.target.files[0].name);
    });
}


// drag n drop
function drag_start(event) {
    console.log('dragstart');
    let style = window.getComputedStyle(event.target, null);    //window.getComputedStyle(element--要獲取樣式的元素, pseudoElement--查詢類偽元素)
    // console.log(event.clientX, event.target.style.left);
    event.dataTransfer.setData("text/plain",
        (parseInt(style.getPropertyValue("left"), 10) - event.clientX) + ',' + (parseInt(style.getPropertyValue("top"), 10) - event.clientY));
}

function drag_over(event) {
    event.preventDefault();
    return false;
}

function drop_2(event) {
    console.log('id', event.target.id);
    console.log('drop2');
    // console.log('drop2 event.t', event.target.querySelectorAll('.postit').id);
    // console.log(event.target.getAttribute('id'));
    let offset = event.dataTransfer.getData("text/plain").split(',');
    // console.log(document.getElementById(event.target.id))
    document.getElementById(event.target.id).style.left = (event.clientX + parseInt(offset[0], 10)) + 'px';
    document.getElementById(event.target.id).style.top = (event.clientY + parseInt(offset[1], 10)) + 'px';
    event.preventDefault();
    return false;
}
function drop(event) {
    console.log('drop!??');
    let offset = event.dataTransfer.getData("text/plain").split(',');
    dm.style.left = (event.clientX + parseInt(offset[0], 10)) + 'px';
    dm.style.top = (event.clientY + parseInt(offset[1], 10)) + 'px';
    event.preventDefault();
    return false;
}
// let dm = document.getElementById('dragme');
// dm.addEventListener('dragstart', drag_start, false);
// dm.addEventListener('dragover', drag_over, false);
// dm.addEventListener('drop', drop, false);
// document.body.addEventListener('dragover', drag_over, false);
// document.body.addEventListener('drop', drop_2, false);


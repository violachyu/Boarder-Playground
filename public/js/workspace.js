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
// add post-it
let workspace = document.querySelector('.workspace')
function add_postit() {
    let new_postit = document.createElement('aside');
    // setAttributes(new_postit, { 'class': 'postit', 'draggable': 'true', 'id': `id_${Math.floor(Math.random() * 50)}` })
    setAttributes(new_postit, { 'class': 'postit', 'draggable': 'true', 'id': `id_${Math.floor(Math.random() * 50)}` })
    // new_postit.innerHTML = ` New Post-it!<span class='postit_color'>COLOR :
    // <div class='color_block' style='background-color:#EE9795'></div>
    // <div class='color_block' style='background-color:#809BCE'></div>
    // <div class='color_block' style='background-color:#B8CFE0'></div>
    // </span>`
    new_postit.innerHTML = ` New Post-it!`
    workspace.appendChild(new_postit);


    // postit detail settings
    let color_blocks = document.querySelectorAll('.color_block')
    let colors = ['#EE9795', '#809BCE', '#B8CFE0']
    for (let j = 0; j < color_blocks.length; j++) {
        color_blocks[j].style.backgroundColor = colors[j];
    }

    new_postit.addEventListener('dragstart', drag_start);
    // new_postit.addEventListener('dragover', drag_over, false);
    // new_postit.addEventListener('drop', drop_2);
    document.querySelector('.workspace').addEventListener('dragover', drag_over, false);
    document.querySelector('.workspace').addEventListener('drop', drop_2, false);
    // document.body.addEventListener('dragover', drag_over, false);
    // document.body.addEventListener('drop', drop_2, false);
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

// postit detail settings
let color_blocks = document.querySelectorAll('.color_block')
let colors = ['#EE9795', '#809BCE', '#B8CFE0']
for (let j = 0; j < color_blocks.length; j++) {
    color_blocks[j].style.backgroundColor = colors[j];
}

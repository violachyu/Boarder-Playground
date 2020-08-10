/*---Get Workspace---*/
function fetch_get_workspace(wb_id, access_token) {
    fetch(`api/1.0/workspace/${wb_id}`, {
        method: 'GET',
        headers: {
            'content-type': 'application/json',
            'authorization': access_token
        }
    })
        .then((res) => res.json())
        .then((json_data) => {
            if (json_data.error) {
                // hide background
                $('section').css('display', 'none');

                // alert error
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: `${json_data.error}`,
                    onAfterClose: () => {
                        location.href = '/';
                    }
                });
            } else {
                let data = json_data.workspace_data;
                render_postit(data);
            }
        });
}

/*---Update Workspace---*/
function fetch_update_postit(access_token, postit_data) {
    let saveInit = {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            'authorization': access_token
        },
        body: JSON.stringify({
            postit_data
        })
    };
    fetch('api/1.0/postit', saveInit)
        .then((res) => res.json())
        .then((data) => {
            console.log(data.error || data.message);
        });
    $('.saveStatus').html('DOCUMENT SAVED!!');
}

/*---Delete Postit---*/
function fetch_delete_postit(access_token, delete_id) {
    let deleteInit = {
        method: 'DELETE',
        headers: {
            'content-type': 'application/json',
            'authorization': access_token
        },
        body: JSON.stringify({
            postit_id: delete_id
        })
    };
    fetch('api/1.0/postit', deleteInit)
        .then((res) => res.json())
        .then((data) => {
            let { message, error } = data;
            if (message) {
                alertMessage(message, 'success');
            } else {
                alertMessage(error, 'danger');
            }
        });
}
/*---Update Template---*/
function fetch_update_template(access_token, wb_id, template_name) {
    fetch(`api/1.0/template`, {
        method: 'PATCH',
        headers: {
            'content-type': 'application/json',
            'authorization': access_token
        },
        body: JSON.stringify({
            wb_id, template_name
        })
    })
        .then((res) => res.json())
        .then((data) => {
            let { message, error } = data;
            console.log(message || error);
        });
    $('.saveStatus').html('DOCUMENT SAVED!!');
}
/*---Save Collaborator Workspace---*/
function fetch_share_record(access_token, wb_id, user_id) {
    fetch(`api/1.0/record`, {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            'authorization': access_token
        },
        body: JSON.stringify({
            wb_id, user_id
        })
    })
        .then((res) => res.json())
        .then((data) => {
            let { message, error } = data;
            console.log(message || error);
        });
}





# Boarder-Playground

## User
- register
endpoint: api/1.0/register
method: post
request body:
register_data: {
    {
        email: A01.gmail.com,
        pwd: ***************,
        access_token: HGJSHLKFHLEsjhlSHfwJ
    }
}

- login
endpoint: api/1.0/login
method: post
request: email, password, accesstoken


- logout
endpoint: api/1.0/logout
method: get


## Dashboard
- get_whiteboard
method: get
endpoint: api/1.0/get_whiteboard
request: user_id
respond: all_wb

- createWhiteboard 
method: post
endpoint: api/1.0/createWhiteboard
request: user_id



## Dashboard
- get_workspace
method: get
request header: auth: user_id, access_token

- savePostit
method: post
request body:
{
    wb_id: xxx,
    postit: [
        {
            postit_id: xxx,
            user_id: xxx,
            position_x: xxx,
            position_y: yyy,
            text: xxx,
            color: xxx,
            width: xxx,
            height: yyy,
            img: 'http://...',
            z_index: xxx,
            comment: xxx
        },
        {
            postit_id: xxx,
            user_id: xxx,
            position_x: xxx,
            position_y: yyy,
            text: xxx,
            color: xxx,
            width: xxx,
            height: yyy,
            img: 'http://...',
            z_index: xxx,
            comment: xxx
        }
    ]
}


    
    

# Boarder-Playground
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



- getWhiteboard
method: get
endpoint: api/1.0/getWhiteboard
request: user_id
respond: all_wb

- createWhiteboard 
method: post
endpoint: api/1.0/createWhiteboard
request: user_id
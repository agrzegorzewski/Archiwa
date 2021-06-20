function sendRequest(un, pw) {
    let token = "Basic " + btoa(un + ":" + pw);
    console.log(token);

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", token);

    var raw = JSON.stringify({
        "limit": 100,
        "filters": {
            "tags": {
                "exclude_values": [
                    "spam",
                    "support",
                    "sales",
                    "empty"
                ]
            },
            "agents": {
                "values": [
                    ""
                ]
            },
        }
    });

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw.replace('""', `"${document.getElementById('email').value}"`),
        redirect: 'follow'
    };

    const call = fetch("https://api.livechatinc.com/v3.3/agent/action/list_archives", requestOptions)
        .then(response => response.text())
        .then(result => {
            // console.log(JSON.parse(result));
            setLeftChats(result);
            createChatList(result);
            // console.log('found chats ' + JSON.parse(result).found_chats);
            // console.log('chats length ' + JSON.parse(result).chats.length);
        })
        .catch(error => console.log('error', error));

    function setLeftChats(result) {
        document.getElementById('chats_left').value = "Chats left to tag: " + ((JSON.parse(result).found_chats - JSON.parse(result).chats.length) > 0 ? JSON.parse(result).found_chats - JSON.parse(result).chats.length : "0");
    }

    function createChatList(result) {
        document.getElementById('chats_list').innerHTML = "";
        for (let i = 0; i < JSON.parse(result).chats.length; i++) {
            let id = JSON.parse(result).chats[i].thread.id;
            document.getElementById('chats_list').innerHTML += '<a href="https://my.staging.livechatinc.com/archives/' + id + '" target="_blank">' + id + '</a><br>';
        }
    }
}
function sendRequest(un, pw) {
    let token = "Basic " + btoa(un + ":" + pw);
    console.log(token);

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", token);

    var raw = JSON.stringify({
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
                    "a.grzegorzewski@livechat.com"
                ]
            },
        },
        "limit": 100
    });

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    const call = fetch("https://api.livechatinc.com/v3.3/agent/action/list_archives", requestOptions)
        .then(response => response.text())
        .then(result => {
            console.log(JSON.parse(result));
            setLeftChats(result);
            console.log('found chats ' + JSON.parse(result).found_chats);
            console.log('chats length ' + JSON.parse(result).chats.length);
        })
        .catch(error => console.log('error', error));

    function setLeftChats(result) {
        document.getElementById('chats_left').value = "Chats left to tag: " + JSON.parse(result).found_chats - JSON.parse(result).chats.length < 0 ? JSON.parse(result).found_chats - JSON.parse(result).chats.length : "0";
    }
}
function SendRequest(un, pw) {
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
            }
        }
    });

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    fetch("https://api.livechatinc.com/v3.3/agent/action/list_archives", requestOptions)
        .then(response => response.text())
        .then(result => console.log(result))
        .catch(error => console.log('error', error));
}
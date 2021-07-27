function sendRequest(un, pw) {
    const token = "Basic " + btoa(un + ":" + pw);

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", token);

    const requestParameters = {
        method: 'POST',
        headers: myHeaders,
        body: createBody(),
        redirect: 'follow'
    };

    makeCall(requestParameters);

}

function setLeftChats(result) {
    document.getElementById('chats_left').value = "Chats left to tag: " + ((JSON.parse(result).found_chats - JSON.parse(result).chats.length) > 0 ? JSON.parse(result).found_chats - JSON.parse(result).chats.length : "0");
}

function createChatList(result) {
    document.getElementById('chats_list').innerHTML = "";
    for (let chatIndex in JSON.parse(result).chats) {
        let id = JSON.parse(result).chats[chatIndex].thread.id;
        document.getElementById('chats_list').innerHTML += '<a href="https://my.staging.livechatinc.com/archives/' + id + '" target="_blank">' + id + '</a><br>';
    }
}

function makeCall(requestOptions) {
    fetch("https://api.livechatinc.com/v3.3/agent/action/list_archives", requestOptions)
        .then(response => response.text())
        .then(result => {
            setLeftChats(result);
            createChatList(result);
        })
        .catch(error => console.log('error', error));
}

function addDateToBody(date_from_input, date_to_input, requestBody) {

    const date_from = new Date(date_from_input);
    const date_to = new Date(date_to_input);

    if (Boolean(date_from_input) !== Boolean(date_to_input)) {
        return alert('Only one date included.');
    }
    if (date_from >= date_to) {
        return alert('"Date from" is bigger than or equal "date to".')
    }
    if (!date_from_input) {
        return requestBody;
    }

    requestBody.filters.from = date_from;
    requestBody.filters.to = date_to;

    return requestBody;
}

function createBody() {
    let raw = {
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
                    "agentEmail"
                ]
            },
        }
    };

    raw.filters.agents.values[0] = document.getElementById('email').value;

    return JSON.stringify(addDateToBody(document.getElementById('date_from').value, document.getElementById('date_to').value, raw));
}
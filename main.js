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

function addDateToBody(dateFromInput, dateToInput, requestBody) {

    const dateFrom = new Date(dateFromInput);
    const dateTo = new Date(dateToInput);

    if (Boolean(dateFromInput) !== Boolean(dateToInput)) {
        return alert('Only one date included.');
    }
    if (dateFrom >= dateTo) {
        return alert('"Date from" is bigger than or equal "date to".')
    }
    if (!dateFromInput) {
        return requestBody;
    }

    dateTo.setHours(23);
    dateTo.setMinutes(59);
    dateTo.setSeconds(59);

    requestBody.filters.from = addMilisecondsToDateString(dateFrom.toISOString());
    requestBody.filters.to = addMilisecondsToDateString(dateTo.toISOString());

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

function addMilisecondsToDateString(dateString) {
    return dateString.slice(0, -1) + "000Z";
}
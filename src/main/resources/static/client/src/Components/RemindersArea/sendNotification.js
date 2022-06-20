export function sendNotification(header, content, uid) {
    var url = "https://onesignal.com/api/v1/notifications";

    var xhr = new XMLHttpRequest();
    xhr.open("POST", url);

    xhr.setRequestHeader("Content-Type", "application/json; charset=utf-8");
    xhr.setRequestHeader("Authorization", "Basic OTgxNzVjNTUtNTU3Yi00OTUyLThhYzMtMGY3ZjBhNjRlYjM3");

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            console.log(xhr.status);
            console.log(xhr.responseText);
        }
    };

    var data = `{"app_id": "577a3ade-c29c-434b-8c12-ee8749ed6dfb",
    "contents": {"en":"` + content + `"},
    "headings": {"en": "` + header + `" },
    "channel_for_external_user_ids": "push",
     "include_external_user_ids": ["` + uid + `"]}`;
    console.log(data);
    xhr.send(data);

}
import {APP_ID} from "../../Consts/OneSignalInfo";

export function sendNotification(header, content, uid) {
    let url = "https://onesignal.com/api/v1/notifications";

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url);

    xhr.setRequestHeader("Content-Type", "application/json; charset=utf-8");
    xhr.setRequestHeader("Authorization", "Basic OTgxNzVjNTUtNTU3Yi00OTUyLThhYzMtMGY3ZjBhNjRlYjM3");

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {

        }
    };

    let data = `{"app_id": "`+ APP_ID + `",
    "contents": {"en":"` + content + `"},
    "headings": {"en": "` + header + `" },
    "channel_for_external_user_ids": "push",
     "include_external_user_ids": ["` + uid + `"]}`;
    xhr.send(data);

}
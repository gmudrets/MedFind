import {APP_ID} from "../../Consts/OneSignalInfo";
import {getAuth} from "firebase/auth";


export async function sendNotification(header, content, uid) {
    let url = "https://onesignal.com/api/v1/notifications";
    const a =
    const requastParams = {
        'authToken': "OTgxNzVjNTUtNTU3Yi00OTUyLThhYzMtMGY3ZjBhNjRlYjM3",
        "appID": "577a3ade-c29c-434b-8c12-ee8749ed6dfb"
    }
    console.log(requastParams);
    await getRequest(await getAuth().currentUser.getIdToken(true), ServerConsts.GetA, requastParams);
    xhr.open("POST", url);

    xhr.setRequestHeader("Content-Type", "application/json; charset=utf-8");
    xhr.setRequestHeader("Authorization", "Basic " + profile[ProfileFields.API_KEY]);

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {

        }
    };

    let data = `{"app_id": "` + APP_ID + `",
    "contents": {"en":"` + content + `"},
    "headings": {"en": "` + header + `" },
    "channel_for_external_user_ids": "push",
     "include_external_user_ids": ["` + uid + `"]}`;
    xhr.send(data);

}
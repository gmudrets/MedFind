import {APP_ID} from "../../Consts/OneSignalInfo";
import {getAuth} from "firebase/auth";
import {ServerConsts} from "../../Consts/apiPaths";
import {getRequest} from "../../Utils/AxiosRequests";


export async function sendNotification(header, content, uid) {
    let url = "https://onesignal.com/api/v1/notifications";
    let xhr = new XMLHttpRequest();

    const appData = await getRequest(await getAuth().currentUser.getIdToken(true), ServerConsts.GET_APP_DATA);
    console.log(appData);
    xhr.open("POST", url);

    xhr.setRequestHeader("Content-Type", "application/json; charset=utf-8");
    xhr.setRequestHeader("Authorization", "Basic " + appData['authToken']);

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
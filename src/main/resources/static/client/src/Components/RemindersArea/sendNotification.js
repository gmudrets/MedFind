import {APP_ID} from "../../Consts/OneSignalInfo";
import {useSelector} from "react-redux";
import {getSafe} from "../../Utils/Utils";
import {USER_PROFILE} from "../../Consts/StatePaths";
import * as ProfileFields from "../../Consts/ProfileFields";


export function sendNotification(header, content, uid) {
    let url = "https://onesignal.com/api/v1/notifications";
    const profile = useSelector((state) => getSafe(USER_PROFILE, state));
    let xhr = new XMLHttpRequest();
    xhr.open("POST", url);

    xhr.setRequestHeader("Content-Type", "application/json; charset=utf-8");
    xhr.setRequestHeader("Authorization", "Basic " +profile[ProfileFields.API_KEY]);

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
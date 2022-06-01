import React, {useEffect} from 'react';
import {Client} from '@stomp/stompjs';


const SOCKET_URL = 'wss://localhost:8080/wss-messages';

export default function Test(props) {
    const [messege, setMessege] = React.useState("Your server message here");


    useEffect(() => {
        let onConnected = () => {
            console.log("Connected!!")
            client.subscribe('/wss-alerts/message', function (msg) {
                if (msg.body) {
                    console.log(msg.body);
                    var jsonBody = JSON.parse(msg.body);
                    if (jsonBody.message) {
                        setMessege(jsonBody.message)
                    }
                }
            });
        }

        let onDisconnected = () => {
            console.log("Disconnected!!")
        }

        const client = new Client({
            brokerURL: SOCKET_URL,
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
            onConnect: onConnected,
            onDisconnect: onDisconnected
        });

        client.activate();
    });

    return (
        <div>
            <div>{messege}</div>
        </div>
    );


}


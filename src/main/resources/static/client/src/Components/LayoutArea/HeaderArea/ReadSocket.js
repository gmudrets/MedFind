import React, {useEffect} from 'react';
import {Client} from '@stomp/stompjs';
import {SOCKET_URL} from "../../../Consts/WebSocketConst";


export default function ReadSocket(props) {
    const [messege, setMessege] = React.useState("Your server message here");


    useEffect(() => {
        let onConnected = () => {
            client.subscribe('/wss-alerts/message', function (msg) {
                if (msg.body) {
                    props.readSocket(msg.body);
                }
            });
        }

        let onDisconnected = () => {
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
        <></>
    );


}


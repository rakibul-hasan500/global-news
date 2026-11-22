"use client"
import {config} from "@/config/config";
import {useDispatch, useSelector} from "react-redux";
import {useEffect} from "react";
import {io} from "socket.io-client";
import {markReaddNotificationOnRedux, removeDeletedNotificationFromRedux, setLiveNotificationToRedux} from "@/redux/services/notification/notificationSlice";

const socketUrl = config.serverUrl

const SocketConnection = () => {

    // Dispatch
    const dispatch = useDispatch();

    // Auth State
    const {accessToken, user} = useSelector((state: any) => state.Auth)

    useEffect(() => {

        // Check Access Token
        if (!accessToken) return

        // Socket Connection
        const socket = io(socketUrl, {
            auth: {
                token: accessToken,
            },
            autoConnect: false
        })

        // Connect Socket
        socket.connect()

        // Connected
        socket.on("connect", () => {
            console.log("Socket Connected Successfully")
        })

        // Connection Error
        socket.on("connect_error", (error: any) => {
            console.error("Socket Connection Error:", error.message);
        })

        // Disconnected
        socket.on("disconnect", (reason: any) => {
            console.log("Socket Disconnected:", reason)
        })

        // Receive Real-Time Notification
        socket.on("notification:new", (notification) => {
            dispatch(setLiveNotificationToRedux(notification))
        })

        // Remove Deleted Notification
        socket.on("notification:delete", (data) => {
           dispatch(removeDeletedNotificationFromRedux(data))
        })

        // Mark Read Notification
        socket.on("notification:mark-read", (notificationId) => {
            dispatch(markReaddNotificationOnRedux(notificationId))
        })

        // Cleanup
        return () => {
            socket.disconnect()
        }

    }, [accessToken, user?._id]);

    return null
}

export default SocketConnection;
import {createSlice} from "@reduxjs/toolkit";

const notificationSlice = createSlice({
    name: "notificationSlice",
    initialState: {
        notifications: [],
        latestUnreadNotifications: [],
        unreadCount: 0,
    },
    reducers: {

        // Set Notification To Redux
        setNotificationToRedux: (state: any, action: any) => {
            state.notifications = action.payload
        },

        // Set Live Notification To Redux
        setLiveNotificationToRedux: (state: any, action: any) => {
            state.notifications.unshift(action.payload)
            state.unreadCount += 1
            state.totalNotificationCount += 1
            state.toNotificationCount += 1
        },

        // Set Unread Notification Count To Redux
        setUnreadNotificationCountToRedux: (state: any, action: any) => {
            state.unreadCount = action.payload
        },

        // Remove Deleted Notification From Redux
        removeDeletedNotificationFromRedux: (state: any, action: any) => {
            const notification = action.payload.notification
            const isRead = action.payload.isRead
            if(notification) {
               state.notifications = state.notifications.filter((item: any) => item?._id?.toString() !== notification?.toString())
            }
            if(!isRead) {
                state.unreadCount -= 1
            }
        },

        // Mark Readd Notification On Redux
        markReaddNotificationOnRedux: (state: any, action: any) => {
            const notification = action.payload
            if(notification) {
                state.notifications = state.notifications.map((item: any) => {
                    if(item._id?.toString() === notification?.toString()) {
                        return {
                            ...item,
                            isRead: true,
                        }
                    } else {
                        return item
                    }
                })
                if(state.unreadCount > 0) {
                    state.isRead -= 1
                }
            }
        },

    }
})

export const {
    setNotificationToRedux,
    setLiveNotificationToRedux,
    setUnreadNotificationCountToRedux,
    removeDeletedNotificationFromRedux,
    markReaddNotificationOnRedux
} = notificationSlice.actions;
export default notificationSlice.reducer;
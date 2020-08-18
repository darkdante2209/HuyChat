import {pushSocketIdToArray, emitNotifyToArray, removeSocketIdFromArray} from "./../../helpers/socketHelpers";

/**
 * 
 * @param {*} io từ socket.io library
 */
let userOnlineOffline = (io) => {
    let clients = {};//Biến global

    io.on("connection", (socket) => {//Chạy khi truy cập trang web
        
        //Đưa socket id vào mảng
        clients = pushSocketIdToArray(clients, socket.request.user._id, socket.id);
        socket.request.user.chatGroupIds.forEach(group => {
            clients = pushSocketIdToArray(clients, group._id, socket.id);
        });

        let listUserOnline = Object.keys(clients);

        // Step 01: Đẩy mảng chứa key id về phía user sau khi login hay reload trang web
        socket.emit("server-send-list-users-online", listUserOnline);

        // Step 02: Đẩy sự kiện tới toàn bộ users khi có user mới online
        socket.broadcast.emit("server-send-when-new-user-online", socket.request.user._id);


        socket.on("disconnect", () => {
            clients = removeSocketIdFromArray(clients, socket.request.user._id, socket);
            socket.request.user.chatGroupIds.forEach(group => {
                clients = removeSocketIdFromArray(clients, group._id, socket);
            });
            // Step 03: Đẩy về cho các user khác khi có user offline
            socket.broadcast.emit("server-send-when-new-user-offline", socket.request.user._id);
        });
        // console.log(clients);
    });
};

module.exports = userOnlineOffline;
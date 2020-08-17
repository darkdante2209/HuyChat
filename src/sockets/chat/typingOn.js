import {pushSocketIdToArray, emitNotifyToArray, removeSocketIdFromArray} from "./../../helpers/socketHelpers";

/**
 * 
 * @param {*} io từ socket.io library
 */
let typingOn = (io) => {
    let clients = {};//Biến global

    io.on("connection", (socket) => {//Chạy khi truy cập trang web
        
        //Đưa socket id vào mảng
        clients = pushSocketIdToArray(clients, socket.request.user._id, socket.id);
        socket.request.user.chatGroupIds.forEach(group => {
            clients = pushSocketIdToArray(clients, group._id, socket.id);
        });
        socket.on("user-is-typing", (data) => {//Lắng nghe sự kiện mình tạo ra từ addContact.js
            if (data.groupId) {
                let response = {
                    currentGroupId: data.groupId,
                    currentUserId: socket.request.user._id
                };
                //Kiểm tra contact id từ data gửi vào socket trong addContact.js
                if (clients[data.groupId]) {
                    emitNotifyToArray(clients, data.groupId, io, "response-user-is-typing", response);
                }
            }
            if (data.contactId) {
                let response = {
                    currentUserId: socket.request.user._id
                };
                //Kiểm tra contact id từ data gửi vào socket trong addContact.js
                if (clients[data.contactId]) {
                    emitNotifyToArray(clients, data.contactId, io, "response-user-is-typing", response);
                }
            }
        });

        socket.on("disconnect", () => {
            clients = removeSocketIdFromArray(clients, socket.request.user._id, socket);
            socket.request.user.chatGroupIds.forEach(group => {
                clients = removeSocketIdFromArray(clients, group._id, socket);
            });
        });
        // console.log(clients);
    });
};

module.exports = typingOn;
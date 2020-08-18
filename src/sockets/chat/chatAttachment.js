import {pushSocketIdToArray, emitNotifyToArray, removeSocketIdFromArray} from "./../../helpers/socketHelpers";

/**
 * 
 * @param {*} io từ socket.io library
 */
let chatAttachment = (io) => {
    let clients = {};//Biến global

    io.on("connection", (socket) => {//Chạy khi truy cập trang web
        
        //Đưa socket id vào mảng
        clients = pushSocketIdToArray(clients, socket.request.user._id, socket.id);
        socket.request.user.chatGroupIds.forEach(group => {
            clients = pushSocketIdToArray(clients, group._id, socket.id);
        });
        socket.on("chat-attachment", (data) => {//Lắng nghe sự kiện mình tạo ra từ addContact.js
            if (data.groupId) {
                let response = {
                    currentGroupId: data.groupId,
                    currentUserId: socket.request.user._id,
                    message: data.message
                };
                //Kiểm tra contact id từ data gửi vào socket trong addContact.js
                if (clients[data.groupId]) {
                    emitNotifyToArray(clients, data.groupId, io, "response-chat-attachment", response);
                }
            }
            if (data.contactId) {
                let response = {
                    currentUserId: socket.request.user._id,
                    message: data.message
                };
                //Kiểm tra contact id từ data gửi vào socket trong addContact.js
                if (clients[data.contactId]) {
                    emitNotifyToArray(clients, data.contactId, io, "response-chat-attachment", response);
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

module.exports = chatAttachment;
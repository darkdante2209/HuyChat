import {pushSocketIdToArray, emitNotifyToArray, removeSocketIdFromArray} from "./../../helpers/socketHelpers";

/**
 * 
 * @param {*} io từ socket.io library
 */
let addNewContact = (io) => {
    let clients = {};//Biến global

    io.on("connection", (socket) => {//Chạy khi truy cập trang web
        
        //Đưa socket id vào mảng
        clients = pushSocketIdToArray(clients, socket.request.user._id, socket.id);
        socket.on("add-new-contact", (data) => {//Lắng nghe sự kiện mình tạo ra từ addContact.js
            let currentUser = {
                id: socket.request.user._id,
                username: socket.request.user.username,
                avatar: socket.request.user.avatar,
                address: (socket.request.user.address !== null) ? socket.request.user.address : ""
            };
            //Kiểm tra contact id từ data gửi vào socket trong addContact.js
            if (clients[data.contactId]) {
                emitNotifyToArray(clients, data.contactId, io, "response-add-new-contact", currentUser);
            }
        });

        socket.on("disconnect", () => {
            clients = removeSocketIdFromArray(clients, socket.request.user._id, socket);
        });
        // console.log(clients);
    });
};

module.exports = addNewContact;
import {pushSocketIdToArray, emitNotifyToArray, removeSocketIdFromArray} from "../../helpers/socketHelpers";

/**
 * 
 * @param {*} io từ socket.io library
 */
let removeRequestContactSent = (io) => {
    let clients = {};//Biến global

    io.on("connection", (socket) => {//Chạy khi truy cập trang web
        
        //Đưa socket id vào mảng
        clients = pushSocketIdToArray(clients, socket.request.user._id, socket.id);

        socket.on("remove-request-contact-sent", (data) => {//Lắng nghe sự kiện mình tạo ra từ addContact.js
            let currentUser = {
                id: socket.request.user._id
            };
            //Kiểm tra contact id từ data gửi vào socket trong addContact.js
            if (clients[data.contactId]) {
                emitNotifyToArray(clients, data.contactId, io, "response-remove-request-contact-sent", currentUser);
            }
        });

        socket.on("disconnect", () => {
            //Xóa các socket id cũ khi người dùng tải lại trang
            clients = removeSocketIdFromArray(clients, socket.request.user._id, socket);
        });
        // console.log(clients);
    });
};

module.exports = removeRequestContactSent;
import {pushSocketIdToArray, emitNotifyToArray, removeSocketIdFromArray} from "../../helpers/socketHelpers";

/**
 * 
 * @param {*} io từ socket.io library
 */
let removeContact = (io) => {
    let clients = {};//Biến global

    io.on("connection", (socket) => {//Chạy khi truy cập trang web
        
        //Đưa socket id vào mảng
        clients = pushSocketIdToArray(clients, socket.request.user._id, socket.id);

        socket.on("remove-contact", (data) => {//Lắng nghe sự kiện mình tạo ra từ removeContact.js
            let currentUser = {
                id: socket.request.user._id
            };
            //Kiểm tra contact id từ data gửi vào socket trong addContact.js
            if (clients[data.contactId]) {
                emitNotifyToArray(clients, data.contactId, io, "response-remove-contact", currentUser);
            }
        });

        socket.on("disconnect", () => {
            //Xóa các socket id cũ khi người dùng tải lại trang
            clients = removeSocketIdFromArray(clients, socket.request.user._id, socket);
        });
        // console.log(clients);
    });
};

module.exports = removeContact;
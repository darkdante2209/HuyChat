/**
 * 
 * @param {*} io từ socket.io library
 */
let addNewContact = (io) => {
    io.on("connection", (socket) => {//Chạy khi truy cập trang web
        socket.on("add-new-contact", (data) => {//Lắng nghe sự kiện mình tạo ra
            console.log(data);
            console.log(socket.request.user);
        });
    });
};

module.exports = addNewContact;
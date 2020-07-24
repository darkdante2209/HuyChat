import addNewContact from "./contact/addNewContact";
import removeRequestContact from "./contact/removeRequestContact";

/**
 * 
 * @param {*} io từ socket.io library
 */
let initSockets = (io) => {
    addNewContact(io);//sử dụng io để tạo code trong hàm addNewContact
    //
    removeRequestContact(io);
};

module.exports = initSockets;
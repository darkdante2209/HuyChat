import addNewContact from "./contact/addNewContact";
import removeRequestContactSent from "./contact/removeRequestContactSent";

/**
 * 
 * @param {*} io từ socket.io library
 */
let initSockets = (io) => {
    addNewContact(io);//sử dụng io để tạo code trong hàm addNewContact
    //
    removeRequestContactSent(io);
};

module.exports = initSockets;
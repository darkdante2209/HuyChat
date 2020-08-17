import addNewContact from "./contact/addNewContact";
import removeRequestContactSent from "./contact/removeRequestContactSent";
import removeRequestContactReceived from "./contact/removeRequestContactReceived";
import approveRequestContactReceived from "./contact/approveRequestContactReceived";
import removeContact from "./contact/removeContact";
import chatTextEmoji from "./chat/chatTextEmoji";
import typingOn from "./chat/typingOn";
import typingOff from "./chat/typingOff";
import chatImage from "./chat/chatImage";

/**
 * 
 * @param {*} io từ socket.io library
 */
let initSockets = (io) => {
    addNewContact(io);//sử dụng io để tạo code trong hàm addNewContact
    //
    removeRequestContactSent(io);
    removeRequestContactReceived(io);
    approveRequestContactReceived(io);
    removeContact(io);
    chatTextEmoji(io);
    typingOn(io);
    typingOff(io);
    chatImage(io);
};

module.exports = initSockets;
import ContactModel from "./../models/contactModel";
import UserModel from "./../models/userModel";
import ChatGroupModel from "./../models/chatGroupModel";
import MessageModel from "./../models/messageModel";
import _ from "lodash";
import {transErrors} from "./../../lang/vi";
import {app} from "./../config/app";
import fsExtra from "fs-extra";

const LIMIT_CONVERSATIONS_TAKEN = 10;
const LIMIT_MESSAGES_TAKEN = 30;


/**
 * Lấy ra toàn bộ cuộc trò chuyện
 * @param {string} currentUserId 
 */
let getAllConversationItems = (currentUserId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let contacts = await ContactModel.getContacts(currentUserId, LIMIT_CONVERSATIONS_TAKEN);
            let userConversationsPromise = contacts.map(async (contact) => {
                if (contact.contactId == currentUserId) {
                    let getUserContact = await UserModel.getNormalUserDataById(contact.userId);
                    // Vì contact và getUserContact đang đồng bồ với nhau là từ mongodb trả về cho mình
                    // getUserContact lấy từ UserModel trên, còn contact lấy từ ContactModel
                    // nên có thể gán cho nhau được
                    getUserContact.updatedAt = contact.updatedAt;
                    return getUserContact;
                } else {
                    let getUserContact = await UserModel.getNormalUserDataById (contact.contactId);
                    getUserContact.updatedAt = contact.updatedAt;
                    return getUserContact;
                }
            });
            let userConversations = await Promise.all(userConversationsPromise);
            let groupConversations = await ChatGroupModel.getChatGroups(currentUserId, LIMIT_CONVERSATIONS_TAKEN);
            let allConversations = userConversations.concat(groupConversations);//Ghép hai mảng trò chuyện
            
            allConversations = _.sortBy(allConversations, (item) => {
                return -item.updatedAt;// Để dấu - sẽ sắp xếp từ lớn đến nhỏ, ko thì sẽ từ nhỏ đến lớn
            });

            // Lấy tin nhắn đổ ra màn hình chat
            let allConversationWithMessagesPromise = allConversations.map(async (conversation) => {
                conversation = conversation.toObject();

                if (conversation.members) {
                    let getMessages = await MessageModel.model.getMessagesInGroup(conversation._id, LIMIT_MESSAGES_TAKEN);

                    conversation.messages = _.reverse(getMessages);
                } else {
                    let getMessages = await MessageModel.model.getMessagesInPersonal(currentUserId, conversation._id, LIMIT_MESSAGES_TAKEN);

                    conversation.messages = _.reverse(getMessages);
                }

                return conversation
            });

            let allConversationWithMessages = await Promise.all(allConversationWithMessagesPromise);
            //Sắp xếp theo updatedAt giảm dần
            allConversationWithMessages = _.sortBy(allConversationWithMessages, (item) => {
                return -item.updatedAt;
            });

            resolve({
                allConversationWithMessages: allConversationWithMessages
            });

        } catch (error) {
            reject(error);
        }
    });
};

/**
 * Thêm mới một tin nhắn và emoji
 * @param {object} sender current user
 * @param {string} receiverId 1 user hoặc group user
 * @param {string} messageVal 
 * @param {boolean} isChatGroup 
 */
let addNewTextEmoji = (sender, receiverId, messageVal, isChatGroup) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (isChatGroup) {
                let getChatGroupReceiver = await ChatGroupModel.getChatGroupById(receiverId);
                if (!getChatGroupReceiver) {
                    return reject(transErrors.conversation_not_found);
                }
                let receiver = {
                    id: getChatGroupReceiver._id,
                    name: getChatGroupReceiver.name,
                    avatar: app.general_avatar_group_chat
                };

                let newMessageItem = {
                    senderId: sender.id,
                    receiverId: receiver.id,
                    conversationType: MessageModel.conversationTypes.GROUP,
                    messageType: MessageModel.messageTypes.TEXT,
                    sender: sender,
                    receiver: receiver,
                    text: messageVal,
                    createdAt: Date.now(),
                };
                // Tạo mới tin nhắn
                let newMessage = MessageModel.model.createNew(newMessageItem);
                // Update group chat
                await ChatGroupModel.updateWhenHasNewMessage(getChatGroupReceiver._id, getChatGroupReceiver.messageAmount + 1);
                resolve(newMessage);
            } else {
                let getUserReceiver = await UserModel.getNormalUserDataById(receiverId);
                if (!getUserReceiver) {
                    return reject(transErrors.conversation_not_found);
                }

                let receiver = {
                    id: getUserReceiver._id,
                    name: getUserReceiver.username,
                    avatar: getUserReceiver.avatar
                };
                
                let newMessageItem = {
                    senderId: sender.id,
                    receiverId: receiver.id,
                    conversationType: MessageModel.conversationTypes.PERSONAL,
                    messageType: MessageModel.messageTypes.TEXT,
                    sender: sender,
                    receiver: receiver,
                    text: messageVal,
                    createdAt: Date.now(),
                };
                // Tạo mới tin nhắn
                let newMessage = MessageModel.model.createNew(newMessageItem);

                // Update contact
                await ContactModel.updateWhenHasNewMessage(sender.id, getUserReceiver._id);

                resolve(newMessage);
            }
        } catch (error) {
            reject(error);
        }
    });
};

/**
 * Thêm mới một tin nhắn hình ảnh
 * @param {object} sender current user
 * @param {string} receiverId 1 user hoặc group user
 * @param {file} messageVal 
 * @param {boolean} isChatGroup 
 */
let addNewImage = (sender, receiverId, messageVal, isChatGroup) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (isChatGroup) {
                let getChatGroupReceiver = await ChatGroupModel.getChatGroupById(receiverId);
                if (!getChatGroupReceiver) {
                    return reject(transErrors.conversation_not_found);
                }
                let receiver = {
                    id: getChatGroupReceiver._id,
                    name: getChatGroupReceiver.name,
                    avatar: app.general_avatar_group_chat
                };

                let imageBuffer = await fsExtra.readFile(messageVal.path); //Đọc ảnh đã lưu vào folder image trong public thành buffer
                let imageContentType = messageVal.mimetype;
                let imageName = messageVal.originalname;

                let newMessageItem = {
                    senderId: sender.id,
                    receiverId: receiver.id,
                    conversationType: MessageModel.conversationTypes.GROUP,
                    messageType: MessageModel.messageTypes.IMAGE,
                    sender: sender,
                    receiver: receiver,
                    file: {data: imageBuffer, contentType: imageContentType, fileName: imageName},
                    createdAt: Date.now(),
                };
                // Tạo mới tin nhắn
                let newMessage = MessageModel.model.createNew(newMessageItem);
                // Update group chat
                await ChatGroupModel.updateWhenHasNewMessage(getChatGroupReceiver._id, getChatGroupReceiver.messageAmount + 1);
                resolve(newMessage);
            } else {
                let getUserReceiver = await UserModel.getNormalUserDataById(receiverId);
                if (!getUserReceiver) {
                    return reject(transErrors.conversation_not_found);
                }

                let receiver = {
                    id: getUserReceiver._id,
                    name: getUserReceiver.username,
                    avatar: getUserReceiver.avatar
                };
                
                let imageBuffer = await fsExtra.readFile(messageVal.path); //Đọc ảnh đã lưu vào folder image trong public thành buffer
                let imageContentType = messageVal.mimetype;
                let imageName = messageVal.originalname;

                let newMessageItem = {
                    senderId: sender.id,
                    receiverId: receiver.id,
                    conversationType: MessageModel.conversationTypes.PERSONAL,
                    messageType: MessageModel.messageTypes.IMAGE,
                    sender: sender,
                    receiver: receiver,
                    file: {data: imageBuffer, contentType: imageContentType, fileName: imageName},
                    createdAt: Date.now(),
                };
                // Tạo mới tin nhắn
                let newMessage = MessageModel.model.createNew(newMessageItem);

                // Update contact
                await ContactModel.updateWhenHasNewMessage(sender.id, getUserReceiver._id);

                resolve(newMessage);
            }
        } catch (error) {
            reject(error);
        }
    });
};

/**
 * Thêm mới một tin nhắn tệp đính kèm
 * @param {object} sender current user
 * @param {string} receiverId 1 user hoặc group user
 * @param {file} messageVal 
 * @param {boolean} isChatGroup 
 */
let addNewAttachment = (sender, receiverId, messageVal, isChatGroup) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (isChatGroup) {
                let getChatGroupReceiver = await ChatGroupModel.getChatGroupById(receiverId);
                if (!getChatGroupReceiver) {
                    return reject(transErrors.conversation_not_found);
                }
                let receiver = {
                    id: getChatGroupReceiver._id,
                    name: getChatGroupReceiver.name,
                    avatar: app.general_avatar_group_chat
                };

                let attachmentBuffer = await fsExtra.readFile(messageVal.path); //Đọc tệp đã lưu vào folder  trong public thành buffer
                let attachmentContentType = messageVal.mimetype;
                let attachmentName = messageVal.originalname;

                let newMessageItem = {
                    senderId: sender.id,
                    receiverId: receiver.id,
                    conversationType: MessageModel.conversationTypes.GROUP,
                    messageType: MessageModel.messageTypes.FILE,
                    sender: sender,
                    receiver: receiver,
                    file: {data: attachmentBuffer, contentType: attachmentContentType, fileName: attachmentName},
                    createdAt: Date.now(),
                };
                // Tạo mới tin nhắn
                let newMessage = MessageModel.model.createNew(newMessageItem);
                // Update group chat
                await ChatGroupModel.updateWhenHasNewMessage(getChatGroupReceiver._id, getChatGroupReceiver.messageAmount + 1);
                resolve(newMessage);
            } else {
                let getUserReceiver = await UserModel.getNormalUserDataById(receiverId);
                if (!getUserReceiver) {
                    return reject(transErrors.conversation_not_found);
                }

                let receiver = {
                    id: getUserReceiver._id,
                    name: getUserReceiver.username,
                    avatar: getUserReceiver.avatar
                };
                
                let attachmentBuffer = await fsExtra.readFile(messageVal.path); //Đọc tệp đã lưu vào folder  trong public thành buffer
                let attachmentContentType = messageVal.mimetype;
                let attachmentName = messageVal.originalname;

                let newMessageItem = {
                    senderId: sender.id,
                    receiverId: receiver.id,
                    conversationType: MessageModel.conversationTypes.PERSONAL,
                    messageType: MessageModel.messageTypes.FILE,
                    sender: sender,
                    receiver: receiver,
                    file: {data: attachmentBuffer, contentType: attachmentContentType, fileName: attachmentName},
                    createdAt: Date.now(),
                };
                // Tạo mới tin nhắn
                let newMessage = MessageModel.model.createNew(newMessageItem);

                // Update contact
                await ContactModel.updateWhenHasNewMessage(sender.id, getUserReceiver._id);

                resolve(newMessage);
            }
        } catch (error) {
            reject(error);
        }
    });
};

module.exports = {
    getAllConversationItems: getAllConversationItems,
    addNewTextEmoji: addNewTextEmoji,
    addNewImage: addNewImage,
    addNewAttachment: addNewAttachment
};
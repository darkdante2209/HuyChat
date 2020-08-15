import ContactModel from "./../models/contactModel";
import UserModel from "./../models/userModel";
import ChatGroupModel from "./../models/chatGroupModel";
import _ from "lodash";

const LIMIT_CONVERSATIONS_TAKEN = 10;


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
                    getUserContact.createdAt = contact.createdAt;
                    return getUserContact;
                } else {
                    let getUserContact = await UserModel.getNormalUserDataById (contact.contactId);
                    getUserContact.createdAt = contact.createdAt;
                    return getUserContact;
                }
            });
            let userConversations = await Promise.all(userConversationsPromise);
            let groupConversations = await ChatGroupModel.getChatGroups(currentUserId, LIMIT_CONVERSATIONS_TAKEN);
            let allConversations = userConversations.concat(groupConversations);//Ghép hai mảng trò chuyện
            
            allConversations = _.sortBy(allConversations, (item) => {
                return -item.createdAt;// Để dấu - sẽ sắp xếp từ lớn đến nhỏ, ko thì sẽ từ nhỏ đến lớn
            });

            resolve({
                userConversations: userConversations,
                groupConversations: groupConversations,
                allConversations: allConversations
            });

        } catch (error) {
            reject(error);
        }
    });
};

module.exports = {
    getAllConversationItems: getAllConversationItems
};
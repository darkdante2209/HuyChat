import ContactModel from "./../models/contactModel";
import UserModel from "./../models/userModel";
import NotificationModel from "./../models/notificationModel";
import _ from "lodash";

const LIMIT_NUMBER_TAKEN = 10;

let findUsersContact = (currentUserId, keyword) => {
    return new Promise(async (resolve, reject) => {
        let deprecatedUserIds = [currentUserId]; //Những id không cần thiết
        let contactsByUser = await ContactModel.findAllByUser(currentUserId);
        contactsByUser.forEach((contact) => {
            deprecatedUserIds.push(contact.userId);
            deprecatedUserIds.push(contact.contactId);
        });

        deprecatedUserIds = _.uniqBy(deprecatedUserIds);//Bỏ các phần tử trùng lặp trong mảng
        let users = await UserModel.findAllForAddContact(deprecatedUserIds, keyword);
        resolve(users);
    });
};

let addNew = (currentUserId, contactId) => {
    return new Promise(async (resolve, reject) => {
        let contactExists = await ContactModel.checkExists(currentUserId, contactId);
        if (contactExists) {
            return reject(false);
        }
        // Tạo contact
        let newContactItem = {
            userId: currentUserId,
            contactId: contactId
        };
        let newContact = await ContactModel.createNew(newContactItem);
        // Tạo thông báo contact
        let notificationItem = {  
            senderId: currentUserId,
            receiverId: contactId,
            type: NotificationModel.types.ADD_CONTACT,
        };
        await NotificationModel.model.createNew(notificationItem);

        resolve(newContact);
    });
};

let removeContact = (currentUserId, contactId) => {
    return new Promise(async (resolve, reject) => {
        let removeContact = await ContactModel.removeContact(currentUserId, contactId);
        if (removeContact.result.n === 0) {
            return reject(false);
        }
        resolve(true);
    });
};

let removeRequestContactSent = (currentUserId, contactId) => {
    return new Promise(async (resolve, reject) => {
        let removeReq = await ContactModel.removeRequestContactSent(currentUserId, contactId);
        if (removeReq.result.n === 0) {
            return reject(false);
        }
        // Xóa thông báo contact
        await NotificationModel.model.removeRequestContactSentNotification(currentUserId, contactId, NotificationModel.types.ADD_CONTACT);
        resolve(true);
    });
};

let removeRequestContactReceived = (currentUserId, contactId) => {
    return new Promise(async (resolve, reject) => {
        let removeReq = await ContactModel.removeRequestContactReceived(currentUserId, contactId);
        if (removeReq.result.n === 0) {
            return reject(false);
        }
        // Xóa thông báo contact
        // await NotificationModel.model.removeRequestContactReceivedNotification(currentUserId, contactId, NotificationModel.types.ADD_CONTACT);
        resolve(true);
    });
};

let approveRequestContactReceived = (currentUserId, contactId) => {
    return new Promise(async (resolve, reject) => {
        let approveReq = await ContactModel.approveRequestContactReceived(currentUserId, contactId);
        //Bắt lỗi nếu người dùng cố ý gửi request accept khi đã là bạn bè rồi
        if (approveReq.nModified === 0) {
            return reject(false);
        }

        // Tạo thông báo contact
        let notificationItem = {  
            senderId: currentUserId,
            receiverId: contactId,
            type: NotificationModel.types.APPROVE_CONTACT,
        };
        await NotificationModel.model.createNew(notificationItem);
        resolve(true);
    });
};

let getContacts = (currentUserId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let contacts = await ContactModel.getContacts(currentUserId, LIMIT_NUMBER_TAKEN);
            let users = contacts.map(async (contact) => {
                if (contact.contactId == currentUserId) {
                    return await UserModel.getNormalUserDataById(contact.userId);
                } else {
                    return await UserModel.getNormalUserDataById (contact.contactId);
                }
            });
            resolve(await Promise.all(users));
        } catch (error) {
            reject(error);
        }
    });
};

let getContactsSent = (currentUserId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let contacts = await ContactModel.getContactsSent(currentUserId, LIMIT_NUMBER_TAKEN);
            let users = contacts.map(async (contact) => {
               return await UserModel.getNormalUserDataById(contact.contactId);
            });
            resolve(await Promise.all(users));
        } catch (error) {
            reject(error);
        }
    });
};

let getContactsReceived = (currentUserId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let contacts = await ContactModel.getContactsReceived(currentUserId, LIMIT_NUMBER_TAKEN);
            let users = contacts.map(async (contact) => {
               return await UserModel.getNormalUserDataById(contact.userId);
            });
            resolve(await Promise.all(users));
        } catch (error) {
            reject(error);
        }
    });
};

let countAllContacts = (currentUserId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let count = await ContactModel.countAllContacts(currentUserId);
            resolve(count);
        } catch (error) {
            reject(error);
        }
    });
};

let countAllContactsSent = (currentUserId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let count = await ContactModel.countAllContactsSent(currentUserId);
            resolve(count);
        } catch (error) {
            reject(error);
        }
    });
};

let countAllContactsReceived = (currentUserId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let count = await ContactModel.countAllContactsReceived(currentUserId);
            resolve(count);
        } catch (error) {
            reject(error);
        }
    });
};

/**
 * Xem thêm danh sách bạn bè,tối đa 10 item 1 lần
 * @param {string} currentUserId 
 * @param {number} skipNumberContact 
 */
let readMoreContacts = (currentUserId, skipNumberContact) => {
    return new Promise(async (resolve, reject) => {
        try {
            let newContacts = await ContactModel.readMoreContacts(currentUserId, skipNumberContact, LIMIT_NUMBER_TAKEN);

            let users = newContacts.map(async (contact) => {
                if (contact.contactId == currentUserId) {
                    return await UserModel.getNormalUserDataById(contact.userId);
                } else {
                    return await UserModel.getNormalUserDataById(contact.contactId);
                }
            });
            // Promise.all trả về một promise mới, promise mới này chỉ kết thúc khi tất cả promise tront users kết thúc hoặc có promise nào đó xử lý thất bại
            // Kết quả của promise mới này là một mảng chứa kết quả của tất cả các promise theo đúng thứ tự hoặc kết quả lỗi của promise gây lỗi
            resolve(await Promise.all(users));
        } catch (error) {
            reject(error);
        }
    });
};

/**
 * Xem thêm yêu cầu kết bạn đã gửi,tối đa 10 item 1 lần
 * @param {string} currentUserId 
 * @param {number} skipNumberContact 
 */
let readMoreContactsSent = (currentUserId, skipNumberContact) => {
    return new Promise(async (resolve, reject) => {
        try {
            let newContacts = await ContactModel.readMoreContactsSent(currentUserId, skipNumberContact, LIMIT_NUMBER_TAKEN);

            let users = newContacts.map(async (contact) => {
                return await UserModel.getNormalUserDataById(contact.contactId);
            });
            // Promise.all trả về một promise mới, promise mới này chỉ kết thúc khi tất cả promise tront users kết thúc hoặc có promise nào đó xử lý thất bại
            // Kết quả của promise mới này là một mảng chứa kết quả cảu tất cả các promise theo đúng thứ tự hoặc kết quả lỗi của promise gây lỗi
            resolve(await Promise.all(users));
        } catch (error) {
            reject(error);
        }
    });
};

/**
 * Xem thêm yêu cầu kết bạn đã nhận,tối đa 10 item 1 lần
 * @param {string} currentUserId 
 * @param {number} skipNumberContact 
 */
let readMoreContactsReceived = (currentUserId, skipNumberContact) => {
    return new Promise(async (resolve, reject) => {
        try {
            let newContacts = await ContactModel.readMoreContactsReceived(currentUserId, skipNumberContact, LIMIT_NUMBER_TAKEN);

            let users = newContacts.map(async (contact) => {
                return await UserModel.getNormalUserDataById(contact.userId);
            });
            // Promise.all trả về một promise mới, promise mới này chỉ kết thúc khi tất cả promise tront users kết thúc hoặc có promise nào đó xử lý thất bại
            // Kết quả của promise mới này là một mảng chứa kết quả cảu tất cả các promise theo đúng thứ tự hoặc kết quả lỗi của promise gây lỗi
            resolve(await Promise.all(users));
        } catch (error) {
            reject(error);
        }
    });
};

let searchFriends = (currentUserId, keyword) => {
    return new Promise(async (resolve, reject) => {
        let friendIds = [];
        let friends = await ContactModel.getFriends(currentUserId);

        friends.forEach((item) => {
            friendIds.push(item.userId);
            friendIds.push(item.contactId);
        });

        friendIds = _.uniqBy(friendIds);//Lọc trùng lặp
        friendIds = friendIds.filter(userId => userId != currentUserId);

        let users = await UserModel.findAllToAddGroupChat(friendIds, keyword);

        resolve(users);
    });
};

module.exports = {
    findUsersContact: findUsersContact,
    addNew: addNew,
    removeContact: removeContact,
    removeRequestContactSent: removeRequestContactSent,
    removeRequestContactReceived: removeRequestContactReceived,
    approveRequestContactReceived: approveRequestContactReceived,
    getContacts: getContacts,
    getContactsSent: getContactsSent,
    getContactsReceived: getContactsReceived,
    countAllContacts: countAllContacts,
    countAllContactsSent: countAllContactsSent,
    countAllContactsReceived: countAllContactsReceived,
    readMoreContacts: readMoreContacts,
    readMoreContactsSent: readMoreContactsSent,
    readMoreContactsReceived: readMoreContactsReceived,
    searchFriends: searchFriends
}
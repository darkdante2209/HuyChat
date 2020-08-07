import NotificationModel from "./../models/notificationModel";
import UserModel from "./../models/userModel";

const LIMIT_NUMBER_TAKEN = 10;

/**
 * Lấy thông báo khi reload page
 * Chỉ hiển thị tối đa 10 thông báo 1 lần
 * @param {string} currentUserId 
 * Khi reload page thì sẽ đồng thời gọi đến function gethome của bên homeController
 */
let getNotifications = (currentUserId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let notifications = await NotificationModel.model.getByUserIdAndLimit(currentUserId, LIMIT_NUMBER_TAKEN);

             // map() giúp tạo ra một mảng mới với các phần tử là kết quả từ việc thực thị một hàm lên mảng được gọi
            let getNotifContents = notifications.map(async (notification) => {
                // query vào trong bảng user theo cái sender id để lấy dữ liệu người gửi
                let sender = await UserModel.getNormalUserDataById(notification.senderId);
                return NotificationModel.contents.getContent(notification.type, notification.isRead, sender._id, sender.username, sender.avatar);
            });
            // Promise.all trả về một promise mới, promise mới này chỉ kết thúc khi tất cả promise tront getNotifContents kết thúc hoặc có promise nào đó xử lý thất bại
            // Kết quả của promise mới này là một mảng chứa kết quả cảu tất cả các promise theo đúng thứ tự hoặc kết quả lỗi của promise gây lỗi
            resolve(await Promise.all(getNotifContents));
           
        } catch (error) {
            reject(error);
        }
    });
};

/**
 * Xử lý phần đọc thêm thông báo, tối đa 10 item 1 lần
 * @param {string} currentUserId 
 * @param {number} skipNumberNotification 
 */
let countNotifUnread = (currentUserId, skipNumberNotification) => {
    return new Promise(async (resolve, reject) => {
        try {
           let notificationsUnread = await NotificationModel.model.countNotifUnread(currentUserId);
           resolve(notificationsUnread);
        } catch (error) {
            reject(error);
        }
    });
};

let readMore = (currentUserId, skipNumberNotification) => {
    return new Promise(async (resolve, reject) => {
        try {
            let newNotifications = await NotificationModel.model.readMore(currentUserId, skipNumberNotification, LIMIT_NUMBER_TAKEN);

            let getNotifContents = newNotifications.map(async (notification) => {
                // query vào trong bảng user theo cái sender id để lấy dữ liệu người gửi
                let sender = await UserModel.getNormalUserDataById(notification.senderId);
                return NotificationModel.contents.getContent(notification.type, notification.isRead, sender._id, sender.username, sender.avatar);
            });
            // Promise.all trả về một promise mới, promise mới này chỉ kết thúc khi tất cả promise tront getNotifContents kết thúc hoặc có promise nào đó xử lý thất bại
            // Kết quả của promise mới này là một mảng chứa kết quả cảu tất cả các promise theo đúng thứ tự hoặc kết quả lỗi của promise gây lỗi
            resolve(await Promise.all(getNotifContents));
        } catch (error) {
            reject(error);
        }
    });
};
/**
 * Đánh dấu thông báo là đã đọc
 * @param {string} currentUserId 
 * @param {array} targetUsers 
 */
let markAllAsRead = (currentUserId, targetUsers) => {
    return new Promise(async (resolve, reject) => {
        try {
            await NotificationModel.model.markAllAsRead(currentUserId, targetUsers);
            resolve(true);
        } catch (error) {
            console.log(`Error when mark notification as read: ${error}`);
            reject(false);
        }
    });
};

module.exports = {
    getNotifications: getNotifications,
    countNotifUnread: countNotifUnread,
    readMore: readMore,
    markAllAsRead: markAllAsRead
};
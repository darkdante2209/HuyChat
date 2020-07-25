import NotificationModel from "./../models/notificationModel";
import UserModel from "./../models/userModel";

/**
 * Lấy thông báo khi reload page
 * Chỉ hiển thị tối đa 10 thông báo 1 lần
 * @param {string} currentUserId 
 * @param {number} limit 
 * Khi reload page thì sẽ đồng thời gọi đến function gethome của bên homeController
 */
let getNotifications = (currentUserId, limit = 10) => {
    return new Promise(async (resolve, reject) => {
        try {
            let notifications = await NotificationModel.model.getByUserIdAndLimit(currentUserId, limit);

             // map() giúp tạo ra một mảng mới với các phần tử là kết quả từ việc thực thị một hàm lên mảng được gọi
            let getNotifContents = notifications.map(async (notification) => {
                // query vào trong bảng user theo cái sender id để lấy dữ liệu người gửi
                let sender = await UserModel.findUserById(notification.senderId);
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

module.exports = {
    getNotifications: getNotifications
};
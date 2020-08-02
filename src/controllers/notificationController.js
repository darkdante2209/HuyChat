import {notification} from  "./../services/index";

let readMore = async (req, res) => {
    try {
        // Lấy số thông báo đã hiển thị từ query param để bỏ qua
        let skipNumberNotification = +(req.query.skipNumber);
        // console.log(typeof skipNumberNotif);
        // Lấy thêm item
        let newNotifications = await notification.readMore(req.user._id, skipNumberNotification);
        return res.status(200).send(newNotifications);
    } catch (error) {
        return res.status(500).send(error);
    }
};

module.exports = {
    readMore: readMore
};
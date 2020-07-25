import {notification} from "./../services/index";

let getHome = async (req,res) => {
  //Lấy 10 item 1 lần
  let notifications = await notification.getNotifications(req.user._id);
  //Lấy tổng số thông báo chưa đọc
  let countNotifUnread = await notification.countNotifUnread(req.user._id);

  return res.render("main/home/home", {
    errors:req.flash("errors"),
    success: req.flash("success"),
    user: req.user,//Như trong passport user thì ta đã lưu user vào trong req nên không cần phải querry về database nữa
    notifications: notifications,
    countNotifUnread: countNotifUnread
  });
};

module.exports = {
  getHome: getHome
};
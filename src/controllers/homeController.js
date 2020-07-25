import {notification} from "./../services/index";

let getHome = async (req,res) => {
  let notifications = await notification.getNotifications(req.user._id);

  return res.render("main/home/home", {
    errors:req.flash("errors"),
    success: req.flash("success"),
    user: req.user,//Như trong passport user thì ta đã lưu user vào trong req nên không cần phải querry về database nữa
    notifications: notifications
  });
};

module.exports = {
  getHome: getHome
};
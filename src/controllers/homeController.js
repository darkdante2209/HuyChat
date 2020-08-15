import {notification, contact, message} from "./../services/index";

let getHome = async (req,res) => {
  //Lấy 10 item 1 lần
  let notifications = await notification.getNotifications(req.user._id);
  //Lấy tổng số thông báo chưa đọc
  let countNotifUnread = await notification.countNotifUnread(req.user._id);

  //Lấy danh sách contacts, 10 item 1 lần
  let contacts = await contact.getContacts(req.user._id);
  //Lấy danh sách gửi yêu cầu kết bạn, 10 tiem 1 lần
  let contactsSent = await contact.getContactsSent(req.user._id);
  //Lấy danh sách yêu cầu kết bạn nhận được, 10 item 1 lần
  let contactsReceived = await contact.getContactsReceived(req.user._id);

  //Đếm contacts
  let countAllContacts = await contact.countAllContacts(req.user._id);
  let countAllContactsSent = await contact.countAllContactsSent(req.user._id);
  let countAllContactsReceived = await contact.countAllContactsReceived(req.user._id);

  let getAllConversationItems = await message.getAllConversationItems(req.user._id);
  let allConversations = getAllConversationItems.allConversations;
  let userConversations = getAllConversationItems.userConversations;
  let groupConversations = getAllConversationItems.groupConversations;

  return res.render("main/home/home", {
    errors:req.flash("errors"),
    success: req.flash("success"),
    user: req.user,//Như trong passport user thì ta đã lưu user vào trong req nên không cần phải querry về database nữa
    notifications: notifications,
    countNotifUnread: countNotifUnread,
    contacts: contacts,
    contactsSent: contactsSent,
    contactsReceived: contactsReceived,
    countAllContacts: countAllContacts,
    countAllContactsSent: countAllContactsSent,
    countAllContactsReceived: countAllContactsReceived,
    allConversations: allConversations,
    userConversations: userConversations,
    groupConversations: groupConversations
  });
};

module.exports = {
  getHome: getHome
};
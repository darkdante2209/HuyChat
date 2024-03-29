import {contact} from "./../services/index";
import {validationResult} from "express-validator/check";

let findUsersContact = async (req, res) => {
    let errorArr = [];
    let validationErrors = validationResult(req);

    if (!validationErrors.isEmpty()) {
      let errors = Object.values(validationErrors.mapped());
      errors.forEach(item => {
        errorArr.push(item.msg);
      });
      //Logging
      // console.log(errorArr);
      return res.status(500).send(errorArr);
    }

    try {
        let currentUserId = req.user._id;
        let keyword = req.params.keyword; //Trùng với keyword trong ":keyword" bên router

        let users = await contact.findUsersContact(currentUserId, keyword); //Xử lý logic tìm kiếm người dùng ở đây, để xử lý bất đồng bộ thì đưa promise vào trong contactService thì mới sử dụng được async await
        return res.render("main/contact/sections/_findUsersContact", {users});
    } catch (error) {
        return res.status(500).send(error);
    }
};

let addNew = async (req, res) => {
  try {
      let currentUserId = req.user._id;
      let contactId = req.body.uid;//Lấy uid từ phương thức post phải dùng body

      let newContact = await contact.addNew(currentUserId, contactId);
      return res.status(200).send({success: !!newContact});//!! để nếu newContact tồn tại sẽ trả về true, ngược lại false
  } catch (error) {
      return res.status(500).send(error);
  }
};

let removeContact = async (req, res) => {
  try {
    let currentUserId = req.user._id;
    let contactId = req.body.uid;//Lấy uid từ phương thức post phải dùng body

    let removeContact = await contact.removeContact(currentUserId, contactId);
    return res.status(200).send({success: !!removeContact});//!! để nếu newContact tồn tại sẽ trả về true, ngược lại false
  } catch (error) {
      return res.status(500).send(error);
  }
};

let removeRequestContactSent = async (req, res) => {
  try {
      let currentUserId = req.user._id;
      let contactId = req.body.uid;//Lấy uid từ phương thức post phải dùng body

      let removeReq = await contact.removeRequestContactSent(currentUserId, contactId);
      return res.status(200).send({success: !!removeReq});//!! để nếu newContact tồn tại sẽ trả về true, ngược lại false
  } catch (error) {
      return res.status(500).send(error);
  }
};

let removeRequestContactReceived = async (req, res) => {
  try {
      let currentUserId = req.user._id;
      let contactId = req.body.uid;//Lấy uid từ phương thức post phải dùng body

      let removeReq = await contact.removeRequestContactReceived(currentUserId, contactId);
      return res.status(200).send({success: !!removeReq});//!! để nếu newContact tồn tại sẽ trả về true, ngược lại false
  } catch (error) {
      return res.status(500).send(error);
  }
};

let approveRequestContactReceived = async (req, res) => {
  try {
      let currentUserId = req.user._id;
      let contactId = req.body.uid;//Lấy uid từ phương thức post phải dùng body

      let approveReq = await contact.approveRequestContactReceived(currentUserId, contactId);
      return res.status(200).send({success: !!approveReq});//!! để nếu newContact tồn tại sẽ trả về true, ngược lại false
  } catch (error) {
      return res.status(500).send(error);
  }
};

let readMoreContacts = async (req, res) => {
  try {
    // Lấy số contact đã hiển thị từ query param để bỏ qua
    let skipNumberContact = +(req.query.skipNumber);
    // console.log(typeof skipNumberNotif);
    // Lấy thêm item
    let newContactUsers = await contact.readMoreContacts(req.user._id, skipNumberContact);
    return res.status(200).send(newContactUsers);
  } catch (error) {
      return res.status(500).send(error);
  }
};

let readMoreContactsSent = async (req, res) => {
  try {
    // Lấy số contact đã hiển thị từ query param để bỏ qua
    let skipNumberContact = +(req.query.skipNumber);
    // console.log(typeof skipNumberNotif);
    // Lấy thêm item
    let newContactUsers = await contact.readMoreContactsSent(req.user._id, skipNumberContact);
    return res.status(200).send(newContactUsers);
  } catch (error) {
      return res.status(500).send(error);
  }
};

let readMoreContactsReceived = async (req, res) => {
  try {
    // Lấy số contact đã hiển thị từ query param để bỏ qua
    let skipNumberContact = +(req.query.skipNumber);
    // console.log(typeof skipNumberNotif);
    // Lấy thêm item
    let newContactUsers = await contact.readMoreContactsReceived(req.user._id, skipNumberContact);
    return res.status(200).send(newContactUsers);
  } catch (error) {
      return res.status(500).send(error);
  }
};

let searchFriends = async (req, res) => {
  let errorArr = [];
  let validationErrors = validationResult(req);

  if (!validationErrors.isEmpty()) {
    let errors = Object.values(validationErrors.mapped());
    errors.forEach(item => {
      errorArr.push(item.msg);
    });
    //Logging
    // console.log(errorArr);
    return res.status(500).send(errorArr);
  }

  try {
      let currentUserId = req.user._id;
      let keyword = req.params.keyword; //Trùng với keyword trong ":keyword" bên router

      let users = await contact.searchFriends(currentUserId, keyword); //Xử lý logic tìm kiếm người dùng ở đây, để xử lý bất đồng bộ thì đưa promise vào trong contactService thì mới sử dụng được async await
      return res.render("main/groupChat/sections/_searchFriends", {users});
  } catch (error) {
      return res.status(500).send(error);
  }
};

module.exports = {
    findUsersContact: findUsersContact,
    addNew: addNew,
    removeContact: removeContact,
    removeRequestContactSent: removeRequestContactSent,
    removeRequestContactReceived: removeRequestContactReceived,
    approveRequestContactReceived: approveRequestContactReceived,
    readMoreContacts: readMoreContacts,
    readMoreContactsSent: readMoreContactsSent,
    readMoreContactsReceived: readMoreContactsReceived,
    searchFriends: searchFriends
}
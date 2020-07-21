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
}

module.exports = {
    findUsersContact: findUsersContact
}
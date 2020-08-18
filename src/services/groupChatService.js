import _ from "lodash";
import ChatGroupModel from "./../models/chatGroupModel";

let addNewGroup = (currentUserId, arrayMemberIds, groupChatName) => {
    return new Promise(async (resolve, reject) => {
        try {
            // Thêm cả người dùng hiện tại vào trong mảng array members
            arrayMemberIds.unshift({userId: `${currentUserId}`});
            // Lọc id người dùng trùng lặp
            arrayMemberIds = _.uniqBy(arrayMemberIds, "userId");
            let newGroupItem = {
                name: groupChatName,
                userAmount: arrayMemberIds.length,
                userId: `${currentUserId}`, //Id of room master
                members: arrayMemberIds
            };

            let newGroup = await ChatGroupModel.createNew(newGroupItem);
            resolve(newGroup);
        } catch (error) {
            reject(error);
        }
    });
};

module.exports = {
    addNewGroup: addNewGroup
};
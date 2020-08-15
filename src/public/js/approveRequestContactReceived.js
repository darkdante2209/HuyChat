function approveRequestContactReceived() {
    //Để tránh trường hợp hàm thực hiện nhiều lần do bị gọi nhiều nơi
    //nên phải dùng unbind trước rồi on để chỉ bắt function 1 lần
    $(".user-approve-request-contact-received").unbind("click").on("click", function() {
        let targetId = $(this).data("uid");
        
        $.ajax({
            url: "/contact/approve-request-contact-received",
            type: "put",
            data: {uid: targetId},
            success: function(data) {
                if (data.success) {
                    let userInfo =  $("#request-contact-received").find(`ul li[data-uid = ${targetId}]`);
                    $(userInfo).find("div.user-approve-request-contact-received").remove();
                    $(userInfo).find("div.user-remove-request-contact-received").remove();
                    $(userInfo).find("div.contactPanel")
                        .append(`
                        <div class="user-talk" data-uid="${targetId}">
                            Trò chuyện
                        </div>
                        <div class="user-remove-contact action-danger" data-uid="${targetId}">
                            Xóa liên hệ
                        </div>
                    `);
                    let userInfoHtml = userInfo.get(0).outerHTML;//get(0).outerHTML lấy toàn bộ nội dung của cả thẻ li trong userInfo
                    $("#contacts").find("ul").prepend(userInfoHtml);
                    $(userInfo).remove();
            
                    decreaseNumberNotifContact("count-request-contact-received");//js/caculateNotifContact.js
                    increaseNumberNotifContact("count-contacts");//js/caculateNotifContact.js
            
                    decreaseNumberNotification("noti_contact_counter", 1);//js/caculateNotifContact.js
                    removeContact();// js/removecontact.js
                    //Xử lý user phần chat
                    

                    socket.emit("approve-request-contact-received", {contactId: targetId});
                }
            }
        });
    });
}

//socket lắng nghe sự kiện server gửi về
socket.on("response-approve-request-contact-received", function(user) {
    let notif = `<div class="notif-readed-false" data-uid="${user.id}">
        <img class="avatar-small" src="images/users/${user.avatar}" alt=""> 
        <strong>${user.username}</strong> đã chấp nhận lời mời kết bạn của bạn!
    </div>`;
     //DOM, paste dữ liệu vào cấu trúc trang web
    $(".noti_content").prepend(notif);//prepend đẩy thông báo mới nhất từ trên xuống - thông báo popup
    $("ul.list-notifications").prepend(`<li>${notif}</li>`);//Modal bảng thông báo

    decreaseNumberNotification("noti_contact_counter", 1);// js/caculateNotification.js
    increaseNumberNotification("noti_counter", 1);// js/caculateNotification.js

    decreaseNumberNotifContact("count-request-contact-sent");//js/caculateNotifContact.js
    increaseNumberNotifContact("count-contacts");//js/caculateNotifContact.js

    $("#request-contact-sent").find(`ul li[data-uid = ${user.id}]`).remove();
    $("#find-user").find(`ul li[data-uid = ${user.id}]`).remove();
    let userInfoHtml = `
    <li class="_contactList" data-uid="${user.id}">
        <div class="contactPanel">
            <div class="user-avatar">
                <img src="images/users/${user.avatar}" alt="">
            </div>
            <div class="user-name">
                <p>
                    ${user.username}
                </p>
            </div>
            <br>
            <div class="user-address">
                <span>&nbsp ${user.address}</span>
            </div>
            <div class="user-talk" data-uid="${user.id}">
                Trò chuyện
            </div>
            <div class="user-remove-contact action-danger" data-uid="${user.id}">
                Xóa liên hệ
            </div>
        </div>
    </li>
    `;
    $("#contacts").find("ul").prepend(userInfoHtml);

    removeContact();// js/removecontact.js
    //Xử lý user phần chat
});

$(document).ready(function() {
    approveRequestContactReceived();// js/approveRequestContactSent.js
});

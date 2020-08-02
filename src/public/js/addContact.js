function addContact() {
    $(".user-add-new-contact").bind("click", function() {
        let targetId = $(this).data("uid");
        $.post("/contact/add-new", {uid: targetId}, function(data){
            if (data.success) {
                $("#find-user").find(`div.user-add-new-contact[data-uid = ${targetId}]`).hide();//Tìm đến đúng thẻ ul li có uid trùng với uid mình cần
                $("#find-user").find(`div.user-remove-request-contact[data-uid = ${targetId}]`).css("display", "inline-block");
                increaseNumberNotifContact("count-request-contact-sent");
                socket.emit("add-new-contact", {contactId: targetId});
            }
        });
    });
}
//socket lắng nghe sự kiện server gửi về
socket.on("response-add-new-contact", function(user) {
    let notif = `<div class="notif-readed-false" data-uid="${user.id}">
                    <img class="avatar-small" src="images/users/${user.avatar}" alt=""> 
                    <strong>${user.username}</strong> đã gửi cho bạn một lời mời kết bạn!
                </div>`;
    //DOM, paste dữ liệu vào cấu trúc trang web
    $(".noti_content").prepend(notif);//prepend đẩy thông báo mới nhất từ trên xuống - thông báo popup
    $("ul.list-notifications").prepend(`<li>${notif}</li>`);//Modal bảng thông báo
    increaseNumberNotifContact("count-request-contact-received");

    increaseNumberNotification("noti_contact_counter", 1);
    increaseNumberNotification("noti_counter", 1);
});
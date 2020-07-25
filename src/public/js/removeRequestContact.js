function removeRequestContact() {
    $(".user-remove-request-contact").bind("click", function() {
        let targetId = $(this).data("uid");
        $.ajax({
            url: "/contact/remove-request-contact",
            type: "delete",
            data: {uid: targetId},
            success: function(data) {
                if (data.success) {
                    $("#find-user").find(`div.user-remove-request-contact[data-uid = ${targetId}]`).hide();//Tìm đến đúng thẻ ul li có uid trùng với uid mình cần
                    $("#find-user").find(`div.user-add-new-contact[data-uid = ${targetId}]`).css("display", "inline-block");
                    decreaseNumberNotifContact("count-request-contact-sent");
                    socket.emit("remove-request-contact", {contactId: targetId});
                }
            }
        });
    });
}

//socket lắng nghe sự kiện server gửi về
socket.on("response-remove-request-contact", function(user) {
    $(".noti_content").find(`div[data-uid = ${user.id}]`).remove(); //Xóa ở bảng thông báo popup
    $("ul.list-notifications").find(`li>div[data-uid = ${user.id}]`).parent().remove();//Xóa ở modal bảng thông báo, parent tác dụng hàm xóa lên cả thẻ cha là li
    // Xóa ở modal tab yêu cầu kết bạn

    decreaseNumberNotifContact("count-request-contact-received");

    decreaseNumberNotification("noti_contact_counter");
    decreaseNumberNotification("noti_counter");
});
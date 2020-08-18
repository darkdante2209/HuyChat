// Step 01: Gửi mảng id các user online về clients
socket.on("server-send-list-users-online", function(listUserIds) {
    listUserIds.forEach(userId => {
        $(`.person[data-chat=${userId}]`).find("div.dot").addClass("online");
        $(`.person[data-chat=${userId}]`).find("img").addClass("avatar-online");
    });
});

// Step 02: Gửi id người dùng mới online tới các user khác
socket.on("server-send-when-new-user-online", function(userId) {
    $(`.person[data-chat=${userId}]`).find("div.dot").addClass("online");
    $(`.person[data-chat=${userId}]`).find("img").addClass("avatar-online");
});
// Step 02: Gửi id người dùng mới online tới các user khác
socket.on("server-send-when-new-user-offline", function(userId) {
    $(`.person[data-chat=${userId}]`).find("div.dot").removeClass("online");
    $(`.person[data-chat=${userId}]`).find("img").removeClass("avatar-online");
});
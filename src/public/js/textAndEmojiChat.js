function textAndEmojiChat(divId){
    $(".emojionearea").unbind("keyup").on("keyup", function(element){
        let currentEmojioneArea = $(this);
        if (element.which === 13) {
            let targetId = $(`#write-chat-${divId}`).data("chat");
            let messageVal = $(`#write-chat-${divId}`).val();

            if (!targetId.length || !messageVal.length) {
                return false;
            }

            let dataTextEmojiForSend = {
                uid: targetId,
                messageVal: messageVal
            };

            if ($(`#write-chat-${divId}`).hasClass("chat-in-group")) {
                dataTextEmojiForSend.isChatGroup = true;
            }

            // Gọi gửi tin nhắn lên
            $.post("/message/add-new-text-emoji", dataTextEmojiForSend, function(data) {
                let dataToEmit = {
                    message: data.message
                };

                //Step 01: Xử lý message data trước khi hiển thị
                let messageOfMe = $(`<div class="convert-emoji bubble me data-mess-id="${data.message._id}"></div>`);
                messageOfMe.text(data.message.text);
                let converEmojiMessage = emojione.toImage(messageOfMe.html());

                if (dataTextEmojiForSend.isChatGroup) {
                    let senderAvatar = `<img src="/images/users/${data.message.sender.avatar}" class="avatar-small" title="${data.message.sender.name}">`;
                    messageOfMe.html(`${senderAvatar} ${converEmojiMessage}`);
                    
                    increaseNumberMessageGroup(divId);
                    dataToEmit.groupId = targetId;
                } else {
                    messageOfMe.html(converEmojiMessage);
                    dataToEmit.contactId = targetId;
                }

                //Step 02: Nạp dữ liệu tin nhắn vào màn hình
                $(`.right .chat[data-chat=${divId}]`).append(messageOfMe);
                nineScrollRight(divId);

                //Step 03: Xóa tất cả tin nhắn trong ô nhập sau khi đã gửi
                $(`#write-chat-${divId}`).val("");
                currentEmojioneArea.find(".emojionearea-editor").text("");

                // Step 04: Cập nhật tin nhắn preview và thời gian cột liên hệ bên trái
                $(`.person[data-chat=${divId}]`).find("span.time").removeClass("message-time-realtime").html(moment(data.message.createdAt).locale("vi").startOf("seconds").fromNow());
                $(`.person[data-chat=${divId}]`).find("span.preview").html(emojione.toImage(data.message.text));

                // Step 05: Đưa cuộc trò chuyện lên mới nhất
                $(`.person[data-chat=${divId}]`).on("eventMoveTop.moveConversationToTheTop", function() {
                    let dataToMove = $(this).parent();
                    $(this).closest("ul").prepend(dataToMove);
                    $(this).off("eventMoveTop.moveConversationToTheTop");
                });
                $(`.person[data-chat=${divId}]`).trigger("eventMoveTop.moveConversationToTheTop");

                // Step 06: Emit real time
                socket.emit("chat-text-emoji", dataToEmit);

                // Step 07: Emit xóa typing real-time
                typingOff(divId);

                // Step 08: nếu đang có typing real-time, xóa ngay lập tức
                let checkTyping = $(`.chat[data-chat=${divId}]`).find("div.bubble-typing-gif");
                if (checkTyping.length) {
                    checkTyping.remove();
                }

            }).fail(function(response){
                //errors
                alertify.notify(response.responseText, "error", 7);
            });

        }
    })
}

$(document).ready(function () {
    socket.on("response-chat-text-emoji", function(response) {
        let divId = "";
        //Step 01: Xử lý message data trước khi hiển thị
        let messageOfYou = $(`<div class="convert-emoji bubble you data-mess-id="${response.message._id}"></div>`);
        messageOfYou.text(response.message.text);
        let converEmojiMessage = emojione.toImage(messageOfYou.html());

        if (response.currentGroupId) {
            let senderAvatar = `<img src="/images/users/${response.message.sender.avatar}" class="avatar-small" title="${response.message.sender.name}">`;
            messageOfYou.html(`${senderAvatar} ${converEmojiMessage}`);
            
            divId = response.currentGroupId;

            if (response.currentUserId !== $("#dropdown-navbar-user").data("uid")) {            
                increaseNumberMessageGroup(divId);
            }
        } else {
            messageOfYou.html(converEmojiMessage);
            divId = response.currentUserId;
        }        

        //Step 02: Nạp dữ liệu tin nhắn vào màn hình
        if (response.currentUserId !== $("#dropdown-navbar-user").data("uid")) {
            $(`.right .chat[data-chat=${divId}]`).append(messageOfYou);
            nineScrollRight(divId);
            $(`.person[data-chat=${divId}]`).find("span.time").addClass("message-time-realtime");
        }

        // Step 04: Cập nhật tin nhắn preview và thời gian cột liên hệ bên trái
        $(`.person[data-chat=${divId}]`).find("span.time").html(moment(response.message.createdAt).locale("vi").startOf("seconds").fromNow());
        $(`.person[data-chat=${divId}]`).find("span.preview").html(emojione.toImage(response.message.text));

        // Step 05: Đưa cuộc trò chuyện lên mới nhất
        $(`.person[data-chat=${divId}]`).on("eventMoveTop.moveConversationToTheTop", function() {
            let dataToMove = $(this).parent();
            $(this).closest("ul").prepend(dataToMove);
            $(this).off("eventMoveTop.moveConversationToTheTop");
        });
        $(`.person[data-chat=${divId}]`).trigger("eventMoveTop.moveConversationToTheTop");
        
    });
});
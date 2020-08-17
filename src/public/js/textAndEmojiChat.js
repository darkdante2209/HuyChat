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
                //Step 01: Xử lý message data trước khi hiển thị
                let messageOfMe = $(`<div class="convert-emoji bubble me data-mess-id="${data.message._id}"></div>`);
                if (dataTextEmojiForSend.isChatGroup) {
                    messageOfMe.html(`<img src="/images/users/${data.message.sender.avatar}" class="avatar-small" title="${data.message.sender.name}">`);
                    
                    messageOfMe.text(data.message.text);
                    increaseNumberMessageGroup(divId);
                } else {
                    messageOfMe.text(data.message.text);
                }

                let converEmojiMessage = emojione.toImage(messageOfMe.html());
                console.log(converEmojiMessage);
                messageOfMe.html(converEmojiMessage);

                //Step 02: Nạp dữ liệu tin nhắn vào màn hình
                $(`.right .chat[data-chat=${divId}]`).append(messageOfMe);
                nineScrollRight(divId);

                //Step 03: Xóa tất cả tin nhắn trong ô nhập sau khi đã gửi
                $(`#write-chat-${divId}`).val("");
                currentEmojioneArea.find(".emojionearea-editor").text("");

                // Step 04: Cập nhật tin nhắn preview và thời gian cột liên hệ bên trái
                $(`.person[data-chat=${divId}]`).find("span.time").html(moment(data.message.createdAt).locale("vi").startOf("seconds").fromNow());
                $(`.person[data-chat=${divId}]`).find("span.preview").html(emojione.toImage(data.message.text));

                // Step 05: Đưa cuộc trò chuyện lên mới nhất
                $(`.person[data-chat=${divId}]`).on("click.moveConversationToTheTop", function() {
                    let dataToMove = $(this).parent();
                    $(this).closest("ul").prepend(dataToMove);
                    $(this).off("click.moveConversationToTheTop");
                });
                $(`.person[data-chat=${divId}]`).click();

                // Step 06: Emit real time

            }).fail(function(response){
                //errors
                alertify.notify(response.responseText, "error", 7);
            });

        }
    })
}
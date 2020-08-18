function videoChat(divId) {
    $(`#video-chat-${divId}`).unbind("click").on("click", function() {
        let targetId = $(this).data("chat");
        let callerName = $("#navbar-username").text();

        let datatoEmit = {
            listenerId: targetId,
            callerName: callerName
        };

        // Step 01 của người gọi:
        socket.emit("caller-check-listener-online-or-not", datatoEmit);
    });
}

$(document).ready(function() {
    // Step 02 của người gọi: trả về từ chối khi người dùng offline
    socket.on("server-send-listener-is-offline", function() {
        alertify.notify("Người dùng này hiện không trực tuyến", "error", 7);
    });

    let getPeerId = "";
    const peer = new Peer();
    // console.log(peer);
    peer.on("open", function(peerId) {
        // console.log(peerId);
        getPeerId = peerId;
    });
    // Step 03 của người nghe: Lấy peer id và data
    socket.on("server-request-peer-id-of-listener", function(response) {
        let listenerName = $("#navbar-username").text();
        let dataToEmit = {
            callerId: response.callerId,
            listenerId: response.listenerId,
            callerName: response.callerName,
            listenerName: listenerName,
            listenerPeerId: getPeerId
        };
        // Step 04 của người nghe: gửi peer id về cho server
        socket.emit("listener-emit-peer-id-to-server", dataToEmit);
    });

    // Step 05 của người gọi: server gửi data và peer id của người nghe về cho người gọi
    socket.on("server-send-peer-id-of-listener-to-caller", function(response) {
        let dataToEmit = {
            callerId: response.callerId,
            listenerId: response.listenerId,
            callerName: response.callerName,
            listenerName: response.listenerName,
            listenerPeerId: response.listenerPeerId
        };

        // Step 06 của người gọi: Gửi yêu cầu thực hiện cuộc gọi lên server
        socket.emit("caller-request-call-to-server", dataToEmit);

        let timerInterval;
        Swal.fire({
            title: `Đang gọi cho &nbsp; <span style="color: #2ECC71">${response.listenerName}</span> &nbsp; <i class="fa fa-volume-control-phone"></i>`,
            html:`
                Thời gian: <strong style="color: #D43F3A"></strong> giây. <br/> <br/>
                <button id="btn-cancel-call" class="btn btn-danger">
                    Hủy cuộc gọi
                </button>
            `,
            backdrop: "rgba(85, 85, 85, 0.4)",
            width: "52rem",
            allowOutsideClick: false, // Để cho click ra bên ngoài cũng ko thể tắt thông báo cuộc gọi
            timer: 30000, // 30 giây
            onBeforeOpen: () => {
                $("#btn-cancel-call").unbind("click").on("click", function() {
                    Swal.close();
                    clearInterval(timerInterval);

                    // Step 07 của người gọi: Hủy cuộc gọi
                    socket.emit("caller-cancel-request-call-to-server", dataToEmit);
                });

                Swal.showLoading();
                timerInterval = setInterval(() => {
                    Swal.getContent().querySelector("strong").textContent = Math.ceil(Swal.getTimerLeft() / 1000);
                }, 1000);
            },
            onOpen: () => {
                // Step 12 của người gọi: server gửi thông báo cuộc gọi bị từ chối về cho người gọi
                socket.on("server-send-reject-call-to-caller", function(response) {
                    Swal.close();
                    clearInterval(timerInterval);

                    Swal.fire({
                        type:"info",
                        title: `<span style="color: #2ECC71">${response.listenerName}</span> &nbsp; hiện tại không thể nghe máy`,
                        backdrop: "rgba(85, 85, 85, 0.4)",
                        width: "52rem",
                        allowOutsideClick: false, // Để cho click ra bên ngoài cũng ko thể tắt thông báo cuộc gọi
                        confirmButtonColor: "#2ECC71",
                        confirmButtonText: "Xác nhận",
                    });
                });

                // Step 13 của người gọi: server gửi thông báo cuộc gọi được chấp nhận về cho người gọi
                socket.on("server-send-accept-call-to-caller", function(response) {
                    Swal.close();
                    clearInterval(timerInterval);
                    console.log("Caller ok........");
                });
            },
            onClose: () => {
                clearInterval(timerInterval);
            }
          }).then((result) => {
              return false;
          });
    });

    // Step 08 cuả người nghe: server gửi yêu cầu cuộc gọi của người gọi về cho người nghe
    socket.on("server-send-request-call-to-listener", function(response) {
        let dataToEmit = {
            callerId: response.callerId,
            listenerId: response.listenerId,
            callerName: response.callerName,
            listenerName: response.listenerName,
            listenerPeerId: response.listenerPeerId
        };
        let timerInterval;
        Swal.fire({
            title: `&nbsp; <span style="color: #2ECC71">${response.callerName}</span> &nbsp; muốn trò chuyện video với bạn &nbsp; <i class="fa fa-volume-control-phone"></i>`,
            html:`
                Thời gian: <strong style="color: #D43F3A"></strong> giây. <br/> <br/>
                <button id="btn-reject-call" class="btn btn-danger">
                    Từ chối
                </button>
                <button id="btn-accept-call" class="btn btn-success">
                    Đồng ý
                </button>
            `,
            backdrop: "rgba(85, 85, 85, 0.4)",
            width: "52rem",
            allowOutsideClick: false, // Để cho click ra bên ngoài cũng ko thể tắt thông báo cuộc gọi
            timer: 30000, // 30 giây
            onBeforeOpen: () => {
                $("#btn-reject-call").unbind("click").on("click", function() {
                    Swal.close();
                    clearInterval(timerInterval);

                    // Step 10 của người nghe: người nghe từ chối cuộc gọi
                    socket.emit("listener-reject-request-call-to-server", dataToEmit);
                });

                $("#btn-accept-call").unbind("click").on("click", function() {
                    Swal.close();
                    clearInterval(timerInterval);

                    // Step 11 của người nghe: người nghe chấp nhận cuộc gọi
                    socket.emit("listener-accept-request-call-to-server", dataToEmit);
                });

                Swal.showLoading();
                timerInterval = setInterval(() => {
                    Swal.getContent().querySelector("strong").textContent = Math.ceil(Swal.getTimerLeft() / 1000);
                }, 1000);
            },
            onOpen: () => {
                // Step 09 của người nghe: nhận yêu cầu hủy cuộc gọi từ người gọi.
                socket.on("server-send-cancel-request-call-to-listener", function(response) {
                    Swal.close();
                    clearInterval(timerInterval);
                });

                // Step 14 của người nghe: server gửi thông báo cuộc gọi được chấp nhận về kết nối người nghe
                socket.on("server-send-accept-call-to-listener", function(response) {
                    Swal.close();
                    clearInterval(timerInterval);
                    console.log("Listener ok........");
                });
            },
            onClose: () => {
                clearInterval(timerInterval);
            }
          }).then((result) => {
              return false;
          })
    });


});
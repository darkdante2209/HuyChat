//Đưa các socket id vào mảng 
export let pushSocketIdToArray = (clients, userId, socketId) => {
    if (clients[userId]) {
        clients[userId].push(socketId);//Khi đã đăng nhập, mở tab mới sẽ push một socket id mới vào
    } else {
    clients[userId] = [socketId];//Đăng nhập lần đàu tiên thì nó sẽ đưa socket id mới vào
    }
    return clients;
};

//Bắn sự kiện về mảng socket id
export let emitNotifyToArray = (clients, userId, io, eventName, data) => {
    //Nếu người dùng đang mở nhiều tab, có nhiều socket id thì sẽ bắn thông báo
    //tới tất cả socket id đang tồn tại
    clients[userId].forEach(socketId => io.sockets.connected[socketId].emit(eventName, data));
};

//Xóa socket id từ mảng
export let removeSocketIdFromArray = (clients, userId, socket) => {
    //Xóa các socket id cũ khi người dùng tải lại trang
    clients[userId] = clients[userId].filter((socketId) => {
        return socketId !== socket.id;
    });
    //Khi tắt hoàn toàn ứng dụng phải xóa hết socket ID liên quan đến clients
    //Nếu không nó sẽ lưu vĩnh viễn socket id cuối cùng.
    if (!clients[userId].length) {
        delete clients[userId];
    }
    return clients;
};
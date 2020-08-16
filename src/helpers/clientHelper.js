import moment from "moment";

export let bufferToBase64 = (bufferFrom) => {
    return Buffer.from(bufferFrom).toString("base64");
};

export let lastItemOfArray = (array) => {
    if (!array.length) {
        return [];
    }
    return array[array.length - 1];// vì phần tử đầu tiên của array là 0, array.length min là 1 trừ đi để lấy phần từ cuối cùng của mảng.
};

export let convertTimestampToHumanTime = (timestamp) => {
    if (!timestamp) {
        return "";
    }
    return moment(timestamp).locale("vi").startOf("seconds").fromNow();
};
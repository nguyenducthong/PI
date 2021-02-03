const TransferStatus_Value = {
    received: 3,//Đã nhận được mẫu
    delivered: 2,// đang chuyển
    wait_for_transfer: 1,//Chờ chuyển
    no_sample_received: -1//Thất lạc
}

const TransferStatusRef_Value = {
    Delivered_Pi: 1,//Đã chuyển được mẫu
    Received_Health_Org: 2,// //Đơn vị đã nhận được mẫu đối chứng
    Sample_Resend_Unit: 3,///Đơn vị đã chuyển bộ mẫu đối chứng cho pi
    Received_Pi: 4//PI đã nhận bộ mẫu đối chứng
}

module.exports = Object.freeze({
    TransferStatus_Value: TransferStatus_Value,
    TransferStatusRef_Value: TransferStatusRef_Value
  });
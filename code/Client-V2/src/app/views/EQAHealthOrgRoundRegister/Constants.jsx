const TransferStatus_Value = {
    received: 3,//Đã nhận được mẫu
    delivered: 2,// đang chuyển
    wait_for_transfer: 1,//Chờ chuyển
    no_sample_received: -1//Thất lạc
}

const EQAHealthOrgRoundRegister_Value = {
    new: 0,//chưa đang kí
    confirmed: 1,//Mới đăng kí
    cancel_Registration: -1//HỦy đăng kí
}
const EQAStatusResult_value ={
    yes: true,
    no: false
}
const EQAFeeStatus_Value = {
    yes: 1,
    no: 0
}

const TransferStatusRef_Value = {
    Delivered_Pi: 1,//Đã chuyển được mẫu
    Received_Health_Org: 2,// //Đơn vị đã nhận được mẫu đối chứng
    Sample_Resend_Unit: 3,///Đơn vị đã chuyển bộ mẫu đối chứng cho pi
    Received_Pi: 4//PI đã nhận bộ mẫu đối chứng
}

module.exports = Object.freeze({
    TransferStatus_Value: TransferStatus_Value,
    EQAHealthOrgRoundRegister_Value: EQAHealthOrgRoundRegister_Value,
    EQAStatusResult_value: EQAStatusResult_value,
    EQAFeeStatus_Value:EQAFeeStatus_Value,
    TransferStatusRef_Value: TransferStatusRef_Value
  });
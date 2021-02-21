const EQASerumBottle_Value =   {
    yes: "Đạt",
    no: "Chưa Đạt"
}
const EQAResult_Value = {
    Not_Implemented: -2,//(-2) Không thực hiện
    negative:-1, //(-1) Âm tính
    indertermine:0,//(0) Không xác định
    positive:1 //(1) Dương tính
}
const EQAStatusSample_value ={
    yes: true,
    no: false
}
const EQASerumBankSample_Value = {
    Serum: 1,
    Plasma: 0
}
module.exports = Object.freeze({
    EQASerumBottle_Value: EQASerumBottle_Value,
    EQAResult_Value:EQAResult_Value,
    EQAStatusSample_value: EQAStatusSample_value,
    EQASerumBankSample_Value: EQASerumBankSample_Value
  });
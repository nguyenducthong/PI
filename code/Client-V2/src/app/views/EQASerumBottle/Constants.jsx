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
module.exports = Object.freeze({
    EQASerumBottle_Value: EQASerumBottle_Value,
    EQAResult_Value:EQAResult_Value
  });
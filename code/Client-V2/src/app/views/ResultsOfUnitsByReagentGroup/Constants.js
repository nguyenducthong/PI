const EQAResultReportTypeMethod =   {
    Elisa:1,//Kết Quả Xét Nghiệm Bằng Kỹ Thuật Elisa
	FastTest:2,//Kết Quả Xét Nghiệm Bằng Kỹ Thuật Xét Nghiệm Nhanh
	SERODIA:3,//Kết Quả Xét Nghiệm Bằng Kỹ Thuật SERODIA
	ECL:4,//Kỹ thuật điện hóa phát quang - Electrode Chemi Luminescence
	Conclusion:5 //Kết luận: dùng khi làm kết luận cuối cùng cho bộ mẫu
}
module.exports = Object.freeze({
    EQAResultReportTypeMethod: EQAResultReportTypeMethod,
  });
package com.globits.PI;
public class PIConst {
	
	public static final String ROLE_HEALTH_ORG = "ROLE_HEALTH_ORG";
	public static final String ROLE_USER = "ROLE_USER";
	public static final String ROLE_COORDINATOR = "ROLE_COORDINATOR";
	public static final String ROLE_ADMINISTRATIVE_STAFF = "ROLE_ADMINISTRATIVE_STAFF";
	public static final String ROLE_STAFF = "ROLE_STAFF";
	public static final String ROLE_SAMPLE_ADMIN = "ROLE_SAMPLE_ADMIN";
	public static final Boolean CHECK_HEALTH_ORG = true;
	public static final Boolean CHECK_ERROR_RESULT = true;
	
	public static String SERUM_CODE = "PI";
	public static int PASSWORD_LENGTH = 16;

	public static String PathUploadDocumentAttachment = null;
	
	public static enum SampleTransferStatus{
		lost_NoSamplesReceived(-1),		//thất lạc - không nhận được mẫu
		WaitForTransfer(1),				//Chờ chuyển
		Delivered(2),					//Đã chuyển
		Received(3),					//Đã nhận được
		;		
		private Integer value;
		private SampleTransferStatus(int value) {
		    this.value = value;
		}
	
		public Integer getValue() {
			return value;
		}
	}
	
	public static enum ReferenceResultPriority{
		officialResult(1),//Kết quả tương đồng
		referenceResult(2);//Kết quả PI
		private Integer value;
		private ReferenceResultPriority(int value) {
		    this.value = value;
		}
		public Integer getValue() {
			return value;
		}
	}
	public static enum SampleTransferStatusReference{
		Delivered_Pi(1),		//PI đã chuyển mẫu đối chứng
		Received_Health_Org(2),				//Đơn vị đã nhận được mẫu đối chứng
		Sample_Resend_Unit(3),	//Đơn vị đã chuyển bộ mẫu đối chứng cho pi
		Received_Pi(4),					//PI đã nhận bộ mẫu đối chứng
		;		
		private Integer value;
		private SampleTransferStatusReference(int value) {
		    this.value = value;
		}
	
		public Integer getValue() {
			return value;
		}
	}


	public static enum HealthOrgEQARoundStatus{
		New(0),//mới đăng ký
		Confirmed(1),//đã xác nhận được phép tham gia
		Cancel_Registration(-1)//đã hủy đăng ký tham gia
		;		
		private Integer value;
		private HealthOrgEQARoundStatus(int value) {
		    this.value = value;
		}
	
		public Integer getValue() {
			return value;
		}
	}
	
	public static enum EQAResultReportTypeMethod{
		Elisa(1),//Kết Quả Xét Nghiệm Bằng Kỹ Thuật Elisa
		FastTest(2),//Kết Quả Xét Nghiệm Bằng Kỹ Thuật Xét Nghiệm Nhanh
		SERODIA(3),//Kết Quả Xét Nghiệm Bằng Kỹ Thuật SERODIA
		ECL(4),//Kỹ thuật điện hóa phát quang - Electrode Chemi Luminescence
		Conclusion(5) //Kết luận: dùng khi làm kết luận cuối cùng cho bộ mẫu
		;		
		private Integer value;
		private EQAResultReportTypeMethod(int value) {
		    this.value = value;
		}
	
		public Integer getValue() {
			return value;
		}
	}
	
	/**
	 * serodia 
	 * Mức độ ngưng kết
	 * @return
	 */
	public static enum EQAResultReportDetail_Agglomeration{
		minus(1),//	 (-)
		plusMinus(2),//	(+/-)
		plus(3),// 	(+)
		plusPlus(4),//	(++)
		;		
		private Integer value;
		private EQAResultReportDetail_Agglomeration(int value) {
		    this.value = value;
		}
		public Integer getValue() {
			return value;
		}
	}
	
	/**
	 * serodia 
	 * Giếng chứng
	 * @return
	 */
	public static enum EQAResultReportDetail_CheckValue{
		negative(-1),//Âm tính
		positive(1)//Dương tính
		;		
		private Integer value;
		private EQAResultReportDetail_CheckValue(int value) {
		    this.value = value;
		}
		public Integer getValue() {
			return value;
		}
	}
	
	/**
	 * serodia 
	 * Giếng test
	 * @return
	 */
	public static enum EQAResultReportDetail_TestValue{
		noEvaluate(-3),//Không đánh giá
		none(-2),//Không thực hiện
		negative(-1),//Âm tính
		indertermine(0),//Không xác định
		positive(1),//Dương tính
		confirmation_form(2)//PXN gửi mẫu khẳng định
		;
		private Integer value;
		private EQAResultReportDetail_TestValue(int value) {
		    this.value = value;
		}
		public Integer getValue() {
			return value;
		}
	}
	
	public static enum SampleResult{
		positive(1),//Dương tính
		indertermine(0),//Không xác định
		negative(-1),//Âm tính
		none(-2)//Không thực hiện
		;		
		private Integer value;
		private SampleResult(int value) {
		    this.value = value;
		}
	
		public Integer getValue() {
			return value;
		}
	}
	public static enum SerumType{//Loại huyết thanh
		plasma(0),//Huyết tương
		serum(1)//Huyết thanh
		;		
		private int value;
		private SerumType(int value) {
		    this.value = value;
		}
	
		public int getValue() {
			return value;
		}
	}
	public static enum SerumQuality{
		good(0),//tốt
		hemolysis(1),//tán huyết
		opaque(2)//Đục
		;		
		private int value;
		private SerumQuality(int value) {
		    this.value = value;
		}
	
		public int getValue() {
			return value;
		}
	}
	public static enum FeeStatus{//Tình trạng nộp phí của các đơn vị tham gia ngoại kiểm
		no(0),//chưa nộp
		yes(1)//đã nộp
		;		
		private int value;
		private FeeStatus(int value) {
		    this.value = value;
		}
	
		public int getValue() {
			return value;
		}
	}
	public static enum TubeType{//Loại tube: dùng để xét nghiệm hay dùng để tham chiều chất lượng
		main(1),//Tube chính
		reference(0)//Tube tham chiều
		;		
		private int value;
		private TubeType(int value) {
		    this.value = value;
		}
	
		public int getValue() {
			return value;
		}
	}
	public static enum TubeStatus{//Trạng thái tube
		cancel(-3),//Đã hủy
		revoke(-2),//Đã nhân lại từ phòng xét nghiệm (trường hợp tube tham chiếu chất lượng)
		reSent(-1),//đã gửi trả lại
		newTube(0),//Mới
		sent(1),//đã gửi
		received(2),//Phòng xét nghiệm đã nhận
		hasResult(3)//Đã có kết quả
		;		
		private int value;
		private TubeStatus(int value) {
		    this.value = value;
		}
	
		public int getValue() {
			return value;
		}
	}
	
	public static enum LogType{
		log_ResultReport(1),		// Kết quả
		Log_Sample(2),
		Log_SerumBottle(3),
		;		
		private Integer value;
		private LogType(int value) {
		    this.value = value;
		}
	
		public Integer getValue() {
			return value;
		}
	}
}

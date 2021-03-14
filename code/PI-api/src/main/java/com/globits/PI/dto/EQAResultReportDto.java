package com.globits.PI.dto;

import java.util.Calendar;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

import com.globits.PI.domain.EQAResultReport;
import com.globits.PI.domain.EQAResultReportDetail;
import com.globits.core.dto.BaseObjectDto;

public class EQAResultReportDto extends BaseObjectDto{
	private Integer typeMethod;//Loại báo cáo kết quả 
	private String reagentLot;
	private Date reagentExpiryDate;
	private Date reagentUnBoxDate;
	private String note;// Ghi chú
	private ReagentDto reagent;
	private String supplyOfReagent;// Nguồn cung cấp sinh phẩm
	private String personBuyReagent;// Người mua sinh phẩm
	private String orderTest;// Thứ tự xét nghiệm
	private Date testDate;// Ngày xét nghiệm
	private Integer timeToResult;// thời gian trả kết quả (Phút)
	private Boolean isUsingIQC;// Có sử dụng mẫu nội kiểm hay không (IQC Internal Quality Control)
	private Boolean isUsingControlLine;// Có sử dụng vạch kiểm chứng hay không
	private Date dateSubmitResults; //Ngày nộp kết quả cuối cùng
	private String shakingMethod;// Phương pháp lắc
	private Integer shakingNumber;// Số lần lắc
	private Integer shakingTimes;// Thời gian lắc (Giây)
	private Integer incubationPeriod;// Thời gian ủ (Phút)
	private Double incubationTemp;// nhiệt độ ủ (°C)
	private Integer incubationPeriodWithPlus;// Thời gian ủ với cộng hợp(Phút)
	private Double incubationTempWithPlus;// nhiệt độ ủ với cộng hợp (°C)
	private Integer incubationPeriodWithSubstrate;// Thời gian ủ với cơ chất(Phút)
	private Double incubationTempWithSubstrate;// nhiệt độ ủ với cơ chất (°C)
	private Boolean isUsingCTest;// ELISA - có chạy chứng kiểm tra hay không
	private Integer totalCheckValue;// ELISA - tổng số giếng trứng
	private HealthOrgEQARoundDto healthOrgRound;
	private UUID healthOrgId;
	private Set<EQAResultReportDetailDto> details;// Danh sách chi tiết kết quả các mẫu
	private Boolean isFinalResult;//Có phải kết quả cuối cùng 
	private Boolean isEditAble;//User đang đăng nhập có quyền sửa hay không?
	private String reagentName;//tên sinh phẩm
	private String technician; ; //tên người thực hiện
	private Boolean otherReagent = false; //Có check trùng sinh phẩm hay không
	private String noteOtherReagent;
	private Integer dayReagentExpiryDate;
	private Integer monthReagentExpiryDate;
	private Integer yeahReagentExpiryDate;
	
	public EQAResultReportDto() {

	}
	
	public EQAResultReportDto(EQAResultReport entity) {
		this.id = entity.getId();
		this.reagentLot = entity.getReagentLot();
		this.technician = entity.getTechnician();
		this.reagentExpiryDate = entity.getReagentExpiryDate();//Hạn sử dụng sinh phẩm
		this.reagentUnBoxDate = entity.getReagentUnBoxDate();
		this.typeMethod = entity.getTypeMethod();
		this.note = entity.getNote();// Ghi chú
		this.isFinalResult = entity.getIsFinalResult();//Có phải kết quả cuối cùng
		if (entity.getReagent() != null) {
			this.reagent = new ReagentDto(entity.getReagent());
			this.reagentName = entity.getReagent().getName();
		}
		this.supplyOfReagent = entity.getSupplyOfReagent();// Nguồn cung cấp sinh phẩm
		this.personBuyReagent = entity.getPersonBuyReagent();// Người mua sinh phẩm
		this.orderTest = entity.getOrderTest();// Thứ tự xét nghiệm
		this.testDate = entity.getTestDate();// Ngày xét nghiệm
		this.dateSubmitResults = entity.getDateSubmitResults(); // Ngày nộp kết quả cuối cùng
		// Xet nghiem nhanh
	
		if(entity.getReagentExpiryDate() != null) {
			Calendar calendar = Calendar.getInstance();
			calendar.setTime(entity.getReagentExpiryDate());
			this.dayReagentExpiryDate =  calendar.get(Calendar.DATE);
			this.monthReagentExpiryDate = calendar.get(Calendar.MONTH) + 1;
			this.yeahReagentExpiryDate = calendar.get(Calendar.YEAR);
		}
	
		if (entity.getHealthOrgRound() != null) {
			this.healthOrgRound = new HealthOrgEQARoundDto(entity.getHealthOrgRound());
			this.healthOrgId = entity.getHealthOrgRound().getHealthOrg().getId();
		}
			
		if (entity.getDetails() != null) {
			this.details = new HashSet<EQAResultReportDetailDto>();
			for (EQAResultReportDetail eQAResultReportDetail : entity.getDetails()) {
				this.details.add(new EQAResultReportDetailDto(eQAResultReportDetail));
			}
		}
	}

	public EQAResultReportDto(EQAResultReport entity, boolean simple) {
		this.id = entity.getId();
		this.reagentLot = entity.getReagentLot();
		this.technician = entity.getTechnician();
		this.reagentExpiryDate = entity.getReagentExpiryDate();
		this.reagentUnBoxDate = entity.getReagentUnBoxDate();
		this.typeMethod = entity.getTypeMethod();
		this.note = entity.getNote();// Ghi chú
		this.isFinalResult = entity.getIsFinalResult();//Có phải kết quả cuối cùng
		if(!simple) {
			if (entity.getReagent() != null)
				this.reagent = new ReagentDto(entity.getReagent());
		}
		if (entity.getReagent() != null)
			this.reagentName = entity.getReagent().getName();
		
		this.supplyOfReagent = entity.getSupplyOfReagent();// Nguồn cung cấp sinh phẩm
		this.personBuyReagent = entity.getPersonBuyReagent();// Người mua sinh phẩm
		this.orderTest = entity.getOrderTest();// Thứ tự xét nghiệm
		this.testDate = entity.getTestDate();// Ngày xét nghiệm
		this.dateSubmitResults = entity.getDateSubmitResults(); // Ngày nộp kết quả cuối cùng
		if(entity.getReagentExpiryDate() != null) {
			Calendar calendar = Calendar.getInstance();
			calendar.setTime(entity.getReagentExpiryDate());
			this.dayReagentExpiryDate =  calendar.get(Calendar.DATE);
			this.monthReagentExpiryDate = calendar.get(Calendar.MONTH) + 1;
			this.yeahReagentExpiryDate = calendar.get(Calendar.YEAR);
		}
		if (entity.getHealthOrgRound() != null) {
			if(simple) {
				this.healthOrgRound = new HealthOrgEQARoundDto(entity.getHealthOrgRound(),true);
			}
			else {
				this.healthOrgRound = new HealthOrgEQARoundDto(entity.getHealthOrgRound());
			}			
		}			
	}

	public EQAResultReportDto(EQAResultReport entity, boolean simple, int type) {
		this.id = entity.getId();
		this.typeMethod = entity.getTypeMethod();
	}
	
	public Integer getTypeMethod() {
		return typeMethod;
	}

	public void setTypeMethod(Integer typeMethod) {
		this.typeMethod = typeMethod;
	}

	public String getReagentLot() {
		return reagentLot;
	}

	public void setReagentLot(String reagentLot) {
		this.reagentLot = reagentLot;
	}

	public Date getReagentExpiryDate() {
		return reagentExpiryDate;
	}

	public void setReagentExpiryDate(Date reagentExpiryDate) {
		this.reagentExpiryDate = reagentExpiryDate;
	}

	public Date getReagentUnBoxDate() {
		return reagentUnBoxDate;
	}

	public void setReagentUnBoxDate(Date reagentUnBoxDate) {
		this.reagentUnBoxDate = reagentUnBoxDate;
	}

	public String getNote() {
		return note;
	}

	public void setNote(String note) {
		this.note = note;
	}

	public ReagentDto getReagent() {
		return reagent;
	}

	public void setReagent(ReagentDto reagent) {
		this.reagent = reagent;
	}

	public HealthOrgEQARoundDto getHealthOrgRound() {
		return healthOrgRound;
	}

	public void setHealthOrgRound(HealthOrgEQARoundDto healthOrgRound) {
		this.healthOrgRound = healthOrgRound;
	}

	public UUID getHealthOrgId() {
		return healthOrgId;
	}

	public void setHealthOrgId(UUID healthOrgId) {
		this.healthOrgId = healthOrgId;
	}

	public Set<EQAResultReportDetailDto> getDetails() {
		return details;
	}

	public void setDetails(Set<EQAResultReportDetailDto> details) {
		this.details = details;
	}

	public String getSupplyOfReagent() {
		return supplyOfReagent;
	}

	public void setSupplyOfReagent(String supplyOfReagent) {
		this.supplyOfReagent = supplyOfReagent;
	}

	public String getPersonBuyReagent() {
		return personBuyReagent;
	}

	public void setPersonBuyReagent(String personBuyReagent) {
		this.personBuyReagent = personBuyReagent;
	}
	
	public String getOrderTest() {
		return orderTest;
	}

	public void setOrderTest(String orderTest) {
		this.orderTest = orderTest;
	}

	public Date getTestDate() {
		return testDate;
	}

	public void setTestDate(Date testDate) {
		this.testDate = testDate;
	}

	public Integer getTimeToResult() {
		return timeToResult;
	}

	public void setTimeToResult(Integer timeToResult) {
		this.timeToResult = timeToResult;
	}

	public Boolean getIsUsingIQC() {
		return isUsingIQC;
	}

	public void setIsUsingIQC(Boolean isUsingIQC) {
		this.isUsingIQC = isUsingIQC;
	}

	public Boolean getIsUsingControlLine() {
		return isUsingControlLine;
	}

	public void setIsUsingControlLine(Boolean isUsingControlLine) {
		this.isUsingControlLine = isUsingControlLine;
	}

	public String getShakingMethod() {
		return shakingMethod;
	}

	public void setShakingMethod(String shakingMethod) {
		this.shakingMethod = shakingMethod;
	}

	public Integer getShakingNumber() {
		return shakingNumber;
	}

	public void setShakingNumber(Integer shakingNumber) {
		this.shakingNumber = shakingNumber;
	}

	public Integer getShakingTimes() {
		return shakingTimes;
	}

	public void setShakingTimes(Integer shakingTimes) {
		this.shakingTimes = shakingTimes;
	}

	public Integer getIncubationPeriod() {
		return incubationPeriod;
	}

	public void setIncubationPeriod(Integer incubationPeriod) {
		this.incubationPeriod = incubationPeriod;
	}

	public Double getIncubationTemp() {
		return incubationTemp;
	}

	public void setIncubationTemp(Double incubationTemp) {
		this.incubationTemp = incubationTemp;
	}

	public Integer getIncubationPeriodWithPlus() {
		return incubationPeriodWithPlus;
	}

	public void setIncubationPeriodWithPlus(Integer incubationPeriodWithPlus) {
		this.incubationPeriodWithPlus = incubationPeriodWithPlus;
	}

	public Double getIncubationTempWithPlus() {
		return incubationTempWithPlus;
	}

	public void setIncubationTempWithPlus(Double incubationTempWithPlus) {
		this.incubationTempWithPlus = incubationTempWithPlus;
	}

	public Integer getIncubationPeriodWithSubstrate() {
		return incubationPeriodWithSubstrate;
	}

	public void setIncubationPeriodWithSubstrate(Integer incubationPeriodWithSubstrate) {
		this.incubationPeriodWithSubstrate = incubationPeriodWithSubstrate;
	}

	public Double getIncubationTempWithSubstrate() {
		return incubationTempWithSubstrate;
	}

	public void setIncubationTempWithSubstrate(Double incubationTempWithSubstrate) {
		this.incubationTempWithSubstrate = incubationTempWithSubstrate;
	}

	public Boolean getIsUsingCTest() {
		return isUsingCTest;
	}

	public void setIsUsingCTest(Boolean isUsingCTest) {
		this.isUsingCTest = isUsingCTest;
	}

	public Integer getTotalCheckValue() {
		return totalCheckValue;
	}

	public void setTotalCheckValue(Integer totalCheckValue) {
		this.totalCheckValue = totalCheckValue;
	}

	public Boolean getIsFinalResult() {
		return isFinalResult;
	}

	public void setIsFinalResult(Boolean isFinalResult) {
		this.isFinalResult = isFinalResult;
	}

	public Boolean getIsEditAble() {
		return isEditAble;
	}

	public void setIsEditAble(Boolean isEditAble) {
		this.isEditAble = isEditAble;
	}

	public Date getDateSubmitResults() {
		return dateSubmitResults;
	}

	public void setDateSubmitResults(Date dateSubmitResults) {
		this.dateSubmitResults = dateSubmitResults;
	}

	public String getReagentName() {
		return reagentName;
	}

	public void setReagentName(String reagentName) {
		this.reagentName = reagentName;
	}

	public String getTechnician() {
		return technician;
	}

	public void setTechnician(String technician) {
		this.technician = technician;
	}

	public Boolean getOtherReagent() {
		return otherReagent;
	}

	public void setOtherReagent(Boolean otherReagent) {
		this.otherReagent = otherReagent;
	}

	public String getNoteOtherReagent() {
		return noteOtherReagent;
	}

	public void setNoteOtherReagent(String noteOtherReagent) {
		this.noteOtherReagent = noteOtherReagent;
	}

	public Integer getDayReagentExpiryDate() {
		return dayReagentExpiryDate;
	}

	public void setDayReagentExpiryDate(Integer dayReagentExpiryDate) {
		this.dayReagentExpiryDate = dayReagentExpiryDate;
	}

	public Integer getMonthReagentExpiryDate() {
		return monthReagentExpiryDate;
	}

	public void setMonthReagentExpiryDate(Integer monthReagentExpiryDate) {
		this.monthReagentExpiryDate = monthReagentExpiryDate;
	}

	public Integer getYeahReagentExpiryDate() {
		return yeahReagentExpiryDate;
	}

	public void setYeahReagentExpiryDate(Integer yeahReagentExpiryDate) {
		this.yeahReagentExpiryDate = yeahReagentExpiryDate;
	}

	
}

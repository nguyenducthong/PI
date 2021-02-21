package com.globits.PI.functiondto;

import java.util.Date;

import com.globits.PI.dto.EQARoundDto;

public class EQAResultReportSearchDto extends SearchDto {

	//giá trị trong  PIConst.EQAResultReportTypeMethod
	//Elisa(1),//Kết Quả Xét Nghiệm Bằng Kỹ Thuật Elisa
	//FastTest(2),//Kết Quả Xét Nghiệm Bằng Kỹ Thuật Xét Nghiệm Nhanh
	//SERODIA(3)//Kết Quả Xét Nghiệm Bằng Kỹ Thuật SERODIA
	private Integer typeMethod;//Loại báo cáo kết quả 
	private Date testDate;
	private EQARoundDto round;
	private Boolean isManagementUnit;
	public Integer getTypeMethod() {
		return typeMethod;
	}

	public void setTypeMethod(Integer typeMethod) {
		this.typeMethod = typeMethod;
	}

	public EQARoundDto getRound() {
		return round;
	}

	public void setRound(EQARoundDto round) {
		this.round = round;
	}
	

	public Date getTestDate() {
		return testDate;
	}

	public void setTestDate(Date testDate) {
		this.testDate = testDate;
	}

	public Boolean getIsManagementUnit() {
		return isManagementUnit;
	}

	public void setIsManagementUnit(Boolean isManagementUnit) {
		this.isManagementUnit = isManagementUnit;
	}

	public EQAResultReportSearchDto() {
		super();
	}
	
}

package com.globits.PI.dto;

import com.globits.PI.domain.EQAResultReportDetail;
import com.globits.core.dto.BaseObjectDto;

public class EQAResultReportDetailDto extends BaseObjectDto{
	private EQAResultReportDto resultReport;//Thuộc báo cáo nào
	private EQASampleTubeDto sampleTube;//Tube nào
	private Integer orderNumber;	//Thứ tự trong chi tiết báo cáo
	private Integer result;
	private String note;//Ghi chú
	/**
	 * ELISA
	 * Giá trị ngưỡng
	 */
	private Double cutOff;
	
	/**
	 * ELISA
	 * Giá trị OD mẫu
	 */
	private Double oDvalue;
	
	/**
	 * ELISA
	 * Tỉ số OD/cut-off
	 */
	private Double ratioOdAndCutOff;
	
	/**
	 * ECLIA
	 * Giá trị mẫu S/CO
	 * @return
	 */
	private Double sCOvalue;
	
	/**
	 * serodia 
	 * Mức độ ngưng kết
	 * @return
	 */
	private Integer agglomeration;
	
	/**
	 * serodia 
	 * Giếng chứng
	 * @return
	 */
	private Integer checkValue;
	
	/**
	 * serodia 
	 * Giếng test
	 * @return
	 */
	private Integer testValue;
	
	/**
	 * Test nhanh
	 * Vạch chứng
	 * @return
	 * PIConst.EQASampleStatus
	 */
	private Integer cLine;
	
	/**
	 * Test nhanh
	 * Vạch test
	 * @return
	 * PIConst.EQASampleStatus
	 */
	private Integer tLine;
	public EQAResultReportDto getResultReport() {
		return resultReport;
	}
	public void setResultReport(EQAResultReportDto resultReport) {
		this.resultReport = resultReport;
	}
	public EQASampleTubeDto getSampleTube() {
		return sampleTube;
	}
	public void setSampleTube(EQASampleTubeDto sampleTube) {
		this.sampleTube = sampleTube;
	}
	public Integer getResult() {
		return result;
	}
	public void setResult(Integer result) {
		this.result = result;
	}
	public String getNote() {
		return note;
	}
	public void setNote(String note) {
		this.note = note;
	}
	
	public Double getCutOff() {
		return cutOff;
	}
	public void setCutOff(Double cutOff) {
		this.cutOff = cutOff;
	}
	public Integer getAgglomeration() {
		return agglomeration;
	}
	public void setAgglomeration(Integer agglomeration) {
		this.agglomeration = agglomeration;
	}
	public Integer getCheckValue() {
		return checkValue;
	}
	public void setCheckValue(Integer checkValue) {
		this.checkValue = checkValue;
	}
	public Integer getTestValue() {
		return testValue;
	}
	public void setTestValue(Integer testValue) {
		this.testValue = testValue;
	}
	public Integer getcLine() {
		return cLine;
	}
	public void setcLine(Integer cLine) {
		this.cLine = cLine;
	}
	public Integer gettLine() {
		return tLine;
	}
	public void settLine(Integer tLine) {
		this.tLine = tLine;
	}
	
	public Double getoDvalue() {
		return oDvalue;
	}
	public void setoDvalue(Double oDvalue) {
		this.oDvalue = oDvalue;
	}
	public Double getsCOvalue() {
		return sCOvalue;
	}
	public void setsCOvalue(Double sCOvalue) {
		this.sCOvalue = sCOvalue;
	}
	
	public Double getRatioOdAndCutOff() {
		return ratioOdAndCutOff;
	}
	public void setRatioOdAndCutOff(Double ratioOdAndCutOff) {
		this.ratioOdAndCutOff = ratioOdAndCutOff;
	}
	
	public Integer getOrderNumber() {
		return orderNumber;
	}
	public void setOrderNumber(Integer orderNumber) {
		this.orderNumber = orderNumber;
	}
	public EQAResultReportDetailDto() {
	}
	
	public EQAResultReportDetailDto(EQAResultReportDetail entity) {
		if (entity != null) {
			this.id = entity.getId();
			this.result = entity.getResult();
			this.note = entity.getNote();
			this.orderNumber = entity.getOrderNumber();
			if (entity.getResultReport() != null) {
				this.resultReport = new EQAResultReportDto(entity.getResultReport(), false, 1);
			}
			if (entity.getSampleTube() != null) {
				this.sampleTube = new EQASampleTubeDto(entity.getSampleTube(), false);
			}
			
			//serodia 
			this.agglomeration=entity.getAgglomeration();
			this.checkValue=entity.getCheckValue();
			this.testValue = entity.getTestValue();
			//ELISA
			this.cutOff=entity.getCutOff();
			this.oDvalue = entity.getoDvalue();
			this.ratioOdAndCutOff = entity.getRatioOdAndCutOff();
			//ECLIA
			this.sCOvalue = entity.getsCOvalue();
			//Test nhanh
			this.tLine = entity.gettLine();
			this.cLine=entity.getcLine();
		}
	}

}

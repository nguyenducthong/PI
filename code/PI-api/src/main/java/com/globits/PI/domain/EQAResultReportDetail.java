package com.globits.PI.domain;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.xml.bind.annotation.XmlRootElement;

import com.globits.core.domain.BaseObject;

@Entity
@Table(name = "tbl_eqa_result_report_detail")
@XmlRootElement
public class EQAResultReportDetail extends BaseObject {
	private static final long serialVersionUID = -5100199485809565238L;
	
	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "result_report_id")
	private EQAResultReport resultReport;//Thuộc báo cáo nào (bao gồm thông tin phương pháp xét nghiệm)
	
	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "sample_tube_id")
	private EQASampleTube sampleTube;//Tube nào
	
	@Column(name="order_number")
	private Integer orderNumber;	//Thứ tự trong chi tiết báo cáo
	
	@Column(name="result")//Kết quả xét nghiệm; giá trị: PIConst.EQASampleStatus: Âm tính, dương tính, không xác định
	private Integer result;
		
	@Column(name="note")
	private String note;//Ghi chú

	/**
	 * ELISA
	 * Giá trị ngưỡng
	 */
	@Column(name="cut_off")
	private Double cutOff;
	
	/**
	 * ELISA
	 * Giá trị OD mẫu
	 */
	@Column(name="od_value")
	private Double oDvalue;
	
	/**
	 * ELISA
	 * Tỉ số OD/cut-off
	 */
	@Column(name="ratio_od_and_cut_off")
	private Double ratioOdAndCutOff;
	
	/**
	 * ECLIA
	 * Giá trị mẫu S/CO
	 * @return
	 */
	@Column(name="s_co_value")
	private Double sCOvalue;
	
	/**
	 * serodia 
	 * Mức độ ngưng kết
	 * @return
	 */
	@Column(name="agglomeration")
	private Integer agglomeration;
	
	/**
	 * serodia 
	 * Giếng chứng
	 * @return
	 */
	@Column(name="check_value")
	private Integer checkValue;
	
	/**
	 * serodia 
	 * Giếng test
	 * @return
	 */
	@Column(name="test_value")
	private Integer testValue;
	
	/**
	 * Test nhanh
	 * Vạch chứng
	 * @return
	 * PIConst.EQASampleStatus
	 */
	@Column(name="c_line")
	private Integer cLine;
	
	/**
	 * Test nhanh
	 * Vạch test
	 * @return
	 * PIConst.EQASampleStatus
	 */
	@Column(name="t_line")
	private Integer tLine;
	
	public EQAResultReport getResultReport() {
		return resultReport;
	}

	public void setResultReport(EQAResultReport resultReport) {
		this.resultReport = resultReport;
	}

	public EQASampleTube getSampleTube() {
		return sampleTube;
	}

	public void setSampleTube(EQASampleTube sampleTube) {
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

}

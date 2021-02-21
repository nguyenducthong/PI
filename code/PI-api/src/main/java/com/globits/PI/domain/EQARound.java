package com.globits.PI.domain;

import java.util.Date;
import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.xml.bind.annotation.XmlRootElement;

import com.globits.core.domain.BaseObject;

@Entity
@Table(name = "tbl_eqa_round")
@XmlRootElement
public class EQARound extends BaseObject {
	private static final long serialVersionUID = -5100199485809565238L;
	
	@Column(name = "name")
	private String name;
	
	@Column(name = "code")
	private String code;
	
	@Column(name = "start_date")
	private Date startDate;
	
	@Column(name = "end_date")
	private Date endDate;
	
	@Column(name = "is_active")
	private Boolean isActive;
	
	@Column(name = "registration_start_date")
	private Date registrationStartDate; // Ngày bắt đầu đăng ký
	
	@Column(name = "registration_expiry_date")
	private Date registrationExpiryDate;// Ngày hết hạn đăng ký
	
	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "eqa_planning_id")
	private EQAPlanning eqaPlanning;
	
	@OneToMany(mappedBy = "eqaRound", fetch = FetchType.LAZY)
	private List<EQASampleSet> eqaSampleSet;
	
	@Column(name = "order_number")//Số thứ tự trong năm
	private Integer orderNumber;
	
	@Column(name = "sample_submission_deadline")
	private Date sampleSubmissionDeadline;// Hạn nộp mẫu
	
	@Column(name = "sample_number")
	private Integer sampleNumber;// số mẫu 1 vòng
	
	@Column(name = "sample_set_number")
	private Integer sampleSetNumber; //Số bộ mẫu
	
	@Column(name = "health_org_number")
	private Integer healthOrgNumber;// Số đơn vị tham gia
	
	@Column(name = "execution_time")
	private Date executionTime;//thời gian thực hiện
	
	@Column(name = "sample_characteristics")
	private String sampleCharacteristics; //Đặc tính mẫu
	
	public List<EQASampleSet> getEqaSampleSet() {
		return eqaSampleSet;
	}

	public void setEqaSampleSet(List<EQASampleSet> eqaSampleSet) {
		this.eqaSampleSet = eqaSampleSet;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code;
	}

	public Date getStartDate() {
		return startDate;
	}

	public void setStartDate(Date startDate) {
		this.startDate = startDate;
	}

	public Date getEndDate() {
		return endDate;
	}

	public void setEndDate(Date endDate) {
		this.endDate = endDate;
	}

	public EQAPlanning getEqaPlanning() {
		return eqaPlanning;
	}

	public void setEqaPlanning(EQAPlanning eqaPlanning) {
		this.eqaPlanning = eqaPlanning;
	}

	public Boolean getIsActive() {
		return isActive;
	}

	public void setIsActive(Boolean isActive) {
		this.isActive = isActive;
	}

	public Date getRegistrationStartDate() {
		return registrationStartDate;
	}

	public void setRegistrationStartDate(Date registrationStartDate) {
		this.registrationStartDate = registrationStartDate;
	}

	public Date getRegistrationExpiryDate() {
		return registrationExpiryDate;
	}

	public void setRegistrationExpiryDate(Date registrationExpiryDate) {
		this.registrationExpiryDate = registrationExpiryDate;
	}

	public Integer getOrderNumber() {
		return orderNumber;
	}

	public void setOrderNumber(Integer orderNumber) {
		this.orderNumber = orderNumber;
	}

	public Date getSampleSubmissionDeadline() {
		return sampleSubmissionDeadline;
	}
	
	public void setSampleSubmissionDeadline(Date sampleSubmissionDeadline) {
		this.sampleSubmissionDeadline = sampleSubmissionDeadline;
	}

	public Integer getSampleNumber() {
		return sampleNumber;
	}

	public void setSampleNumber(Integer sampleNumber) {
		this.sampleNumber = sampleNumber;
	}

	public Integer getSampleSetNumber() {
		return sampleSetNumber;
	}

	public void setSampleSetNumber(Integer sampleSetNumber) {
		this.sampleSetNumber = sampleSetNumber;
	}

	public Integer getHealthOrgNumber() {
		return healthOrgNumber;
	}

	public void setHealthOrgNumber(Integer healthOrgNumber) {
		this.healthOrgNumber = healthOrgNumber;
	}

	public Date getExecutionTime() {
		return executionTime;
	}

	public void setExecutionTime(Date executionTime) {
		this.executionTime = executionTime;
	}


	public String getSampleCharacteristics() {
		return sampleCharacteristics;
	}

	public void setSampleCharacteristics(String sampleCharacteristics) {
		this.sampleCharacteristics = sampleCharacteristics;
	}
	
}

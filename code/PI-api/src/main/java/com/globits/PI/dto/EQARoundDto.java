package com.globits.PI.dto;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import com.globits.PI.domain.EQARound;
import com.globits.PI.domain.EQASampleSet;
import com.globits.PI.domain.EQASampleSetDetail;
import com.globits.core.dto.BaseObjectDto;

public class EQARoundDto extends BaseObjectDto{
	private String name;
	private String code;
	private Date startDate;
	private Date endDate;
	private Boolean isActive;
	private Date registrationStartDate; // Ngày bắt đầu đăng ký
	private Date registrationExpiryDate;// Ngày hết hạn đăng ký
	private Integer numberSampleList;
	private Integer orderNumber;
	private EQAPlanningDto eqaPlanning;
	private Date sampleSubmissionDeadline;
	private Boolean isManualSetCode=false; // cho phép nhập tay. mã code
	private List<EQASampleSetDto> eqaSampleSet = new ArrayList<EQASampleSetDto>();
	private Integer sampleNumber;// Số mẫu
	private Integer sampleSetNumber;// Số bộ mẫu
	private Date executionTime;//Thời gian thực hiện
	private Integer healthOrgNumber;//Số đơn vị tham gia
	private String sampleCharacteristics; //Đặc tính mẫu
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
	public Integer getNumberSampleList() {
		return numberSampleList;
	}
	public void setNumberSampleList(Integer numberSampleList) {
		this.numberSampleList = numberSampleList;
	}
	public Integer getOrderNumber() {
		return orderNumber;
	}
	public void setOrderNumber(Integer orderNumber) {
		this.orderNumber = orderNumber;
	}
	public EQAPlanningDto getEqaPlanning() {
		return eqaPlanning;
	}
	public void setEqaPlanning(EQAPlanningDto eqaPlanning) {
		this.eqaPlanning = eqaPlanning;
	}
	public Date getSampleSubmissionDeadline() {
		return sampleSubmissionDeadline;
	}
	public void setSampleSubmissionDeadline(Date sampleSubmissionDeadline) {
		this.sampleSubmissionDeadline = sampleSubmissionDeadline;
	}
	public Boolean getIsManualSetCode() {
		return isManualSetCode;
	}
	public void setIsManualSetCode(Boolean isManualSetCode) {
		this.isManualSetCode = isManualSetCode;
	}
	public List<EQASampleSetDto> getEqaSampleSet() {
		return eqaSampleSet;
	}
	public void setEqaSampleSet(List<EQASampleSetDto> eqaSampleSet) {
		this.eqaSampleSet = eqaSampleSet;
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
	public Date getExecutionTime() {
		return executionTime;
	}
	public void setExecutionTime(Date executionTime) {
		this.executionTime = executionTime;
	}
	public Integer getHealthOrgNumber() {
		return healthOrgNumber;
	}
	public void setHealthOrgNumber(Integer healthOrgNumber) {
		this.healthOrgNumber = healthOrgNumber;
	}
	public String getSampleCharacteristics() {
		return sampleCharacteristics;
	}
	public void setSampleCharacteristics(String sampleCharacteristics) {
		this.sampleCharacteristics = sampleCharacteristics;
	}
	
	
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public EQARoundDto() {
	}
	
	public EQARoundDto(EQARound entity) {
		if (entity != null) {
			this.id = entity.getId();
			this.name = entity.getName();
			this.code = entity.getCode();
			this.startDate = entity.getStartDate();
			this.endDate = entity.getEndDate();
			this.isActive = entity.getIsActive();
			this.registrationStartDate = entity.getRegistrationStartDate();
			this.registrationExpiryDate = entity.getRegistrationExpiryDate();
			this.sampleSubmissionDeadline = entity.getSampleSubmissionDeadline();
			this.sampleNumber = entity.getSampleNumber();
			this.sampleSetNumber = entity.getSampleSetNumber();
			this.executionTime = entity.getExecutionTime();
			this.healthOrgNumber = entity.getHealthOrgNumber();
			this.orderNumber = entity.getOrderNumber();
			this.sampleCharacteristics = entity.getSampleCharacteristics();
			if (entity.getEqaPlanning() != null) {
				this.eqaPlanning = new EQAPlanningDto(entity.getEqaPlanning(), true);
			}
		
			if (entity.getEqaSampleSet() != null && entity.getEqaSampleSet().size() > 0) {
				for (EQASampleSet eqaSampleSet : entity.getEqaSampleSet()) {
					EQASampleSetDto dto  = new EQASampleSetDto();
					dto.setCode(eqaSampleSet.getCode());
					dto.setId(eqaSampleSet.getId());
					dto.setName(eqaSampleSet.getName());
					Set<EQASampleSetDetailDto> eQASampleSetDetailDtos = new HashSet<EQASampleSetDetailDto>();
					if (eqaSampleSet.getDetails() != null && eqaSampleSet.getDetails().size() > 0) {
						for (EQASampleSetDetail eqaSampleSetDetail : eqaSampleSet.getDetails()) {
							EQASampleSetDetailDto eQASampleSetDetailDto = new EQASampleSetDetailDto(eqaSampleSetDetail, false);
							eQASampleSetDetailDtos.add(eQASampleSetDetailDto);
						}
						dto.setDetails(eQASampleSetDetailDtos);
					}
					this.eqaSampleSet.add(dto);
				}
			}
		}
	}
	public EQARoundDto(EQARound entity, Boolean simple) {
		if (entity != null) {
			this.id = entity.getId();
			this.name = entity.getName();
			this.code = entity.getCode();
			this.startDate = entity.getStartDate();
			this.endDate = entity.getEndDate();
			this.isActive = entity.getIsActive();
			this.registrationStartDate = entity.getRegistrationStartDate();
			this.registrationExpiryDate = entity.getRegistrationExpiryDate();
			this.sampleNumber = entity.getSampleNumber();
			this.sampleSetNumber = entity.getSampleSetNumber();
			this.executionTime = entity.getExecutionTime();
			this.healthOrgNumber = entity.getHealthOrgNumber();
			this.sampleNumber = entity.getSampleNumber();
			this.sampleSetNumber = entity.getSampleSetNumber();
			this.executionTime = entity.getExecutionTime();
			this.healthOrgNumber = entity.getHealthOrgNumber();
			this.orderNumber = entity.getOrderNumber();
			this.sampleCharacteristics = entity.getSampleCharacteristics();
			if (entity.getEqaPlanning() != null) {
				this.eqaPlanning = new EQAPlanningDto(entity.getEqaPlanning(), true);
			}
		}
	}

}

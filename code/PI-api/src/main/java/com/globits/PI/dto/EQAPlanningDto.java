package com.globits.PI.dto;

import java.util.Date;

import com.globits.PI.domain.EQAPlanning;
import com.globits.core.dto.BaseObjectDto;

public class EQAPlanningDto extends BaseObjectDto {
	private String name;
	private String code;
	private Integer year;
	private String type;
	private String objectives;
	private int numberOfRound;
	private Date startDate;
	private Date endDate;
	private double fee;//Phí tham dự
	private Boolean isManualSetCode=false; // cho phép nhập tay. mã code

	public double getFee() {
		return fee;
	}

	public void setFee(double fee) {
		this.fee = fee;
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

	public Integer getYear() {
		return year;
	}

	public void setYear(Integer year) {
		this.year = year;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public String getObjectives() {
		return objectives;
	}

	public void setObjectives(String objectives) {
		this.objectives = objectives;
	}

	public int getNumberOfRound() {
		return numberOfRound;
	}

	public void setNumberOfRound(int numberOfRound) {
		this.numberOfRound = numberOfRound;
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

	public Boolean getIsManualSetCode() {
		return isManualSetCode;
	}

	public void setIsManualSetCode(Boolean isManualSetCode) {
		this.isManualSetCode = isManualSetCode;
	}


	public EQAPlanningDto() {
	}

	public EQAPlanningDto(EQAPlanning entity) {
		if (entity != null) {
			this.id = entity.getId();
			this.name = entity.getName();
			this.code = entity.getCode();
			this.year = entity.getYear();
			this.type = entity.getType();
			this.objectives = entity.getObjectives();
			this.numberOfRound = entity.getNumberOfRound();
			this.startDate = entity.getStartDate();
			this.endDate = entity.getEndDate();
			this.fee = entity.getFee();	
		}
	}
	
	public EQAPlanningDto(EQAPlanning entity, Boolean simple) {
		if (entity != null) {
			this.id = entity.getId();
			this.name = entity.getName();
			this.code = entity.getCode();
			this.year = entity.getYear();
			this.type = entity.getType();
			this.objectives = entity.getObjectives();
			this.numberOfRound = entity.getNumberOfRound();
			this.startDate = entity.getStartDate();
			this.endDate = entity.getEndDate();
			this.fee = entity.getFee();

		}
	}

}

package com.globits.PI.dto;

import com.globits.PI.domain.EQASampleSetDetail;
import com.globits.core.dto.BaseObjectDto;

public class EQASampleSetDetailDto extends BaseObjectDto{
	private String name;
	private String code;
	private EQASampleDto sample;
	private EQASampleSetDto sampleSet;
	private int orderNumber;
	private String sampleCode;
	private Integer sampleResult;
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
	public EQASampleDto getSample() {
		return sample;
	}
	public void setSample(EQASampleDto sample) {
		this.sample = sample;
	}
	public EQASampleSetDto getSampleSet() {
		return sampleSet;
	}
	public void setSampleSet(EQASampleSetDto sampleSet) {
		this.sampleSet = sampleSet;
	}
	public int getOrderNumber() {
		return orderNumber;
	}
	public void setOrderNumber(int orderNumber) {
		this.orderNumber = orderNumber;
	}
	
	public String getSampleCode() {
		return sampleCode;
	}
	public void setSampleCode(String sampleCode) {
		this.sampleCode = sampleCode;
	}
	public Integer getSampleResult() {
		return sampleResult;
	}
	public void setSampleResult(Integer sampleResult) {
		this.sampleResult = sampleResult;
	}
	public EQASampleSetDetailDto() {
	}
	
	public EQASampleSetDetailDto(EQASampleSetDetail entity) {
		if (entity != null) {
			this.id = entity.getId();
			this.name = entity.getName();
			this.code = entity.getCode();
			this.orderNumber = entity.getOrderNumber();
			
			if (entity.getSample() != null) {
				this.sample = new EQASampleDto(entity.getSample(), false);
				this.sampleCode = entity.getSample().getCode();
				this.sampleResult = entity.getSample().getResult();
			}
			if (entity.getSampleSet() != null) {
				this.sampleSet = new EQASampleSetDto(entity.getSampleSet(), false);
			}
		}
	}
	
	public EQASampleSetDetailDto(EQASampleSetDetail entity, boolean simple) {
		if (entity != null) {
			this.id = entity.getId();
			this.name = entity.getName();
			this.code = entity.getCode();
			this.orderNumber = entity.getOrderNumber();
			if (entity.getSample() != null) {
				this.sample = new EQASampleDto();
				this.sample.setId(entity.getSample().getId());
				
				this.sampleCode = entity.getSample().getCode();
				this.sampleResult = entity.getSample().getResult();
			}
		}
	}
}

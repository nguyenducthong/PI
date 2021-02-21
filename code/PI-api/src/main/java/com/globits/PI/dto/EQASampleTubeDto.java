package com.globits.PI.dto;

import com.globits.PI.domain.EQASampleTube;
import com.globits.core.dto.BaseObjectDto;

public class EQASampleTubeDto extends BaseObjectDto{
	private String name;
	private String code;
	private String note;
	private double volume;
	private EQASampleDto eqaSample;
	private EQASerumBottleDto eqaSerumBottle;
	private EQARoundDto eqaRound;
	private HealthOrgEQARoundDto healthOrgEQARound;
	private EQASampleSetDetailDto eqaSampleSetDetail;
	private HealthOrgDto healthOrg;
	private Integer lastResultFromLab;
	private int type;
	private int status;
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
	public String getNote() {
		return note;
	}
	public void setNote(String note) {
		this.note = note;
	}
	public double getVolume() {
		return volume;
	}
	public void setVolume(double volume) {
		this.volume = volume;
	}
	public EQASampleDto getEqaSample() {
		return eqaSample;
	}
	public void setEqaSample(EQASampleDto eqaSample) {
		this.eqaSample = eqaSample;
	}
	public EQARoundDto getEqaRound() {
		return eqaRound;
	}
	public void setEqaRound(EQARoundDto eqaRound) {
		this.eqaRound = eqaRound;
	}	
	public int getType() {
		return type;
	}
	public void setType(int type) {
		this.type = type;
	}
	public int getStatus() {
		return status;
	}
	public void setStatus(int status) {
		this.status = status;
	}
	
	public Integer getLastResultFromLab() {
		return lastResultFromLab;
	}
	public void setLastResultFromLab(Integer lastResultFromLab) {
		this.lastResultFromLab = lastResultFromLab;
	}
	
	public HealthOrgEQARoundDto getHealthOrgEQARound() {
		return healthOrgEQARound;
	}
	public void setHealthOrgEQARound(HealthOrgEQARoundDto healthOrgEQARound) {
		this.healthOrgEQARound = healthOrgEQARound;
	}
	public EQASampleSetDetailDto getEqaSampleSetDetail() {
		return eqaSampleSetDetail;
	}
	public void setEqaSampleSetDetail(EQASampleSetDetailDto eqaSampleSetDetail) {
		this.eqaSampleSetDetail = eqaSampleSetDetail;
	}
	
	public HealthOrgDto getHealthOrg() {
		return healthOrg;
	}
	public void setHealthOrg(HealthOrgDto healthOrg) {
		this.healthOrg = healthOrg;
	}
	public EQASampleTubeDto() {
	}

	public EQASerumBottleDto getEqaSerumBottle() {
		return eqaSerumBottle;
	}

	public void setEqaSerumBottle(EQASerumBottleDto eqaSerumBottle) {
		this.eqaSerumBottle = eqaSerumBottle;
	}

	public EQASampleTubeDto(EQASampleTube entity) {
		if (entity != null) {
			this.id = entity.getId();
			this.name = entity.getName();
			this.code = entity.getCode();
			this.note = entity.getNote();
			this.volume = entity.getVolume();
			this.status = entity.getStatus();
			this.type = entity.getType();
			this.lastResultFromLab = entity.getLastResultFromLab();
			if (entity.getEqaSample() != null) {
				this.eqaSample = new EQASampleDto(entity.getEqaSample(),true);
			}
			if (entity.getEqaRound() != null) {
				this.eqaRound = new EQARoundDto(entity.getEqaRound(),true);
			}
			if (entity.getHealthOrgEQARound() != null) {
				this.healthOrgEQARound = new HealthOrgEQARoundDto(entity.getHealthOrgEQARound(),true);
			}
			if (entity.getSampleSetDetail() != null) {
				this.eqaSampleSetDetail = new EQASampleSetDetailDto(entity.getSampleSetDetail(),true);
			}
			if (entity.getHealthOrg() != null) {
				this.healthOrg = new HealthOrgDto(entity.getHealthOrg(),true);
			}
			if (entity.getEqaSerumBottle() != null){
				this.eqaSerumBottle = new EQASerumBottleDto(entity.getEqaSerumBottle(),true);
			}

		}
	}

	public EQASampleTubeDto(EQASampleTube entity, boolean simple) {
		if (entity != null) {
			this.id = entity.getId();
			this.name = entity.getName();
			this.code = entity.getCode();
			this.note = entity.getNote();
			this.volume = entity.getVolume();
			this.status = entity.getStatus();
			this.type = entity.getType();
			this.lastResultFromLab = entity.getLastResultFromLab();
			if (entity.getEqaSample() != null) {
				this.eqaSample = new EQASampleDto(entity.getEqaSample(), false);
			}
		}
	}

}

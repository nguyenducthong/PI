package com.globits.PI.dto;

import java.util.HashSet;
import java.util.Set;

import com.globits.PI.domain.EQASampleSet;
import com.globits.PI.domain.EQASampleSetDetail;
import com.globits.core.dto.BaseObjectDto;

public class EQASampleSetDto extends BaseObjectDto{
	private String name;
	private String code;
	private EQARoundDto eqaRound;
	private Set<EQASampleSetDetailDto> details;//Danh sách chi tiết các mẫu
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
	public EQARoundDto getEqaRound() {
		return eqaRound;
	}
	public void setEqaRound(EQARoundDto eqaRound) {
		this.eqaRound = eqaRound;
	}
	public Set<EQASampleSetDetailDto> getDetails() {
		return details;
	}
	public void setDetails(Set<EQASampleSetDetailDto> details) {
		this.details = details;
	}
	
	public EQASampleSetDto() {
	}

	public EQASampleSetDto(EQASampleSet entity) {
		if (entity != null) {
			this.id = entity.getId();
			this.name = entity.getName();
			this.code = entity.getCode();
			if (entity.getEqaRound() != null) {
				this.eqaRound = new EQARoundDto(entity.getEqaRound());
			}
			
			this.details = new HashSet<EQASampleSetDetailDto>();
			
			if (entity.getDetails() != null && entity.getDetails().size() > 0) {
				for (EQASampleSetDetail eqaSampleSetDetail : entity.getDetails()) {
					EQASampleSetDetailDto dto = new EQASampleSetDetailDto(eqaSampleSetDetail, false);
					this.details.add(dto);
				}
			}
		}
	}

	public EQASampleSetDto(EQASampleSet entity, boolean simple) {
		if (entity != null) {
			this.id = entity.getId();
			this.name = entity.getName();
			this.code = entity.getCode();
		}
	}
}

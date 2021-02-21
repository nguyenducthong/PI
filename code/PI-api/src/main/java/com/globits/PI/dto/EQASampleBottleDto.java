package com.globits.PI.dto;

import com.globits.PI.domain.EQASampleBottle;
import com.globits.core.dto.BaseObjectDto;

public class EQASampleBottleDto extends BaseObjectDto{
	private EQASampleDto eQASample;
	private EQASerumBottleDto eQASerumBottle;
	
	public EQASampleDto geteQASample() {
		return eQASample;
	}
	public void seteQASample(EQASampleDto eQASample) {
		this.eQASample = eQASample;
	}
	public EQASerumBottleDto geteQASerumBottle() {
		return eQASerumBottle;
	}
	public void seteQASerumBottle(EQASerumBottleDto eQASerumBottle) {
		this.eQASerumBottle = eQASerumBottle;
	}
	public EQASampleBottleDto() {
		super();
	}

	public EQASampleBottleDto(EQASampleBottle entity) {
		super();
		if (entity != null) {
			this.id = entity.getId();
			if (entity.geteQASample() != null) {
				this.eQASample = new EQASampleDto(entity.geteQASample(), false);
			}
			if (entity.geteQASerumBottle() != null) {
				this.eQASerumBottle = new EQASerumBottleDto(entity.geteQASerumBottle(), true);
			}
		}
	}
}

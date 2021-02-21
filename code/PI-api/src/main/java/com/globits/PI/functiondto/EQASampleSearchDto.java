package com.globits.PI.functiondto;

import java.util.UUID;

public class EQASampleSearchDto extends SearchDto {
	private UUID eqaRoundId;

	public UUID getEqaRoundId() {
		return eqaRoundId;
	}

	public void setEqaRoundId(UUID eqaRoundId) {
		this.eqaRoundId = eqaRoundId;
	}

}

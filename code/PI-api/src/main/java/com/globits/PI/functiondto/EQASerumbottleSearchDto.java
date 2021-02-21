package com.globits.PI.functiondto;

import java.util.UUID;

public class EQASerumbottleSearchDto extends SearchDto {
	private UUID eqaSerumBankId;
	private Boolean checkBottle;
	public UUID getEqaSerumBankId() {
		return eqaSerumBankId;
	}

	public void setEqaSerumBankId(UUID eqaSerumBankId) {
		this.eqaSerumBankId = eqaSerumBankId;
	}

	public Boolean getCheckBottle() {
		return checkBottle;
	}

	public void setCheckBottle(Boolean checkBottle) {
		this.checkBottle = checkBottle;
	}
	
}

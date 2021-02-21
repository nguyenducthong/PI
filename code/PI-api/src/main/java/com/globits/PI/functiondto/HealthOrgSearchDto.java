package com.globits.PI.functiondto;

import java.util.UUID;

public class HealthOrgSearchDto extends SearchDto {
	private UUID eqaRoundId;
	private UUID administrativeUnitId;
	private Boolean isManagementUnit;
	public UUID getAdministrativeUnitId() {
		return administrativeUnitId;
	}

	public void setAdministrativeUnitId(UUID administrativeUnitId) {
		this.administrativeUnitId = administrativeUnitId;
	}

	public UUID getEqaRoundId() {
		return eqaRoundId;
	}

	public void setEqaRoundId(UUID eqaRoundId) {
		this.eqaRoundId = eqaRoundId;
	}

	public Boolean getIsManagementUnit() {
		return isManagementUnit;
	}

	public void setIsManagementUnit(Boolean isManagementUnit) {
		this.isManagementUnit = isManagementUnit;
	}
	
	

}

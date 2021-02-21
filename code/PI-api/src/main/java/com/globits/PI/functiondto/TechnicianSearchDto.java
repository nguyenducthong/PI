package com.globits.PI.functiondto;

import com.globits.PI.dto.HealthOrgDto;

public class TechnicianSearchDto extends SearchDto {
	private HealthOrgDto healthOrg;
	private Boolean searchByHealthOrg = false; //Nếu đẩy lên true bắt buộc phải tìm theo healthOrg và healthOrg đấy lên null thì trả về null.

	public HealthOrgDto getHealthOrg() {
		return healthOrg;
	}

	public void setHealthOrg(HealthOrgDto healthOrg) {
		this.healthOrg = healthOrg;
	}

	public Boolean getSearchByHealthOrg() {
		return searchByHealthOrg;
	}

	public void setSearchByHealthOrg(Boolean searchByHealthOrg) {
		this.searchByHealthOrg = searchByHealthOrg;
	}

}

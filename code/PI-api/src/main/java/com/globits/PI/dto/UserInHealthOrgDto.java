package com.globits.PI.dto;

import com.globits.PI.domain.UserInHealthOrg;
import com.globits.core.dto.BaseObjectDto;
import com.globits.security.dto.UserDto;

public class UserInHealthOrgDto extends BaseObjectDto{
	private UserDto user;
	private HealthOrgDto healthOrg;
	
	public UserDto getUser() {
		return user;
	}
	public void setUser(UserDto user) {
		this.user = user;
	}
	public HealthOrgDto getHealthOrg() {
		return healthOrg;
	}
	public void setHealthOrg(HealthOrgDto healthOrg) {
		this.healthOrg = healthOrg;
	}
	
	public UserInHealthOrgDto() {
		super();
	}

	public UserInHealthOrgDto(UserInHealthOrg entity) {
		super();
		if (entity != null) {
			this.id = entity.getId();
			if (entity.getUser() != null) {
				this.user = new UserDto(entity.getUser());
			}
			
			if (entity.getHealthOrg() != null) {
				this.healthOrg = new HealthOrgDto(entity.getHealthOrg());
			}
		}
	}

	public UserInHealthOrgDto(UserInHealthOrg entity, boolean simple) {
		super();
		if (entity != null) {
			this.id = entity.getId();
			if (entity.getUser() != null) {
				this.user = new UserDto(entity.getUser());
			}
			
			if (entity.getHealthOrg() != null) {
				this.healthOrg = new HealthOrgDto(entity.getHealthOrg(), false);
			}
		}
	}
	
}

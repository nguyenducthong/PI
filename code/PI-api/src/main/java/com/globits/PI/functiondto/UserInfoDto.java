package com.globits.PI.functiondto;

import java.util.List;
import java.util.UUID;

import com.globits.PI.domain.HealthOrg;
import com.globits.PI.domain.UserInHealthOrg;
import com.globits.security.domain.User;

public class UserInfoDto {
	private User user;
	private HealthOrg healthOrg;

	private Boolean isRoleAdmin = false;

	private Boolean isRoleUser = false;
	
	private Boolean isRoleAdiministrativeStaff = false;

	private Boolean isRoleHealthOrg = false;
	
	private Boolean isRoleStaff = false;

	private List<UserInHealthOrg> listUserInHealthOrg;
	
	private List<UUID> listUserInHealthOrgId;
	
	private List<UUID> listHealthOrgId;
	
	public User getUser() {
		return user;
	}

	public void setUser(User user) {
		this.user = user;
	}

	public HealthOrg getHealthOrg() {
		return healthOrg;
	}

	public void setHealthOrg(HealthOrg healthOrg) {
		this.healthOrg = healthOrg;
	}

	public Boolean getIsRoleAdmin() {
		return isRoleAdmin;
	}

	public void setIsRoleAdmin(Boolean isRoleAdmin) {
		this.isRoleAdmin = isRoleAdmin;
	}

	public Boolean getIsRoleAdiministrativeStaff() {
		return isRoleAdiministrativeStaff;
	}

	public void setIsRoleAdiministrativeStaff(Boolean isRoleAdiministrativeStaff) {
		this.isRoleAdiministrativeStaff = isRoleAdiministrativeStaff;
	}

	public Boolean getIsRoleStaff() {
		return isRoleStaff;
	}

	public void setIsRoleStaff(Boolean isRoleStaff) {
		this.isRoleStaff = isRoleStaff;
	}

	public Boolean getIsRoleUser() {
		return isRoleUser;
	}

	public void setIsRoleUser(Boolean isRoleUser) {
		this.isRoleUser = isRoleUser;
	}

	public Boolean getIsRoleHealthOrg() {
		return isRoleHealthOrg;
	}

	public void setIsRoleHealthOrg(Boolean isRoleHealthOrg) {
		this.isRoleHealthOrg = isRoleHealthOrg;
	}

	public List<UserInHealthOrg> getListUserInHealthOrg() {
		return listUserInHealthOrg;
	}

	public void setListUserInHealthOrg(List<UserInHealthOrg> listUserInHealthOrg) {
		this.listUserInHealthOrg = listUserInHealthOrg;
	}

	public List<UUID> getListUserInHealthOrgId() {
		return listUserInHealthOrgId;
	}

	public void setListUserInHealthOrgId(List<UUID> listUserInHealthOrgId) {
		this.listUserInHealthOrgId = listUserInHealthOrgId;
	}

	public List<UUID> getListHealthOrgId() {
		return listHealthOrgId;
	}

	public void setListHealthOrgId(List<UUID> listHealthOrgId) {
		this.listHealthOrgId = listHealthOrgId;
	}
	
	
}

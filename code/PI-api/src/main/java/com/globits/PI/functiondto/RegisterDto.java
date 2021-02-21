package com.globits.PI.functiondto;

import com.globits.PI.dto.EQARoundDto;
import com.globits.PI.dto.HealthOrgDto;

public class RegisterDto  {
	private EQARoundDto eqaRound;
	private HealthOrgDto healthOrg;
	private String username;
	private String email;
	private String password;
	private Boolean duplicateEmail =false;
	private Boolean sendEmailFailed = false;
	
	public Boolean getSendEmailFailed() {
		return sendEmailFailed;
	}
	public void setSendEmailFailed(Boolean sendEmailFailed) {
		this.sendEmailFailed = sendEmailFailed;
	}
	public Boolean getDuplicateEmail() {
		return duplicateEmail;
	}
	public void setDuplicateEmail(Boolean duplicateEmail) {
		this.duplicateEmail = duplicateEmail;
	}
	public EQARoundDto getEqaRound() {
		return eqaRound;
	}
	public void setEqaRound(EQARoundDto eqaRound) {
		this.eqaRound = eqaRound;
	}
	public String getUsername() {
		return username;
	}
	public void setUsername(String username) {
		this.username = username;
	}
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	public String getPassword() {
		return password;
	}
	public void setPassword(String password) {
		this.password = password;
	}
	public HealthOrgDto getHealthOrg() {
		return healthOrg;
	}
	public void setHealthOrg(HealthOrgDto healthOrg) {
		this.healthOrg = healthOrg;
	}
	public RegisterDto() {
		super();
	}
	
}

package com.globits.PI.dto;

import java.util.Date;

import com.globits.PI.domain.Reagent;
import com.globits.core.dto.BaseObjectDto;

public class ReagentDto extends BaseObjectDto{
	private String code;
	private String name;
	private String description;
	private String registrationNumber;//Số đăng ký
	private Date dateOfIssue; //Ngày cấp
	private Date expirationDate; //Ngày hết hạn
	private String activeIngredients; //Hoạt chất
	private String dosageForms; //Dạng bào chế
	private String packing; //Quy cách đóng gói
	private String registeredFacilityName; //Tên cơ sở đăng ký
	private String productionFacilityName; //Tên cơ sở sản xuất
	private Boolean healthDepartmentDirectory; //Thuộc danh mục bộ y tế
	private Integer testType; //Sinh phẩm thuộc phương pháp
	public String getActiveIngredients() {
		return activeIngredients;
	}
	public void setActiveIngredients(String activeIngredients) {
		this.activeIngredients = activeIngredients;
	}
	public String getDosageForms() {
		return dosageForms;
	}
	public void setDosageForms(String dosageForms) {
		this.dosageForms = dosageForms;
	}
	public String getPacking() {
		return packing;
	}
	public void setPacking(String packing) {
		this.packing = packing;
	}
	public String getRegisteredFacilityName() {
		return registeredFacilityName;
	}
	public void setRegisteredFacilityName(String registeredFacilityName) {
		this.registeredFacilityName = registeredFacilityName;
	}
	public String getProductionFacilityName() {
		return productionFacilityName;
	}
	public void setProductionFacilityName(String productionFacilityName) {
		this.productionFacilityName = productionFacilityName;
	}
	public String getCode() {
		return code;
	}
	public void setCode(String code) {
		this.code = code;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	
	public String getRegistrationNumber() {
		return registrationNumber;
	}
	public void setRegistrationNumber(String registrationNumber) {
		this.registrationNumber = registrationNumber;
	}
	public Date getDateOfIssue() {
		return dateOfIssue;
	}
	public void setDateOfIssue(Date dateOfIssue) {
		this.dateOfIssue = dateOfIssue;
	}
	public Date getExpirationDate() {
		return expirationDate;
	}
	public void setExpirationDate(Date expirationDate) {
		this.expirationDate = expirationDate;
	}
	
	public Boolean getHealthDepartmentDirectory() {
		return healthDepartmentDirectory;
	}
	public void setHealthDepartmentDirectory(Boolean healthDepartmentDirectory) {
		this.healthDepartmentDirectory = healthDepartmentDirectory;
	}
	public Integer getTestType() {
		return testType;
	}
	public void setTestType(Integer testType) {
		this.testType = testType;
	}
	
	public ReagentDto() {
	}

	public ReagentDto(Reagent entity) {
		if (entity != null) {
			this.id = entity.getId();
			this.name = entity.getName();
			this.description = entity.getDescription();
			this.code = entity.getCode();
			this.registrationNumber = entity.getRegistrationNumber();
			this.dateOfIssue = entity.getDateOfIssue();
			this.expirationDate = entity.getExpirationDate();
			this.activeIngredients = entity.getActiveIngredients();
			this.dosageForms = entity.getDosageForms();
			this.packing = entity.getPacking();
			this.registeredFacilityName = entity.getRegisteredFacilityName();
			this.productionFacilityName = entity.getProductionFacilityName();
			this.testType = entity.getTestType();
		}
	}
	
	public ReagentDto(Reagent entity,Boolean simple) {
		if (entity != null) {
			this.id = entity.getId();
			this.name = entity.getName();
			this.description = entity.getDescription();
			this.code = entity.getCode();
			this.registrationNumber = entity.getRegistrationNumber();
			this.dateOfIssue = entity.getDateOfIssue();
			this.expirationDate = entity.getExpirationDate();
			this.activeIngredients = entity.getActiveIngredients();
			this.dosageForms = entity.getDosageForms();
			this.packing = entity.getPacking();
			this.registeredFacilityName = entity.getRegisteredFacilityName();
			this.testType = entity.getTestType();
			this.productionFacilityName = entity.getProductionFacilityName();
		}
	}
}

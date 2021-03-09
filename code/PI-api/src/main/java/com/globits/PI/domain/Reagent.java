package com.globits.PI.domain;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;
import javax.xml.bind.annotation.XmlRootElement;

import com.globits.core.domain.BaseObject;

@Entity
@Table(name = "tbl_eqa_reagent")
@XmlRootElement
public class Reagent extends BaseObject {
	private static final long serialVersionUID = -5100199485809565238L;
	@Column(name="name")
	private String name;
	@Column(name="code")
	private String code;
	@Column(name="description")//Mô tả
	private String description;

	@Column(name="registration_number")
	private String registrationNumber;//Số đăng ký
	
	@Column(name="date_of_issue")
	private Date dateOfIssue; //Ngày cấp
	
	@Column(name="expiration_date")
	private Date expirationDate; //Ngày hết hạn
	
	@Column(name="active_ingredients")
	private String activeIngredients; //Hoạt chất
	
	@Column(name="dosage_forms")
	private String dosageForms; //Dạng bào chế
	
	@Column(name="packing")
	private String packing; //Quy cách đóng gói
	
	@Column(name="registered_facility_name")
	private String registeredFacilityName; //Tên cơ sở đăng ký
	
	@Column(name="production_facility_name")
	private String productionFacilityName; //Tên cơ sở sản xuất

	@Column(name = "test_type")
	private Integer testType; //Loại xét nghiệm
	
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
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	
	public Integer getTestType() {
		return testType;
	}
	public void setTestType(Integer testType) {
		this.testType = testType;
	}
	public Reagent() {
		super();
	}
}

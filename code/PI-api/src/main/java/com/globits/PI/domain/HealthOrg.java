package com.globits.PI.domain;

import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.xml.bind.annotation.XmlRootElement;


import com.globits.core.domain.AdministrativeUnit;
import com.globits.core.domain.BaseObject;

@Entity
@Table(name = "tbl_eqa_health_org")
@XmlRootElement
public class HealthOrg  extends BaseObject {
	private static final long serialVersionUID = -5100199485809565238L;
	@Column(name="name")//Tên đơn vị
	private String name;
	
	@Column(name="code")//Mã đơn vị
	private String code;
	
	@Column(name="description")//Mô tả
	private String description;
	
	@ManyToOne( optional = true, fetch = FetchType.EAGER)
	@JoinColumn(name = "administrative_unit_id", unique = false)
	private AdministrativeUnit administrativeUnit;
	

	@Column(name="contactName")//Cán bộ phụ trách
	private String contactName;
	
	@Column(name="contactPhone")//Điện thoại liên hệ
	private String contactPhone;
	
	@Column(name="address")//Địa chỉ
	private String address;
	
//	@Column(name="qualification")//Trình độ
//	private String qualification;
	
	@Column(name="email")//email
	private String email;

	
	@Column(name="specify_level")//Ghi rõ cấp độ phòng xét nghiệm
	private String specifyLevel;
	
	@Column(name="tax_code_of_the_unit")
	private String taxCodeOfTheUnit;//Mã số thuế của đơn vị
	
	@Column(name="unit_code_of_program_peqas")
	private String unitCodeOfProgramPEQAS;//Mã số đơn vị của chương trình PEQAS
	
	@Column(name="officer_posion")
	private String officerPosion;//Chức vụ
	
	@Column(name="fax")
	private String fax;//fax

	@OneToMany(mappedBy = "healthOrg", fetch = FetchType.EAGER, cascade = CascadeType.ALL, orphanRemoval = true)
	private Set<UserInHealthOrg> listUser;//Danh sách user của đơn vị
	
	@Column(name="order_number")
	private Integer orderNumber;
	
	public String getTaxCodeOfTheUnit() {
		return taxCodeOfTheUnit;
	}

	public void setTaxCodeOfTheUnit(String taxCodeOfTheUnit) {
		this.taxCodeOfTheUnit = taxCodeOfTheUnit;
	}

	public String getUnitCodeOfProgramPEQAS() {
		return unitCodeOfProgramPEQAS;
	}

	public void setUnitCodeOfProgramPEQAS(String unitCodeOfProgramPEQAS) {
		this.unitCodeOfProgramPEQAS = unitCodeOfProgramPEQAS;
	}

	public String getOfficerPosion() {
		return officerPosion;
	}

	public void setOfficerPosion(String officerPosion) {
		this.officerPosion = officerPosion;
	}

	public String getFax() {
		return fax;
	}

	public void setFax(String fax) {
		this.fax = fax;
	}

	public Integer getOrderNumber() {
		return orderNumber;
	}

	public void setOrderNumber(Integer orderNumber) {
		this.orderNumber = orderNumber;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getSpecifyLevel() {
		return specifyLevel;
	}

	public void setSpecifyLevel(String specifyLevel) {
		this.specifyLevel = specifyLevel;
	}

//	public String getQualification() {
//		return qualification;
//	}
//
//	public void setQualification(String qualification) {
//		this.qualification = qualification;
//	}

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

	public AdministrativeUnit getAdministrativeUnit() {
		return administrativeUnit;
	}

	public void setAdministrativeUnit(AdministrativeUnit administrativeUnit) {
		this.administrativeUnit = administrativeUnit;
	}


	public String getContactName() {
		return contactName;
	}

	public void setContactName(String contactName) {
		this.contactName = contactName;
	}

	public String getContactPhone() {
		return contactPhone;
	}

	public void setContactPhone(String contactPhone) {
		this.contactPhone = contactPhone;
	}

	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
	}

	public Set<UserInHealthOrg> getListUser() {
		return listUser;
	}

	public void setListUser(Set<UserInHealthOrg> listUser) {
		this.listUser = listUser;
	}


}

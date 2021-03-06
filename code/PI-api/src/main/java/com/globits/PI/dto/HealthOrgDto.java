package com.globits.PI.dto;

import java.util.Date;
import java.util.HashSet;
import java.util.Set;

import com.globits.PI.domain.HealthOrg;
import com.globits.PI.domain.UserInHealthOrg;
import com.globits.core.dto.AdministrativeUnitDto;
import com.globits.core.dto.BaseObjectDto;

public class HealthOrgDto extends BaseObjectDto{
	private String name;
	private String code;
	private String description;
	private AdministrativeUnitDto administrativeUnit;
	private String contactName;
	private String contactPhone;
	private String address;
	private String specifyQualification;//Ghi rõ trình độ
	private String email;//email
	private Boolean positiveAffirmativeRight;//Phòng xét nghiệm đã được quyền khẳng định dương tính HIV hay chưa?
	private String specifyLevel;//Ghi rõ cấp độ phòng xét nghiệm
	private String specifyTestPurpose;//Ghi rõ mục đích xét nghiệm
	private Date sampleReceiptDate;//Ngày nhận mẫu
	private String sampleRecipient;//Người nhận mẫu
	private Integer sampleStatus;//Tình trạng mẫu
	private String specifySampleStatus;//Ghi rõ tình trạng mẫu
	private String taxCodeOfTheUnit;//Mã số thuế của đơn vị
	private String unitCodeOfProgramPEQAS;//Mã số đơn vị của chương trình PEQAS
	private String officerPosion;//Chức vụ
	private String fax;//fax
	private Integer orderNumber;
	private Set<UserInHealthOrgDto> listUser;//Danh sách user của đơn vị;
	private String password;
	private String qualificationName;//Trình độ
	private String levelName;//Trình độ
	private String testPurposeName1;//Mục đích xét nghiệm 1
	private String testPurposeName2;//Mục đích xét nghiệm 2
	private String testPurposeName3;//Mục đích xét nghiệm 3
	private String testPurposeName4;//Mục đích xét nghiệm 4
	private Boolean isManualSetCode=false;
	
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

	public String getSpecifyQualification() {
		return specifyQualification;
	}
	public void setSpecifyQualification(String specifyQualification) {
		this.specifyQualification = specifyQualification;
	}
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	public Boolean getPositiveAffirmativeRight() {
		return positiveAffirmativeRight;
	}
	public void setPositiveAffirmativeRight(Boolean positiveAffirmativeRight) {
		this.positiveAffirmativeRight = positiveAffirmativeRight;
	}

	public String getSpecifyLevel() {
		return specifyLevel;
	}
	public void setSpecifyLevel(String specifyLevel) {
		this.specifyLevel = specifyLevel;
	}
	public String getSpecifyTestPurpose() {
		return specifyTestPurpose;
	}
	public void setSpecifyTestPurpose(String specifyTestPurpose) {
		this.specifyTestPurpose = specifyTestPurpose;
	}
	public Date getSampleReceiptDate() {
		return sampleReceiptDate;
	}
	public void setSampleReceiptDate(Date sampleReceiptDate) {
		this.sampleReceiptDate = sampleReceiptDate;
	}
	public String getSampleRecipient() {
		return sampleRecipient;
	}
	public void setSampleRecipient(String sampleRecipient) {
		this.sampleRecipient = sampleRecipient;
	}
	public Integer getSampleStatus() {
		return sampleStatus;
	}
	public void setSampleStatus(Integer sampleStatus) {
		this.sampleStatus = sampleStatus;
	}
	public String getSpecifySampleStatus() {
		return specifySampleStatus;
	}
	public void setSpecifySampleStatus(String specifySampleStatus) {
		this.specifySampleStatus = specifySampleStatus;
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
	public AdministrativeUnitDto getAdministrativeUnit() {
		return administrativeUnit;
	}
	public void setAdministrativeUnit(AdministrativeUnitDto administrativeUnit) {
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
	
	public Set<UserInHealthOrgDto> getListUser() {
		return listUser;
	}
	public void setListUser(Set<UserInHealthOrgDto> listUser) {
		this.listUser = listUser;
		
	}
	
	public String getQualificationName() {
		return qualificationName;
	}
	public void setQualificationName(String qualificationName) {
		this.qualificationName = qualificationName;
	}
	public String getLevelName() {
		return levelName;
	}
	public void setLevelName(String levelName) {
		this.levelName = levelName;
	}
	public String getTestPurposeName1() {
		return testPurposeName1;
	}
	public void setTestPurposeName1(String testPurposeName1) {
		this.testPurposeName1 = testPurposeName1;
	}
	public String getTestPurposeName2() {
		return testPurposeName2;
	}
	public void setTestPurposeName2(String testPurposeName2) {
		this.testPurposeName2 = testPurposeName2;
	}
	public String getTestPurposeName3() {
		return testPurposeName3;
	}
	public void setTestPurposeName3(String testPurposeName3) {
		this.testPurposeName3 = testPurposeName3;
	}
	public String getTestPurposeName4() {
		return testPurposeName4;
	}
	public void setTestPurposeName4(String testPurposeName4) {
		this.testPurposeName4 = testPurposeName4;
	}

	public HealthOrgDto() {
	}
	
	public String getPassword() {
		return password;
	}
	public void setPassword(String password) {
		this.password = password;
	}
	public Boolean getIsManualSetCode() {
		return isManualSetCode;
	}
	public void setIsManualSetCode(Boolean isManualSetCode) {
		this.isManualSetCode = isManualSetCode;
	}
	public HealthOrgDto(HealthOrg entity) {
		if (entity != null) {
			this.id = entity.getId();
			this.name = entity.getName();
			this.code = entity.getCode();
			this.description = entity.getDescription();
			this.contactName = entity.getContactName();
			this.contactPhone = entity.getContactPhone();
			this.address = entity.getAddress();
			this.email = entity.getEmail();
			this.specifyLevel = entity.getSpecifyLevel();
			this.taxCodeOfTheUnit = entity.getTaxCodeOfTheUnit();
			this.unitCodeOfProgramPEQAS = entity.getUnitCodeOfProgramPEQAS();
			this.officerPosion = entity.getOfficerPosion();
			this.fax=entity.getFax();
			this.orderNumber = entity.getOrderNumber();
			if (entity.getAdministrativeUnit() != null) {
				this.administrativeUnit = new AdministrativeUnitDto(entity.getAdministrativeUnit());
			}
			
			if (entity.getListUser() != null && entity.getListUser().size() > 0) {
				this.listUser = new HashSet<UserInHealthOrgDto>();
				for (UserInHealthOrg uiho : entity.getListUser()) {
					this.listUser.add(new UserInHealthOrgDto(uiho, false));
				}
			}
		}
	}
	
	public HealthOrgDto(HealthOrg entity, boolean simple) {
		if (entity != null) {
			this.id = entity.getId();
			this.name = entity.getName();
			this.code = entity.getCode();
			this.description = entity.getDescription();
			this.contactName = entity.getContactName();
			this.contactPhone = entity.getContactPhone();
			this.address = entity.getAddress();
			this.email = entity.getEmail();
			this.specifyLevel = entity.getSpecifyLevel();
			this.taxCodeOfTheUnit = entity.getTaxCodeOfTheUnit();
			this.unitCodeOfProgramPEQAS = entity.getUnitCodeOfProgramPEQAS();
			this.officerPosion = entity.getOfficerPosion();
			this.fax=entity.getFax();
			this.orderNumber = entity.getOrderNumber();
		}
	}
}

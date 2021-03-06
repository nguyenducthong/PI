package com.globits.PI.dto;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import com.globits.PI.domain.EQASerumBank;
import com.globits.PI.domain.EQASerumBottle;
import com.globits.core.dto.BaseObjectDto;

public class EQASerumBankDto extends BaseObjectDto{
	private String name;
	private String serumCode;
	private String originalCode;
	private int type;
	private double originalVolume;
	private double presentVolume;
	private String quality;
	private int hepatitisBStatus;
	private int hepatitisCStatus;
	private Date sampledDate;
	private Date receiveDate;
	private String storeLocation;
	private String note;
	//Mã số lab
	private String labCode;
	private String createBy;
	private Date createDateTime;

	//Tình trạng nhiễm HIV, âm tính hay dương tính, giá trị: PIConst.SampleStatus
	private Integer hivStatus;
		
	//Số lượng ống chia nhỏ
	private Integer numberBottle;
	
	//Số lượng ống chia còn lại
	private Integer numberBottlesRemaining;
	
	//Chất lượng: Có lipit
	private Boolean hasLipid;
	
	
	//Chất lượng:  Tán huyết
	private Boolean hemolysis;
	
	//Mẫu có ly tâm tốc độ cao
	private Boolean hasHighSpeedCentrifugal;
	
	//mẫu có lọc
	private Boolean dialysis;
	
	// Mẫu bất hoạt
	private Boolean inactivated;
	//Số thứ tự
	private Integer orderNumber;
	//Danh sách các ống chia
	private List<EQASerumBottleDto> serumBottles;
	private Boolean isManualSetCode=false; // cho phép nhập tay. mã code
	public String getLabCode() {
		return labCode;
	}

	public void setLabCode(String labCode) {
		this.labCode = labCode;
	}
	public String getNote() {
		return note;
	}

	public void setNote(String note) {
		this.note = note;
	}

	public Integer getHivStatus() {
		return hivStatus;
	}

	public void setHivStatus(Integer hivStatus) {
		this.hivStatus = hivStatus;
	}

	public Integer getNumberBottle() {
		return numberBottle;
	}

	public void setNumberBottle(Integer numberBottle) {
		this.numberBottle = numberBottle;
	}

	public Boolean getHasLipid() {
		return hasLipid;
	}

	public void setHasLipid(Boolean hasLipid) {
		this.hasLipid = hasLipid;
	}

	public Boolean getHemolysis() {
		return hemolysis;
	}

	public void setHemolysis(Boolean hemolysis) {
		this.hemolysis = hemolysis;
	}

	public Boolean getHasHighSpeedCentrifugal() {
		return hasHighSpeedCentrifugal;
	}

	public void setHasHighSpeedCentrifugal(Boolean hasHighSpeedCentrifugal) {
		this.hasHighSpeedCentrifugal = hasHighSpeedCentrifugal;
	}

	public Boolean getDialysis() {
		return dialysis;
	}

	public void setDialysis(Boolean dialysis) {
		this.dialysis = dialysis;
	}

	public Boolean getInactivated() {
		return inactivated;
	}

	public void setInactivated(Boolean inactivated) {
		this.inactivated = inactivated;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getSerumCode() {
		return serumCode;
	}

	public void setSerumCode(String serumCode) {
		this.serumCode = serumCode;
	}

	public String getOriginalCode() {
		return originalCode;
	}

	public void setOriginalCode(String originalCode) {
		this.originalCode = originalCode;
	}

	public int getType() {
		return type;
	}

	public void setType(int type) {
		this.type = type;
	}

	public double getOriginalVolume() {
		return originalVolume;
	}

	public void setOriginalVolume(double originalVolume) {
		this.originalVolume = originalVolume;
	}

	public double getPresentVolume() {
		return presentVolume;
	}

	public void setPresentVolume(double presentVolume) {
		this.presentVolume = presentVolume;
	}

	public String getQuality() {
		return quality;
	}

	public void setQuality(String quality) {
		this.quality = quality;
	}

	public int getHepatitisBStatus() {
		return hepatitisBStatus;
	}

	public void setHepatitisBStatus(int hepatitisBStatus) {
		this.hepatitisBStatus = hepatitisBStatus;
	}

	public int getHepatitisCStatus() {
		return hepatitisCStatus;
	}

	public void setHepatitisCStatus(int hepatitisCStatus) {
		this.hepatitisCStatus = hepatitisCStatus;
	}

	public Date getSampledDate() {
		return sampledDate;
	}

	public void setSampledDate(Date sampledDate) {
		this.sampledDate = sampledDate;
	}

	public Date getReceiveDate() {
		return receiveDate;
	}

	public void setReceiveDate(Date receiveDate) {
		this.receiveDate = receiveDate;
	}

	public String getStoreLocation() {
		return storeLocation;
	}

	public void setStoreLocation(String storeLocation) {
		this.storeLocation = storeLocation;
	}

	public List<EQASerumBottleDto> getSerumBottles() {
		return serumBottles;
	}

	public void setSerumBottles(List<EQASerumBottleDto> serumBottles) {
		this.serumBottles = serumBottles;
	}

	public Integer getNumberBottlesRemaining() {
		return numberBottlesRemaining;
	}

	public void setNumberBottlesRemaining(Integer numberBottlesRemaining) {
		this.numberBottlesRemaining = numberBottlesRemaining;
	}

	public String getCreateBy() {
		return createBy;
	}

	public void setCreateBy(String createBy) {
		this.createBy = createBy;
	}

	public Date getCreateDateTime() {
		return createDateTime;
	}

	public void setCreateDateTime(Date createDateTime) {
		this.createDateTime = createDateTime;
	}

	public Boolean getIsManualSetCode() {
		return isManualSetCode;
	}

	public void setIsManualSetCode(Boolean isManualSetCode) {
		this.isManualSetCode = isManualSetCode;
	}

	public EQASerumBankDto() {
	}


	public EQASerumBankDto(EQASerumBank entity, boolean simple) {
		if (entity != null) {
			this.id = entity.getId();
			this.createBy = entity.getCreatedBy();
			this.createDateTime = entity.getCreateDate().toDate();
			this.name = entity.getName();
			this.serumCode = entity.getSerumCode();
			this.originalCode = entity.getOriginalCode();
			this.type = entity.getType();
			this.note = entity.getNote();
			this.originalVolume = entity.getOriginalVolume();
			this.presentVolume = entity.getPresentVolume();
			this.quality = entity.getQuality();
			this.sampledDate = entity.getSampledDate();
			this.receiveDate = entity.getReceiveDate();
			this.storeLocation = entity.getStoreLocation();
			//Mã số lab
			this.labCode = entity.getLabCode();
			
			//Tình trạng nhiễm HIV, âm tính hay dương tính, giá trị: PIConst.SampleStatus
			this.hivStatus= entity.getHivStatus();

			
			//Số lượng ống chia nhỏ
			this.numberBottle= entity.getNumberBottle();
			//Số ống chia còn lại
			this.numberBottlesRemaining = entity.getNumberBottlesRemaining();
			
			//Chất lượng: Có lipit
			this.hasLipid= entity.getHasLipid();
			
			
			//Chất lượng:  Tán huyết
			this.hemolysis= entity.getHemolysis();
			
			//Mẫu có ly tâm tốc độ cao
			this.hasHighSpeedCentrifugal= entity.getHasHighSpeedCentrifugal();
			
			//mẫu có lọc
			this.dialysis= entity.getDialysis();
			
			// Mẫu bất hoạt
			this.inactivated= entity.getInactivated();
			this.orderNumber=entity.getOrderNumber();
		}
	}

	public EQASerumBankDto(EQASerumBank entity) {
		if (entity != null) {
			this.id = entity.getId();
			this.createBy = entity.getCreatedBy();
			this.createDateTime = entity.getCreateDate().toDate();
			this.name = entity.getName();
			this.serumCode = entity.getSerumCode();
			this.originalCode = entity.getOriginalCode();
			this.type = entity.getType();
			this.note = entity.getNote();
			this.originalVolume = entity.getOriginalVolume();
			this.presentVolume = entity.getPresentVolume();
			this.quality = entity.getQuality();
			this.sampledDate = entity.getSampledDate();
			this.receiveDate = entity.getReceiveDate();
			this.storeLocation = entity.getStoreLocation();
			//Mã số lab
			this.labCode = entity.getLabCode();
			
			//Tình trạng nhiễm HIV, âm tính hay dương tính, giá trị: PIConst.SampleStatus
			this.hivStatus= entity.getHivStatus();
			
			//Số lượng ống chia nhỏ
			this.numberBottle= entity.getNumberBottle();
			//Số ống chia còn lại
			this.numberBottlesRemaining = entity.getNumberBottlesRemaining();
			//Chất lượng: Có lipit
			this.hasLipid= entity.getHasLipid();
			//Chất lượng:  Tán huyết
			this.hemolysis= entity.getHemolysis();
			
			//Mẫu có ly tâm tốc độ cao
			this.hasHighSpeedCentrifugal= entity.getHasHighSpeedCentrifugal();
			
			//mẫu có lọc
			this.dialysis= entity.getDialysis();
			
			// Mẫu bất hoạt
			this.inactivated= entity.getInactivated();
			this.orderNumber=entity.getOrderNumber();
			//Danh sách ống chia
			if(entity.getSerumBottles()!=null && entity.getSerumBottles().size()>0) {
				this.serumBottles = new ArrayList<EQASerumBottleDto>();
				for (EQASerumBottle eqaSerumBottle : entity.getSerumBottles()) {
					this.serumBottles.add(new EQASerumBottleDto(eqaSerumBottle,false));
				}
			}
		}

	}
}

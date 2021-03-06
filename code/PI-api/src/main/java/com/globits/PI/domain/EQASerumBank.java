package com.globits.PI.domain;

import java.util.Date;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.OneToMany;
import javax.persistence.OrderBy;
import javax.persistence.Table;
import javax.xml.bind.annotation.XmlRootElement;

import com.globits.core.domain.BaseObject;

@Entity
@Table(name = "tbl_eqa_serum_bank")
@XmlRootElement
public class EQASerumBank extends BaseObject {
	private static final long serialVersionUID = -5100199485809565238L;
	@Column(name="name")
	private String name;
	
	@Column(name="serum_code")//Mã ngân hàng huyết thanh (tự sinh: PI-S/P-aaaa)
	private String serumCode;
	
	@Column(name="original_code")//Mã nguyên bản
	private String originalCode;
	
	@Column(name="lab_code")//Mã số lab
	private String labCode;
	
	//Loại mẫu:máu, huyết thanh, huyết tương, khác...; giá trị: PIConst.SerumType
	//tạm thời fix giá trị, có thể phải làm danh mục riêng
	@Column(name="type")
	private int type;
	
	@Column(name="original_volume")//Dung tích ban đầu
	private double originalVolume;
	
	@Column(name="present_volume")//Dung tích hiện thời 
	private double presentVolume;
	
	//Chất lượng mẫu; giá trị: PIConst.SerumQuality
	//Tạm thời fix giá trị, có thể phải làm danh mục
	@Column(name="quality")
	private String quality;
	
	@Column(name = "note")
	private String note;
	
	@Column(name="hiv_status")//Tình trạng nhiễm HIV, âm tính hay dương tính, giá trị: PIConst.SampleStatus
	private Integer hivStatus;
	
	@Column(name="number_bottle")//Số lượng ống chia nhỏ
	private Integer numberBottle;
	
	@Column(name="number_bottles_remaining")
	private Integer numberBottlesRemaining;// Số ống chia còn lại
	
	@Column(name="sampled_date")//Ngày lấy mẫu
	private Date sampledDate;
	
	@Column(name="receive_date")//Ngày nhận mẫu
	private Date receiveDate;
	
	@Column(name="has_Lipid")//Chất lượng: Có lipit
	private Boolean hasLipid;	
	
	@Column(name="hemolysis")//Chất lượng:  Tán huyết
	private Boolean hemolysis;
	
	@Column(name="has_high_speed_centrifugal")//Mẫu có ly tâm tốc độ cao
	private Boolean hasHighSpeedCentrifugal;
	
	@Column(name="dialysis")//mẫu có lọc
	private Boolean dialysis;
	
	@Column(name="inactivated")// Mẫu bất hoạt
	private Boolean inactivated;
	
	@Column(name="store_location")//Nơi lưu trữ mẫu xét nghiệm; Có thể phải làm danh mục
	private String storeLocation;

	@Column(name="order_number")// Số thứ tự
	private Integer orderNumber;
	
	@OneToMany(mappedBy = "eqaSerumBank", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
	@OrderBy("code ASC")
	private Set<EQASerumBottle> serumBottles;	
	
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


	public String getNote() {
		return note;
	}


	public void setNote(String note) {
		this.note = note;
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

	public String getLabCode() {
		return labCode;
	}


	public void setLabCode(String labCode) {
		this.labCode = labCode;
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


	public void setHasLipid(Boolean hasPib) {
		this.hasLipid = hasPib;
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


	public Integer getOrderNumber() {
		return orderNumber;
	}


	public void setOrderNumber(Integer orderNumber) {
		this.orderNumber = orderNumber;
	}


	public Set<EQASerumBottle> getSerumBottles() {
		return serumBottles;
	}


	public void setSerumBottles(Set<EQASerumBottle> serumBottles) {
		this.serumBottles = serumBottles;
	}

	public Integer getNumberBottlesRemaining() {
		return numberBottlesRemaining;
	}


	public void setNumberBottlesRemaining(Integer numberBottlesRemaining) {
		this.numberBottlesRemaining = numberBottlesRemaining;
	}


	public EQASerumBank() {
		super();
	}
}

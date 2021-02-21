package com.globits.PI.dto;

import java.util.Date;

import com.globits.PI.PIConst;
import com.globits.PI.domain.EQARound;
import com.globits.PI.domain.HealthOrgEQARound;
import com.globits.core.dto.BaseObjectDto;

public class HealthOrgEQARoundDto extends BaseObjectDto{
	private int status;
	private Boolean hasResult = false;//Đã có kết quả hay chưa
	private int feeStatus;
	private Integer sampleTransferStatus;	//Tình trạng chuyển bộ mẫu		PIConst.SampleTransferStatus
	private String shippingUnit;	//Đơn vị vận chuyển
	private Date deliveryDate;		//Ngày vận chuyển
	private Date sampleReceivingDate;		//Ngày nhận mẫu 
	private HealthOrgDto healthOrg;
	private EQARoundDto round;
	private EQASampleSetDto sampleSet;
	private String billOfLadingCode; // mã đơn vận đi
	private Boolean isDuplicateHealthOrg = false;
	/*Trường tạm thời*/
	private Boolean isRegistered = false;//Hiển thị nút đăng ký
	private Boolean isCancelRegistration = false;//Hiển thị nút hủy đăng ký
	private Integer point;
	private Boolean statusSentResults;//Gửi chấm điểm lại cho đơn vị.
	public int getStatus() {
		return status;
	}
	public void setStatus(int status) {
		this.status = status;
	}
	public Boolean getHasResult() {
		return hasResult;
	}
	public void setHasResult(Boolean hasResult) {
		this.hasResult = hasResult;
	}
	public int getFeeStatus() {
		return feeStatus;
	}
	public void setFeeStatus(int feeStatus) {
		this.feeStatus = feeStatus;
	}
	public HealthOrgDto getHealthOrg() {
		return healthOrg;
	}
	public void setHealthOrg(HealthOrgDto healthOrg) {
		this.healthOrg = healthOrg;
	}
	public EQARoundDto getRound() {
		return round;
	}
	public void setRound(EQARoundDto round) {
		this.round = round;
	}
	
	public EQASampleSetDto getSampleSet() {
		return sampleSet;
	}
	public void setSampleSet(EQASampleSetDto sampleSet) {
		this.sampleSet = sampleSet;
	}
	public Boolean getIsRegistered() {
		return isRegistered;
	}
	public void setIsRegistered(Boolean isRegistered) {
		this.isRegistered = isRegistered;
	}
	
	public Boolean getIsCancelRegistration() {
		return isCancelRegistration;
	}
	public void setIsCancelRegistration(Boolean isCancelRegistration) {
		this.isCancelRegistration = isCancelRegistration;
	}
	
	public Boolean getIsDuplicateHealthOrg() {
		return isDuplicateHealthOrg;
	}
	public void setIsDuplicateHealthOrg(Boolean isDuplicateHealthOrg) {
		this.isDuplicateHealthOrg = isDuplicateHealthOrg;
	}
	
	public Integer getSampleTransferStatus() {
		return sampleTransferStatus;
	}
	public void setSampleTransferStatus(Integer sampleTransferStatus) {
		this.sampleTransferStatus = sampleTransferStatus;
	}
	public String getShippingUnit() {
		return shippingUnit;
	}
	public void setShippingUnit(String shippingUnit) {
		this.shippingUnit = shippingUnit;
	}
	public Date getDeliveryDate() {
		return deliveryDate;
	}
	public void setDeliveryDate(Date deliveryDate) {
		this.deliveryDate = deliveryDate;
	}
	public Date getSampleReceivingDate() {
		return sampleReceivingDate;
	}
	public void setSampleReceivingDate(Date sampleReceivingDate) {
		this.sampleReceivingDate = sampleReceivingDate;
	}
	public String getBillOfLadingCode() {
		return billOfLadingCode;
	}
	public void setBillOfLadingCode(String billOfLadingCode) {
		this.billOfLadingCode = billOfLadingCode;
	}
	public Integer getPoint() {
		return point;
	}
	public void setPoint(Integer point) {
		this.point = point;
	}
	
	public Boolean getStatusSentResults() {
		return statusSentResults;
	}
	public void setStatusSentResults(Boolean statusSentResults) {
		this.statusSentResults = statusSentResults;
	}
	public HealthOrgEQARoundDto() {
	}
	
	public HealthOrgEQARoundDto(HealthOrgEQARound entity) {
		if (entity != null) {
			this.id = entity.getId();
			this.status = entity.getStatus();
			this.hasResult = entity.getHasResult();
			this.feeStatus = entity.getFeeStatus();
			this.sampleTransferStatus = entity.getSampleTransferStatus();
			this.shippingUnit = entity.getShippingUnit();
			this.deliveryDate = entity.getDeliveryDate();
			this.sampleReceivingDate = entity.getSampleReceivingDate();
			this.billOfLadingCode = entity.getBillOfLadingCode();
			if (entity.getHealthOrg() != null) {
				this.healthOrg = new HealthOrgDto(entity.getHealthOrg());
			}
			if (entity.getRound() != null) {
				this.round = new EQARoundDto(entity.getRound());
			}
			if (entity.getSampleSet() != null) {
				this.sampleSet = new EQASampleSetDto(entity.getSampleSet());
			}
		}
	}
	
	public HealthOrgEQARoundDto(HealthOrgEQARound entity, boolean simple) {
		if (entity != null) {
			this.id = entity.getId();
			this.status = entity.getStatus();
			this.hasResult = entity.getHasResult();
			this.feeStatus = entity.getFeeStatus();
			this.sampleTransferStatus = entity.getSampleTransferStatus();
			this.shippingUnit = entity.getShippingUnit();
			this.deliveryDate = entity.getDeliveryDate();
			this.sampleReceivingDate = entity.getSampleReceivingDate();
			this.billOfLadingCode = entity.getBillOfLadingCode();
			if (entity.getHealthOrg() != null) {
				this.healthOrg = new HealthOrgDto(entity.getHealthOrg(), true);
			}
			if (entity.getRound() != null) {
				this.round = new EQARoundDto();
				this.round.setId(entity.getRound().getId());
				this.round.setName(entity.getRound().getName());
				this.round.setCode(entity.getRound().getCode());
				this.round.setStartDate(entity.getRound().getStartDate());
				this.round.setEndDate(entity.getRound().getEndDate());
				this.round.setIsActive(entity.getRound().getIsActive());
				this.round.setRegistrationStartDate(entity.getRound().getRegistrationStartDate());
				this.round.setRegistrationExpiryDate(entity.getRound().getRegistrationExpiryDate());
				this.round.setOrderNumber(entity.getRound().getOrderNumber());
			}
			if (entity.getSampleSet() != null) {
				this.sampleSet = new EQASampleSetDto(entity.getSampleSet(), true);
			}
		}
	}
	
	public HealthOrgEQARoundDto(EQARound round, HealthOrgEQARound healthOrgEQARound) {
		if (round != null) {
			Date dateNow = new Date();
			this.round = new EQARoundDto(round, true);

			if (round.getRegistrationStartDate() != null && round.getRegistrationExpiryDate() != null 
					&& round.getRegistrationStartDate().before(dateNow) && round.getRegistrationExpiryDate().after(dateNow)) {
				if (healthOrgEQARound != null && healthOrgEQARound.getId() != null) {
					this.id = healthOrgEQARound.getId();
					this.status = healthOrgEQARound.getStatus();
					this.hasResult = healthOrgEQARound.getHasResult();
					this.feeStatus = healthOrgEQARound.getFeeStatus();
					this.sampleTransferStatus = healthOrgEQARound.getSampleTransferStatus();
					this.shippingUnit = healthOrgEQARound.getShippingUnit();
					this.deliveryDate = healthOrgEQARound.getDeliveryDate();
					this.sampleReceivingDate = healthOrgEQARound.getSampleReceivingDate();
					this.billOfLadingCode = healthOrgEQARound.getBillOfLadingCode();
					if (this.status == PIConst.HealthOrgEQARoundStatus.New.getValue()) {
						this.isCancelRegistration = true;
					}
					if (this.status == PIConst.HealthOrgEQARoundStatus.Cancel_Registration.getValue()) {
						this.isRegistered = true;
					}
				}
				else {
					this.isRegistered = true;
				}
			}
		}
	}
}

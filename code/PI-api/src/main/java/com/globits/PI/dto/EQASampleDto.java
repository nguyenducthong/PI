package com.globits.PI.dto;

import java.util.Date;
import java.util.HashSet;
import java.util.Set;

import com.globits.PI.domain.EQASample;
import com.globits.PI.domain.EQASampleBottle;
import com.globits.core.dto.BaseObjectDto;

public class EQASampleDto extends BaseObjectDto{
	private String name;
	private String code;
	private Integer result;// Tình trạng nhiễm, âm tính hay dương tính, giá trị: PIConst.EQASampleStatus
	private double additiveThrombin;
	private Date thrombinAddedDate;
	private Boolean inactiveVirus;
	private double volumeAfterRemoveFibrin;
	private Date removeFibrinDate;
	private double volumeAfterCentrifuge;
	private Date centrifugeDate;
	private double volumeOfProclinAdded;
	private String note;
	private Set<EQASampleBottleDto> eqaSampleBottles;	//1 sample có nhiều bottle
	private String dilution;//Độ pha loãng (Tỷ lệ:  1/dilution)
	private EQARoundDto round;
	private Integer orderNumber;
	private Integer orderNumberSample;
	private Integer dilutionLevel;
	private Date endDate; // ngày hoàn thành mẫu
	private Boolean isManualSetCode=false; // cho phép nhập tay. mã code
	public Integer getDilutionLevel() {
		return dilutionLevel;
	}

	public String getDilution() {
		return dilution;
	}

	public void setDilution(String dilution) {
		this.dilution = dilution;
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

	public Integer getResult() {
		return result;
	}

	public void setResult(Integer result) {
		this.result = result;
	}

	public double getAdditiveThrombin() {
		return additiveThrombin;
	}

	public void setAdditiveThrombin(double additiveThrombin) {
		this.additiveThrombin = additiveThrombin;
	}

	public Date getThrombinAddedDate() {
		return thrombinAddedDate;
	}

	public void setThrombinAddedDate(Date thrombinAddedDate) {
		this.thrombinAddedDate = thrombinAddedDate;
	}

	public Boolean getInactiveVirus() {
		return inactiveVirus;
	}

	public void setInactiveVirus(Boolean inactiveVirus) {
		this.inactiveVirus = inactiveVirus;
	}

	public double getVolumeAfterRemoveFibrin() {
		return volumeAfterRemoveFibrin;
	}

	public void setVolumeAfterRemoveFibrin(double volumeAfterRemoveFibrin) {
		this.volumeAfterRemoveFibrin = volumeAfterRemoveFibrin;
	}

	public Date getRemoveFibrinDate() {
		return removeFibrinDate;
	}

	public void setRemoveFibrinDate(Date removeFibrinDate) {
		this.removeFibrinDate = removeFibrinDate;
	}

	public double getVolumeAfterCentrifuge() {
		return volumeAfterCentrifuge;
	}

	public void setVolumeAfterCentrifuge(double volumeAfterCentrifuge) {
		this.volumeAfterCentrifuge = volumeAfterCentrifuge;
	}

	public Date getCentrifugeDate() {
		return centrifugeDate;
	}

	public void setCentrifugeDate(Date centrifugeDate) {
		this.centrifugeDate = centrifugeDate;
	}

	public double getVolumeOfProclinAdded() {
		return volumeOfProclinAdded;
	}

	public void setVolumeOfProclinAdded(double volumeOfProclinAdded) {
		this.volumeOfProclinAdded = volumeOfProclinAdded;
	}

	public String getNote() {
		return note;
	}

	public void setNote(String note) {
		this.note = note;
	}

	public Set<EQASampleBottleDto> getEqaSampleBottles() {
		return eqaSampleBottles;
	}

	public void setEqaSampleBottles(Set<EQASampleBottleDto> eqaSampleBottles) {
		this.eqaSampleBottles = eqaSampleBottles;
	}

	public EQARoundDto getRound() {
		return round;
	}

	public void setRound(EQARoundDto round) {
		this.round = round;
	}

	public Integer getOrderNumber() {
		return orderNumber;
	}

	public void setOrderNumber(Integer orderNumber) {
		this.orderNumber = orderNumber;
	}

	public Integer getOrderNumberSample() {
		return orderNumberSample;
	}

	public void setOrderNumberSample(Integer orderNumberSample) {
		this.orderNumberSample = orderNumberSample;
	}
	
	public void setDilutionLevel(Integer dilutionLevel) {
		this.dilutionLevel = dilutionLevel;
	}

	public Date getEndDate() {
		return endDate;
	}

	public void setEndDate(Date endDate) {
		this.endDate = endDate;
	}

	public Boolean getIsManualSetCode() {
		return isManualSetCode;
	}

	public void setIsManualSetCode(Boolean isManualSetCode) {
		this.isManualSetCode = isManualSetCode;
	}

	public EQASampleDto() {
	}

	public EQASampleDto(EQASample entity, boolean simple) {
		if (entity != null) {
			this.id = entity.getId();
			this.name = entity.getName();
			this.code = entity.getCode();
			this.result = entity.getResult();
			this.additiveThrombin = entity.getAdditiveThrombin();
			this.thrombinAddedDate = entity.getThrombinAddedDate();
			this.inactiveVirus = entity.getInactiveVirus();
			this.volumeAfterCentrifuge = entity.getVolumeAfterCentrifuge();
			this.removeFibrinDate = entity.getRemoveFibrinDate();
			this.volumeAfterRemoveFibrin = entity.getVolumeAfterRemoveFibrin();
			this.centrifugeDate = entity.getCentrifugeDate();
			this.volumeOfProclinAdded = entity.getVolumeOfProclinAdded();
			this.dilution = entity.getDilution();
			this.note = entity.getNote();
			this.orderNumber = entity.getOrderNumber();
			this.orderNumberSample = entity.getOrderNumberSample();
			this.dilutionLevel = entity.getDilution_level();
			this.endDate = entity.getEndDate();
		}
	}

	public EQASampleDto(EQASample entity) {
		if (entity != null) {
			this.id = entity.getId();
			this.name = entity.getName();
			this.code = entity.getCode();
			this.result = entity.getResult();
			this.additiveThrombin = entity.getAdditiveThrombin();
			this.thrombinAddedDate = entity.getThrombinAddedDate();
			this.inactiveVirus = entity.getInactiveVirus();
			this.volumeAfterCentrifuge = entity.getVolumeAfterCentrifuge();
			this.removeFibrinDate = entity.getRemoveFibrinDate();
			this.volumeAfterRemoveFibrin = entity.getVolumeAfterRemoveFibrin();
			this.centrifugeDate = entity.getCentrifugeDate();
			this.volumeOfProclinAdded = entity.getVolumeOfProclinAdded();
			this.dilution = entity.getDilution();
			this.note = entity.getNote();
			this.orderNumber = entity.getOrderNumber();
			this.orderNumberSample = entity.getOrderNumberSample();
			this.dilutionLevel = entity.getDilution_level();
			this.endDate = entity.getEndDate();

			if(entity.getRound()!=null) {
				this.round = new EQARoundDto(entity.getRound(),true);
			}

			if (entity.getEqaSampleBottles() != null && entity.getEqaSampleBottles().size() > 0) {
				this.eqaSampleBottles = new HashSet<EQASampleBottleDto>();
				for (EQASampleBottle sb : entity.getEqaSampleBottles()) {
					this.eqaSampleBottles.add(new EQASampleBottleDto(sb));
				}
			}
		}
	}
}

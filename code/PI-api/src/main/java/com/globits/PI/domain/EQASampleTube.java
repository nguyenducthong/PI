package com.globits.PI.domain;


import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.xml.bind.annotation.XmlRootElement;

import com.globits.core.domain.BaseObject;

@Entity
@Table(name = "tbl_eqa_sample_tube")
@XmlRootElement
public class EQASampleTube extends BaseObject {
	private static final long serialVersionUID = -5100199485809565238L;
	@Column(name="name")
	private String name;
	
	@Column(name="code")
	private String code;
	
	@Column(name="note")//Ghi chú
	private String note;
	
	@Column(name="volume")//Dung tích
	private double volume;
	
	//Mẫu xét nghiệm
	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "eqa_sample_id")
	private EQASample eqaSample;

	//Mã ống chia
	@ManyToOne(fetch = FetchType.EAGER)
	//@NotFound(action = NotFoundAction.IGNORE)
	@JoinColumn(name = "eqa_sample_bottle_id")
	private EQASerumBottle eqaSerumBottle;

	//Đợt ngoại kiểm
	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "eqa_round_id")
	private EQARound eqaRound;

	//Thuộc phòng xét nghiệm nào
	@ManyToOne(fetch = FetchType.EAGER)
	//@NotFound(action = NotFoundAction.IGNORE)
	@JoinColumn(name = "health_org_id")
	private HealthOrg healthOrg;
	
	@ManyToOne(fetch = FetchType.EAGER)
//	@NotFound(action = NotFoundAction.IGNORE)
	@JoinColumn(name = "health_org_round_id")
	private HealthOrgEQARound healthOrgEQARound;
	
	//Thuộc thứ tự nào trong set danh cho phòng xét nghiệm
	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "sample_set_detail_id")
//	@NotFound(action = NotFoundAction.IGNORE)
	private EQASampleSetDetail sampleSetDetail;
	
	@Column(name="type")//Loại tube: tube phụ hay tube chính, giá trị: PIConst.TubeType
	private int type;
	
	@Column(name="status")//Tình trạng tube, giá trị: PIConst.TubeStatus
	private int status;
	
	@Column(name="last_result_from_lab")//Kết quả cuối cùng từ phòng xét nghiệm; giá trị: PIConst.EQASampleStatus
	private Integer lastResultFromLab;
	
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

	public String getNote() {
		return note;
	}

	public void setNote(String note) {
		this.note = note;
	}

	public double getVolume() {
		return volume;
	}

	public void setVolume(double volume) {
		this.volume = volume;
	}

	public EQASample getEqaSample() {
		return eqaSample;
	}

	public void setEqaSample(EQASample eqaSample) {
		this.eqaSample = eqaSample;
	}

	public EQARound getEqaRound() {
		return eqaRound;
	}

	public void setEqaRound(EQARound eqaRound) {
		this.eqaRound = eqaRound;
	}

	public HealthOrg getHealthOrg() {
		return healthOrg;
	}

	public void setHealthOrg(HealthOrg healthOrg) {
		this.healthOrg = healthOrg;
	}
	
	public HealthOrgEQARound getHealthOrgEQARound() {
		return healthOrgEQARound;
	}

	public void setHealthOrgEQARound(HealthOrgEQARound healthOrgEQARound) {
		this.healthOrgEQARound = healthOrgEQARound;
	}

	public EQASampleSetDetail getSampleSetDetail() {
		return sampleSetDetail;
	}

	public void setSampleSetDetail(EQASampleSetDetail sampleSetDetail) {
		this.sampleSetDetail = sampleSetDetail;
	}

	public int getType() {
		return type;
	}

	public void setType(int type) {
		this.type = type;
	}

	public int getStatus() {
		return status;
	}

	public void setStatus(int status) {
		this.status = status;
	}

	public Integer getLastResultFromLab() {
		return lastResultFromLab;
	}

	public void setLastResultFromLab(Integer lastResultFromLab) {
		this.lastResultFromLab = lastResultFromLab;
	}

	public EQASampleTube() {
		super();
	}

	public EQASerumBottle getEqaSerumBottle() {
		return eqaSerumBottle;
	}

	public void setEqaSerumBottle(EQASerumBottle eqaSerumBottle) {
		this.eqaSerumBottle = eqaSerumBottle;
	}
}

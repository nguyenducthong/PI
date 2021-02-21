package com.globits.PI.domain;

import java.util.Date;
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

import com.globits.core.domain.BaseObject;

@Entity
@Table(name = "tbl_eqa_sample")
@XmlRootElement
public class EQASample extends BaseObject {
	private static final long serialVersionUID = -5100199485809565238L;
	@Column(name="name")
	private String name;
	
	@Column(name="code")
	private String code;
	
	@Column(name="result")//Tình trạng nhiễm, âm tính hay dương tính, giá trị: PIConst.SampleResult
	private Integer result;
	
	//Lượng thrombin thêm vào (ul)
	@Column(name="additive_thrombin")
	private double additiveThrombin;	
	
	//Ngày thêm lượng thrombin
	@Column(name="thrombin_added_date")
	private Date thrombinAddedDate;
	
	//Có cần phải bất hoạt virus?
	@Column(name="inactive_virus")
	private Boolean inactiveVirus;
	
	//Dung tích sau khi bỏ Fibrin (ml)
	@Column(name="volume_after_remove_fibrin")
	private double volumeAfterRemoveFibrin;	
	
	//Ngày lược bỏ Fibrin
	@Column(name="remove_fibrin_date")
	private Date removeFibrinDate;
	
	//Dung tích sau khi ly tâm (ml)
	@Column(name="volume_after_centrifuge")
	private double volumeAfterCentrifuge;	
	
	//Ngày thực hiện ly tâm
	@Column(name="centrifuge_date")
	private Date centrifugeDate;
	
	//Lượng Proclin 300 được thêm (ml)
	@Column(name="volume_of_proclin_added")
	private double volumeOfProclinAdded;	

	@Column(name="note")//Ghi chú
	private String note;	

	@Column(name="dilution")
	private String dilution;//Độ pha loãng được chọn (Tỷ lệ:  1/dilution)
	
	@Column(name="dilution_level")
	private Integer dilution_level;//Số bậc pha loãng
	
	@Column(name = "end_date")
	private Date endDate;// Ngày hoàn thành mẫu
	
	//1 sample có nhiều bottle
	@OneToMany(mappedBy = "eQASample", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
	private Set<EQASampleBottle> eqaSampleBottles;	
	
	@ManyToOne(fetch = FetchType.EAGER, cascade=CascadeType.PERSIST)
    @JoinColumn(name = "eqa_round_id")
	private EQARound round;
	
	@Column(name="order_number")//Thứ tự trong 1 vòng ngoại kiểm
	private Integer orderNumber;
	
	@Column(name="order_number_sample")//Thứ tự ống theo vòng
	private Integer orderNumberSample;
	

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

	public Set<EQASampleBottle> getEqaSampleBottles() {
		return eqaSampleBottles;
	}

	public void setEqaSampleBottles(Set<EQASampleBottle> eqaSampleBottles) {
		this.eqaSampleBottles = eqaSampleBottles;
	}

	public EQARound getRound() {
		return round;
	}

	public void setRound(EQARound round) {
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
	
	public Integer getDilution_level() {
		return dilution_level;
	}



	public void setDilution_level(Integer dilution_level) {
		this.dilution_level = dilution_level;
	}

	public Date getEndDate() {
		return endDate;
	}

	public void setEndDate(Date endDate) {
		this.endDate = endDate;
	}

	public EQASample() {
		super();
	}
}

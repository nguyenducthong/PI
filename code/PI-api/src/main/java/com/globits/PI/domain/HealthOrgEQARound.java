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
import javax.persistence.OneToOne;
import javax.persistence.OrderBy;
import javax.persistence.Table;
import javax.xml.bind.annotation.XmlRootElement;


import com.globits.core.domain.BaseObject;
/**
 * Đơn vị - vòng ngoại kiểm
 * Đơn vị nào, tham gia vào vòng ngoại kiểm nào
 */
@Entity
@Table(name = "tbl_health_org_eqaround")
@XmlRootElement
public class HealthOrgEQARound extends BaseObject {
	private static final long serialVersionUID = -5100199485809565238L;
	@Column(name="status")//Tình trạng tham gia
	private int status;//PIConst.HealthOrgEQARoundStatus
	
	@Column(name="has_result")
	private Boolean hasResult;//Đã có kết quả hay chưa
	
	@Column(name="fee")//Tình trạng nộp phí; giá trị: PIConst.FeeStatus
	private Integer feeStatus;

	@Column(name="sample_transfer_status")
	private Integer sampleTransferStatus;	//Tình trạng chuyển bộ mẫu		PIConst.SampleTransferStatus

	@Column(name="shipping_unit")
	private String shippingUnit;	//Đơn vị vận chuyển

	@Column(name="delivery_date")
	private Date deliveryDate;		//Ngày PI vận chuyển 
	
	@Column(name="sample_receiving_date")
	private Date sampleReceivingDate;		//Ngày PXN nhận mẫu
	
	@ManyToOne( optional = true, fetch = FetchType.EAGER)
	@JoinColumn(name = "health_org_id", unique = false)
	private HealthOrg healthOrg;
	
	@ManyToOne( optional = true, fetch = FetchType.EAGER)
	@JoinColumn(name = "eqa_round_id", unique = false)
	private EQARound round;
	
	@OneToOne
	@JoinColumn(name = "eqa_sample_set_id", unique = false)
	private EQASampleSet sampleSet;

	@Column(name = "bill_of_lading_code")
	private String billOfLadingCode; // Mã đơn vận đi
	 
	@OneToMany(mappedBy = "healthOrgEQARound", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
	@OrderBy("code ASC")
	private Set<EQASampleTube> listSampleTube;

	@OneToMany(mappedBy = "healthOrgRound", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
	@OrderBy("orderTest ASC")
	private Set<EQAResultReport> listResultReport;
		
	public EQASampleSet getSampleSet() {
		return sampleSet;
	}

	public void setSampleSet(EQASampleSet sampleSet) {
		this.sampleSet = sampleSet;
	}

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

	public Integer getFeeStatus() {
		return feeStatus;
	}

	public void setFeeStatus(Integer feeStatus) {
		this.feeStatus = feeStatus;
	}

	public HealthOrg getHealthOrg() {
		return healthOrg;
	}

	public void setHealthOrg(HealthOrg healthOrg) {
		this.healthOrg = healthOrg;
	}

	public EQARound getRound() {
		return round;
	}

	public void setRound(EQARound round) {
		this.round = round;
	}

	public Set<EQASampleTube> getListSampleTube() {
		return listSampleTube;
	}

	public void setListSampleTube(Set<EQASampleTube> listSampleTube) {
		this.listSampleTube = listSampleTube;
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

	public HealthOrgEQARound() {
		super();
	}
}

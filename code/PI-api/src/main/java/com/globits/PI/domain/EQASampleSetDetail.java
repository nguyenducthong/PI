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
@Table(name = "tbl_eqa_sample_set_detail")
@XmlRootElement
public class EQASampleSetDetail  extends BaseObject {
	private static final long serialVersionUID = -5100199485809565238L;
	
	@Column(name="name")
	private String name;
	
	@Column(name="code")
	private String code;
	
	//Thuộc mẫu xét nghiệm nào
	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "eqa_sample_id")
	private EQASample sample;

	//Thuộc về set nào
	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "eqa_sample_set_id")
	private EQASampleSet sampleSet;
	
	//Thứ tự trong set
	@Column(name="order_number")
	private int orderNumber;
		
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

	public EQASample getSample() {
		return sample;
	}

	public void setSample(EQASample sample) {
		this.sample = sample;
	}

	public EQASampleSet getSampleSet() {
		return sampleSet;
	}

	public void setSampleSet(EQASampleSet sampleSet) {
		this.sampleSet = sampleSet;
	}

	public int getOrderNumber() {
		return orderNumber;
	}

	public void setOrderNumber(int orderNumber) {
		this.orderNumber = orderNumber;
	}

	public EQASampleSetDetail() {
		super();
	}
}

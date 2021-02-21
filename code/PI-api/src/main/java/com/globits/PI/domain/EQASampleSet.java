package com.globits.PI.domain;

import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.OrderBy;
import javax.persistence.Table;
import javax.xml.bind.annotation.XmlRootElement;

import com.globits.core.domain.BaseObject;

@Entity
@Table(name = "tbl_eqa_sample_set")
@XmlRootElement
public class EQASampleSet  extends BaseObject {
	private static final long serialVersionUID = -5100199485809565238L;
	
	@Column(name="name")
	private String name;
	
	@Column(name="code")
	private String code;
	
	//Vòng ngoại kiểm
	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "eqa_round_id")
	private EQARound eqaRound;

	@OneToMany(mappedBy = "sampleSet", fetch = FetchType.EAGER, cascade = CascadeType.ALL, orphanRemoval = true)
	@OrderBy("orderNumber ASC")
	private Set<EQASampleSetDetail> details;//Danh sách chi tiết các mẫu
	
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

	public EQARound getEqaRound() {
		return eqaRound;
	}

	public void setEqaRound(EQARound eqaRound) {
		this.eqaRound = eqaRound;
	}
	
	public Set<EQASampleSetDetail> getDetails() {
		return details;
	}

	public void setDetails(Set<EQASampleSetDetail> details) {
		this.details = details;
	}

	public EQASampleSet() {
		super();
	}
}

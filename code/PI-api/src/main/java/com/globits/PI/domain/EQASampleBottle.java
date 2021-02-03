package com.globits.PI.domain;

import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.xml.bind.annotation.XmlRootElement;

import com.globits.core.domain.BaseObject;
/**
 */
@Entity
@Table(name = "tbl_eqa_sample_bottle")
@XmlRootElement
public class EQASampleBottle extends BaseObject {
	private static final long serialVersionUID = -5100199485809565238L;

	//EQASample
	@ManyToOne
	@JoinColumn(name = "eqa_sample_id")
	private EQASample eQASample;
	
	//EQASerumBottle
	@ManyToOne
	@JoinColumn(name = "eqa_serum_bottle_id")
	private EQASerumBottle eQASerumBottle;

	public EQASample geteQASample() {
		return eQASample;
	}

	public void seteQASample(EQASample eQASample) {
		this.eQASample = eQASample;
	}

	public EQASerumBottle geteQASerumBottle() {
		return eQASerumBottle;
	}

	public void seteQASerumBottle(EQASerumBottle eQASerumBottle) {
		this.eQASerumBottle = eQASerumBottle;
	}
	
}

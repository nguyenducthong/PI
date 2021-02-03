package com.globits.core.sys.domain;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.Inheritance;
import javax.persistence.InheritanceType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.xml.bind.annotation.XmlRootElement;

import com.globits.core.domain.BaseObject;

/**
 * Giá trị của các khái niệm
 * @author dangnh
 * @since 2020/04/08
 */
@Entity
@Table(name = "tbl_obs")
@Inheritance(strategy = InheritanceType.JOINED)
@XmlRootElement
public class Obs  extends BaseObject {
	private static final long serialVersionUID = -5100199485809565238L;
	
	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "concept_id")
	private Concept concept;//Giá trị dành cho Concept nào
	
	@Column(name="obs_date")
	private Date obsDate;
	
	@Column(name="value_boolean")
	private Boolean valueBoolean;
	
	@Column(name="value_coded")
	private Concept valueCoded;
	
	@Column(name="value_datetime")
	private Date valueDatetime;
	
	@Column(name="value_numeric")
	private Double valueNumeric;
	
	@Column(name="value_text")
	private String valueText;

	@Column(name="comments")
	private String comments;
	
	public Concept getConcept() {
		return concept;
	}

	public void setConcept(Concept concept) {
		this.concept = concept;
	}

	public Date getObsDate() {
		return obsDate;
	}

	public void setObsDate(Date obsDate) {
		this.obsDate = obsDate;
	}

	public Boolean getValueBoolean() {
		return valueBoolean;
	}

	public void setValueBoolean(Boolean valueBoolean) {
		this.valueBoolean = valueBoolean;
	}

	public Concept getValueCoded() {
		return valueCoded;
	}

	public void setValueCoded(Concept valueCoded) {
		this.valueCoded = valueCoded;
	}

	public Date getValueDatetime() {
		return valueDatetime;
	}

	public void setValueDatetime(Date valueDatetime) {
		this.valueDatetime = valueDatetime;
	}

	public Double getValueNumeric() {
		return valueNumeric;
	}

	public void setValueNumeric(Double valueNumeric) {
		this.valueNumeric = valueNumeric;
	}

	public String getValueText() {
		return valueText;
	}

	public void setValueText(String valueText) {
		this.valueText = valueText;
	}

	public String getComments() {
		return comments;
	}

	public void setComments(String comments) {
		this.comments = comments;
	}

	public Obs() {
		super();
	}
	
}

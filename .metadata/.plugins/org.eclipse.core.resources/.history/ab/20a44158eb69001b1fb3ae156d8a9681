package com.globits.PI.domain;

import java.util.Date;


import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.xml.bind.annotation.XmlRootElement;

import com.globits.core.domain.BaseObject;

@Entity
@Table(name = "tbl_eqa_planning")
@XmlRootElement
public class EQAPlanning extends BaseObject {
	private static final long serialVersionUID = -5100199485809565238L;
	@Column(name="name")
	private String name;
	@Column(name="code")
	private String code;
	@Column(name="year")
	private Integer year;
	@Column(name="type")
	private String type;
	@Column(name="objectives")
	private String objectives;
	@Column(name="number_of_round")
	private int numberOfRound;
	@Column(name="start_date")
	private Date startDate;
	@Column(name="end_date")
	private Date endDate;
	@Column(name="fee")
	private double fee;//Phí tham dự
	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "personnel_id")//Nhan su

	
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
	public Integer getYear() {
		return year;
	}
	public void setYear(Integer year) {
		this.year = year;
	}
	public String getType() {
		return type;
	}
	public void setType(String type) {
		this.type = type;
	}
	public String getObjectives() {
		return objectives;
	}
	public void setObjectives(String objectives) {
		this.objectives = objectives;
	}
	public int getNumberOfRound() {
		return numberOfRound;
	}
	public void setNumberOfRound(int numberOfRound) {
		this.numberOfRound = numberOfRound;
	}
	public Date getStartDate() {
		return startDate;
	}
	public void setStartDate(Date startDate) {
		this.startDate = startDate;
	}
	public Date getEndDate() {
		return endDate;
	}
	public void setEndDate(Date endDate) {
		this.endDate = endDate;
	}

	public double getFee() {
		return fee;
	}
	public void setFee(double fee) {
		this.fee = fee;
	}
	
	public EQAPlanning() {
		super();
	}
}

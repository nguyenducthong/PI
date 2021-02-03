package com.globits.core.sys.domain;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.xml.bind.annotation.XmlRootElement;

import com.globits.PI.domain.EQASampleTube;
import com.globits.core.domain.BaseObject;
import com.globits.core.sys.CoreSysConst;

/**
 * Khái niệm, các khái niệm dùng chung
 * @author dangnh
 * @since 2020/04/08
 */
@Entity
@Table(name = "tbl_concept")
@XmlRootElement
public class Concept  extends BaseObject {
	private static final long serialVersionUID = -5100199485809565238L;
	
	@Column(name="name")
	private String name;
	
	@Column(name="code",nullable = false,unique = true)
	private String code;
	
	@Column(name="short_name")
	private String shortName;
	
	@Column(name="description")
	private String description;
	
	@Column(name="data_type")
	private int dataType;//giá trị tại: CoreSysConst.ConceptDataType

	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "concept_class_id")
	private ConceptClass conceptClass;//Thuộc nhóm concept nào
	
	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "concept_id")
	private Concept answerForConcept;//Diễn giải cho Concept nào
	
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

	public String getShortName() {
		return shortName;
	}

	public void setShortName(String shortName) {
		this.shortName = shortName;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public int getDataType() {
		return dataType;
	}

	public void setDataType(int dataType) {
		this.dataType = dataType;
	}
	
	public ConceptClass getConceptClass() {
		return conceptClass;
	}

	public void setConceptClass(ConceptClass conceptClass) {
		this.conceptClass = conceptClass;
	}

	public Concept getAnswerForConcept() {
		return answerForConcept;
	}

	public void setAnswerForConcept(Concept answerForConcept) {
		this.answerForConcept = answerForConcept;
	}

	public Concept() {
		super();
	}
	
}

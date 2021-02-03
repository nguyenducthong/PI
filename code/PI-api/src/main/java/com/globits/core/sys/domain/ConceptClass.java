package com.globits.core.sys.domain;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;
import javax.xml.bind.annotation.XmlRootElement;

import com.globits.core.domain.BaseObject;

/**
 * Lớp các khái niệm
 * @author dangnh
 * @since 2020/04/08
 */
@Entity
@Table(name = "tbl_concept_class")
@XmlRootElement
public class ConceptClass  extends BaseObject {
	private static final long serialVersionUID = -5100199485809565238L;
	
	@Column(name="name")
	private String name;
	
	@Column(name="code",nullable = false,unique = true)
	private String code;
	
	@Column(name="short_name")
	private String shortName;
	
	@Column(name="description")
	private String description;
	
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

	public ConceptClass() {
		super();
	}
	
}

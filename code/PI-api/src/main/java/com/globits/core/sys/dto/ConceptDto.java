package com.globits.core.sys.dto;

import com.globits.core.dto.BaseObjectDto;
import com.globits.core.sys.domain.Concept;

public class ConceptDto extends BaseObjectDto {
	private String code;
	private String name;
	private String shortName;
	private String description;
	private int dataType;//giá trị tại: CoreSysConst.ConceptDataType
	private ConceptClassDto conceptClass;//Thuộc nhóm concept nào
	private ConceptDto answerForConcept;//Diễn giải cho Concept nào
	
	public String getCode() {
		return code;
	}
	public void setCode(String code) {
		this.code = code;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
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
	public ConceptClassDto getConceptClass() {
		return conceptClass;
	}
	public void setConceptClass(ConceptClassDto conceptClass) {
		this.conceptClass = conceptClass;
	}
	public ConceptDto getAnswerForConcept() {
		return answerForConcept;
	}
	public void setAnswerForConcept(ConceptDto answerForConcept) {
		this.answerForConcept = answerForConcept;
	}
	
	public ConceptDto() {
	}
	
	public ConceptDto(Concept entity) {
		if (entity != null) {
			this.id = entity.getId();
			this.name = entity.getName();
			this.code = entity.getCode();
			this.shortName = entity.getShortName();
			this.description = entity.getDescription();
			this.dataType = entity.getDataType();
			if (entity.getConceptClass() != null) {
				this.conceptClass = new ConceptClassDto(entity.getConceptClass());
			}
			if (entity.getAnswerForConcept() != null) {
				this.answerForConcept = new ConceptDto(entity.getAnswerForConcept(), false);
			}
		}
	}
	
	public ConceptDto(Concept entity, boolean simple) {
		if (entity != null) {
			this.id = entity.getId();
			this.name = entity.getName();
			this.code = entity.getCode();
			this.shortName = entity.getShortName();
			this.description = entity.getDescription();
			this.dataType = entity.getDataType();
			if (entity.getConceptClass() != null) {
				this.conceptClass = new ConceptClassDto(entity.getConceptClass());
			}
		}
	}

}

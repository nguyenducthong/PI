package com.globits.core.sys.dto;

import java.util.Date;

import com.globits.core.dto.BaseObjectDto;
import com.globits.core.sys.domain.Concept;
import com.globits.core.sys.domain.Obs;

public class ObsDto extends BaseObjectDto {
	private ConceptDto concept;//Giá trị dành cho Concept nào
	private Date obsDate;
	private Boolean valueBoolean;
	private Concept valueCoded;
	private Date valueDatetime;
	private Double valueNumeric;
	private String valueText;
	private String comments;
	
	public ConceptDto getConcept() {
		return concept;
	}
	public void setConcept(ConceptDto concept) {
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
	
	public ObsDto() {
	}
	
	public ObsDto(Obs entity) {
		if (entity != null) {
			if (entity.getConcept() != null) {
				this.concept = new ConceptDto(entity.getConcept());
			}
			this.obsDate = entity.getObsDate();
			this.valueBoolean = entity.getValueBoolean();
			this.valueCoded = entity.getValueCoded();
			this.valueDatetime = entity.getValueDatetime();
			this.valueNumeric = entity.getValueNumeric();
			this.valueText = entity.getValueText();
			this.comments = entity.getComments();
		}
	}

}

package com.globits.core.sys.dto;

import com.globits.core.dto.BaseObjectDto;
import com.globits.core.sys.domain.ConceptClass;

public class ConceptClassDto extends BaseObjectDto {
	private String name;
	private String code;
	private String shortName;
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
	public ConceptClassDto() {
	}

	public ConceptClassDto(ConceptClass entity) {
		if (entity != null) {
			this.id = entity.getId();
			this.name = entity.getName();
			this.code = entity.getCode();
			this.shortName = entity.getShortName();
			this.description = entity.getDescription();
		}
	}
}

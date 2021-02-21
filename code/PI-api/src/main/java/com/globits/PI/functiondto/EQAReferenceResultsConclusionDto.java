package com.globits.PI.functiondto;

import java.util.UUID;

public class EQAReferenceResultsConclusionDto {
	private UUID referenceResultID;
	private UUID reagentID;
	private UUID roundID;
	private UUID sampleID;
	private Integer typeMethod;
	private Integer referenceResult;
	private Integer priority;
	private Integer officialResult;//Kết quả của PI
	private Boolean checkView;
	public UUID getReferenceResultID() {
		return referenceResultID;
	}
	public void setReferenceResultID(UUID referenceResultID) {
		this.referenceResultID = referenceResultID;
	}
	public UUID getReagentID() {
		return reagentID;
	}
	public void setReagentID(UUID reagentID) {
		this.reagentID = reagentID;
	}
	public UUID getRoundID() {
		return roundID;
	}
	public void setRoundID(UUID roundID) {
		this.roundID = roundID;
	}
	public Integer getTypeMethod() {
		return typeMethod;
	}
	public void setTypeMethod(Integer typeMethod) {
		this.typeMethod = typeMethod;
	}
	public Integer getReferenceResult() {
		return referenceResult;
	}
	public void setReferenceResult(Integer referenceResult) {
		this.referenceResult = referenceResult;
	}
	public UUID getSampleID() {
		return sampleID;
	}
	public void setSampleID(UUID sampleID) {
		this.sampleID = sampleID;
	}
	public Integer getPriority() {
		return priority;
	}
	public void setPriority(Integer priority) {
		this.priority = priority;
	}
	public Integer getOfficialResult() {
		return officialResult;
	}
	public void setOfficialResult(Integer officialResult) {
		this.officialResult = officialResult;
	}
	public Boolean getCheckView() {
		return checkView;
	}
	public void setCheckView(Boolean checkView) {
		this.checkView = checkView;
	}
	
}

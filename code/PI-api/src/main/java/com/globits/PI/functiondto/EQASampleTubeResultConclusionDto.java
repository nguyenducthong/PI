package com.globits.PI.functiondto;

import java.util.UUID;

public class EQASampleTubeResultConclusionDto implements Comparable<EQASampleTubeResultConclusionDto> {
	
	private UUID tubeID;
	
	private String tubeCode;
	
	//Kết quả xét nghiệm; giá trị: PIConst.EQASampleStatus: Âm tính, dương tính, không xác định
	private Integer result;
	
	private String note;

	public UUID getTubeID() {
		return tubeID;
	}

	public void setTubeID(UUID tubeID) {
		this.tubeID = tubeID;
	}

	public Integer getResult() {
		return result;
	}

	public void setResult(Integer result) {
		this.result = result;
	}

	public String getNote() {
		return note;
	}

	public void setNote(String note) {
		this.note = note;
	}

	public String getTubeCode() {
		return tubeCode;
	}

	public void setTubeCode(String tubeCode) {
		this.tubeCode = tubeCode;
	}

	@Override
	public int compareTo(EQASampleTubeResultConclusionDto dto) {
		int result;
		if (dto.getTubeCode() != null && this.tubeCode != null) {
			result = this.tubeCode.compareTo(dto.getTubeCode());
		} else {
			result = this.tubeID.compareTo(dto.getTubeID());
		}
		return result;
	}
	
}

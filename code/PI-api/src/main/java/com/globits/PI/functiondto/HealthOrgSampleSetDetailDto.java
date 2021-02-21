package com.globits.PI.functiondto;

import java.util.ArrayList;
import java.util.List;

import com.globits.PI.domain.HealthOrg;
import com.globits.PI.dto.EQASampleSetDto;
import com.globits.PI.dto.HealthOrgEQARoundDto;

public class HealthOrgSampleSetDetailDto {
	private String note;
	private int numberOfHealthOrg=0;
	private EQASampleSetDto eQASampleSetDto;
	private List<HealthOrgEQARoundDto> listHealthOrg = new ArrayList<HealthOrgEQARoundDto>();
	
	public String getNote() {
		return note;
	}
	public void setNote(String note) {
		this.note = note;
	}
	public int getNumberOfHealthOrg() {
		if(listHealthOrg!=null && listHealthOrg.size()>0) {
			numberOfHealthOrg = listHealthOrg.size();
		}
		return numberOfHealthOrg;
	}
	public EQASampleSetDto geteQASampleSetDto() {
		return eQASampleSetDto;
	}
	public void seteQASampleSetDto(EQASampleSetDto eQASampleSetDto) {
		this.eQASampleSetDto = eQASampleSetDto;
	}
	public List<HealthOrgEQARoundDto> getListHealthOrg() {
		return listHealthOrg;
	}
	public void setListHealthOrg(List<HealthOrgEQARoundDto> listHealthOrg) {
		this.listHealthOrg = listHealthOrg;
	}
	
	
}

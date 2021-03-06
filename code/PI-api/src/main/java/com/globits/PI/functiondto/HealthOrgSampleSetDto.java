package com.globits.PI.functiondto;


import java.util.List;

import com.globits.PI.dto.EQARoundDto;
import com.globits.PI.dto.EQASampleSetDto;

public class HealthOrgSampleSetDto {
	private EQARoundDto round;
	private List<EQASampleSetDto> listSampleSet;
	private List<HealthOrgSampleSetDetailDto> listDetail;
	
	public EQARoundDto getRound() {
		return round;
	}
	public void setRound(EQARoundDto round) {
		this.round = round;
	}
	public List<EQASampleSetDto> getListSampleSet() {
		return listSampleSet;
	}
	public void setListSampleSet(List<EQASampleSetDto> listSampleSet) {
		this.listSampleSet = listSampleSet;
	}
	public List<HealthOrgSampleSetDetailDto> getListDetail() {
		return listDetail;
	}
	public void setListDetail(List<HealthOrgSampleSetDetailDto> listDetail) {
		this.listDetail = listDetail;
	}
	public HealthOrgSampleSetDto() {
		
	}
}

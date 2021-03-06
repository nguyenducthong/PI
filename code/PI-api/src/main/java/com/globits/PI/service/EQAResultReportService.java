package com.globits.PI.service;

import java.text.ParseException;
import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Page;
import com.globits.PI.domain.EQAResultReport;
import com.globits.PI.dto.EQAResultReportDto;
import com.globits.PI.functiondto.EQAResultReportSearchDto;
import com.globits.PI.functiondto.EQASampleTubeResultConclusionDto;
import com.globits.PI.functiondto.TestResultDto;
import com.globits.core.service.GenericService;

public interface EQAResultReportService extends GenericService<EQAResultReport, UUID> {

	public Page<EQAResultReportDto> searchByDto(EQAResultReportSearchDto dto);
	
	public Page<EQAResultReportDto> searchByDtoAll(EQAResultReportSearchDto dto);

	public EQAResultReportDto saveOrUpdate(EQAResultReportDto dto, UUID id)  throws ParseException ;

	public EQAResultReportDto getById(UUID id);
	
	public Boolean deleteById(UUID id);
	
	public List<EQAResultReportDto> getAllResultByHealthOrgEQARoundId(UUID id);
	
	public List<EQAResultReport> getAllResultByHealthOrg(UUID id);
	
	Boolean updateResultReportConclusionBySampleTube(List<EQASampleTubeResultConclusionDto> dtoList, UUID orgID,Boolean isFinalResult);

	public List<EQASampleTubeResultConclusionDto> getEQASampleTubeResultConclusionDtoByHealthOrgEQARoundId(UUID orgID);
	
	public List<EQAResultReportDto> getAllResultByHealthOrgManagementEQARoundId(UUID id);

	public Boolean checkReagent(UUID id, UUID idHealthOrgRound, UUID idReagent, Integer typeMethod);
	
	public Integer countResultReport(UUID id);

	public EQAResultReportDto updateFinalResultStatus(UUID id, boolean isFinalResult);

	public List<TestResultDto> getListTestResultByRound(UUID RoundId, UUID reagentId, Integer testMethod, UUID sampleId);

}


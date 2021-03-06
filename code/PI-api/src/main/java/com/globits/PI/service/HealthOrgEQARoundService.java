package com.globits.PI.service;

import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Page;

import com.globits.PI.domain.HealthOrgEQARound;
import com.globits.PI.dto.EQAPlanningDto;
import com.globits.PI.dto.EQARoundDto;
import com.globits.PI.dto.HealthOrgDto;
import com.globits.PI.dto.HealthOrgEQARoundDto;
import com.globits.PI.functiondto.HealthOrgEQARoundSearchDto;
import com.globits.core.dto.ResultMessageDto;
import com.globits.core.service.GenericService;

public interface HealthOrgEQARoundService extends GenericService<HealthOrgEQARound, UUID> {
	
	Page<HealthOrgEQARoundDto> searchByDto(HealthOrgEQARoundSearchDto dto);

	HealthOrgEQARoundDto saveOrUpdate(HealthOrgEQARoundDto dto, UUID id);

	HealthOrgEQARoundDto getById(UUID id);

	Boolean deleteById(UUID id);

	Page<HealthOrgDto> searchHealthOrg(HealthOrgEQARoundSearchDto dto);

	Page<EQARoundDto> searchEQARoundByPage(HealthOrgEQARoundSearchDto dto);

	HealthOrgEQARoundDto healthOrgRegisterRound(UUID roundId);

	HealthOrgEQARoundDto handleCancelRegistration(UUID id);

	ResultMessageDto addMultiple(List<HealthOrgEQARoundDto> dtoList);

	List<HealthOrgEQARoundDto> getListByRoundID(UUID roundID);

	HealthOrgEQARoundDto cancelRegistration(UUID healthOrgId, UUID roundId);
	
	Integer countNumberOfHealthOrgEQARound();
	
	Boolean changeSampleTransferStatus(UUID healthOrgID, Integer status);
	
	Page<HealthOrgEQARoundDto> searchByTransferredSample(HealthOrgEQARoundSearchDto dto);
	
	List<HealthOrgEQARoundDto> getListHealthOrgEQARoundByEQARoundIdAndCurrentUser(UUID roundID);
	
	Page<EQAPlanningDto> searchEQAPlanningByPage(HealthOrgEQARoundSearchDto dto);

	Boolean updateSubscriptionStatus(List<UUID> listId);

	Boolean updateStatus(List<HealthOrgEQARoundDto> dtoList);
	
	public List<HealthOrgEQARoundDto> getListHealthOrgManagementEQARoundByEQARoundId(UUID roundID);
	
	public Page<HealthOrgEQARoundDto> searchByPage(HealthOrgEQARoundSearchDto dto);
	
	public List<HealthOrgEQARoundDto> getListHealthOrgEQARoundByEQARoundId(UUID roundID);
	
	public HealthOrgEQARoundDto getHealthOrgEQARound(UUID healthOrgId,UUID roundId);

	Boolean updateStatusSentResults(UUID healthOrgId, UUID roundId);
}

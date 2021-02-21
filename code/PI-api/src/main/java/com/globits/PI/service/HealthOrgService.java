package com.globits.PI.service;

import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Page;

import com.globits.PI.domain.HealthOrg;
import com.globits.PI.dto.HealthOrgDto;
import com.globits.PI.functiondto.HealthOrgSampleSetDto;
import com.globits.PI.functiondto.HealthOrgSearchDto;
import com.globits.core.service.GenericService;
import com.globits.security.domain.User;

public interface HealthOrgService extends GenericService<HealthOrg, UUID> {

	Page<HealthOrgDto> searchByDto(HealthOrgSearchDto dto);

	HealthOrgDto saveOrUpdate(HealthOrgDto dto, UUID id);

	HealthOrgDto getById(UUID id);

	Boolean deleteById(UUID id);

	Boolean checkDuplicateCode(UUID id, String code);

	HealthOrgSampleSetDto allocationSampleToHealthOrg(HealthOrgSampleSetDto dto);

	void setCodeForAllHealthOrg();

	HealthOrgSampleSetDto classifyHealthOrgByRound(UUID roundId, int numberToBreak);
	
	List<User> createAccountForAllHealthOrg();

	Page<HealthOrgDto> searchNotInRound(HealthOrgSearchDto dto);

	Boolean checkDuplicateEmail(UUID id, String email);

}

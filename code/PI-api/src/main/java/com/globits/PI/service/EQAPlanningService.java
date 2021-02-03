package com.globits.PI.service;

import java.util.UUID;

import org.springframework.data.domain.Page;

import com.globits.PI.domain.EQAPlanning;
import com.globits.PI.dto.EQAPlanningDto;
import com.globits.PI.functiondto.EQAPlanningSearchDto;
import com.globits.core.service.GenericService;

public interface EQAPlanningService extends GenericService<EQAPlanning, UUID> {

	Page<EQAPlanningDto> searchByDto(EQAPlanningSearchDto dto);

	EQAPlanningDto saveOrUpdate(EQAPlanningDto dto, UUID id);

	EQAPlanningDto getById(UUID id);

	Boolean deleteById(UUID id);

	Boolean checkDuplicateCode(UUID id, String code);
	
	Boolean checkNotBeingUsed(UUID id);
}

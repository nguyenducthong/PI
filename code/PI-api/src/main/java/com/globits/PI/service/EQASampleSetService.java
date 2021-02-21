package com.globits.PI.service;

import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Page;

import com.globits.PI.domain.EQASampleSet;
import com.globits.PI.dto.EQASampleSetDto;
import com.globits.PI.functiondto.EQASampleSetSearchDto;
import com.globits.core.service.GenericService;

public interface EQASampleSetService extends GenericService<EQASampleSet, UUID> {

	Page<EQASampleSetDto> searchByDto(EQASampleSetSearchDto dto);

	EQASampleSetDto saveOrUpdate(EQASampleSetDto dto, UUID id);

	EQASampleSetDto getById(UUID id);

	Boolean deleteById(UUID id);

	Boolean checkDuplicateCode(UUID id, String code);

	List<EQASampleSetDto> getSampleSetByRoundID(UUID id);
	
	List<EQASampleSet> getSampleSetBy(UUID id);

}

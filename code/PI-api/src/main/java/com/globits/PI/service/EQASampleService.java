package com.globits.PI.service;

import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Page;

import com.globits.PI.domain.EQASample;
import com.globits.PI.dto.EQASampleDto;
import com.globits.PI.functiondto.EQASampleSearchDto;
import com.globits.core.service.GenericService;

public interface EQASampleService extends GenericService<EQASample, UUID> {

	Page<EQASampleDto> searchByDto(EQASampleSearchDto dto);

	EQASampleDto saveOrUpdate(EQASampleDto dto, UUID id);

	EQASampleDto getById(UUID id);

	Boolean deleteById(UUID id);

	Boolean checkDuplicateCode(UUID id, String code);

	Boolean checkCode(UUID id, EQASampleDto dto);
	
	List<EQASampleDto> getByRoundId(UUID id);

	Integer countByRoundId(UUID id);

}

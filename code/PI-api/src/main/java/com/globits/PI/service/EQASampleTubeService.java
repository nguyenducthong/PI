package com.globits.PI.service;

import java.util.UUID;

import org.springframework.data.domain.Page;

import com.globits.PI.domain.EQASampleTube;
import com.globits.PI.dto.EQASampleTubeDto;
import com.globits.PI.functiondto.EQASampleTubeSearchDto;
import com.globits.core.service.GenericService;

public interface EQASampleTubeService extends GenericService<EQASampleTube, UUID> {

	Page<EQASampleTubeDto> searchByDto(EQASampleTubeSearchDto dto);

	EQASampleTubeDto saveOrUpdate(EQASampleTubeDto dto, UUID id);

	EQASampleTubeDto getById(UUID id);

	Boolean deleteById(UUID id);

	Boolean checkDuplicateCode(UUID id, String code);

	Integer countNumberOfCorrectSampleTube();
	
	Integer countNumberOfIncorrectSampleTube();
	
	Integer countNumberOfNotSubmittedSampleTube();
}

package com.globits.PI.service;

import java.util.UUID;

import org.springframework.data.domain.Page;
import com.globits.PI.domain.Reagent;
import com.globits.PI.dto.ReagentDto;
import com.globits.PI.functiondto.ReagentSearchDto;
import com.globits.core.service.GenericService;

public interface ReagentService extends GenericService<Reagent, UUID> {

	Page<ReagentDto> searchByDto(ReagentSearchDto dto);

	ReagentDto saveOrUpdate(ReagentDto dto, UUID id);

	ReagentDto getById(UUID id);

	Boolean deleteById(UUID id);

	Boolean checkDuplicateCode(UUID id, String code);
	
	
}

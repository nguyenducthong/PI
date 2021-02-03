package com.globits.core.sys.service;

import java.util.UUID;

import org.springframework.data.domain.Page;

import com.globits.PI.functiondto.SearchDto;
import com.globits.core.service.GenericService;
import com.globits.core.sys.domain.ConceptClass;
import com.globits.core.sys.dto.ConceptClassDto;

public interface ConceptClassService extends GenericService<ConceptClass, UUID> {

	Page<ConceptClassDto> searchByDto(SearchDto dto);

	ConceptClassDto saveOrUpdate(ConceptClassDto dto, UUID id);

	ConceptClassDto getById(UUID id);

	Boolean deleteById(UUID id);

	Boolean checkDuplicateCode(UUID id, String code);

}

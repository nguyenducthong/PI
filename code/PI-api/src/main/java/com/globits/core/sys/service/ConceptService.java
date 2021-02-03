package com.globits.core.sys.service;

import java.util.UUID;

import org.springframework.data.domain.Page;

import com.globits.core.service.GenericService;
import com.globits.core.sys.domain.Concept;
import com.globits.core.sys.dto.ConceptDto;
import com.globits.core.sys.functiondto.ConceptSearchDto;

public interface ConceptService extends GenericService<Concept, UUID> {

	Page<ConceptDto> searchByDto(ConceptSearchDto dto);

	ConceptDto saveOrUpdate(ConceptDto dto, UUID id);

	Boolean checkDuplicateCode(UUID id, String code);

	ConceptDto getById(UUID id);

	Boolean deleteById(UUID id);

}

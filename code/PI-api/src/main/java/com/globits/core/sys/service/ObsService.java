package com.globits.core.sys.service;

import java.util.UUID;

import com.globits.core.service.GenericService;
import com.globits.core.sys.domain.Obs;
import com.globits.core.sys.dto.ConceptDto;
import com.globits.core.sys.dto.ObsDto;

public interface ObsService extends GenericService<Obs, UUID> {

	ObsDto saveOrUpdate(ObsDto dto, UUID id);

	ObsDto getById(UUID id);

	Boolean deleteById(UUID id);

}

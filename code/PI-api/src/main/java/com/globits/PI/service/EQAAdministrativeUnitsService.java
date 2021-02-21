package com.globits.PI.service;

import java.util.UUID;

import org.springframework.data.domain.Page;

import com.globits.PI.functiondto.SearchDto;
import com.globits.core.domain.AdministrativeUnit;
import com.globits.core.dto.AdministrativeUnitDto;
import com.globits.core.service.GenericService;

public interface EQAAdministrativeUnitsService  extends GenericService<AdministrativeUnit, UUID>{

	Page<AdministrativeUnitDto> searchByDto(SearchDto dto);

	Boolean checkDuplicateCode(UUID id, String code);

}

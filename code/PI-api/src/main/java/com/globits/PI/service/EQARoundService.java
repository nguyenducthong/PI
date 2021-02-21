package com.globits.PI.service;

import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Page;

import com.globits.PI.domain.EQARound;
import com.globits.PI.dto.EQARoundDto;
import com.globits.PI.functiondto.EQARoundSearchDto;
import com.globits.core.service.GenericService;

public interface EQARoundService extends GenericService<EQARound, UUID> {

	Boolean deleteById(UUID id);

	EQARoundDto getDtoById(UUID id);

	Page<EQARoundDto> searchByDto(EQARoundSearchDto dto);

	Boolean checkDuplicateCode(UUID id, String code);

	EQARoundDto saveOrUpdate(EQARoundDto dto);

	EQARoundDto getCurentEQARound();

	Integer checkOrderNumber(int year);

	Integer countNumberOfEQARound();

	List<EQARoundDto> getEQARoundsByPlanning(UUID id);
}

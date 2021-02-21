package com.globits.PI.service;

import java.util.UUID;

import org.springframework.data.domain.Page;

import com.globits.PI.domain.EQASerumBank;
import com.globits.PI.dto.EQASerumBankDto;
import com.globits.PI.functiondto.EQASerumBankSearchDto;
import com.globits.core.service.GenericService;

public interface EQASerumBankService extends GenericService<EQASerumBank, UUID> {

	Page<EQASerumBankDto> searchByDto(EQASerumBankSearchDto dto);

	EQASerumBankDto saveOrUpdate(EQASerumBankDto dto, UUID id);

	EQASerumBankDto getById(UUID id);

	Boolean deleteById(UUID id);

	Boolean checkDuplicateCode(UUID id, String code);

	Boolean checkDuplicateCodeSerum(UUID id, String code);

}

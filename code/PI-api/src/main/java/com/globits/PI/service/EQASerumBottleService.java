package com.globits.PI.service;


import com.globits.PI.domain.EQASerumBank;
import com.globits.PI.domain.EQASerumBottle;
import com.globits.PI.dto.EQASerumBankDto;
import com.globits.PI.dto.EQASerumBottleDto;
import com.globits.PI.functiondto.EQASerumbottleSearchDto;
import com.globits.core.service.GenericService;
import org.springframework.data.domain.Page;

import java.util.List;
import java.util.UUID;

public interface EQASerumBottleService extends GenericService<EQASerumBottle, UUID> {

    Page<EQASerumBottleDto> searchByDto(EQASerumbottleSearchDto dto);

    EQASerumBottleDto saveOrUpdate(EQASerumBottleDto dto, UUID id);

    EQASerumBottleDto getById(UUID id);

    Boolean deleteById(UUID id);

    List<EQASerumBottleDto> getBySerumBank(EQASerumBankDto serumBank);
    
    void saveOrUpdateMultiple(List<EQASerumBottleDto> dtoList, UUID serumBankID);

	String createCode(EQASerumBank eQASerumBank, int startIndex);

	Boolean checkDuplicateCode(UUID id, String code);
}

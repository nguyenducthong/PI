package com.globits.PI.repository;

import java.util.List;
import java.util.UUID;

import javax.transaction.Transactional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.globits.PI.domain.EQASerumBottle;
import com.globits.PI.dto.EQASerumBottleDto;

@Repository
public interface EQASerumBottleRepository extends JpaRepository<EQASerumBottle, UUID> {

    @Query("select entity FROM EQASerumBottle entity where entity.eqaSerumBank.id =?1 order by entity.createDate desc ")
    EQASerumBottle getOneBySerumBank(UUID serumBankId);

    @Query("select entity FROM EQASerumBottle entity where entity.code =?1 order by entity.createDate desc ")
    List<EQASerumBottle> findByCode(String newCode);
    
    @Query("select entity FROM EQASerumBottle entity where entity.code =?1 ")
    EQASerumBottle findByCodeBottle(String newCode);

    @Query("select new com.globits.PI.dto.EQASerumBottleDto(entity) FROM EQASerumBottle entity where entity.eqaSerumBank.id =?1 ")
	List<EQASerumBottleDto> getAllBySerumBank(UUID id);
    
    @Transactional
    @Modifying
    @Query("DELETE FROM EQASampleBottle entity WHERE entity.eQASerumBottle.id =?1")
    void deleteSampleBottle(UUID id);
    
    @Query("SELECT COUNT(entity) FROM EQASampleBottle entity WHERE entity.eQASerumBottle.id = ?1")
    Integer countSampleBottle(UUID id);
}

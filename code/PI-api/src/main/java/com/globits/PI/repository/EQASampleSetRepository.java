package com.globits.PI.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.globits.PI.domain.EQASampleSet;
import com.globits.PI.dto.EQASampleSetDto;

@Repository
public interface EQASampleSetRepository extends JpaRepository<EQASampleSet, UUID> {

	@Query("select entity FROM EQASampleSet entity where entity.code =?1 ")
	EQASampleSet getByCode(String code);

	@Query("SELECT new com.globits.PI.dto.EQASampleSetDto(entity) FROM EQASampleSet entity where entity.eqaRound.id = ?1")
	List<EQASampleSetDto> getSampleSetByRoundID(UUID id);
	
	@Query("SELECT COUNT(entity) FROM HealthOrgEQARound entity WHERE entity.sampleSet.id = ?1")
	Integer countHealthOrgEQARound(UUID id);
	
	@Query("SELECT entity FROM EQASampleSet entity where entity.eqaRound.id = ?1")
	List<EQASampleSet> getSampleSet(UUID id);
}

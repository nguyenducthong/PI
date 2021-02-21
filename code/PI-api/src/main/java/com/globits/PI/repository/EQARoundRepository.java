package com.globits.PI.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.globits.PI.domain.EQARound;
import com.globits.PI.dto.EQARoundDto;

@Repository
public interface EQARoundRepository extends JpaRepository<EQARound, UUID> {

	@Query("select entity FROM EQARound entity where entity.code =?1 ")
	EQARound getByCode(String checkCode);

	@Query("select new com.globits.PI.dto.EQARoundDto(entity) FROM EQARound entity where entity.eqaPlanning.id =?1 ")
	List<EQARoundDto> getEQARoundsByPlanning(UUID id);

	@Query("select entity FROM EQARound entity where entity.id =?1 ")
	EQARound getEQARoundById(UUID id);
	
	@Query("SELECT COUNT(entity) FROM EQARound entity")
	Integer countNumberOfEQARound();
	
	@Query("SELECT COUNT(entity) FROM EQASampleSet entity WHERE entity.eqaRound.id = ?1")
	Integer countEQASampleSet(UUID id);
	
	@Query("SELECT COUNT(entity) FROM EQASample entity WHERE entity.round.id = ?1")
	Integer countEQASample(UUID id);
	
	@Query("SELECT COUNT(entity) FROM HealthOrgEQARound entity WHERE entity.round.id = ?1")
	Integer countHealthOrgEQARound(UUID id);
	
	@Query("SELECT new com.globits.PI.dto.EQARoundDto(entity) FROM EQARound entity WHERE entity.eqaPlanning.year =?1 ")
	List<EQARoundDto> getByYear(int year);
}

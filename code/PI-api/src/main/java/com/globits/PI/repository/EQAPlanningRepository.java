package com.globits.PI.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.globits.PI.domain.EQAPlanning;

@Repository
public interface EQAPlanningRepository extends JpaRepository<EQAPlanning, UUID> {

	@Query("select entity FROM EQAPlanning entity where entity.code =?1 ")
	EQAPlanning getByCode(String code);

	@Query("SELECT COUNT(round.eqaPlanning.id) FROM EQARound round WHERE round.eqaPlanning.id = ?1")
	Integer countEQAPlanningInEQARound(UUID id);
	
	@Query("select entity FROM EQAPlanning entity where entity.year =?1 ORDER BY entity.code ASC")
	List<EQAPlanning> getByYear(int year);
}

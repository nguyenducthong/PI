package com.globits.PI.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.globits.PI.domain.EQASerumBank;

@Repository
public interface EQASerumBankRepository extends JpaRepository<EQASerumBank, UUID> {

	@Query("select entity FROM EQASerumBank entity where entity.originalCode =?1 ")
	EQASerumBank getByCode(String originalCode);
	
	@Query("select entity FROM EQASerumBank entity where entity.serumCode =?1 ")
	EQASerumBank getByCodeSerum(String serumCode);

	@Query("select entity FROM EQASerumBank entity where entity.serumCode =?1 ")
	List<EQASerumBank> findBySerumCode(String code);

	@Transactional
	@Modifying
	@Query("DELETE FROM EQASerumBottle entity WHERE entity.eqaSerumBank.id = ?1")
	void deleteAllSerumBottle(UUID serumBankID);
	
	@Query("SELECT COUNT(entity) FROM EQASerumBottle entity WHERE entity.eqaSerumBank.id = ?1")
	Integer countSerumBottle(UUID id);
	
	@Query("SELECT COUNT(entity) FROM EQASerumBottle entity WHERE entity.eqaSerumBank.id = ?1 AND (entity.resultBottle IS NULL OR entity.resultBottle = 0) ")
	Integer countSerumBottleRemaining(UUID id);
}
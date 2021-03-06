package com.globits.PI.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.globits.PI.domain.EQARound;
import com.globits.PI.domain.HealthOrgEQARound;
import com.globits.PI.dto.HealthOrgEQARoundDto;

@Repository
public interface HealthOrgEQARoundRepository extends JpaRepository<HealthOrgEQARound, UUID> {

	@Query("select new com.globits.PI.dto.HealthOrgEQARoundDto(entity) FROM HealthOrgEQARound entity ")
	List<HealthOrgEQARoundDto> getAll();

	@Query("select new com.globits.PI.dto.HealthOrgEQARoundDto(entity) FROM HealthOrgEQARound entity WHERE entity.round.id =?1 ")
	List<HealthOrgEQARoundDto> getListHealthOrgEQARoundByEQARoundId(UUID id);

	@Query("select new com.globits.PI.dto.HealthOrgEQARoundDto(entity) FROM HealthOrgEQARound entity WHERE entity.healthOrg.id =?1 AND entity.round.id =?2 ")
	List<HealthOrgEQARoundDto> getListByHealthOrgAndEQARound(UUID healthOrgId, UUID eQARoundId);

	@Query("select entity FROM HealthOrgEQARound entity WHERE entity.healthOrg.id =?2 AND entity.round.id =?1 ")
	List<HealthOrgEQARound> getListByEQARoundAndHealthOrg(UUID eQARoundId, UUID healthOrgId);

	@Query("select entity FROM HealthOrgEQARound entity where entity.id =?1 ")
	HealthOrgEQARound getHealthOrgEQARoundById(UUID id);
	
	@Query("select entity FROM HealthOrgEQARound entity where entity.healthOrg.id =?1 AND entity.round.id =?2 AND entity.status IN (0,1) ")
	List<HealthOrgEQARound> getHealthOrgEQAByHealthOrgId(UUID healthOrgId, UUID roundId);
	
	@Query("select entity FROM HealthOrgEQARound entity where entity.status IN (?1) ")
	List<HealthOrgEQARound> getByStatus(List<Integer> listStatus);
	
	@Query("SELECT COUNT(entity) FROM HealthOrgEQARound entity WHERE entity.status = 1 OR entity.status = 0")
	Integer countNumberOfHealthOrgEQARound();
	
	@Query("SELECT COUNT(entity) FROM EQAResultReport entity WHERE entity.healthOrgRound.id = ?1")
	Integer countEQAResultReport(UUID id);
	
	@Query("UPDATE HealthOrgEQARound entity SET entity.status = ?1 WHERE entity.id IN ?2")
	Void updateSubscriptionStatus(Integer status, List<UUID> list);
	
	
	@Query("select entity FROM HealthOrgEQARound entity WHERE entity.round.id =?1 ")
	List<HealthOrgEQARound> getHealthOrgEQARoundByEQARoundId(UUID id);
	
//	@Query("UPDATE HealthOrgEQARound entity SET entity.statusSentResults = ?1 WHERE entity.id IN ?2")
//	Void updateStatusSentResults(Boolean status, List<UUID> list);
}

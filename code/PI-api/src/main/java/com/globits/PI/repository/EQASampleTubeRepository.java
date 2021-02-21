package com.globits.PI.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.globits.PI.domain.EQASampleTube;
import com.globits.PI.dto.EQASampleTubeDto;

@Repository
public interface EQASampleTubeRepository extends JpaRepository<EQASampleTube, UUID> {

	@Query("select entity FROM EQASampleTube entity where entity.code =?1 ")
	EQASampleTube getByCode(String code);

	@Query("select entity FROM EQASampleTube entity where entity.healthOrgEQARound.id =?1 AND entity.type = 1 AND entity.healthOrgEQARound.sampleTransferStatus = 3 ORDER BY entity.code ASC ")
	List<EQASampleTubeDto> getByHealthOrgEQARoundId(UUID id);
	
	@Query("select entity FROM EQASampleTube entity where entity.healthOrgEQARound.id =?1 ORDER BY entity.code ASC ")
	List<EQASampleTubeDto> getByHealthOrgEQARoundIdAdmin(UUID id);
	
	@Query("select entity FROM EQASampleTube entity where entity.eqaRound.id =?1 and entity.healthOrg.id=?2")
	List<EQASampleTubeDto> getByHealthOrgAndEQARound(UUID roundId, UUID healthOrgId);
	
	@Query("select entity FROM EQASampleTube entity where entity.eqaRound.id =?1 and entity.healthOrg.id=?2 AND entity.sampleSetDetail.id=?3 AND entity.type = ?4 ")
	List<EQASampleTube> getByHealthOrgAndEQARoundAndSample(UUID roundId, UUID healthOrgId, UUID sampleSetDetailId, Integer type);
	
	@Query("SELECT COUNT(entity) FROM EQASampleTube entity JOIN EQASample sample ON entity.eqaSample.id = sample.id WHERE entity.status = 3 AND entity.lastResultFromLab = sample.result")
	Integer countNumberOfCorrectSampleTube();
	
	@Query("SELECT COUNT(entity) FROM EQASampleTube entity JOIN EQASample sample ON entity.eqaSample.id = sample.id WHERE entity.status = 3 AND entity.lastResultFromLab <> sample.result")
	Integer countNumberOfIncorrectSampleTube();
	
	@Query("SELECT COUNT(entity) FROM EQASampleTube entity JOIN EQASample sample ON entity.eqaSample.id = sample.id WHERE entity.status < 1")
	Integer countNumberOfNotSubmittedSampleTube();
	
	
}

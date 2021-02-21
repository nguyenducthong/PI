package com.globits.PI.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.globits.PI.domain.EQAResultReport;
import com.globits.PI.dto.EQAResultReportDto;

@Repository
public interface EQAResultReportRepository extends JpaRepository<EQAResultReport, UUID> {

	@Query("select new com.globits.PI.dto.EQAResultReportDto(entity) FROM EQAResultReport entity where entity.healthOrgRound.id =?1 and entity.isFinalResult is true ORDER BY entity.typeMethod ASC")
	List<EQAResultReportDto> getAllResultByHealthOrgEQARoundId(UUID id);
	
	@Query("select new com.globits.PI.dto.EQAResultReportDto(entity) FROM EQAResultReport entity where entity.healthOrgRound.id = ?1 and entity.typeMethod = 5 ")
	EQAResultReportDto getConclusionByHealthOrgEQARoundId(UUID orgID);

	@Query("SELECT new com.globits.PI.dto.EQAResultReportDto(entity) FROM EQAResultReport entity WHERE entity.healthOrgRound.round.id = ?1 AND entity.typeMethod = 5")
	List<EQAResultReportDto> getConclusionByEQARoundId(UUID roundID);
	
	@Query("select entity FROM EQAResultReport entity  where entity.typeMethod = 5 and entity.healthOrgRound.round.id =?1 and entity.isFinalResult is true")
	List<EQAResultReport> getAllResultByHealthOrg(UUID id);
	
	@Query("select new com.globits.PI.dto.EQAResultReportDto(entity) FROM EQAResultReport entity where entity.healthOrgRound.id =?1  ORDER BY entity.typeMethod ASC")
	List<EQAResultReportDto> getAllResultByHealthOrgManagementEQARoundId(UUID id);
	
	@Query("Select entity FROM EQAResultReport entity where entity.healthOrgRound.id =?1 and entity.reagent.id = ?2 and entity.typeMethod = ?3 ")
	List<EQAResultReport> countReagentByHealthOrgRound(UUID idHealthOrgRound, UUID idReagent, Integer typeMethod);
	
	@Query("SELECT COUNT(entity) FROM EQAResultReport entity WHERE entity.healthOrgRound.id = ?1")
	Integer countResultReport(UUID id);
}
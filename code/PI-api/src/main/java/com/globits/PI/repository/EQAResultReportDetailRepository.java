package com.globits.PI.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.globits.PI.domain.EQAResultReportDetail;
import com.globits.PI.dto.EQAResultReportDetailDto;

@Repository
public interface EQAResultReportDetailRepository extends JpaRepository<EQAResultReportDetail, UUID> {
	@Query("SELECT de FROM EQAResultReportDetail de WHERE de.resultReport.healthOrgRound.round.id=?1 and de.resultReport.isFinalResult is true ")
	List<EQAResultReportDetail> getListFinalResultByRoundId(UUID roundId);
	
	@Query("SELECT de FROM EQAResultReportDetail de WHERE de.resultReport.healthOrgRound.round.id=?1 and de.resultReport.healthOrgRound.healthOrg.id=?2 and de.resultReport.isFinalResult is true ")
	List<EQAResultReportDetail> getListFinalResultByRoundId(UUID roundId,UUID healthOrgId);
	
	@Query("SELECT d FROM EQAResultReportDetail d WHERE d.result IS NULL")
	List<EQAResultReportDetail> listResultReportDetail();
}

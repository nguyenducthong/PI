package com.globits.PI.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.globits.PI.domain.EQASampleSetDetail;
import com.globits.PI.dto.EQASampleSetDetailDto;

@Repository
public interface EQASampleSetDetailRepository extends JpaRepository<EQASampleSetDetail, UUID> {

	@Query("select entity FROM EQASampleSetDetail entity where entity.sampleSet.id =?1 ")
	List<EQASampleSetDetailDto> getByEQASampleSetId(UUID id);

}

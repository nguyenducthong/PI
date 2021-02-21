package com.globits.PI.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.globits.PI.domain.EQASample;
import com.globits.PI.dto.EQASampleDto;

@Repository
public interface EQASampleRepository extends JpaRepository<EQASample, UUID> {

	@Query("select entity FROM EQASample entity where entity.code =?1 ")
	List<EQASample> getByCode(String code);
	
	@Query("select entity FROM EQASample entity where entity.round.id =?1 ORDER BY entity.code ASC")
	List<EQASample> getByRoundId(UUID id);

	@Query("select new com.globits.PI.dto.EQASampleDto(entity) FROM EQASample entity where entity.round.id =?1 ORDER BY entity.code ASC")
	List<EQASampleDto> getRoundId(UUID id);
}

package com.globits.PI.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.globits.PI.domain.Reagent;
import com.globits.PI.dto.ReagentDto;

@Repository
public interface ReagentRepository extends JpaRepository<Reagent, UUID> {

	@Query("select entity FROM Reagent entity where entity.code =?1 ")
	Reagent getByCode(String code);

	@Query("select new com.globits.PI.dto.ReagentDto(entity) FROM Reagent entity ")
	List<ReagentDto> getAll();

}

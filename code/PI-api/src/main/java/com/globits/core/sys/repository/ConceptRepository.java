package com.globits.core.sys.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.globits.core.sys.domain.Concept;

@Repository
public interface ConceptRepository extends JpaRepository<Concept, UUID> {

	@Query("select entity FROM Concept entity where entity.code =?1 ")
	Concept getByCode(String code);

}

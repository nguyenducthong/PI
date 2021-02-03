package com.globits.core.sys.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.globits.core.sys.domain.ConceptClass;

@Repository
public interface ConceptClassRepository extends JpaRepository<ConceptClass, UUID> {

	@Query("select entity FROM ConceptClass entity where entity.code =?1 ")
	ConceptClass getByCode(String code);

}

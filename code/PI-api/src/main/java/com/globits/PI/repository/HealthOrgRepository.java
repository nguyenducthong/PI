package com.globits.PI.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.globits.PI.domain.HealthOrg;
import com.globits.PI.dto.HealthOrgDto;

@Repository
public interface HealthOrgRepository extends JpaRepository<HealthOrg, UUID> {

	@Query("select entity FROM HealthOrg entity where entity.code =?1 ")
	HealthOrg getByCode(String code);
	
	@Query("select entity FROM HealthOrg entity where entity.email =?1 ")
	List<HealthOrg> getByEmail(String email);
	
	@Query("select entity FROM HealthOrg entity where entity.id =?1 ")
	HealthOrg getHealthOrgById(UUID id);
	

	@Query("select new com.globits.PI.dto.HealthOrgDto(entity) FROM HealthOrg entity ")
	List<HealthOrgDto> getAll();
	
	@Query(" select MAX(entity.orderNumber) FROM HealthOrg entity ")
	Integer getMaxOrderNumber();
}

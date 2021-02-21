package com.globits.PI.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.globits.PI.domain.HealthOrg;
import com.globits.PI.domain.UserInHealthOrg;

@Repository
public interface UserInHealthOrgRepository extends JpaRepository<UserInHealthOrg, UUID> {

	@Query("select entity FROM UserInHealthOrg entity where entity.user.id =?1 ")
	List<UserInHealthOrg> getAllByUserId(Long id);
	
	@Query("select entity FROM UserInHealthOrg entity where entity.user.id =?1 AND entity.healthOrg.id=?2")
	List<UserInHealthOrg> getAllByUserIdAndHealthOrgId(Long id,UUID healthOrgId);
	
	@Query("select entity FROM UserInHealthOrg entity where entity.user.id =?1 ")
	HealthOrg finHealthOrgByUserId(Long id); 
}

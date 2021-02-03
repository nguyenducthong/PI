package com.globits.core.sys.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.globits.core.sys.domain.Obs;

@Repository
public interface ObsRepository extends JpaRepository<Obs, UUID> {

}

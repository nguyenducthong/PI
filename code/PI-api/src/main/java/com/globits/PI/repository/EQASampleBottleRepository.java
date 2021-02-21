package com.globits.PI.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.globits.PI.domain.EQASampleBottle;

public interface EQASampleBottleRepository extends JpaRepository<EQASampleBottle, UUID> {

}

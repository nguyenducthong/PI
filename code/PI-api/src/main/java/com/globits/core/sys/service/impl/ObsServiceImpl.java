package com.globits.core.sys.service.impl;

import java.util.UUID;

import javax.persistence.EntityManager;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.globits.core.service.impl.GenericServiceImpl;
import com.globits.core.sys.domain.Concept;
import com.globits.core.sys.domain.Obs;
import com.globits.core.sys.dto.ObsDto;
import com.globits.core.sys.repository.ConceptRepository;
import com.globits.core.sys.repository.ObsRepository;
import com.globits.core.sys.service.ObsService;

@Transactional
@Service
public class ObsServiceImpl extends GenericServiceImpl<Obs, UUID> implements ObsService {
	
	@Autowired
	private EntityManager manager;

	@Autowired
	private ObsRepository obsRepository;

	@Autowired
	private ConceptRepository conceptRepository;

	@Override
	public ObsDto saveOrUpdate(ObsDto dto, UUID id) {
		if (dto != null) {
			Obs entity = null;
			if (id != null) {
				entity = obsRepository.getOne(id);
			}else {
				entity = new Obs();
			}

			entity.setObsDate(dto.getObsDate());
			entity.setValueBoolean(dto.getValueBoolean());
			entity.setValueCoded(dto.getValueCoded());
			entity.setValueDatetime(dto.getValueDatetime());
			entity.setValueNumeric(dto.getValueNumeric());
			entity.setValueText(dto.getValueText());
			entity.setComments(dto.getComments());
			
			Concept concept = null;
			if (dto.getConcept() != null && dto.getConcept().getId() != null) {
				concept = conceptRepository.getOne(dto.getConcept().getId());
			}
			entity.setConcept(concept);
			
			entity = obsRepository.save(entity);
			if (entity != null ) {
				return new ObsDto(entity);
			}
		}
		return null;
	}

	@Override
	public ObsDto getById(UUID id) {
		if (id != null) {
			Obs entity = obsRepository.getOne(id);
			if (entity != null) {
				return new ObsDto(entity);
			}
		}
		return null;
	}

	@Override
	public Boolean deleteById(UUID id) {
		if (id != null) {
			Obs entity = obsRepository.getOne(id);
			if (entity != null) {
				obsRepository.deleteById(id);
				return true;
			}
		}
		return null;
	}

}

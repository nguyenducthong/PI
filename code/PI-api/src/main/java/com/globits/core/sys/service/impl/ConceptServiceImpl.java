package com.globits.core.sys.service.impl;

import java.util.List;
import java.util.UUID;

import javax.persistence.EntityManager;
import javax.persistence.Query;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import com.globits.core.service.impl.GenericServiceImpl;
import com.globits.core.sys.domain.Concept;
import com.globits.core.sys.domain.ConceptClass;
import com.globits.core.sys.dto.ConceptDto;
import com.globits.core.sys.functiondto.ConceptSearchDto;
import com.globits.core.sys.repository.ConceptClassRepository;
import com.globits.core.sys.repository.ConceptRepository;
import com.globits.core.sys.service.ConceptService;

@Transactional
@Service
public class ConceptServiceImpl extends GenericServiceImpl<Concept, UUID> implements ConceptService {
	
	@Autowired
	private EntityManager manager;

	@Autowired
	private ConceptRepository conceptRepository;

	@Autowired
	private ConceptClassRepository conceptClassRepository;

	@Override
	public Page<ConceptDto> searchByDto(ConceptSearchDto dto) {
		if (dto == null) {
			return null;
		}
		
		int pageIndex = dto.getPageIndex();
		int pageSize = dto.getPageSize();
		
		if (pageIndex > 0) {
			pageIndex--;
		} else {
			pageIndex = 0;
		}

		String whereClause = "";
		
		String sqlCount = "select count(eqap.id) from Concept as eqap where (1=1) ";
		String sql = "select new com.globits.core.sys.dto.ConceptDto(eqap) from Concept as eqap where (1=1) ";

		if (dto.getText() != null && StringUtils.hasText(dto.getText())) {
			whereClause += " AND ( eqap.name LIKE :text OR eqap.code LIKE :text ) ";
		}
		
		sql+=whereClause;
		sqlCount+=whereClause;

		Query q = manager.createQuery(sql, ConceptDto.class);
		Query qCount = manager.createQuery(sqlCount);

		if (dto.getText() != null && StringUtils.hasText(dto.getText())) {
			q.setParameter("text", '%' + dto.getText() + '%');
			qCount.setParameter("text", '%' + dto.getText() + '%');
		}

		int startPosition = pageIndex * pageSize;
		q.setFirstResult(startPosition);
		q.setMaxResults(pageSize);
		List<ConceptDto> entities = q.getResultList();
		long count = (long) qCount.getSingleResult();
		
		Pageable pageable = PageRequest.of(pageIndex, pageSize);
		Page<ConceptDto> result = new PageImpl<ConceptDto>(entities, pageable, count);
		return result;
	}

	@Override
	public ConceptDto saveOrUpdate(ConceptDto dto, UUID id) {
		if (dto != null) {
			Boolean checkCode = this.checkDuplicateCode(id, dto.getCode());
			if (checkCode == null || checkCode) {
				return null;
			}
			Concept entity = null;
			if (id != null) {
				entity = conceptRepository.getOne(id);
			}else {
				entity = new Concept();
			}
			entity.setCode(dto.getCode());
			entity.setName(dto.getName());
			entity.setDescription(dto.getDescription());
			entity.setShortName(dto.getShortName());
			entity.setDataType(dto.getDataType());
			
			ConceptClass conceptClass = null;
			if (dto.getConceptClass() != null && dto.getConceptClass().getId() != null) {
				conceptClass = conceptClassRepository.getOne(dto.getConceptClass().getId());
			}
			entity.setConceptClass(conceptClass);
			
			Concept answerForConcept = null;
			if (dto.getAnswerForConcept() != null && dto.getAnswerForConcept().getId() != null) {
				answerForConcept = conceptRepository.getOne(dto.getAnswerForConcept().getId());
			}
			entity.setAnswerForConcept(answerForConcept);
			
			entity = conceptRepository.save(entity);
			if (entity != null ) {
				return new ConceptDto(entity);
			}
		}
		return null;
	}

	@Override
	public Boolean checkDuplicateCode(UUID id, String code) {
		if (code != null && StringUtils.hasText(code)) {
			Concept entity = conceptRepository.getByCode(code);
			if (entity != null) {
				if (id != null && entity.getId().equals(id)) {
					return false;
				}
				return true;
			}
			return false;
		}
		return null;
	}

	@Override
	public ConceptDto getById(UUID id) {
		if (id != null) {
			Concept entity = conceptRepository.getOne(id);
			if (entity != null) {
				return new ConceptDto(entity);
			}
		}
		return null;
	}

	@Override
	public Boolean deleteById(UUID id) {
		if (id != null) {
			Concept entity = conceptRepository.getOne(id);
			if (entity != null) {
				conceptRepository.deleteById(id);
				return true;
			}
		}
		return null;
	}

}

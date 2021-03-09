package com.globits.PI.service.impl;

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

import com.globits.PI.domain.Reagent;
import com.globits.PI.dto.ReagentDto;
import com.globits.PI.functiondto.ReagentSearchDto;
import com.globits.PI.repository.ReagentRepository;
import com.globits.PI.service.ReagentService;
import com.globits.core.service.impl.GenericServiceImpl;

@Transactional
@Service
public class ReagentServiceImpl extends GenericServiceImpl<Reagent, UUID> implements ReagentService {
	
	@Autowired
	private EntityManager manager;
	
	@Autowired
	private ReagentRepository reagentRepository;

	@Override
	public Page<ReagentDto> searchByDto(ReagentSearchDto dto) {
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
		
		String sqlCount = "select count(entity.id) from Reagent as entity where (1=1) ";
		String sql = "select new com.globits.PI.dto.ReagentDto(entity) from Reagent as entity where (1=1) ";

		if (dto.getText() != null && StringUtils.hasText(dto.getText())) {
			whereClause += " AND ( entity.name LIKE :text OR entity.code LIKE :text ) ";
		}
		
		if (dto.getTestType() != null) {
			whereClause += " AND (entity.testType = :testType) ";
		}
		
		sql+=whereClause;
		sqlCount+=whereClause;

		Query q = manager.createQuery(sql, ReagentDto.class);
		Query qCount = manager.createQuery(sqlCount);

		if (dto.getText() != null && StringUtils.hasText(dto.getText())) {
			q.setParameter("text", '%' + dto.getText() + '%');
			qCount.setParameter("text", '%' + dto.getText() + '%');
		}
		if (dto.getTestType() != null) {
			q.setParameter("testType", dto.getTestType());
			qCount.setParameter("testType", dto.getTestType());
		}
		

		int startPosition = pageIndex * pageSize;
		q.setFirstResult(startPosition);
		q.setMaxResults(pageSize);
		List<ReagentDto> entities = q.getResultList();
		long count = (long) qCount.getSingleResult();
		
		Pageable pageable = PageRequest.of(pageIndex, pageSize);
		Page<ReagentDto> result = new PageImpl<ReagentDto>(entities, pageable, count);
		return result;
	}

	@Override
	public ReagentDto saveOrUpdate(ReagentDto dto, UUID id) {
		if (dto != null) {
			Boolean checkCode = this.checkDuplicateCode(id, dto.getCode());
			if (checkCode == null || checkCode) {
				return null;
			}

			Reagent entity = null;
			if (id != null) {
				entity = reagentRepository.getOne(id);
			}else {
				entity = new Reagent();
			}

			entity.setCode(dto.getCode());
			entity.setName(dto.getName());
			entity.setDescription(dto.getDescription());
			entity.setRegistrationNumber(dto.getRegistrationNumber());
			entity.setDateOfIssue(dto.getDateOfIssue());
			entity.setExpirationDate(dto.getExpirationDate());
			entity.setActiveIngredients(dto.getActiveIngredients());
			entity.setDosageForms(dto.getDosageForms());
			entity.setPacking(dto.getPacking());
			entity.setRegisteredFacilityName(dto.getRegisteredFacilityName());
			entity.setProductionFacilityName(dto.getProductionFacilityName());
			entity.setTestType(dto.getTestType());
			entity = reagentRepository.save(entity);
			if (entity != null ) {
				return new ReagentDto(entity);
			}
		}
		return null;
	}

	@Override
	public ReagentDto getById(UUID id) {
		if (id != null) {
			Reagent entity = reagentRepository.getOne(id);
			if (entity != null) {
				return new ReagentDto(entity);
			}
		}
		return null;
	}

	@Override
	public Boolean deleteById(UUID id) {
		if (id != null) {
			Reagent entity = reagentRepository.getOne(id);
			if (entity != null) {
				reagentRepository.deleteById(id);
				return true;
			}
		}
		return null;
	}

	@Override
	public Boolean checkDuplicateCode(UUID id, String code) {
		if (code != null && StringUtils.hasText(code)) {
			Reagent entity = reagentRepository.getByCode(code);
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
}

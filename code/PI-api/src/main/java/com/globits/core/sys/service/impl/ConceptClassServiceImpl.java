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

import com.globits.PI.functiondto.SearchDto;
import com.globits.core.service.impl.GenericServiceImpl;
import com.globits.core.sys.domain.ConceptClass;
import com.globits.core.sys.dto.ConceptClassDto;
import com.globits.core.sys.repository.ConceptClassRepository;
import com.globits.core.sys.service.ConceptClassService;

@Transactional
@Service
public class ConceptClassServiceImpl extends GenericServiceImpl<ConceptClass, UUID> implements ConceptClassService {
	
	@Autowired
	private EntityManager manager;

	@Autowired
	private ConceptClassRepository conceptClassRepository;

	@Override
	public Page<ConceptClassDto> searchByDto(SearchDto dto) {
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
		
		String sqlCount = "select count(eqap.id) from ConceptClass as eqap where (1=1) ";
		String sql = "select new com.globits.core.sys.dto.ConceptClassDto(eqap) from ConceptClass as eqap where (1=1) ";

		if (dto.getText() != null && StringUtils.hasText(dto.getText())) {
			whereClause += " AND ( eqap.name LIKE :text OR eqap.code LIKE :text ) ";
		}
		
		sql+=whereClause;
		sqlCount+=whereClause;

		Query q = manager.createQuery(sql, ConceptClassDto.class);
		Query qCount = manager.createQuery(sqlCount);

		if (dto.getText() != null && StringUtils.hasText(dto.getText())) {
			q.setParameter("text", '%' + dto.getText() + '%');
			qCount.setParameter("text", '%' + dto.getText() + '%');
		}

		int startPosition = pageIndex * pageSize;
		q.setFirstResult(startPosition);
		q.setMaxResults(pageSize);
		List<ConceptClassDto> entities = q.getResultList();
		long count = (long) qCount.getSingleResult();
		
		Pageable pageable = PageRequest.of(pageIndex, pageSize);
		Page<ConceptClassDto> result = new PageImpl<ConceptClassDto>(entities, pageable, count);
		return result;
	}

	@Override
	public ConceptClassDto saveOrUpdate(ConceptClassDto dto, UUID id) {
		if (dto != null) {
			Boolean checkCode = this.checkDuplicateCode(id, dto.getCode());
			if (checkCode == null || checkCode) {
				return null;
			}
			ConceptClass entity = null;
			if (id != null) {
				entity = conceptClassRepository.getOne(id);
			}else {
				entity = new ConceptClass();
			}
			entity.setCode(dto.getCode());
			entity.setName(dto.getName());
			entity.setDescription(dto.getDescription());
			entity.setShortName(dto.getShortName());
			
			entity = conceptClassRepository.save(entity);
			if (entity != null ) {
				return new ConceptClassDto(entity);
			}
		}
		return null;
	}

	@Override
	public ConceptClassDto getById(UUID id) {
		if (id != null) {
			ConceptClass entity = conceptClassRepository.getOne(id);
			if (entity != null) {
				return new ConceptClassDto(entity);
			}
		}
		return null;
	}

	@Override
	public Boolean deleteById(UUID id) {
		if (id != null) {
			ConceptClass entity = conceptClassRepository.getOne(id);
			if (entity != null) {
				conceptClassRepository.deleteById(id);
				return true;
			}
		}
		return null;
	}

	@Override
	public Boolean checkDuplicateCode(UUID id, String code) {
		if (code != null && StringUtils.hasText(code)) {
			ConceptClass entity = conceptClassRepository.getByCode(code);
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

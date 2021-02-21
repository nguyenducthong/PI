package com.globits.PI.service.impl;

import java.util.List;
import java.util.UUID;

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
import com.globits.PI.service.EQAAdministrativeUnitsService;
import com.globits.core.domain.AdministrativeUnit;
import com.globits.core.dto.AdministrativeUnitDto;
import com.globits.core.repository.AdministrativeUnitRepository;
import com.globits.core.service.impl.GenericServiceImpl;

@Transactional
@Service
public class EQAAdministrativeUnitsServiceImpl extends GenericServiceImpl<AdministrativeUnit, UUID> implements EQAAdministrativeUnitsService{
	@Autowired
	private AdministrativeUnitRepository administrativeUnitRepository;
	
	@Override
	public Page<AdministrativeUnitDto> searchByDto(SearchDto dto){
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
		String sqlCount = "select count(entity.id) from AdministrativeUnit as entity where (1=1) ";
		String sql = "select new com.globits.core.dto.AdministrativeUnitDto(entity) from AdministrativeUnit as entity where (1=1) ";
		
		if (dto.getText() != null && StringUtils.hasText(dto.getText())) {
			whereClause += " AND ( entity.name LIKE :text OR entity.code  LIKE :text ) ";
		}
	
		sql+=whereClause;
		sqlCount+=whereClause;
		Query q = manager.createQuery(sql, AdministrativeUnitDto.class);
		Query qCount = manager.createQuery(sqlCount);
		
		if (dto.getText() != null && StringUtils.hasText(dto.getText())) {
			q.setParameter("text", '%' + dto.getText() + '%');
			qCount.setParameter("text", '%' + dto.getText() + '%');
		}
		
		int startPosition = pageIndex * pageSize;
		q.setFirstResult(startPosition);
		q.setMaxResults(pageSize);
		List<AdministrativeUnitDto> entities = q.getResultList();
		long count = (long) qCount.getSingleResult();
		
		Pageable pageable = PageRequest.of(pageIndex, pageSize);
		Page<AdministrativeUnitDto> result = new PageImpl<AdministrativeUnitDto>(entities, pageable, count);
		return result;
	}
	@Override
	public Boolean checkDuplicateCode(UUID id, String code) {
		if (code != null && StringUtils.hasText(code)) {
			AdministrativeUnit entity = administrativeUnitRepository.findByCode(code);
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

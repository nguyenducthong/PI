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
import com.globits.PI.domain.EQAPlanning;

import com.globits.PI.dto.EQAPlanningDto;
import com.globits.PI.functiondto.EQAPlanningSearchDto;
import com.globits.PI.repository.EQAPlanningRepository;
import com.globits.PI.service.EQAPlanningService;
import com.globits.core.service.impl.GenericServiceImpl;
;

@Transactional
@Service
public class EQAPlanningServiceImpl extends GenericServiceImpl<EQAPlanning, UUID> implements EQAPlanningService {
	
	@Autowired
	private EntityManager manager;

	@Autowired
	private EQAPlanningRepository eQAPlanningRepository;

	
	@Override
	public Page<EQAPlanningDto> searchByDto(EQAPlanningSearchDto dto) {
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
		
		String sqlCount = "select count(eqap.id) from EQAPlanning as eqap where (1=1) ";
		String sql = "select new com.globits.PI.dto.EQAPlanningDto(eqap, true) from EQAPlanning as eqap where (1=1) ";

		if (dto.getText() != null && StringUtils.hasText(dto.getText())) {
			whereClause += " AND ( eqap.name LIKE :text OR eqap.code LIKE :text ) ";
		}
		sql += whereClause;
		sqlCount += whereClause;
		Query q = manager.createQuery(sql, EQAPlanningDto.class);
		Query qCount = manager.createQuery(sqlCount);

		if (dto.getText() != null && StringUtils.hasText(dto.getText())) {
			q.setParameter("text", '%' + dto.getText() + '%');
			qCount.setParameter("text", '%' + dto.getText() + '%');
		}

		int startPosition = pageIndex * pageSize;
		q.setFirstResult(startPosition);
		q.setMaxResults(pageSize);
		List<EQAPlanningDto> entities = q.getResultList();
		long count = (long) qCount.getSingleResult();
		
		Pageable pageable = PageRequest.of(pageIndex, pageSize);
		Page<EQAPlanningDto> result = new PageImpl<EQAPlanningDto>(entities, pageable, count);
		return result;
	}

	@Override
	public EQAPlanningDto getById(UUID id) {
		if (id != null) {
			EQAPlanning entity = eQAPlanningRepository.getOne(id);
			if (entity != null) {
				return new EQAPlanningDto(entity);
			}
		}
		return null;
	}

	@Override
	public Boolean deleteById(UUID id) {
		if (id != null) {
			EQAPlanning entity = eQAPlanningRepository.getOne(id);
			if (entity != null) {
				eQAPlanningRepository.deleteById(id);
				return true;
			}
		}
		return null;				
	}

	@Override
	public EQAPlanningDto saveOrUpdate(EQAPlanningDto dto, UUID id) {
		if (dto != null) {
			if(dto.getIsManualSetCode() != null && dto.getIsManualSetCode()== true && dto.getCode() != null) {
				Boolean checkCode = this.checkDuplicateCode(id, dto.getCode());
				if (checkCode == null || checkCode) {
					return null;
				}
			}

			EQAPlanning entity = null;
			if (id != null) {
				entity = eQAPlanningRepository.getOne(id);
				if(dto.getIsManualSetCode() != null && dto.getIsManualSetCode()== true) {
					entity.setCode(dto.getCode());
				}else {
					if(!entity.getYear().equals(dto.getYear())) {
						entity.setCode(gencode(dto.getYear()));
					}
				}
			}else {
				entity = new EQAPlanning();
				if(dto.getIsManualSetCode() != null && dto.getIsManualSetCode()== true) {
					entity.setCode(dto.getCode());
				}else {	
					entity.setCode(gencode(dto.getYear()));
				}
			}
			entity.setName(dto.getName());
			entity.setStartDate(dto.getStartDate());
			entity.setEndDate(dto.getEndDate());
			entity.setFee(dto.getFee());
			entity.setType(dto.getType());
			entity.setYear(dto.getYear());
			entity.setObjectives(dto.getObjectives());
			entity.setNumberOfRound(dto.getNumberOfRound());

			entity = eQAPlanningRepository.save(entity);
			if (entity != null ) {
				return new EQAPlanningDto(entity);
			}
		}
		return null;
	}

	@Override
	public Boolean checkDuplicateCode(UUID id, String code) {
		if (code != null && StringUtils.hasText(code)) {
			EQAPlanning entity = eQAPlanningRepository.getByCode(code);
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

	public String gencode(int year) {
		List<EQAPlanning> listPlanning = eQAPlanningRepository.getByYear(year);//22212-2021312-9021309
		if(listPlanning.size() != 0 ) {
			String code = listPlanning.get(listPlanning.size() - 1).getCode();
			String[] list = code.split("-");
			int number = Integer.parseInt(list[list.length - 1]) + 1;
			String string = "PLAN-" + year + "-" + number;
			return string;
		}else {
			String string = "PLAN-" + year + "-1";
			return string;
		}	
	}
	
	@Override
	public Boolean checkNotBeingUsed(UUID id) {
		Integer number = eQAPlanningRepository.countEQAPlanningInEQARound(id);
		if (number == 0) {
			return true;
		} else {
			return false;
		}
	}

}

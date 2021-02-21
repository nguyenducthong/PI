package com.globits.PI.service.impl;

import java.util.Calendar;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
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

import com.globits.PI.domain.EQARound;
import com.globits.PI.domain.EQASample;
import com.globits.PI.domain.EQASampleSet;
import com.globits.PI.domain.EQASampleSetDetail;
import com.globits.PI.dto.EQASampleSetDetailDto;
import com.globits.PI.dto.EQASampleSetDto;
import com.globits.PI.functiondto.EQASampleSetSearchDto;
import com.globits.PI.repository.EQARoundRepository;
import com.globits.PI.repository.EQASampleRepository;
import com.globits.PI.repository.EQASampleSetDetailRepository;
import com.globits.PI.repository.EQASampleSetRepository;
import com.globits.PI.service.EQASampleSetService;
import com.globits.core.service.impl.GenericServiceImpl;

@Transactional
@Service
public class EQASampleSetServiceImpl extends GenericServiceImpl<EQASampleSet, UUID> implements EQASampleSetService {
	
	@Autowired
	private EntityManager manager;

	@Autowired
	private EQARoundRepository eQARoundRepository;

	@Autowired
	private EQASampleSetRepository eQASampleSetRepository;

	@Autowired
	private EQASampleSetDetailRepository eQASampleSetDetailRepository;

	@Autowired
	private EQASampleRepository eQASampleRepository;
	
	@Override
	public Page<EQASampleSetDto> searchByDto(EQASampleSetSearchDto dto) {
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
		String orderBy = " ORDER BY eqap.eqaRound.startDate DESC  ,eqap.eqaRound.code DESC";
		String sqlCount = "select count(eqap.id) from EQASampleSet as eqap where (1=1) ";
		String sql = "select new com.globits.PI.dto.EQASampleSetDto(eqap) from EQASampleSet as eqap where (1=1) ";

		if (dto.getText() != null && StringUtils.hasText(dto.getText())) {
			whereClause += " AND ( eqap.name LIKE :text OR eqap.code LIKE :text ) ";
		}
		if (dto.getEqaRoundId() != null) {
			whereClause += " AND ( eqap.eqaRound.id =:eqaRoundId) ";
		}
		sql+=whereClause + orderBy;
		sqlCount+=whereClause;

		Query q = manager.createQuery(sql, EQASampleSetDto.class);
		Query qCount = manager.createQuery(sqlCount);

		if (dto.getText() != null && StringUtils.hasText(dto.getText())) {
			q.setParameter("text", '%' + dto.getText() + '%');
			qCount.setParameter("text", '%' + dto.getText() + '%');
		}
		if (dto.getEqaRoundId() != null) {
			q.setParameter("eqaRoundId", dto.getEqaRoundId());
			qCount.setParameter("eqaRoundId", dto.getEqaRoundId());
		}
		int startPosition = pageIndex * pageSize;
		q.setFirstResult(startPosition);
		q.setMaxResults(pageSize);
		List<EQASampleSetDto> entities = q.getResultList();
		long count = (long) qCount.getSingleResult();
		
		Pageable pageable = PageRequest.of(pageIndex, pageSize);
		Page<EQASampleSetDto> result = new PageImpl<EQASampleSetDto>(entities, pageable, count);
		return result;
	}

	@Override
	public EQASampleSetDto saveOrUpdate(EQASampleSetDto dto, UUID id) {
		if (dto != null) {
			Boolean checkCode = this.checkDuplicateCode(id, dto.getCode());
			if (checkCode == null || checkCode) {
				return null;
			}

			EQASampleSet entity = null;
			if (id != null) {
				entity = eQASampleSetRepository.getOne(id);
			}else {
				entity = new EQASampleSet();
			}
			
			entity.setCode(dto.getCode());
			entity.setName(dto.getName());
			
			EQARound e = null;
			if (dto.getEqaRound() != null && dto.getEqaRound().getId() != null) {
				e = eQARoundRepository.getOne(dto.getEqaRound().getId());
				entity.setEqaRound(e);
			}
			if(entity.getEqaRound()==null) {
				return null;
			}
			
			Set<EQASampleSetDetail> listEQASampleSetDetail = new HashSet<EQASampleSetDetail>();
			if (dto.getDetails() != null && dto.getDetails().size() > 0) {
				for (EQASampleSetDetailDto eQASampleSetDetailDto : dto.getDetails()) {
					EQASampleSetDetail eQASampleSetDetail = null;
					
					if (eQASampleSetDetailDto != null && eQASampleSetDetailDto.getId() != null) {
						eQASampleSetDetail = eQASampleSetDetailRepository.getOne(eQASampleSetDetailDto.getId());
					}
					
					if (eQASampleSetDetail == null) {
						eQASampleSetDetail = new EQASampleSetDetail();
					}
					String code = this.genCode(entity.getEqaRound(), eQASampleSetDetailDto.getOrderNumber());
					eQASampleSetDetail.setCode(code);					
					eQASampleSetDetail.setOrderNumber(eQASampleSetDetailDto.getOrderNumber());					
					EQASample eQASample = null;
					if (eQASampleSetDetailDto.getSample() != null && eQASampleSetDetailDto.getSample().getId() != null) {
						eQASample = eQASampleRepository.getOne(eQASampleSetDetailDto.getSample().getId());
					}
					if (eQASample == null) {
						return null;
					}
					eQASampleSetDetail.setSample(eQASample);
					eQASampleSetDetail.setSampleSet(entity);
					listEQASampleSetDetail.add(eQASampleSetDetail);
				}
			}
			if (entity.getDetails() == null) {
				entity.setDetails(listEQASampleSetDetail);
			} else {
				entity.getDetails().clear();
				entity.getDetails().addAll(listEQASampleSetDetail);
			}
			
			entity = eQASampleSetRepository.save(entity);
			if (entity != null ) {
				return new EQASampleSetDto(entity);
			}
		}
		return null;
	}
	
	public String genCode(EQARound round,Integer orderNumber) {
		if(round!=null && orderNumber!=null) {			
			Calendar cal = Calendar.getInstance();
			cal.setTime(round.getStartDate());
			int year = cal.get(Calendar.YEAR);
			String code="PI "+round.getOrderNumber()+"."+year+"-"+orderNumber;
			return code;
		}
		else {
			return "";
		}
	}
	
	@Override
	public EQASampleSetDto getById(UUID id) {
		if (id != null) {
			EQASampleSet entity = eQASampleSetRepository.getOne(id);
			if (entity != null) {
				return new EQASampleSetDto(entity);
			}
		}
		return null;
	}

	@Override
	public Boolean deleteById(UUID id) {
		if (id != null) {
			Integer countHealthOrgEQARound = eQASampleSetRepository.countHealthOrgEQARound(id);
			if(countHealthOrgEQARound != 0) {
				return false;
			}
			EQASampleSet entity = eQASampleSetRepository.getOne(id);
			if (entity != null) {
				List<EQASampleSetDetailDto> listDetail = eQASampleSetDetailRepository.getByEQASampleSetId(entity.getId());
				if (listDetail != null && listDetail.size() > 0) {
					for (EQASampleSetDetailDto eqaSampleSetDetailDto : listDetail) {
						eQASampleSetDetailRepository.deleteById(eqaSampleSetDetailDto.getId());
					}
				}
				eQASampleSetRepository.deleteById(id);
				return true;
			}
		}
		return null;
	}

	@Override
	public Boolean checkDuplicateCode(UUID id, String code) {
		if (code != null && StringUtils.hasText(code)) {
			EQASampleSet entity = eQASampleSetRepository.getByCode(code);
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
	public List<EQASampleSetDto> getSampleSetByRoundID(UUID id) {
		List<EQASampleSetDto> result = eQASampleSetRepository.getSampleSetByRoundID(id);
		return result;
	}

	@Override
	public List<EQASampleSet> getSampleSetBy(UUID id) {
		List<EQASampleSet> result = eQASampleSetRepository.getSampleSet(id);
		return result;
	}

}

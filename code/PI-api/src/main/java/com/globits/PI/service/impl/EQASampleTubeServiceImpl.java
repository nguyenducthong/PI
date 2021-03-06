package com.globits.PI.service.impl;

import java.util.List;
import java.util.UUID;
import javax.persistence.EntityManager;
import javax.persistence.Query;
import com.globits.PI.domain.*;
import com.globits.PI.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import com.globits.PI.dto.EQASampleTubeDto;
import com.globits.PI.functiondto.EQASampleTubeSearchDto;
import com.globits.PI.service.EQASampleTubeService;
import com.globits.core.service.impl.GenericServiceImpl;


@Transactional
@Service
public class EQASampleTubeServiceImpl extends GenericServiceImpl<EQASampleTube, UUID> implements EQASampleTubeService {
	
	@Autowired
	private EntityManager manager;

	@Autowired
	private EQASampleTubeRepository eQASampleTubeRepository;

	@Autowired
	private EQASampleRepository eQASampleRepository;

	@Autowired
	private EQARoundRepository eQARoundRepository;

	@Autowired
	private HealthOrgRepository healthOrgRepository;
	
	@Autowired
	private HealthOrgEQARoundRepository healthOrgEQARoundRepository;
	
	@Autowired
	private EQASampleSetDetailRepository eQASampleSetDetailRepository;

	@Autowired
	private EQASerumBottleRepository eqaSerumBottleRepository;
	
	@Override
	public Page<EQASampleTubeDto> searchByDto(EQASampleTubeSearchDto dto) {
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
		
		String sqlCount = "select count(eqap.id) from EQASampleTube as eqap where (1=1) ";
		String sql = "select new com.globits.PI.dto.EQASampleTubeDto(eqap) from EQASampleTube as eqap where (1=1) ";

		if (dto.getText() != null && StringUtils.hasText(dto.getText())) {
			whereClause += " AND ( eqap.name LIKE :text OR eqap.code LIKE :text ) ";
		}
		
		sql+=whereClause;
		sqlCount+=whereClause;

		Query q = manager.createQuery(sql, EQASampleTubeDto.class);
		Query qCount = manager.createQuery(sqlCount);

		if (dto.getText() != null && StringUtils.hasText(dto.getText())) {
			q.setParameter("text", '%' + dto.getText() + '%');
			qCount.setParameter("text", '%' + dto.getText() + '%');
		}

		int startPosition = pageIndex * pageSize;
		q.setFirstResult(startPosition);
		q.setMaxResults(pageSize);
		List<EQASampleTubeDto> entities = q.getResultList();
		long count = (long) qCount.getSingleResult();
		
		Pageable pageable = PageRequest.of(pageIndex, pageSize);
		Page<EQASampleTubeDto> result = new PageImpl<EQASampleTubeDto>(entities, pageable, count);
		return result;
	}

	@Override
	public EQASampleTubeDto saveOrUpdate(EQASampleTubeDto dto, UUID id) {
		if (dto != null) {
			Boolean checkCode = this.checkDuplicateCode(id, dto.getCode());
			if (checkCode == null || checkCode) {
				return null;
			}

			EQASampleTube entity = null;
			if (id != null) {
				entity = eQASampleTubeRepository.getOne(id);
			}else {
				entity = new EQASampleTube();
			}
			
			entity.setCode(dto.getCode());
			entity.setName(dto.getName());
			entity.setNote(dto.getNote());
			entity.setVolume(dto.getVolume());
			entity.setType(dto.getType());
			entity.setStatus(dto.getStatus());
			entity.setLastResultFromLab(dto.getLastResultFromLab());
			EQASample eQASample = null;
			if (dto.getEqaSample() != null && dto.getEqaSample().getId() != null) {
				eQASample = eQASampleRepository.getOne(dto.getEqaSample().getId());
			}
			entity.setEqaSample(eQASample);

			EQARound eQARound = null;
			if (dto.getEqaRound() != null && dto.getEqaRound().getId() != null) {
				eQARound = eQARoundRepository.getOne(dto.getEqaRound().getId());
			}
			entity.setEqaRound(eQARound);
			
			
			HealthOrg healthOrg = null;
			if (dto.getHealthOrg() != null && dto.getHealthOrg().getId() != null) {
				healthOrg = healthOrgRepository.getOne(dto.getHealthOrg().getId());
			}
			entity.setHealthOrg(healthOrg);

			EQASerumBottle eqaSerumBottle = null;
			if (dto.getEqaSerumBottle() != null && dto.getEqaSerumBottle().getId() != null){
				eqaSerumBottle = eqaSerumBottleRepository.getOne(dto.getEqaSerumBottle().getId());
			}
			entity.setEqaSerumBottle(eqaSerumBottle);
			
			HealthOrgEQARound healthOrgEQARound = null;
			if (dto.getHealthOrgEQARound() != null && dto.getHealthOrgEQARound().getId() != null) {
				healthOrgEQARound = healthOrgEQARoundRepository.getOne(dto.getHealthOrgEQARound().getId());
			}
			entity.setHealthOrgEQARound(healthOrgEQARound);
			
			EQASampleSetDetail sampleSetDetail = null;
			if (dto.getEqaSampleSetDetail() != null && dto.getEqaSampleSetDetail().getId() != null) {
				sampleSetDetail = eQASampleSetDetailRepository.getOne(dto.getEqaSampleSetDetail().getId());
			}
			entity.setSampleSetDetail(sampleSetDetail);
			
			entity = eQASampleTubeRepository.save(entity);
			if (entity != null ) {
				return new EQASampleTubeDto(entity);
			}
		}
		return null;
	}

	@Override
	public EQASampleTubeDto getById(UUID id) {
		if (id != null) {
			EQASampleTube entity = eQASampleTubeRepository.getOne(id);
			if (entity != null) {
				return new EQASampleTubeDto(entity);
			}
		}
		return null;
	}

	@Override
	public Boolean deleteById(UUID id) {
		if (id != null) {
			EQASampleTube entity = eQASampleTubeRepository.getOne(id);
			if (entity != null) {
				eQASampleTubeRepository.deleteById(id);
				return true;
			}
		}
		return null;
	}

	@Override
	public Boolean checkDuplicateCode(UUID id, String code) {
		if (code != null && StringUtils.hasText(code)) {
			EQASampleTube entity = null;
			
			entity = eQASampleTubeRepository.getByCode(code);
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
	public Integer countNumberOfCorrectSampleTube() {
		return eQASampleTubeRepository.countNumberOfCorrectSampleTube();
	}

	@Override
	public Integer countNumberOfIncorrectSampleTube() {
		return eQASampleTubeRepository.countNumberOfIncorrectSampleTube();
	}
	
	@Override
	public Integer countNumberOfNotSubmittedSampleTube() {
		return eQASampleTubeRepository.countNumberOfNotSubmittedSampleTube();
	}
	

}

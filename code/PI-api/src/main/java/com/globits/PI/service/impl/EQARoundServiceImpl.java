package com.globits.PI.service.impl;

import java.util.Calendar;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;

import javax.persistence.EntityManager;
import javax.persistence.Query;

import org.joda.time.LocalDateTime;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import com.globits.PI.domain.EQAPlanning;
import com.globits.PI.domain.EQARound;
import com.globits.PI.dto.EQARoundDto;
import com.globits.PI.functiondto.EQARoundSearchDto;
import com.globits.PI.repository.EQAPlanningRepository;
import com.globits.PI.repository.EQARoundRepository;
import com.globits.PI.service.EQARoundService;
import com.globits.core.service.impl.GenericServiceImpl;
import com.globits.core.utils.CoreDateTimeUtil;
import com.globits.security.domain.User;

@Transactional
@Service
public class EQARoundServiceImpl extends GenericServiceImpl<EQARound, UUID> implements EQARoundService {
	
	@Autowired
	private EntityManager manager;

	@Autowired
	private EQARoundRepository eQARoundRepository;

	@Autowired
	private EQAPlanningRepository eQAPlanningRepository;
	
	@Override
	public Page<EQARoundDto> searchByDto(EQARoundSearchDto dto) {
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
		String orderBy = " ORDER BY entity.startDate DESC,entity.code ASC";
		String sqlCount = "select count(entity.id) from EQARound as entity where (1=1) ";
		String sql = "select new com.globits.PI.dto.EQARoundDto(entity,true) from EQARound as entity where (1=1) ";

		if (dto.getText() != null && StringUtils.hasText(dto.getText())) {
			whereClause += " AND ( entity.name LIKE :text OR entity.code LIKE :text ) ";
		}
		if (dto.getEqaPlanning() != null && dto.getEqaPlanning().getId() != null) {
			whereClause += " AND ( entity.eqaPlanning.id = :eqaPlanningId ) ";
		}
		sql+=whereClause + orderBy;
		sqlCount+=whereClause;
		Query q = manager.createQuery(sql, EQARoundDto.class);
		Query qCount = manager.createQuery(sqlCount);

		if (dto.getText() != null && StringUtils.hasText(dto.getText())) {
			q.setParameter("text", '%' + dto.getText() + '%');
			qCount.setParameter("text", '%' + dto.getText() + '%');
		}
		if (dto.getEqaPlanning() != null && dto.getEqaPlanning().getId() != null) {
			q.setParameter("eqaPlanningId", dto.getEqaPlanning().getId());
			qCount.setParameter("eqaPlanningId", dto.getEqaPlanning().getId());
		}

		int startPosition = pageIndex * pageSize;
		q.setFirstResult(startPosition);
		q.setMaxResults(pageSize);
		List<EQARoundDto> entities = q.getResultList();
		long count = (long) qCount.getSingleResult();
		
		Pageable pageable = PageRequest.of(pageIndex, pageSize);
		Page<EQARoundDto> result = new PageImpl<EQARoundDto>(entities, pageable, count);
		return result;
	}

	@Override
	public EQARoundDto saveOrUpdate(EQARoundDto dto) {
		if (dto != null) {
			if(dto.getIsManualSetCode() != null && dto.getIsManualSetCode()== true && dto.getCode() != null) {
				Boolean checkCode = this.checkDuplicateCode(dto.getId(), dto.getCode());
				if (checkCode == null || checkCode) {
					return null;
				}
			}
		
			EQARound entity = null;
			if(dto.getId()!=null) {
				entity = repository.getOne(dto.getId());
			}
			LocalDateTime currentDate = org.joda.time.LocalDateTime.now();
			String currentUserName = "Unknown User";
			if(entity==null) {
				entity = new EQARound();
				entity.setCreateDate(currentDate);
				entity.setCreatedBy(currentUserName);
				if(dto.getIsManualSetCode() != null && dto.getIsManualSetCode()== true) {
					entity.setCode(dto.getCode());
				}else {
					entity.setCode(gencode(dto.getEqaPlanning().getYear()));
				}
			}
			if(dto.getIsManualSetCode() != null && dto.getIsManualSetCode()== true) {
				entity.setCode(dto.getCode());
			}
			entity.setModifyDate(currentDate);
			entity.setModifiedBy(currentUserName);
			entity.setIsActive(dto.getIsActive());	
			entity.setName(dto.getName());
			entity.setStartDate(dto.getStartDate());
			entity.setEndDate(dto.getEndDate());
			entity.setRegistrationStartDate(dto.getRegistrationStartDate());
			entity.setRegistrationExpiryDate(dto.getRegistrationExpiryDate());
			entity.setSampleSubmissionDeadline(dto.getSampleSubmissionDeadline());
			entity.setSampleNumber(dto.getSampleNumber());
			entity.setSampleSetNumber(dto.getSampleSetNumber());
			entity.setExecutionTime(dto.getExecutionTime());
			entity.setHealthOrgNumber(dto.getHealthOrgNumber());
			entity.setSampleCharacteristics(dto.getSampleCharacteristics());
			if(dto.getOrderNumber()!=null) {
				entity.setOrderNumber(dto.getOrderNumber());
			}
			else {
				Integer orderNumber=null;				
				Calendar cal = Calendar.getInstance();
				int year = cal.get(Calendar.YEAR);
				if(dto.getStartDate()==null) {
					cal.setTime(dto.getStartDate());
					year = cal.get(Calendar.YEAR);
				}
				orderNumber = this.checkOrderNumber(year);
				entity.setOrderNumber(orderNumber);
			}
			
			EQAPlanning e = null;
			if (dto.getEqaPlanning() != null && dto.getEqaPlanning().getId() != null) {
				e = eQAPlanningRepository.getOne(dto.getEqaPlanning().getId());
			}
			entity.setEqaPlanning(e);
			
			entity = eQARoundRepository.save(entity);
			
			if (entity != null ) {
				return new EQARoundDto(entity);
			}
		}

		return null;
	}

	@Override
	public Boolean deleteById(UUID id) {
		if (id != null) {
			Integer countSampleSet = eQARoundRepository.countEQASampleSet(id);
			if(countSampleSet != 0) {
				return false;
			}
			Integer countSample = eQARoundRepository.countEQASample(id);
			if(countSample != 0) {
				return false;
			}
			Integer countHealthOrgRound = eQARoundRepository.countHealthOrgEQARound(id);
			if(countHealthOrgRound != 0) {
				return false;
			}
			EQARound entity = eQARoundRepository.getOne(id);
			if (entity != null) {
				eQARoundRepository.deleteById(id);
				return true;
			}
		}
		return null;
	}
	
	@Override
	public EQARoundDto getDtoById(UUID id) {
		EQARound round = this.findById(id);
		return new EQARoundDto(round);
	}

	@Override
	public Boolean checkDuplicateCode(UUID id, String code) {
		if (code != null && StringUtils.hasText(code)) {
			EQARound entity = eQARoundRepository.getByCode(code);
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
	public EQARoundDto getCurentEQARound() {
		Date dateNow = new Date();
		
		String whereClause = "";
		
		String sql = "select new com.globits.PI.dto.EQARoundDto(entity) from EQARound as entity where (1=1) AND entity.startDate <= :dateNow AND entity.endDate >= :dateNow ";

		sql+=whereClause;
		Query q = manager.createQuery(sql, EQARoundDto.class);

		q.setParameter("dateNow", dateNow);

		q.setFirstResult(0);
		q.setMaxResults(1);
		List<EQARoundDto> entities = q.getResultList();
		if (entities != null && entities.size() > 0) {
			return entities.get(0);
		}
		return null;
	}

	@Override
	public List<EQARoundDto> getEQARoundsByPlanning(UUID id) {
		return eQARoundRepository.getEQARoundsByPlanning(id);
	}
	
	public String gencode(int year) {
		List<EQARoundDto> listRound = eQARoundRepository.getByYear(year);//22212-2021312-9021309
		String codeYear = Integer.toString(year);
		if(listRound.size() != 0 ) {
			String code = listRound.get(listRound.size() - 1).getCode(); //PI 1.19
			String[] list = code.split(" ");
			String str = list[list.length - 1]; // PI 1
			String[] list1 = str.split("\\.");
			int number = Integer.parseInt(list1[0]) + 1;
			String string = "PI " + number + "." + codeYear.substring(codeYear.length()-2, codeYear.length());
			return string;
		}else {
			String string = "PI 1." + codeYear.substring(codeYear.length()-2, codeYear.length());
			return string;
		}	
	}
	@Override
	public Integer checkOrderNumber(int year) {
		String sql=" SELECT MAX(e.orderNumber) FROM EQARound e WHERE e.startDate>=:fromDate AND e.startDate<=:toDate";
		Query q = manager.createQuery(sql);
		q.setParameter("fromDate", CoreDateTimeUtil.getFirstTimeInYear(year));
		q.setParameter("toDate", CoreDateTimeUtil.getLastTimeInYear(year));
		 
		Object ret = q.getSingleResult();
		if(ret!=null) {
			return ((Integer)ret)+1;
		}
		return 1;
	}

	@Override
	public Integer countNumberOfEQARound() {
		return eQARoundRepository.countNumberOfEQARound();
	}
}

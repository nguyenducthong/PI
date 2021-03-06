package com.globits.PI.service.impl;

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
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import com.globits.PI.PIConst;
import com.globits.PI.domain.EQARound;
import com.globits.PI.domain.EQASample;
import com.globits.PI.domain.EQASampleBottle;
import com.globits.PI.domain.EQASerumBottle;
import com.globits.PI.dto.EQASampleBottleDto;
import com.globits.PI.dto.EQASampleDto;
import com.globits.PI.functiondto.EQASampleSearchDto;
import com.globits.PI.functiondto.UserInfoDto;
import com.globits.PI.repository.EQASampleBottleRepository;
import com.globits.PI.repository.EQASampleRepository;
import com.globits.PI.repository.EQASerumBankRepository;
import com.globits.PI.repository.EQASerumBottleRepository;
import com.globits.PI.service.EQARoundService;
import com.globits.PI.service.EQASampleService;
import com.globits.PI.service.UserInHealthOrgService;
import com.globits.core.domain.FileDescription;
import com.globits.core.dto.ActivityLogDto;
import com.globits.core.repository.FileDescriptionRepository;
import com.globits.core.service.impl.GenericServiceImpl;

@Transactional
@Service
public class EQASampleServiceImpl extends GenericServiceImpl<EQASample, UUID> implements EQASampleService {
	
	@Autowired
	private EntityManager manager;

	@Autowired
	private EQASampleRepository eQASampleRepository;

	@Autowired
	private EQASerumBankRepository eQASerumBankRepository;

	@Autowired
	private EQASerumBottleRepository eQASerumBottleRepository;

	@Autowired
	private EQASampleBottleRepository eQASampleBottleRepository;
	
	@Autowired
	EQARoundService eqaRoundService;
	
	@Autowired
	private UserInHealthOrgService userInHealthOrgService;
	
	@Autowired
	FileDescriptionRepository fileDescriptionRepository;
	
	@Override
	public Page<EQASampleDto> searchByDto(EQASampleSearchDto dto) {
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
		String orderBy = " ORDER BY eqap.round.startDate DESC,eqap.code ASC";
		String sqlCount = "select count(eqap.id) from EQASample as eqap where (1=1) ";
		String sql = "select new com.globits.PI.dto.EQASampleDto(eqap) from EQASample as eqap where (1=1) ";

		if (dto.getText() != null && StringUtils.hasText(dto.getText())) {
			whereClause += " AND ( eqap.name LIKE :text"
					+ " OR eqap.code LIKE :text"
					+ " OR eqap.additiveThrombin LIKE :text"
					+ " OR eqap.volumeAfterRemoveFibrin LIKE :text"
					+ " OR eqap.volumeAfterCentrifuge LIKE :text"
					+ " OR eqap.volumeOfProclinAdded LIKE :text ) ";
		}
		if (dto.getEqaRoundId() != null) {
			whereClause += " AND ( eqap.round.id =:eqaRoundId) ";
		}
//		String orderByClause=" ORDER BY eqap.createDate ";
		sql+=whereClause+orderBy;
		sqlCount+=whereClause;

		Query q = manager.createQuery(sql, EQASampleDto.class);
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
		List<EQASampleDto> entities = q.getResultList();
		long count = (long) qCount.getSingleResult();
		
		Pageable pageable = PageRequest.of(pageIndex, pageSize);
		Page<EQASampleDto> result = new PageImpl<EQASampleDto>(entities, pageable, count);
		return result;
	}

	@Override
	public EQASampleDto saveOrUpdate(EQASampleDto dto, UUID id) {
		if (dto != null) {
			UserInfoDto userInfo = userInHealthOrgService.getUserInfoByUserLogin();

//			if(dto.getRound()!=null && id == null) {
//				EQARound round = eqaRoundService.findById(dto.getRound().getId());
//				String code = this.genCode(round, dto.getOrderNumberSample());
//				Boolean checkCode = this.checkDuplicateCode(id, code);
//				if (checkCode == null || checkCode) {
//					return null;
//				}
//			}
			
			EQASample entity = null;
			if (id != null) {
				entity = eQASampleRepository.getOne(id);
			}
			if(entity==null) {
				entity = new EQASample();

			}

			//
			entity.setName(dto.getName());
			entity.setResult(dto.getResult());
			entity.setAdditiveThrombin(dto.getAdditiveThrombin());
			entity.setThrombinAddedDate(dto.getThrombinAddedDate());
			entity.setInactiveVirus(dto.getInactiveVirus());
			entity.setVolumeAfterRemoveFibrin(dto.getVolumeAfterRemoveFibrin());
			entity.setRemoveFibrinDate(dto.getRemoveFibrinDate());
			entity.setVolumeAfterCentrifuge(dto.getVolumeAfterCentrifuge());
			entity.setCentrifugeDate(dto.getCentrifugeDate());
			entity.setVolumeOfProclinAdded(dto.getVolumeOfProclinAdded());
			entity.setNote(dto.getNote());
			entity.setDilution(dto.getDilution());
			entity.setDilution_level(dto.getDilutionLevel());
			entity.setEndDate(dto.getEndDate());
			entity.setOrderNumberSample(dto.getOrderNumberSample());
		
			if(dto.getRound()!=null) {
				EQARound round = eqaRoundService.findById(dto.getRound().getId());
				entity.setRound(round);
				if(id == null && round != null) {
					String code = this.genCode(round);			
					entity.setCode(code);
				}
				if(round!=null) {
					if (dto.getIsManualSetCode() != null && dto.getIsManualSetCode() == true) {
						entity.setCode(dto.getCode());
					}			
				}
			}
			Set<EQASampleBottle> listEQASampleBottle = new HashSet<EQASampleBottle>();
			if (dto.getEqaSampleBottles() != null && dto.getEqaSampleBottles().size() > 0) {
				for (EQASampleBottleDto sbDto : dto.getEqaSampleBottles()) {
					EQASampleBottle eQASampleBottle = null;
					if (sbDto.getId() != null) {
						eQASampleBottle = eQASampleBottleRepository.getOne(sbDto.getId());
						if (eQASampleBottle == null) {
							return null;
						}
					}
					else {
						eQASampleBottle = new EQASampleBottle();
					}
					
					EQASerumBottle eQASerumBottle = null;
					if (sbDto.geteQASerumBottle() != null && sbDto.geteQASerumBottle().getId() != null) {
						eQASerumBottle = eQASerumBottleRepository.getOne(sbDto.geteQASerumBottle().getId());
						eQASerumBottle.setBottleStatus(true);
						
					}
					if (eQASerumBottle != null) {
						eQASampleBottle.seteQASample(entity);
						eQASampleBottle.seteQASerumBottle(eQASerumBottle);
						listEQASampleBottle.add(eQASampleBottle);
					}
				}
			}

			if (entity.getEqaSampleBottles() == null) {
				entity.setEqaSampleBottles(listEQASampleBottle);
			} else {
				entity.getEqaSampleBottles().clear();
				entity.getEqaSampleBottles().addAll(listEQASampleBottle);
			}
			
			
			entity = eQASampleRepository.save(entity);
			if (entity != null ) {
				return new EQASampleDto(entity);
			}
		}
		return null;
	}
	public Integer checkOrderNumber(EQARound round) {
		if(round!=null) {
			String sql = " SELECT MAX(sa.orderNumber) FROM EQASample sa WHERE sa.round.id=:roundId ";
			Query q = manager.createQuery(sql);
			q.setParameter("roundId", round.getId());
			Object ret = q.getSingleResult();
			Integer max=0;
			if(ret!=null) {
				max=(Integer)ret;
			}
			max+=1;
			return max;
		}
		return 1;
	}
	public String genCode(EQARound round) {
		List<EQASample> listSample = eQASampleRepository.getByRoundId(round.getId());
		if(listSample != null && listSample.size() > 0) {
			String codeStr = listSample.get(listSample.size() - 1).getCode();//PI 1.19-1
			String[] list = codeStr.split("-");
			int number = Integer.parseInt(list[list.length - 1]) + 1;
			String code = list[0] + "-"  + number;
			return code;
		}
		else {
			String code = round.getCode() + "-1";
			return code;
		}
//		String code = round.getCode() + "-" + number;
//		return code;
 	}
	
	@Override
	public EQASampleDto getById(UUID id) {
		if (id != null) {
			EQASample entity = eQASampleRepository.getOne(id);
			if (entity != null) {
				return new EQASampleDto(entity);
			}
		}
		return null;
	}

	@Override
	public Boolean deleteById(UUID id) {
		if (id != null) {
			EQASample entity = eQASampleRepository.getOne(id);
			if (entity != null) {
				eQASampleRepository.deleteById(id);
				return true;
			}
		}
		return false;
	}

	@Override
	public Boolean checkDuplicateCode(UUID id, String code) {
		if (code != null && StringUtils.hasText(code)) {
			List<EQASample>  entities = eQASampleRepository.getByCode(code);			 
			if (entities != null && entities.size()>0) {
				EQASample entity = entities.get(0);
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
	public Boolean checkCode(UUID id,EQASampleDto dto) {
		if(dto != null) {
			if(dto.getRound()!=null) {
				EQARound round = eqaRoundService.findById(dto.getRound().getId());
				String code = this.genCode(round);
				Boolean checkCode = this.checkDuplicateCode(id, code);
				if (checkCode == null || checkCode) {
					return false;
				}
			}
		}
		return null;
	}

	@Override
	public List<EQASampleDto> getByRoundId(UUID id) {
		// TODO Auto-generated method stub
		return eQASampleRepository.getRoundId(id);
	}
	
	@Override
	public Integer countByRoundId(UUID id) {
		return eQASampleRepository.countByRoundId(id);
	}

}

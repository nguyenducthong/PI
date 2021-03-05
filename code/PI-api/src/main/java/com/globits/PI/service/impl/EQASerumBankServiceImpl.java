package com.globits.PI.service.impl;

import java.util.Collections;
import java.util.Comparator;
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

import com.globits.PI.PIConst;
import com.globits.PI.domain.EQASerumBank;
import com.globits.PI.domain.EQASerumBottle;
import com.globits.PI.dto.EQASerumBankDto;
import com.globits.PI.dto.EQASerumBottleDto;
import com.globits.PI.functiondto.EQASerumBankSearchDto;
import com.globits.PI.functiondto.UserInfoDto;
import com.globits.PI.repository.EQASerumBankRepository;
import com.globits.PI.repository.EQASerumBottleRepository;
import com.globits.PI.service.EQASerumBankService;
import com.globits.PI.service.EQASerumBottleService;
import com.globits.PI.service.UserInHealthOrgService;
import com.globits.core.service.impl.GenericServiceImpl;

@Transactional
@Service
public class EQASerumBankServiceImpl extends GenericServiceImpl<EQASerumBank, UUID> implements EQASerumBankService {

	@Autowired
	private EntityManager manager;

	@Autowired
	private EQASerumBankRepository eqaSerumBankRepository;
	
	@Autowired
	private EQASerumBottleRepository eqaSerumBottleRepository;
	
	@Autowired
	private EQASerumBottleService eqaSerumBottleService;
	
	@Autowired
	private UserInHealthOrgService userInHealthOrgService;
	


	@Override
	public Page<EQASerumBankDto> searchByDto(EQASerumBankSearchDto dto) {
		if (dto == null) {
			return null;
		}

		int pageIndex = dto.getPageIndex();
		int pageSize = dto.getPageSize();
		 
		String whereClause = "";

		String sqlCount = "select count(eqap.id) from EQASerumBank as eqap where (1=1) ";
		String sql = "select new com.globits.PI.dto.EQASerumBankDto(eqap,true) from EQASerumBank as eqap where (1=1) ";

		if (dto.getText() != null && StringUtils.hasText(dto.getText())) {
			whereClause += " AND ( eqap.name LIKE :text OR eqap.serumCode LIKE :text OR eqap.originalCode LIKE :text ) ";
		}

		sql += whereClause + " ORDER BY eqap.numberBottlesRemaining DESC ";
		sqlCount += whereClause;

		Query q = manager.createQuery(sql, EQASerumBankDto.class);
		Query qCount = manager.createQuery(sqlCount);

		if (dto.getText() != null && StringUtils.hasText(dto.getText())) {
			q.setParameter("text", '%' + dto.getText() + '%');
			qCount.setParameter("text", '%' + dto.getText() + '%');
		}

		int startPosition = pageIndex * pageSize;
		q.setFirstResult(startPosition);
		q.setMaxResults(pageSize);
		List<EQASerumBankDto> entities = q.getResultList();
		long count = (long) qCount.getSingleResult();

		Pageable pageable = PageRequest.of(pageIndex, pageSize);
		Page<EQASerumBankDto> result = new PageImpl<EQASerumBankDto>(entities, pageable, count);
		return result;
	}

	@Override
	public EQASerumBankDto saveOrUpdate(EQASerumBankDto dto, UUID id) {
		if (dto != null) {
			Boolean checkCode = this.checkDuplicateCode(id, dto.getOriginalCode());
			Boolean isChangeSerumCode = false;
			UserInfoDto userInfo = userInHealthOrgService.getUserInfoByUserLogin();
			if (checkCode == null || checkCode) {
				return null;
			}

			EQASerumBank entity = null;
			if (id != null) {
				entity = eqaSerumBankRepository.getOne(id);
				if (dto.getIsManualSetCode() != null && dto.getIsManualSetCode() == true) {
					entity.setSerumCode(dto.getSerumCode());
				}else {
					//Nếu Loại mẫu thay đổi so với trước
					if (entity.getType() != dto.getType()) {
						isChangeSerumCode = true;
						entity.setSerumCode(this.generateSerumCodeByType(dto.getType()));
					}
				}
			}
			if(entity==null) {
				entity = new EQASerumBank();
				if (dto.getIsManualSetCode() != null && dto.getIsManualSetCode() == true) {
					entity.setSerumCode(dto.getSerumCode());
				}else {
					entity.setSerumCode(this.generateSerumCodeByType(dto.getType()));
				}
			}
			entity.setOriginalCode(dto.getOriginalCode());
			entity.setName(dto.getName());
			entity.setType(dto.getType());
			entity.setOriginalVolume(dto.getOriginalVolume());
			entity.setPresentVolume(dto.getPresentVolume());
			entity.setQuality(dto.getQuality());
			entity.setNote(dto.getNote());
			entity.setSampledDate(dto.getSampledDate());
			entity.setReceiveDate(dto.getReceiveDate());
			entity.setStoreLocation(dto.getStoreLocation());
			// Mã số lab
			entity.setLabCode(dto.getLabCode());

			// Tình trạng nhiễm HIV, âm tính hay dương tính, giá trị: PIConst.SampleStatus
			entity.setHivStatus(dto.getHivStatus());

			entity.setNumberBottle(dto.getNumberBottle());
			// Số lượng ống chia còn
			if(dto.getNumberBottlesRemaining() != null ) {
				entity.setNumberBottlesRemaining(dto.getNumberBottlesRemaining());
			}else {
				if(id != null) {
					int count = eqaSerumBankRepository.countSerumBottleRemaining(id);
					entity.setNumberBottlesRemaining(count);
				}	
			}
			
			
			// Chất lượng: Có lipit
			entity.setHasLipid(dto.getHasLipid());

			// Chất lượng: Tán huyết
			entity.setHemolysis(dto.getHemolysis());

			// Mẫu có ly tâm tốc độ cao
			entity.setHasHighSpeedCentrifugal(dto.getHasHighSpeedCentrifugal());

			// mẫu có lọc
			entity.setDialysis(dto.getDialysis());

			// Mẫu bất hoạt
			entity.setInactivated(dto.getInactivated());
			Set<EQASerumBottle> serumBottles = new HashSet<EQASerumBottle>();
			if(dto.getSerumBottles()!=null && dto.getSerumBottles().size()>0) {
				int i=0;
				for (EQASerumBottleDto srbDto : dto.getSerumBottles()) {					
					EQASerumBottle bottle = null;
					if(srbDto.getId()!=null) {
						bottle = eqaSerumBottleRepository.getOne(srbDto.getId());
						if(bottle!=null) {
							if (isChangeSerumCode) {
								bottle.setCode(eqaSerumBottleService.createCode(entity,i));
							
								i++;
							}else {
								bottle.setCode(srbDto.getCode());
								
							}
						}
					}
					if(bottle==null) {
						bottle = new EQASerumBottle();
						bottle.setCode(eqaSerumBottleService.createCode(entity,i));
						i++;
					}
					bottle.setHivStatus(srbDto.getHivStatus());
					bottle.setNote(srbDto.getNote());
					bottle.setBottleQuality(srbDto.getBottleQuality());
					bottle.setBottleVolume(srbDto.getBottleVolume());
					bottle.setLocalSaveBottle(srbDto.getLocalSaveBottle());
					bottle.setEqaSerumBank(entity);
					serumBottles.add(bottle);
				}
			}
			if(entity.getSerumBottles()==null) {
				entity.setSerumBottles(serumBottles);
			}
			else {
				entity.getSerumBottles().clear();
				entity.getSerumBottles().addAll(serumBottles);
			}
			entity = eqaSerumBankRepository.save(entity);
			if (entity != null) {
				return new EQASerumBankDto(entity);
			}
		}
		return null;
	}

	private String generateSerumCodeByType(int type) {
		String code = PIConst.SERUM_CODE + "-";
		int maxSTT = 0;
		if (type == PIConst.SerumType.plasma.getValue()) {
			code += "P";
		}else if (type == PIConst.SerumType.serum.getValue()) {
			code += "S";
		}else {
			return null;
		}

		String sql = "select new com.globits.PI.dto.EQASerumBankDto(entity) from EQASerumBank as entity "
				+ "where entity.type =:type ORDER BY entity.createDate DESC ";
		
		Query q = manager.createQuery(sql, EQASerumBankDto.class);
		q.setParameter("type", type);
		q.setFirstResult(0);
		q.setMaxResults(1);
		List<EQASerumBankDto> result = q.getResultList();
		if (result != null && result.size() > 0) {
			EQASerumBankDto dto = result.get(0);
			String stringSTT = dto.getSerumCode().substring(5, dto.getSerumCode().length());
			try {
				maxSTT = Integer.parseInt(stringSTT);
			}catch (NumberFormatException e) {
				maxSTT = result.size();
			}		
		}

		boolean codeUsed = true;
		while (codeUsed) {
			maxSTT = maxSTT + 1;
			String newCode = code + "-" + String.format("%04d", maxSTT);
			
			List<EQASerumBank> results = eqaSerumBankRepository.findBySerumCode(newCode);
			if (results == null || results.size() <= 0) {
				code = newCode;
				codeUsed = false;
			}
		}
		
		return code;
	}

	@Override
	public EQASerumBankDto getById(UUID id) {
		if (id != null) {
			EQASerumBank entity = eqaSerumBankRepository.getOne(id);
			if (entity != null) {
				EQASerumBankDto returnDto = new EQASerumBankDto(entity);
				List<EQASerumBottleDto> serumBottleList = returnDto.getSerumBottles();
				if(serumBottleList != null && serumBottleList.size() > 0) {
					Collections.sort(serumBottleList, new Comparator<EQASerumBottleDto>() {
						@Override
						public int compare(EQASerumBottleDto bottle1, EQASerumBottleDto bottle2) {
							try {
								String delimiter = "\\-";
								
								// Get the last index of bottle1 code
								String[] firstArray = bottle1.getCode().split(delimiter);
								Integer firstCode = Integer.parseInt(firstArray[firstArray.length - 1]);
								
								// Get the last index of bottle2 code
								String[] secondArray = bottle2.getCode().split(delimiter);
								Integer secondCode = Integer.parseInt(secondArray[secondArray.length - 1]);
								
								return firstCode - secondCode;
							} catch (Exception e) {
								// If there were errors, do normal sorting
								return bottle1.getCode().compareTo(bottle2.getCode());
							}
						}
						
					});
				}
				return returnDto;
			}
		}
		return null;
	}

	@Override
	public Boolean deleteById(UUID id) {
		if (id != null) {
			Integer countSerumBottle = eqaSerumBankRepository.countSerumBottle(id);
			if(countSerumBottle != 0) {
				return false;
			}			
			EQASerumBank entity = eqaSerumBankRepository.getOne(id);
			if (entity != null) {
				eqaSerumBankRepository.deleteById(id);
				return true;
			}
		}
		return null;
	}

	@Override
	public Boolean checkDuplicateCode(UUID id, String code) {
		if (code != null && StringUtils.hasText(code)) {
			EQASerumBank entity = eqaSerumBankRepository.getByCode(code);
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
	public Boolean checkDuplicateCodeSerum(UUID id, String code) {
		if (code != null && StringUtils.hasText(code)) {
			EQASerumBank entity = eqaSerumBankRepository.getByCodeSerum(code);
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

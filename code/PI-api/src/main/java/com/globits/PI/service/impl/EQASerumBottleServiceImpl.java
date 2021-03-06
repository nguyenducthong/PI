package com.globits.PI.service.impl;

import java.util.Comparator;
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

import com.globits.PI.domain.EQASerumBank;
import com.globits.PI.domain.EQASerumBottle;
import com.globits.PI.dto.EQASerumBankDto;
import com.globits.PI.dto.EQASerumBottleDto;
import com.globits.PI.functiondto.EQASerumbottleSearchDto;
import com.globits.PI.functiondto.UserInfoDto;
import com.globits.PI.repository.EQASerumBankRepository;
import com.globits.PI.repository.EQASerumBottleRepository;
import com.globits.PI.service.EQASerumBottleService;
import com.globits.PI.service.UserInHealthOrgService;
import com.globits.core.service.impl.GenericServiceImpl;

@Transactional
@Service
public class EQASerumBottleServiceImpl extends GenericServiceImpl<EQASerumBottle, UUID> implements EQASerumBottleService {

    @Autowired
    private EntityManager manager;

    @Autowired
    private EQASerumBottleRepository repository;

    @Autowired
    private EQASerumBankRepository eQASerumBankRepository;
    
	@Autowired
	private UserInHealthOrgService userInHealthOrgService;
	
	@Autowired
	private EQASerumBottleRepository eQASerumBottleRepository;

    @Override
    public Page<EQASerumBottleDto> searchByDto(EQASerumbottleSearchDto dto) {
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

        String sqlCount = "select count(eqap.id) from EQASerumBottle as eqap where (1=1) ";
        String sql = "select new com.globits.PI.dto.EQASerumBottleDto(eqap,false) from EQASerumBottle as eqap where (1=1) ";

        if (dto.getText() != null && StringUtils.hasText(dto.getText())) {
            whereClause += " AND ( eqap.code LIKE :text ) ";
        }
        if(dto.getEqaSerumBankId()!=null) {
        	whereClause += " AND ( eqap.eqaSerumBank.id = :eqaSerumBankId ) ";
        }
        if(dto.getCheckBottle() != null && dto.getCheckBottle() == true) {
        	whereClause += " AND (eqap.resultBottle IS NULL OR eqap.resultBottle = 0 ) ";
        }

        sql+=whereClause + " ORDER BY eqap.code, eqap.createDate DESC ";
        sqlCount+=whereClause;

        Query q = manager.createQuery(sql, EQASerumBottleDto.class);
        Query qCount = manager.createQuery(sqlCount);

        if (dto.getText() != null && StringUtils.hasText(dto.getText())) {
            q.setParameter("text", '%' + dto.getText() + '%');
            qCount.setParameter("text", '%' + dto.getText() + '%');
        }
        if (dto.getEqaSerumBankId() != null) {
            q.setParameter("eqaSerumBankId", dto.getEqaSerumBankId());
            qCount.setParameter("eqaSerumBankId", dto.getEqaSerumBankId());
        }
        
        int startPosition = pageIndex * pageSize;
        q.setFirstResult(startPosition);
        q.setMaxResults(pageSize);
        List<EQASerumBottleDto> entities = q.getResultList();
        long count = (long) qCount.getSingleResult();

        Pageable pageable = PageRequest.of(pageIndex, pageSize);
        Page<EQASerumBottleDto> result = new PageImpl<EQASerumBottleDto>(entities, pageable, count);
        return result;
    }

    @Override
    public EQASerumBottleDto saveOrUpdate(EQASerumBottleDto dto, UUID id) {
        if (dto != null && dto.getEqaSerumBank() != null && dto.getEqaSerumBank().getId() != null) {
            EQASerumBank eQASerumBank = eQASerumBankRepository.getOne(dto.getEqaSerumBank().getId());
//            UserInfoDto userInfo = userInHealthOrgService.getUserInfoByUserLogin();
            if (eQASerumBank == null || eQASerumBank.getId() == null) {
				return null;
			}
            
            EQASerumBottle entity = null;
            if (id != null) {
                entity = repository.getOne(id);
            }
            if( entity != null) {
            	if (dto.getIsManualSetCode() != null && dto.getIsManualSetCode() == true) {
                	entity.setCode(dto.getCode());
                }
            }
            if(entity == null) {
                entity = new EQASerumBottle();
                if (dto.getIsManualSetCode() != null && dto.getIsManualSetCode() == true) {
                	entity.setCode(dto.getCode());
                }else {
                	entity.setCode(this.createCode(eQASerumBank,0));
                }
            }
            entity.setNote(dto.getNote());
            entity.setHivStatus(dto.getHivStatus());
            entity.setBottleQuality(dto.getBottleQuality());
            entity.setBottleVolume(dto.getBottleVolume());
            entity.setLocalSaveBottle(dto.getLocalSaveBottle());
            entity.setResultBottle(dto.getResultBottle());
            entity.setBottleStatus(dto.getBottleStatus());
            if(id == null  && dto.getEqaSerumBank() != null && dto.getEqaSerumBank().getNumberBottle() != null ) {
            	eQASerumBank.setNumberBottle(dto.getEqaSerumBank().getNumberBottle() + 1);
            }
            if(dto.getEqaSerumBank() != null && dto.getEqaSerumBank().getNumberBottlesRemaining() != null) {
            	if(id != null) {
            		if(entity.getResultBottle() != null && entity.getResultBottle() == true) {
            			eQASerumBank.setNumberBottlesRemaining(dto.getEqaSerumBank().getNumberBottlesRemaining() - 1);	
            		}else {
            			 eQASerumBank.setNumberBottlesRemaining(dto.getEqaSerumBank().getNumberBottlesRemaining() + 1);	
            		}
            	}else {
            		 eQASerumBank.setNumberBottlesRemaining(dto.getEqaSerumBank().getNumberBottlesRemaining() + 1);	
            	}
            }
            entity.setEqaSerumBank(eQASerumBank);
            entity = repository.save(entity);
            if (entity != null ) {
                return new EQASerumBottleDto(entity);
            }
        }
        return null;
    }
    @Override
    public String createCode(EQASerumBank eQASerumBank,int startIndex){
        if (eQASerumBank != null && eQASerumBank.getId() != null && StringUtils.hasText(eQASerumBank.getSerumCode())) {
      
        	List<EQASerumBottle> result = null;
        	int maxSTT = 0;
            String code = eQASerumBank.getSerumCode();

			boolean codeUsed = true;
			while (codeUsed) {
				maxSTT = maxSTT + 1 + startIndex;
				String newCode = code + "-" + maxSTT;
				
				List<EQASerumBottle> results = repository.findByCode(newCode);
				if (results == null || results.size() <= 0) {
					code = newCode;
					codeUsed = false;
				}
			}
			return code;
        }
        return null;
    }


    @Override
    public EQASerumBottleDto getById(UUID id) {
        if (id != null) {
            EQASerumBottle entity = repository.getOne(id);         
            if (entity != null) {
                return new EQASerumBottleDto(entity);
            }
        }
        return null;
    }

    @Override
    public Boolean deleteById(UUID id) {
        if (id != null) {
        	Integer countSerumBottle = repository.countSampleBottle(id);
        	UserInfoDto userInfo = userInHealthOrgService.getUserInfoByUserLogin();
        	if(countSerumBottle != 0) {
        		return false;
        	}
            EQASerumBottle entity = repository.getOne(id);
            EQASerumBank eQASerumBank = eQASerumBankRepository.getOne(entity.getEqaSerumBank().getId());
            if (entity != null) {
                repository.deleteById(id);
                if(entity.getEqaSerumBank() != null && entity.getEqaSerumBank().getNumberBottle() != null) {
                	eQASerumBank.setNumberBottle(entity.getEqaSerumBank().getNumberBottle() - 1);
                } 
                if(eQASerumBank.getNumberBottlesRemaining() != null  && (entity.getResultBottle() == null || !entity.getResultBottle() )) {
                	eQASerumBank.setNumberBottlesRemaining(eQASerumBank.getNumberBottlesRemaining() - 1);
                }
                return true;
            }
        }
        return null;
    }

    @Override
    public List<EQASerumBottleDto> getBySerumBank(EQASerumBankDto serumBank) {
        if (serumBank != null ){
            EQASerumBank eqaSerumBank = eQASerumBankRepository.getOne(serumBank.getId());
            if (eqaSerumBank != null && eqaSerumBank.getId() != null) {
            	List<EQASerumBottleDto> resultList = repository.getAllBySerumBank(eqaSerumBank.getId());
            	resultList.sort(new Comparator<EQASerumBottleDto>() {

					@Override
					public int compare(EQASerumBottleDto arg0, EQASerumBottleDto arg1) {
						int firstID = Integer.parseInt(arg0.getCode().split("-")[arg0.getCode().split("-").length - 1]);
						int secondID = Integer.parseInt(arg1.getCode().split("-")[arg1.getCode().split("-").length - 1]);
						return firstID - secondID;
					}
            	});
            	return resultList;
			}
        }
        return null;
    }

	@Override
	public void saveOrUpdateMultiple(List<EQASerumBottleDto> dtoList, UUID serumBankID) {
		EQASerumBank eqaSerumBank = eQASerumBankRepository.getOne(serumBankID);
		eQASerumBankRepository.deleteAllSerumBottle(serumBankID);
		for (EQASerumBottleDto dto : dtoList) {
			dto.setEqaSerumBank(new EQASerumBankDto(eqaSerumBank));
			this.saveOrUpdate(dto, null);
		}
	}
	
	@Override
	public Boolean checkDuplicateCode(UUID id, String code) {
		if (code != null && StringUtils.hasText(code)) {
			EQASerumBottle entity = eQASerumBottleRepository.findByCodeBottle(code);
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

package com.globits.PI.service.impl;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collections;
import java.util.Comparator;
import java.util.Date;
import java.util.HashSet;
import java.util.Hashtable;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

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
import com.globits.PI.domain.EQAResultReport;
import com.globits.PI.domain.EQAResultReportDetail;
import com.globits.PI.domain.EQARound;
import com.globits.PI.domain.EQASample;
import com.globits.PI.domain.EQASampleTube;
import com.globits.PI.domain.HealthOrgEQARound;
import com.globits.PI.domain.Reagent;
import com.globits.PI.domain.UserInHealthOrg;

import com.globits.PI.dto.EQAResultReportDetailDto;
import com.globits.PI.dto.EQAResultReportDto;

import com.globits.PI.dto.EQASampleTubeDto;
import com.globits.PI.dto.HealthOrgEQARoundDto;
import com.globits.PI.functiondto.EQAResultReportSearchDto;
import com.globits.PI.functiondto.EQASampleTubeResultConclusionDto;
import com.globits.PI.functiondto.TestResultDto;
import com.globits.PI.functiondto.UserInfoDto;
import com.globits.PI.repository.EQAResultReportDetailRepository;
import com.globits.PI.repository.EQAResultReportRepository;
import com.globits.PI.repository.EQARoundRepository;
import com.globits.PI.repository.EQASampleRepository;
import com.globits.PI.repository.EQASampleSetRepository;
import com.globits.PI.repository.EQASampleTubeRepository;
import com.globits.PI.repository.HealthOrgEQARoundRepository;
import com.globits.PI.repository.ReagentRepository;
import com.globits.PI.service.EQAResultReportService;
import com.globits.PI.service.UserInHealthOrgService;
import com.globits.core.repository.FileDescriptionRepository;
import com.globits.core.service.impl.GenericServiceImpl;
import com.globits.PI.utils.PIDateTimeUtil;

@Transactional
@Service
public class EQAResultReportServiceImpl extends GenericServiceImpl<EQAResultReport, UUID> implements EQAResultReportService {
	
	@Autowired
	private EntityManager manager;

	@Autowired
	private EQAResultReportRepository eQAResultReportRepository;
	
	@Autowired
	private ReagentRepository reagentRepository;

	@Autowired
	private HealthOrgEQARoundRepository healthOrgEQARoundRepository;

	@Autowired
	private EQAResultReportDetailRepository eQAResultReportDetailRepository;

	@Autowired
	private EQASampleTubeRepository eQASampleTubeRepository;
	
	@Autowired
	private EQASampleSetRepository eQASampleSetRepository;
	
	@Autowired
	private UserInHealthOrgService userInHealthOrgService;
	
	@Autowired
	EQARoundRepository eQARoundRepository;
	
	@Autowired
	EQASampleRepository eQASampleRepository;
	
	@Autowired
	FileDescriptionRepository fileDescriptionRepository;
	
	public static Date getEndOfDay(Date date) {
		if(date!=null) {
			Calendar calendar = Calendar.getInstance();
		    calendar.setTime(date);
		    calendar.set(Calendar.HOUR_OF_DAY, 23);
		    calendar.set(Calendar.MINUTE, 59);
		    calendar.set(Calendar.SECOND, 59);
		    calendar.set(Calendar.MILLISECOND, 999);
		    return calendar.getTime();
		}
	    return null;
	}
	
	public static Date getStartOfDay(Date date) {
		if(date!=null) {
			Calendar calendar = Calendar.getInstance();
		    calendar.setTime(date);
		    calendar.set(Calendar.HOUR_OF_DAY, 00);
		    calendar.set(Calendar.MINUTE, 00);
		    calendar.set(Calendar.SECOND, 00);
		    calendar.set(Calendar.MILLISECOND, 000);
		    return calendar.getTime();
		}
	    return null;
	}
	
	@Override
	public Page<EQAResultReportDto> searchByDto(EQAResultReportSearchDto dto) {
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
		UserInfoDto userInfo = userInHealthOrgService.getUserInfoByUserLogin();

		String whereClause = "";
		String orderBy = " ORDER BY  eqap.createDate DESC, eqap.orderTest DESC, eqap.healthOrgRound.round.createDate DESC ";
		
		String sqlCount = "select count(eqap.id) from EQAResultReport as eqap where (1=1) ";
		String sql = "select new com.globits.PI.dto.EQAResultReportDto(eqap,true) from EQAResultReport as eqap where (1=1) ";

		if (dto.getTypeMethod() != null && dto.getTypeMethod() > 0) {
			whereClause += " AND ( eqap.typeMethod = :typeMethod ) ";
		}
		if (dto.getText() != null && StringUtils.hasText(dto.getText())) {
			whereClause += " AND ( eqap.healthOrgRound.healthOrg.code LIKE :text "
					+ "OR eqap.healthOrgRound.healthOrg.name LIKE :text "
					+ "OR eqap.reagent.name LIKE :text "
					+ "OR eqap.dateSubmitResults LIKE :text) ";
		}
		if(dto.getRound() != null && dto.getRound().getId() != null) {
			whereClause += " AND ( eqap.healthOrgRound.round.id =: roundId ) " ;
		}
		if (dto.getStartDate() != null && dto.getEndDate() != null) {
			whereClause += " AND ( eqap.testDate >=: startDate ) AND ( eqap.testDate <=: endDate ) " ;
		}
		if(dto.getStartDate() != null && dto.getEndDate() == null) {
			whereClause += " AND ( eqap.testDate >=: startDate ) " ;
		}
		if(dto.getEndDate() != null && dto.getStartDate() == null) {
			whereClause += " AND ( eqap.testDate <=: endDate ) " ;
		}
		
		List<UUID> listHealthOrgId = null;
		if(!userInfo.getIsRoleAdmin() && !userInfo.getIsRoleAdiministrativeStaff() && !userInfo.getIsRoleStaff()) {
			listHealthOrgId = userInHealthOrgService.getListHealthOrgIdByUser(null);
			if (listHealthOrgId != null && listHealthOrgId.size() > 0) {
				whereClause += " AND ( eqap.healthOrgRound.healthOrg.id in (:healthOrgIds) ) ";
			}
		}
		if(dto.getIsManagementUnit() != null) {
			whereClause += " AND ( eqap.healthOrgRound.healthOrg.isManagementUnit =: isManagementUnit ) " ;
		}
				
		sql+=whereClause + orderBy;
		sqlCount+=whereClause;

		Query q = manager.createQuery(sql, EQAResultReportDto.class);
		Query qCount = manager.createQuery(sqlCount);
	

		if (dto.getTypeMethod() != null && dto.getTypeMethod() > 0) {
			q.setParameter("typeMethod", dto.getTypeMethod());
			qCount.setParameter("typeMethod", dto.getTypeMethod());
		}
		if (dto.getText() != null && StringUtils.hasText(dto.getText())) {
			q.setParameter("text", "%" + dto.getText() + "%");
			qCount.setParameter("text", "%" + dto.getText() + "%");
		}
		if (dto.getRound() != null && dto.getRound().getId() != null) {
			q.setParameter("roundId", dto.getRound().getId() );
			qCount.setParameter("roundId", dto.getRound().getId() );
		}
		if (dto.getStartDate() != null && dto.getEndDate() == null) {
			q.setParameter("startDate", getStartOfDay(dto.getStartDate()) );
			qCount.setParameter("startDate", getStartOfDay(dto.getStartDate()) );
		}
		if (dto.getEndDate() != null && dto.getStartDate() == null) {
			q.setParameter("endDate", getEndOfDay(dto.getEndDate()) );
			qCount.setParameter("endDate", getEndOfDay(dto.getEndDate()) );
		}
		if (dto.getStartDate() != null && dto.getEndDate() != null) {
			q.setParameter("startDate", getStartOfDay(dto.getStartDate()) );
			qCount.setParameter("startDate", getStartOfDay(dto.getStartDate()) );
			
			q.setParameter("endDate", getEndOfDay(dto.getEndDate()) );
			qCount.setParameter("endDate", getEndOfDay(dto.getEndDate()) );
		}
		if(!userInfo.getIsRoleAdmin() && !userInfo.getIsRoleAdiministrativeStaff() && !userInfo.getIsRoleStaff()) {
			q.setParameter("healthOrgIds", listHealthOrgId);
			qCount.setParameter("healthOrgIds", listHealthOrgId);
		}
		if(dto.getIsManagementUnit() != null) {
			q.setParameter("isManagementUnit", dto.getIsManagementUnit());
			qCount.setParameter("isManagementUnit", dto.getIsManagementUnit());
		}
		int startPosition = pageIndex * pageSize;
		q.setFirstResult(startPosition);
		q.setMaxResults(pageSize);
		List<EQAResultReportDto> dtos = q.getResultList();
		long count = (long) qCount.getSingleResult();
		if(userInfo!=null && userInfo.getListHealthOrgId()!=null && userInfo.getListHealthOrgId().size()>0 && dtos!=null && dtos.size()>0) {
			Boolean isCheck = false;
			for (EQAResultReportDto eqaResultReportDto : dtos) {
//				for (UUID id : userInfo.getListHealthOrgId()) {
//					if(id.equals(eqaResultReportDto.getHealthOrgId())) {
//						isCheck = true;
//					}
//				}
				eqaResultReportDto.setIsEditAble(userInfo.getListHealthOrgId().contains(eqaResultReportDto.getHealthOrgRound().getHealthOrg().getId()));
			}
		}
		Pageable pageable = PageRequest.of(pageIndex, pageSize);
		Page<EQAResultReportDto> result = new PageImpl<EQAResultReportDto>(dtos, pageable, count);
		return result;
	}

	@Override
	public EQAResultReportDto saveOrUpdate(EQAResultReportDto dto, UUID id) throws ParseException {
		if (dto != null && dto.getTypeMethod() != null && dto.getHealthOrgRound() != null && dto.getHealthOrgRound().getId() != null) {
			EQAResultReport entity = null;
			////Check User
			UserInfoDto userInfo = userInHealthOrgService.getUserInfoByUserLogin();
			boolean isCheckUser = false;
			// admin thì luôn đc thêm sửa
			if(userInfo.getIsRoleAdmin()) {
				isCheckUser = true;
			}
			
			//Sinh pham chọn là Other thì sẽ không check 
			if(dto.getOtherReagent() != null && dto.getOtherReagent() == false) {
				Boolean checkReagent = this.checkReagent(id, dto.getHealthOrgRound().getId(), dto.getReagent().getId(), dto.getTypeMethod());
				if (checkReagent) {
					return null;
				}
				List<EQAResultReport> entities = eQAResultReportRepository.countReagentByHealthOrgRound(dto.getHealthOrgRound().getId(), dto.getReagent().getId(), dto.getTypeMethod());
				if(entities != null && entities.size() > 0) {
					entity = entities.get(0);
				}
			}
			if (id != null) {
				entity = eQAResultReportRepository.getOne(id);
			}
			if(entity == null) {
				entity = new EQAResultReport();
			}
			entity.setReagentLot(dto.getReagentLot());
//			entity.setReagentExpiryDate(dto.getReagentExpiryDate());
			if(dto.getDayReagentExpiryDate() != null && dto.getMonthReagentExpiryDate() != null && dto.getYeahReagentExpiryDate() != null) {
				Date date = PIDateTimeUtil.numberToDate( dto.getDayReagentExpiryDate(),dto.getMonthReagentExpiryDate(),dto.getYeahReagentExpiryDate());
				entity.setReagentExpiryDate(date);			
			}else if(dto.getMonthReagentExpiryDate() != null && dto.getYeahReagentExpiryDate() != null) {
				int day =  PIDateTimeUtil.getDatesByYearMonth(dto.getYeahReagentExpiryDate(), dto.getMonthReagentExpiryDate()).size();
				Date date = PIDateTimeUtil.numberToDate( day ,dto.getMonthReagentExpiryDate(),dto.getYeahReagentExpiryDate());
				entity.setReagentExpiryDate(date);
			}else {
				Date date = PIDateTimeUtil.numberToDate(31, 12 ,dto.getYeahReagentExpiryDate());
				entity.setReagentExpiryDate(date);				
			}
			entity.setReagentUnBoxDate(dto.getReagentUnBoxDate());
			entity.setTechnician(dto.getTechnician()); 
			entity.setNote(dto.getNote());
			entity.setIsFinalResult(dto.getIsFinalResult());
			entity.setTypeMethod(dto.getTypeMethod());
			
			Reagent reagent = null;
			if (dto.getReagent() != null && dto.getReagent().getId() != null) {
				reagent = reagentRepository.getOne(dto.getReagent().getId());
			}
			entity.setReagent(reagent);
			
			HealthOrgEQARound healthOrgRound = null;
			if (dto.getHealthOrgRound() != null && dto.getHealthOrgRound().getId() != null) {
				healthOrgRound = healthOrgEQARoundRepository.getOne(dto.getHealthOrgRound().getId());
				//check user
				if(healthOrgRound.getHealthOrg() != null) {
					if(healthOrgRound.getHealthOrg().getListUser() != null && healthOrgRound.getHealthOrg().getListUser().size() >0) {
						for (UserInHealthOrg user : healthOrgRound.getHealthOrg().getListUser()) {
							
							if(userInfo != null && userInfo.getUser() != null && user.getUser() != null && !userInfo.getIsRoleAdmin()) {
								if(userInfo.getUser().getId().equals(user.getUser().getId())) {
									isCheckUser = true;
								}
							}
						}
					}
				}
			}
			if (healthOrgRound == null) {
				return null;
			}
			//Nếu user đang đang nhập khác user trong đơn vị được sửa thì return null
			if(!isCheckUser) {
				return null;
			}
			entity.setHealthOrgRound(healthOrgRound);
			entity.setSupplyOfReagent(dto.getSupplyOfReagent());// Nguồn cung cấp sinh phẩm
			entity.setPersonBuyReagent(dto.getPersonBuyReagent());// Người mua sinh phẩm
			entity.setOrderTest(dto.getOrderTest());// Thứ tự xét nghiệm
			entity.setTestDate(dto.getTestDate());// Ngày xét nghiệm
			entity.setDateSubmitResults(dto.getDateSubmitResults());//thời gian thực hiện kết quả cuối cùng

			//Cập nhập kết quả null.
			List<EQAResultReportDetail> list = eQAResultReportDetailRepository.listResultReportDetail();
			if(list != null && list.size() > 0) {
				for(EQAResultReportDetail item : list ) {
					item.setResult(PIConst.EQAResultReportDetail_TestValue.none.getValue());
					eQAResultReportDetailRepository.save(item);
				}
			}
			if (dto.getDetails() != null && dto.getDetails().size() > 0) {
				Set<EQAResultReportDetail> listEQAResultReportDetail = new HashSet<EQAResultReportDetail>();
				for (EQAResultReportDetailDto eQAResultReportDetailDto : dto.getDetails()) {
					EQAResultReportDetail eQAResultReportDetail = null;
					if (eQAResultReportDetailDto.getId() != null) {
						eQAResultReportDetail = eQAResultReportDetailRepository.getOne(eQAResultReportDetailDto.getId());
					}
					
					if (eQAResultReportDetail == null) {
						eQAResultReportDetail = new EQAResultReportDetail();
					}
					
					eQAResultReportDetail.setResultReport(entity);
					eQAResultReportDetail.setResult(eQAResultReportDetailDto.getResult());
					eQAResultReportDetail.setOrderNumber(eQAResultReportDetailDto.getOrderNumber());
					eQAResultReportDetail.setNote(eQAResultReportDetailDto.getNote());
					
					//serodia 
					eQAResultReportDetail.setAgglomeration(eQAResultReportDetailDto.getAgglomeration());
					eQAResultReportDetail.setCheckValue(eQAResultReportDetailDto.getCheckValue());
					eQAResultReportDetail.setTestValue(eQAResultReportDetailDto.getTestValue());
					//ELISA
					eQAResultReportDetail.setCutOff(eQAResultReportDetailDto.getCutOff());
					eQAResultReportDetail.setoDvalue(eQAResultReportDetailDto.getoDvalue());
					eQAResultReportDetail.setRatioOdAndCutOff(eQAResultReportDetailDto.getRatioOdAndCutOff());
					//ECLIA
					eQAResultReportDetail.setsCOvalue(eQAResultReportDetailDto.getsCOvalue());
					//Test nhanh
					eQAResultReportDetail.settLine(eQAResultReportDetailDto.gettLine());
					eQAResultReportDetail.setcLine(eQAResultReportDetailDto.getcLine());
					
					EQASampleTube sampleTube = null;
					if (eQAResultReportDetailDto.getSampleTube() != null && eQAResultReportDetailDto.getSampleTube().getId() != null) {
						sampleTube = eQASampleTubeRepository.getOne(eQAResultReportDetailDto.getSampleTube().getId());
					}
					eQAResultReportDetail.setSampleTube(sampleTube);
					
					listEQAResultReportDetail.add(eQAResultReportDetail);
				}

				if (entity.getDetails() == null) {
					entity.setDetails(listEQAResultReportDetail);
				} else {
					entity.getDetails().clear();
					entity.getDetails().addAll(listEQAResultReportDetail);
				}
			}
			
	
			
			
			
			entity = eQAResultReportRepository.save(entity);
		
			HealthOrgEQARound healthOrgEQARound = healthOrgEQARoundRepository.getOne(entity.getHealthOrgRound().getId());
			healthOrgEQARound.setHasResult(true);
			if (entity != null ) {
				return new EQAResultReportDto(entity);
			}
		}
		return null;
	}

	@Override
	public EQAResultReportDto getById(UUID id) {
		if (id != null) {
			EQAResultReport entity = eQAResultReportRepository.getOne(id);
			if (entity != null) {
				EQAResultReportDto eqaResultReportDto = new EQAResultReportDto(entity);
				return eqaResultReportDto;
			}
		}
		return null;
	}

	@Override
	public Boolean deleteById(UUID id) {
		if (id != null) {
			EQAResultReport entity = eQAResultReportRepository.getOne(id);
			UserInfoDto userInfo = userInHealthOrgService.getUserInfoByUserLogin();
			
			if (entity != null) {
				//Check user
				boolean isCheckUser = false;
				if(entity.getHealthOrgRound() != null &&  entity.getHealthOrgRound().getHealthOrg() != null) {
					if(entity.getHealthOrgRound().getHealthOrg().getListUser() != null && entity.getHealthOrgRound().getHealthOrg().getListUser().size() >0) {
						for (UserInHealthOrg user : entity.getHealthOrgRound().getHealthOrg().getListUser()) {
							if(userInfo != null && userInfo.getUser() != null && user.getUser() != null && userInfo.getIsRoleAdmin()) {
								
									isCheckUser = true;
								
							}
						}
					}
				}
				//Nếu user đang đang nhập khác user trong đơn vị được xóa thì return null
				if(!isCheckUser) {
					return false;
				}
				eQAResultReportRepository.deleteById(id);
		
				return true;
			}
		}
		return null;
	}

	@Override
	public List<EQAResultReportDto> getAllResultByHealthOrgEQARoundId(UUID id) {
		UserInfoDto userInfo = userInHealthOrgService.getUserInfoByUserLogin();
		
		List<EQAResultReportDto> result = eQAResultReportRepository.getAllResultByHealthOrgEQARoundId(id);
		for (EQAResultReportDto eqaResultReportDto : result) {
			eqaResultReportDto.setIsEditAble(userInfo.getListHealthOrgId().contains(eqaResultReportDto.getHealthOrgId()));
		}
		return result;
	}

	@Override
	/**
	 * Create a new EQAResultReport for the conclusion based on the DTO passed through from the client
	 * 
	 * @param	dtoList	list of DTOs that will be used to create a list of EQAResultReportDetail
	 * @param	orgID	The ID of the HealthOrgEQARound that the EQAResultReport belongs to
	 * @return			true if the creating process is successful, false if errors happen
	 */
	public Boolean updateResultReportConclusionBySampleTube(List<EQASampleTubeResultConclusionDto> dtoList, UUID orgID,Boolean isFinalResult) {
		if (dtoList != null && !dtoList.isEmpty()) {
			UserInfoDto userInfo = userInHealthOrgService.getUserInfoByUserLogin();
			EQAResultReport conclusion = null;
			EQAResultReportDto eqaResultReportDto = eQAResultReportRepository.getConclusionByHealthOrgEQARoundId(orgID);
			if (eqaResultReportDto != null) {			
				conclusion = eQAResultReportRepository.getOne(eqaResultReportDto.getId());
			} else {
				conclusion = new EQAResultReport();
			}
			conclusion.setIsFinalResult(isFinalResult);
			Set<EQAResultReportDetail> resultReportDetailList = new HashSet<>();
			EQASampleTube tube;
			conclusion.setTypeMethod(PIConst.EQAResultReportTypeMethod.Conclusion.getValue());
			HealthOrgEQARound healthOrgEQARound = healthOrgEQARoundRepository.getOne(orgID);
			if(isFinalResult) {
			healthOrgEQARound.setHasResult(true);
			}else {
				healthOrgEQARound.setHasResult(false);	
			}
			conclusion.setHealthOrgRound(healthOrgEQARound);
			for (EQASampleTubeResultConclusionDto dto : dtoList) {
				tube = eQASampleTubeRepository.getOne(dto.getTubeID());
				EQAResultReportDetail resultReportDetail = new EQAResultReportDetail();
				resultReportDetail.setResult(dto.getResult());
				resultReportDetail.setSampleTube(tube);
				resultReportDetail.setNote(dto.getNote());
				resultReportDetail.setResultReport(conclusion);
				resultReportDetailList.add(resultReportDetail);
				tube.setLastResultFromLab(dto.getResult());
				tube.setStatus(3);
			}
			
			if(conclusion.getDetails() == null) {
				conclusion.setDetails(resultReportDetailList);
			}
			else {
				conclusion.getDetails().clear();
				conclusion.getDetails().addAll(resultReportDetailList);
			}
			eQAResultReportRepository.save(conclusion);
			return true;
		}
		return false;
	}
	@Override
	public EQAResultReportDto updateFinalResultStatus(UUID id,boolean isFinalResult) {
		UserInfoDto userInfo = userInHealthOrgService.getUserInfoByUserLogin();
		if(userInfo.getIsRoleAdmin()) {
			EQAResultReport re = eQAResultReportRepository.getOne(id);
			if(re!=null) {
				re.setIsFinalResult(isFinalResult);
				re = eQAResultReportRepository.save(re);
				return new EQAResultReportDto(re);
			}
		}
		return null;
	}
	
	@Override
	/**
	 * Get a list of DTOs from the ID of the HealthOrgEQARound. This list of DTOs will be displayed on the client.
	 * 
	 * @param	orgID	The ID of the HealthOrgEQARound
	 * @return			a list of the DTOs to be displayed on the client. Return a new DTO list 
	 * 					if there is no conclusion for this particular HealthOrgEQARound yet.
	 */
	public List<EQASampleTubeResultConclusionDto> getEQASampleTubeResultConclusionDtoByHealthOrgEQARoundId(UUID orgID) {
		EQAResultReportDto eqaResultReportDto = eQAResultReportRepository.getConclusionByHealthOrgEQARoundId(orgID);
		if (eqaResultReportDto != null) {
			
			Set<EQAResultReportDetailDto> resultReportDetailList = eqaResultReportDto.getDetails();
			List<EQASampleTubeResultConclusionDto> returnList = new ArrayList<>();
			for (EQAResultReportDetailDto detailDto : resultReportDetailList) {
				EQASampleTubeResultConclusionDto returnDto = new EQASampleTubeResultConclusionDto();
				returnDto.setTubeCode(detailDto.getSampleTube().getCode());
				returnDto.setNote(detailDto.getNote());
				returnDto.setResult(detailDto.getResult());
				returnDto.setTubeID(detailDto.getSampleTube().getId());
				returnList.add(returnDto);
			}
			Collections.sort(returnList);
			return returnList;
		} else {
			List<EQASampleTubeResultConclusionDto> returnList = new ArrayList<>();
			List<EQASampleTubeDto> tubeList = eQASampleTubeRepository.getByHealthOrgEQARoundId(orgID);
			for(EQASampleTubeDto tube : tubeList) {
				EQASampleTubeResultConclusionDto conclusionDto = new EQASampleTubeResultConclusionDto();
				conclusionDto.setTubeCode(tube.getCode());
				conclusionDto.setTubeID(tube.getId());
				conclusionDto.setNote(null);
				conclusionDto.setResult(null);
				returnList.add(conclusionDto);
			}
			Collections.sort(returnList);
			return returnList;
		}
	}

	
	@Override
	public List<EQAResultReport> getAllResultByHealthOrg(UUID id) {
		List<EQAResultReport> result = eQAResultReportRepository.getAllResultByHealthOrg(id);
		return result;
	}

	@Override
	public List<EQAResultReportDto> getAllResultByHealthOrgManagementEQARoundId(UUID id) {
		UserInfoDto userInfo = userInHealthOrgService.getUserInfoByUserLogin();
		
		List<EQAResultReportDto> result = eQAResultReportRepository.getAllResultByHealthOrgManagementEQARoundId(id);
		for (EQAResultReportDto eqaResultReportDto : result) {
			eqaResultReportDto.setIsEditAble(userInfo.getListHealthOrgId().contains(eqaResultReportDto.getHealthOrgId()));
		}
		return result;
	}
	@Override
	public Boolean checkReagent(UUID id, UUID idHealthOrgRound, UUID idReagent, Integer typeMethod) {
//		if(PIConst.CHECK_ERROR_RESULT) {
			List<EQAResultReport> entities = eQAResultReportRepository.countReagentByHealthOrgRound(idHealthOrgRound, idReagent, typeMethod);
			if(entities == null) {
				return false;
			}
			if(entities != null && entities.size()>0) {
				for (EQAResultReport eqaResultReport : entities) {
					if(id != null && eqaResultReport.getId().equals(id)) {
						return false;
					}
				}
				return true;
			}
			return false;
//		}
//		return false;
	}


	@Override
	public Integer countResultReport(UUID id) {
		Integer count = 0;
		if(id != null) {
			count = eQAResultReportRepository.countResultReport(id);
		}
		return count;
	}


	
	
	@Override
	public List<TestResultDto> getListTestResultByRound(UUID RoundId,UUID reagentId,Integer testMethod,UUID sampleId) {
		if(RoundId!=null) {
			String SQL = "SELECT new com.globits.PI.functiondto.TestResultDto(re.sampleTube.eqaSample.id, "
					+ " re.resultReport.reagent.name,"
					+ " re.resultReport.reagent.id , "
					+ " COUNT(re.id),"
					+ " re.sampleTube.eqaSample.code,"
					+ " re.result,"
					+ " re.resultReport.typeMethod ) "
					+ " FROM EQAResultReportDetail re ";
			String whereClause= " WHERE re.resultReport.healthOrgRound.round.id = :RoundId "
					+ "	AND (re.resultReport.healthOrgRound.healthOrg.isManagementUnit is false or re.resultReport.healthOrgRound.healthOrg.isManagementUnit is null)"
					+ " AND re.resultReport.reagent.healthDepartmentDirectory is true "
					+ " AND re.result !=: result "
					+ " AND re.resultReport.isFinalResult is true ";
			if(reagentId!=null && !reagentId.equals(new UUID(0L, 0L))) {
				whereClause+= " AND re.resultReport.reagent.id=:reagentId ";
			}
			if(testMethod!=null && testMethod>0 && testMethod<6) {
				whereClause+= " AND re.resultReport.typeMethod=:testMethod ";
			}
			if(sampleId!=null && !sampleId.equals(new UUID(0L, 0L))) {
				whereClause+= " AND re.sampleTube.eqaSample.id=:sampleId ";
			}
			
			String groupByClause=" GROUP BY re.sampleTube.eqaSample.id, "
					+ " re.resultReport.reagent.name "
					+ ", re.resultReport.reagent.id "
					+ ", re.sampleTube.eqaSample.code"
					+ ", re.result"
					+ ", re.resultReport.typeMethod  ";
			String OrderByClauer = " ORDER BY re.sampleTube.eqaSample.code, re.resultReport.reagent.name ";
			SQL+=whereClause+groupByClause + OrderByClauer;			
			Query q = manager.createQuery(SQL,TestResultDto.class);
			q.setParameter("RoundId", RoundId);
			q.setParameter("result", PIConst.EQAResultReportDetail_TestValue.none.getValue());
			if(reagentId!=null && !reagentId.equals(new UUID(0L, 0L))) {
				q.setParameter("reagentId", reagentId);
			}
			if(testMethod!=null && testMethod>0 && testMethod<6) {
				q.setParameter("testMethod", testMethod);
			}
			if(sampleId!=null && !sampleId.equals(new UUID(0L, 0L))) {
				q.setParameter("sampleId", sampleId);
			}
			return q.getResultList();
		}
		return null;
	}

	
	@Override
	public Page<EQAResultReportDto> searchByDtoAll(EQAResultReportSearchDto dto) {
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
		UserInfoDto userInfo = userInHealthOrgService.getUserInfoByUserLogin();

		String whereClause = "";
		String orderBy = " ORDER BY  eqap.createDate DESC, eqap.orderTest DESC, eqap.healthOrgRound.round.createDate DESC ";
		
		String sqlCount = "select count(eqap.id) from EQAResultReport as eqap where (1=1) ";
		String sql = "select new com.globits.PI.dto.EQAResultReportDto(eqap,true) from EQAResultReport as eqap where (1=1) ";

		if (dto.getTypeMethod() != null && dto.getTypeMethod() > 0) {
			whereClause += " AND ( eqap.typeMethod = :typeMethod ) ";
		}
		if (dto.getText() != null && StringUtils.hasText(dto.getText())) {
			whereClause += " AND ( eqap.healthOrgRound.healthOrg.code LIKE :text "
					+ "OR eqap.healthOrgRound.healthOrg.name LIKE :text "
					+ "OR eqap.dateSubmitResults LIKE :text) ";
		}
		if(dto.getRound() != null && dto.getRound().getId() != null) {
			whereClause += " AND ( eqap.healthOrgRound.round.id =: roundId ) " ;
		}
		if (dto.getStartDate() != null && dto.getEndDate() != null) {
			whereClause += " AND ( eqap.testDate >=: startDate ) AND ( eqap.testDate <=: endDate ) " ;
		}
		if(dto.getStartDate() != null && dto.getEndDate() == null) {
			whereClause += " AND ( eqap.testDate >=: startDate ) " ;
		}
		if(dto.getEndDate() != null && dto.getStartDate() == null) {
			whereClause += " AND ( eqap.testDate <=: endDate ) " ;
		}
		
		List<UUID> listHealthOrgId = null;
		if(!userInfo.getIsRoleAdmin() && !userInfo.getIsRoleAdiministrativeStaff() && !userInfo.getIsRoleStaff()) {
			listHealthOrgId = userInHealthOrgService.getListHealthOrgIdByUser(null);
			if (listHealthOrgId != null && listHealthOrgId.size() > 0) {
				whereClause += " AND ( eqap.healthOrgRound.healthOrg.id in (:healthOrgIds) ) ";
			}
		}
		if(dto.getIsManagementUnit() != null) {
			whereClause += " AND ( eqap.healthOrgRound.healthOrg.isManagementUnit =: isManagementUnit ) " ;
		}
				
		sql+=whereClause + orderBy;
		sqlCount+=whereClause;

		Query q = manager.createQuery(sql, EQAResultReportDto.class);
		Query qCount = manager.createQuery(sqlCount);

		if (dto.getTypeMethod() != null && dto.getTypeMethod() > 0) {
			q.setParameter("typeMethod", dto.getTypeMethod());
			qCount.setParameter("typeMethod", dto.getTypeMethod());
		}
		if (dto.getText() != null && StringUtils.hasText(dto.getText())) {
			q.setParameter("text", "%" + dto.getText() + "%");
			qCount.setParameter("text", "%" + dto.getText() + "%");
		}
		if (dto.getRound() != null && dto.getRound().getId() != null) {
			q.setParameter("roundId", dto.getRound().getId() );
			qCount.setParameter("roundId", dto.getRound().getId() );
		}
		if (dto.getStartDate() != null && dto.getEndDate() == null) {
			q.setParameter("startDate", getStartOfDay(dto.getStartDate()) );
			qCount.setParameter("startDate", getStartOfDay(dto.getStartDate()) );
		}
		if (dto.getEndDate() != null && dto.getStartDate() == null) {
			q.setParameter("endDate", getEndOfDay(dto.getEndDate()) );
			qCount.setParameter("endDate", getEndOfDay(dto.getEndDate()) );
		}
		if (dto.getStartDate() != null && dto.getEndDate() != null) {
			q.setParameter("startDate", getStartOfDay(dto.getStartDate()) );
			qCount.setParameter("startDate", getStartOfDay(dto.getStartDate()) );
			
			q.setParameter("endDate", getEndOfDay(dto.getEndDate()) );
			qCount.setParameter("endDate", getEndOfDay(dto.getEndDate()) );
		}
		if(!userInfo.getIsRoleAdmin() && !userInfo.getIsRoleAdiministrativeStaff() && !userInfo.getIsRoleStaff()) {
			q.setParameter("healthOrgIds", listHealthOrgId);
			qCount.setParameter("healthOrgIds", listHealthOrgId);
		}
		if(dto.getIsManagementUnit() != null) {
			q.setParameter("isManagementUnit", dto.getIsManagementUnit());
			qCount.setParameter("isManagementUnit", dto.getIsManagementUnit());
		}
		int startPosition = pageIndex * pageSize;
		q.setFirstResult(startPosition);
		q.setMaxResults(pageSize);
		List<EQAResultReportDto> dtos = q.getResultList();
		long count = (long) qCount.getSingleResult();
		
		if(userInfo!=null && userInfo.getListHealthOrgId()!=null && userInfo.getListHealthOrgId().size()>0 && dtos!=null && dtos.size()>0) {
			Boolean isCheck = false;
			for (EQAResultReportDto eqaResultReportDto : dtos) {
				eqaResultReportDto.setIsEditAble(userInfo.getListHealthOrgId().contains(eqaResultReportDto.getHealthOrgRound().getHealthOrg().getId()));
			}
		}
		Pageable pageable = PageRequest.of(pageIndex, pageSize);
		Page<EQAResultReportDto> result = new PageImpl<EQAResultReportDto>(dtos, pageable, count);
		return result;
	}
	
	
}

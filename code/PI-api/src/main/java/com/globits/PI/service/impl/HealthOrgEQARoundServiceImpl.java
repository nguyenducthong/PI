package com.globits.PI.service.impl;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

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
import com.globits.PI.domain.EQARound;
import com.globits.PI.domain.EQASampleSet;
import com.globits.PI.domain.EQASampleSetDetail;
import com.globits.PI.domain.EQASampleTube;
import com.globits.PI.domain.HealthOrg;
import com.globits.PI.domain.HealthOrgEQARound;
import com.globits.PI.dto.EQAPlanningDto;
import com.globits.PI.dto.EQARoundDto;
import com.globits.PI.dto.HealthOrgDto;
import com.globits.PI.dto.HealthOrgEQARoundDto;
import com.globits.PI.functiondto.HealthOrgEQARoundSearchDto;
import com.globits.PI.functiondto.UserInfoDto;
import com.globits.PI.repository.EQARoundRepository;
import com.globits.PI.repository.EQASampleSetRepository;
import com.globits.PI.repository.EQASampleTubeRepository;
import com.globits.PI.repository.HealthOrgEQARoundRepository;
import com.globits.PI.repository.HealthOrgRepository;
import com.globits.PI.service.EQASampleTubeService;
import com.globits.PI.service.HealthOrgEQARoundService;
import com.globits.PI.service.UserInHealthOrgService;
import com.globits.core.dto.ResultMessageDto;
import com.globits.core.service.impl.GenericServiceImpl;

@Transactional
@Service
public class HealthOrgEQARoundServiceImpl extends GenericServiceImpl<HealthOrgEQARound, UUID>
		implements HealthOrgEQARoundService {

	@Autowired
	private EntityManager manager;

	@Autowired
	private HealthOrgEQARoundRepository healthOrgEQARoundRepository;

	@Autowired
	private HealthOrgRepository healthOrgRepository;

	@Autowired
	private EQARoundRepository eQARoundRepository;

	@Autowired
	private EQASampleSetRepository eQASampleSetRepository;

	@Autowired
	private EQASampleTubeService eQASampleTubeService;

	@Autowired
	private EQASampleTubeRepository eQASampleTubeRepository;

	@Autowired
	private UserInHealthOrgService userInHealthOrgService;

	@Override
	public Page<HealthOrgEQARoundDto> searchByDto(HealthOrgEQARoundSearchDto dto) {
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
		String orderBy = " ORDER BY hoer.round.startDate DESC,hoer.healthOrg.code ASC ";

		String sqlCount = "select count(hoer.id) from HealthOrgEQARound as hoer where (1=1) ";
		String sql = "select new com.globits.PI.dto.HealthOrgEQARoundDto(hoer,true) from HealthOrgEQARound as hoer where (1=1) ";

		if (dto.getText() != null && StringUtils.hasText(dto.getText())) {
			whereClause += " AND ( hoer.round.name LIKE :text OR hoer.round.code LIKE :text OR hoer.healthOrg.name LIKE :text OR hoer.healthOrg.code LIKE :text) ";
		}
		if (dto.getRoundId() != null) {
			whereClause += " AND ( hoer.round.id =:roundId ) ";			
		}
		if(dto.getHasConclusion()!=null && !dto.getHasConclusion()) {
			whereClause += " AND ( hoer.id not in (SELECT rr.healthOrgRound.id FROM EQAResultReport rr WHERE rr.typeMethod=:typeMethod ) ) ";
		}
		if (dto.getIsRunning() != null && dto.getIsRunning() == true) {
			whereClause += " AND (hoer.sampleTransferStatus in (1,-1)) ";
		}
		if(dto.getTransferStatus() != null) {
			whereClause += " AND (hoer.sampleTransferStatus = :transferStatus) ";
		}
		if(dto.getHasResult() != null) {
			whereClause += " AND (hoer.hasResult in :hasResult) ";
		}
		
		if(dto.getAdministrativeUnitId() != null) {
			whereClause += " AND (hoer.healthOrg.administrativeUnit.id = :administrativeUnitId) ";
		}
		
		if(dto.getFeeStatus() != null) {
			whereClause += " AND (hoer.feeStatus = :feeStatus ) ";
		}
		
		if(dto.getIsSampleTransferStatus()) {
			whereClause += " AND (hoer.sampleTransferStatus =:  sampleTransferStatus) ";
		}
		
//		if (!userInfo.getIsRoleAdmin() && userInfo.getHealthOrg() != null && userInfo.getHealthOrg().getId() != null) {
//			whereClause += " AND ( hoer.healthOrg.id =:healthOrgId ) ";
//		}
	
		List<UUID> listHealthOrgId = null;
		if (!userInfo.getIsRoleAdmin()) {
			listHealthOrgId = userInHealthOrgService.getListHealthOrgIdByUser(null);
			if (listHealthOrgId != null && listHealthOrgId.size() > 0) {
				whereClause += " AND ( hoer.healthOrg.id in (:healthOrgIds) ) ";
			}
		}
		if (userInfo.getIsRoleAdmin() && userInfo.getHealthOrg() != null) {
			listHealthOrgId = userInHealthOrgService.getListHealthOrgIdByUser(null);
			if (listHealthOrgId != null && listHealthOrgId.size() > 0) {
				whereClause += " AND ( hoer.healthOrg.id in (:healthOrgIds) ) ";
			}
		}
		if(dto.getListStatus()!=null && dto.getListStatus().size()>0) {
			whereClause += " AND ( hoer.status in (:listStatus) ) ";
		}
		
		
		
		sql += whereClause + orderBy;
		sqlCount += whereClause;
		
		Query q = manager.createQuery(sql, HealthOrgEQARoundDto.class);
		Query qCount = manager.createQuery(sqlCount);

		if (dto.getText() != null && StringUtils.hasText(dto.getText())) {
			q.setParameter("text", '%' + dto.getText() + '%');
			qCount.setParameter("text", '%' + dto.getText() + '%');
		}
		if (dto.getRoundId() != null) {
			q.setParameter("roundId", dto.getRoundId());
			qCount.setParameter("roundId", dto.getRoundId());
		}
		if(dto.getHasResult() != null) {
			q.setParameter("hasResult", dto.getHasResult());
			qCount.setParameter("hasResult", dto.getHasResult());
		}
		
		if(dto.getIsSampleTransferStatus()) {
			q.setParameter("sampleTransferStatus", PIConst.SampleTransferStatus.Received.getValue());
			qCount.setParameter("sampleTransferStatus", PIConst.SampleTransferStatus.Received.getValue());
		}

		if (!userInfo.getIsRoleAdmin()) {
			if (listHealthOrgId != null && listHealthOrgId.size() > 0) {
				q.setParameter("healthOrgIds", listHealthOrgId);
				qCount.setParameter("healthOrgIds", listHealthOrgId);
			}
		}
		//
		if (userInfo.getIsRoleAdmin() && userInfo.getHealthOrg() != null ) {
			if (listHealthOrgId != null && listHealthOrgId.size() > 0) {
				q.setParameter("healthOrgIds", listHealthOrgId);
				qCount.setParameter("healthOrgIds", listHealthOrgId);
			}
		}
		
		if (dto.getTransferStatus() != null) {
			q.setParameter("transferStatus", dto.getTransferStatus());
			qCount.setParameter("transferStatus", dto.getTransferStatus());
		}
		
		if (dto.getAdministrativeUnitId() != null) {
			q.setParameter("administrativeUnitId", dto.getAdministrativeUnitId());
			qCount.setParameter("administrativeUnitId", dto.getAdministrativeUnitId());
		}
		
		if(dto.getListStatus()!=null && dto.getListStatus().size()>0) {
			q.setParameter("listStatus", dto.getListStatus());
			qCount.setParameter("listStatus", dto.getListStatus());
		}
		
		if(dto.getFeeStatus() != null) {
			q.setParameter("feeStatus", dto.getFeeStatus());
			qCount.setParameter("feeStatus", dto.getFeeStatus());
		}
		
		if(dto.getHasConclusion()!=null && !dto.getHasConclusion()) {
			q.setParameter("typeMethod", PIConst.EQAResultReportTypeMethod.Conclusion.getValue());
			qCount.setParameter("typeMethod",  PIConst.EQAResultReportTypeMethod.Conclusion.getValue());
		}
		
//		int startPosition = pageIndex * pageSize;
//		q.setFirstResult(startPosition);
//		q.setMaxResults(pageSize);
		List<HealthOrgEQARoundDto> entities ;
		long count = (long) qCount.getSingleResult();
		Page<HealthOrgEQARoundDto> result;
		if(dto.getIsExportExcel()) {
			entities = q.getResultList();
			result = new PageImpl<HealthOrgEQARoundDto>(entities);
		}else {
			int startPosition = pageIndex * pageSize;
			q.setFirstResult(startPosition);
			q.setMaxResults(pageSize);
			Pageable pageable = PageRequest.of(pageIndex, pageSize);
			 entities = q.getResultList();
			 result = new PageImpl<HealthOrgEQARoundDto>(entities, pageable, count);
		}
		
		return result;
	}

	@Override
	public HealthOrgEQARoundDto saveOrUpdate(HealthOrgEQARoundDto dto, UUID id) {
		if (dto != null) {
			HealthOrgEQARound entity = null;
			if (id != null) {
				entity = healthOrgEQARoundRepository.getHealthOrgEQARoundById(id);
			} else if (dto.getId() != null && entity==null) {
				entity = healthOrgEQARoundRepository.getHealthOrgEQARoundById(dto.getId());
			}
			HealthOrg healthOrg = null;
			if (dto.getHealthOrg() != null && dto.getHealthOrg().getId() != null) {
				healthOrg = healthOrgRepository.getHealthOrgById(dto.getHealthOrg().getId());
			}

			EQARound eQARound = null;
			if (dto.getRound() != null && dto.getRound().getId() != null) {
				eQARound = eQARoundRepository.getEQARoundById(dto.getRound().getId());
			}
			boolean isDuplicate=false;
			if(healthOrg!=null && eQARound!=null) {
				List<HealthOrgEQARound> healthOrgEQARounds = healthOrgEQARoundRepository.getHealthOrgEQAByHealthOrgId(healthOrg.getId(), eQARound.getId());
				if(healthOrgEQARounds!=null && healthOrgEQARounds.size()>0 && entity==null) {
					entity = healthOrgEQARounds.get(0);
					isDuplicate=true;
				}
			}
			
			if (entity == null) {//TH tạo mới chưa trùng
				entity = new HealthOrgEQARound();
				entity.setSampleTransferStatus(PIConst.SampleTransferStatus.WaitForTransfer.getValue());
			}
			
			if(healthOrg != null) {
				entity.setHealthOrg(healthOrg);
			}
			if(eQARound != null) {
				entity.setRound(eQARound);
			}
			
			entity.setStatus(dto.getStatus());
			if(dto.getHasResult() != null) {
				entity.setHasResult(dto.getHasResult());
			}
			
			entity.setFeeStatus(dto.getFeeStatus());
			if(dto.getBillOfLadingCode()!= null) {
				entity.setBillOfLadingCode(dto.getBillOfLadingCode());
			}
		
			if(dto.getDeliveryDate()!= null) {
				entity.setDeliveryDate(dto.getDeliveryDate());
			}
			if (dto.getSampleTransferStatus() != null) {
				entity.setSampleTransferStatus(dto.getSampleTransferStatus());
			}
			if(dto.getShippingUnit() != null) {
				entity.setShippingUnit(dto.getShippingUnit());
			}
			
			if(dto.getSampleTransferStatus() != null 
					&& dto.getSampleTransferStatus() == PIConst.SampleTransferStatus.Received.getValue()) {
				entity.setSampleReceivingDate(new Date());
			}else {
				entity.setSampleReceivingDate(null);
			}
		
			EQASampleSet eQASampleSet = null;			
			
			if (dto.getSampleSet() != null && dto.getSampleSet().getId() != null) {
				eQASampleSet = eQASampleSetRepository.getOne(dto.getSampleSet().getId());
				entity.setSampleSet(eQASampleSet);
				if (eQASampleSet.getDetails() != null && eQASampleSet.getDetails().size() > 0) {
					Set<EQASampleTube> listSampleTube = new HashSet<EQASampleTube>();
					for (EQASampleSetDetail detailSample : eQASampleSet.getDetails()) {
						EQASampleTube tube = null;
						List<EQASampleTube> listFindSampleTube = eQASampleTubeRepository.getByHealthOrgAndEQARoundAndSample(eQARound.getId(), healthOrg.getId(), detailSample.getId(), 1);
						
						if (listFindSampleTube != null && listFindSampleTube.size() > 0) {
							tube = listFindSampleTube.get(0); // new EQASampleTube();
						}
						
						if (tube == null) {
							tube = new EQASampleTube();	
						}
						tube.setCode(detailSample.getCode());
						tube.setName(detailSample.getName());
						tube.setType(PIConst.TubeType.main.getValue());
						tube.setStatus(PIConst.TubeStatus.newTube.getValue());
//							tube.setLastResultFromLab(dto.getLastResultFromLab());						
						tube.setEqaSample(detailSample.getSample());
						tube.setEqaRound(eQARound);
						tube.setHealthOrg(healthOrg);
						
//							EQASerumBottle eqaSerumBottle = null;-------> Đoạn này cần xem xét lại qui trình
//							if (dto.getEqaSerumBottle() != null && dto.getEqaSerumBottle().getId() != null){
//								eqaSerumBottle = eqaSerumBottleRepository.getOne(dto.getEqaSerumBottle().getId());
//							}
//							tube.setEqaSerumBottle(eqaSerumBottle);

						tube.setHealthOrgEQARound(entity);
						tube.setSampleSetDetail(detailSample);
						listSampleTube.add(tube);
					}
					
					if (entity.getListSampleTube() == null) {
						entity.setListSampleTube(listSampleTube);
					} else {
						entity.getListSampleTube().clear();
						entity.getListSampleTube().addAll(listSampleTube);
					}
				}
			}
			
			if(dto.getSampleSet() == null) {
				entity.setSampleSet(null);
				if(entity.getListSampleTube() != null && entity.getListSampleTube().size() > 0) {
					entity.getListSampleTube().clear();
				}
			}
			
			entity = healthOrgEQARoundRepository.save(entity);
			HealthOrgEQARoundDto healthOrgEQARoundDto = new HealthOrgEQARoundDto(entity);
			healthOrgEQARoundDto.setIsDuplicateHealthOrg(isDuplicate);
			return healthOrgEQARoundDto;
		}
		return null;
	}

	@Override
	public HealthOrgEQARoundDto getById(UUID id) {
		if (id != null) {
			HealthOrgEQARound entity = healthOrgEQARoundRepository.getOne(id);
			if (entity != null) {
				return new HealthOrgEQARoundDto(entity);
			}
		}
		return null;
	}

	@Override
	public Boolean deleteById(UUID id) {
		if (id != null) {
			Integer countEQAResultReport = healthOrgEQARoundRepository.countEQAResultReport(id);
			if(countEQAResultReport != 0) {
				return false;
			}
			
			HealthOrgEQARound entity = healthOrgEQARoundRepository.getOne(id);
			if (entity != null) {
				healthOrgEQARoundRepository.deleteById(id);
				return true;
			}
		}
		return null;
	}

	@Override
	public Page<HealthOrgDto> searchHealthOrg(HealthOrgEQARoundSearchDto dto) {
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

		String sqlCount = "select count(hoer.id) from HealthOrgEQARound as hoer where (1=1) ";
		String sql = "select new com.globits.PI.dto.HealthOrgEQARoundDto(hoer) from HealthOrgEQARound as hoer where (1=1) ";

		if (dto.getText() != null && StringUtils.hasText(dto.getText())) {
			whereClause += " AND ( hoer.round.name LIKE :text OR hoer.round.code LIKE :text OR hoer.healthOrg.name LIKE :text OR hoer.healthOrg.code LIKE :text) ";
		}
		if (dto.getRoundId() != null && dto.getRoundId() != null) {
			whereClause += " AND ( hoer.round.id =:roundId ) ";
		}

		sql += whereClause;
		sqlCount += whereClause;
		Query q = manager.createQuery(sql, HealthOrgEQARoundDto.class);
		Query qCount = manager.createQuery(sqlCount);

		if (dto.getText() != null && StringUtils.hasText(dto.getText())) {
			q.setParameter("text", '%' + dto.getText() + '%');
			qCount.setParameter("text", '%' + dto.getText() + '%');
		}
		if (dto.getRoundId() != null) {
			q.setParameter("roundId", dto.getRoundId());
			qCount.setParameter("roundId", dto.getRoundId());
		}

		int startPosition = pageIndex * pageSize;
		q.setFirstResult(startPosition);
		q.setMaxResults(pageSize);
		List<HealthOrgEQARoundDto> entities = q.getResultList();
		List<HealthOrgDto> healthOrgDtos = new ArrayList<HealthOrgDto>();
		for (HealthOrgEQARoundDto dto1 : entities) {
			healthOrgDtos.add(dto1.getHealthOrg());
		}
		long count = (long) qCount.getSingleResult();

		Pageable pageable = PageRequest.of(pageIndex, pageSize);
		Page<HealthOrgDto> result = new PageImpl<HealthOrgDto>(healthOrgDtos);
		return result;
	}

	@Override
	public Page<EQARoundDto> searchEQARoundByPage(HealthOrgEQARoundSearchDto dto) {
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

		Date dateNow = new Date();

		String whereClause = "";
		String orderBy = " ORDER BY round.createDate DESC ";

		String sqlCount = "select count(round.id) from EQARound as round where (1=1) ";
		String sql = "select new com.globits.PI.dto.EQARoundDto(round) from EQARound as round where (1=1) ";

		if (dto.getText() != null && StringUtils.hasText(dto.getText())) {
			whereClause += " AND (round.name LIKE :text OR round.code LIKE :text ) ";
		}
		if (dto.getIsRunning() != null && dto.getIsRunning()) {
			whereClause += " AND ( round.registrationStartDate <= :dateNow ) AND (round.registrationExpiryDate >= :dateNow ) ";
		}

		if (dto.getRoundId() != null) {
			whereClause += " AND (round.id =:roundId ) ";
		}
		
		if(dto.getPlanningId() != null) {
			whereClause += " AND (round.eqaPlanning.id = :planningId) "; 
		}

		sql += whereClause + orderBy;
		sqlCount += whereClause;
		Query q = manager.createQuery(sql, EQARoundDto.class);
		Query qCount = manager.createQuery(sqlCount);

		if (dto.getText() != null && StringUtils.hasText(dto.getText())) {
			q.setParameter("text", '%' + dto.getText() + '%');
			qCount.setParameter("text", '%' + dto.getText() + '%');
		}
		if (dto.getIsRunning() != null && dto.getIsRunning()) {
			q.setParameter("dateNow", dateNow);
			qCount.setParameter("dateNow", dateNow);
		}
		if (dto.getRoundId() != null) {
			q.setParameter("roundId", dto.getRoundId());
			qCount.setParameter("roundId", dto.getRoundId());
		}
		if(dto.getPlanningId() != null) {
			q.setParameter("planningId", dto.getPlanningId());
			qCount.setParameter("planningId", dto.getPlanningId());
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
	public HealthOrgEQARoundDto healthOrgRegisterRound(UUID roundId) {
		UserInfoDto userInfo = userInHealthOrgService.getUserInfoByUserLogin();
		if (roundId != null && userInfo != null && userInfo.getUser() != null && userInfo.getHealthOrg() != null
				&& userInfo.getHealthOrg().getId() != null) {
			EQARound round = eQARoundRepository.getOne(roundId);
			if (round != null) {
				if (checkTimeRound(round)) {
					HealthOrgEQARound entity = null;
					List<HealthOrgEQARound> listData = healthOrgEQARoundRepository
							.getListByEQARoundAndHealthOrg(round.getId(), userInfo.getHealthOrg().getId());
					if (listData != null && listData.size() > 0) {
						entity = listData.get(0);
					}

					if (entity == null) {
						entity = new HealthOrgEQARound();
						entity.setStatus(PIConst.HealthOrgEQARoundStatus.New.getValue());
						entity.setHasResult(false);
						entity.setFeeStatus(PIConst.FeeStatus.no.getValue());
						entity.setRound(round);
						entity.setHealthOrg(userInfo.getHealthOrg());
					} else {
						entity.setStatus(PIConst.HealthOrgEQARoundStatus.New.getValue());
					}

					entity = healthOrgEQARoundRepository.save(entity);

					return new HealthOrgEQARoundDto(entity);
				}
			}
		}
		return null;
	}
	/**
	 * Hủy Đăng ký tham gia đợt ngoại kiểm
	 */
	@Override
	public HealthOrgEQARoundDto handleCancelRegistration(UUID id) {
		// TODO Auto-generated method stub
		HealthOrgEQARound entity = healthOrgEQARoundRepository.getOne(id);
		if (entity != null && entity.getId() != null) {
			if (this.checkTimeRound(entity.getRound()) && entity.getSampleTransferStatus() != PIConst.SampleTransferStatus.Received.getValue()) {
				entity.setStatus(PIConst.HealthOrgEQARoundStatus.Cancel_Registration.getValue());

				entity = healthOrgEQARoundRepository.save(entity);

				return new HealthOrgEQARoundDto(entity);
			}
		}
		return null;
	}
	/**
	 * Hủy Đăng ký tham gia đợt ngoại kiểm
	 */
	@Override
	public HealthOrgEQARoundDto cancelRegistration(UUID healthOrgId,UUID roundId) {
		List<HealthOrgEQARound> listFind = healthOrgEQARoundRepository.getHealthOrgEQAByHealthOrgId(healthOrgId, roundId);
		if(listFind!=null && listFind.size()>0) {
			HealthOrgEQARound entity = listFind.get(0);
			if (this.checkTimeRound(entity.getRound()) && entity.getSampleTransferStatus() != PIConst.SampleTransferStatus.Received.getValue()) {
				entity.setStatus(PIConst.HealthOrgEQARoundStatus.Cancel_Registration.getValue());
				entity = healthOrgEQARoundRepository.save(entity);
				return new HealthOrgEQARoundDto(entity);
			}
		}
		return null;
	}
	
	private boolean checkTimeRound(EQARound round) {
		// TODO Auto-generated method stub
		if (round != null && round.getRegistrationStartDate() != null && round.getRegistrationExpiryDate() != null) {
			Date dateNow = new Date();
			if (round.getRegistrationStartDate().before(dateNow) && round.getRegistrationExpiryDate().after(dateNow)) {
				return true;
			}

		}
		return false;
	}

	@Override
	public ResultMessageDto addMultiple(List<HealthOrgEQARoundDto> dtoList) {
		ResultMessageDto message = new ResultMessageDto();
		for (HealthOrgEQARoundDto dto : dtoList) {
			List<HealthOrgEQARoundDto> list = healthOrgEQARoundRepository.getListByHealthOrgAndEQARound(dto.getHealthOrg().getId(), dto.getRound().getId());
			if(list != null && list.size()>0) {
				HealthOrgEQARoundDto result = this.saveOrUpdate(dto, list.get(0).getId());
				if (result != null && result.getHealthOrg() != null && result.getRound() != null) {
					if (result.getIsDuplicateHealthOrg()) {
						message.setErrorCode(1);
						message.setMessage("Đơn vị " + result.getHealthOrg().getName()
								+ " đã đăng ký tham gia vòng ngoại kiểm " + result.getRound().getName() + ".");
						return message;
					}
				}
			}else {
				HealthOrgEQARoundDto result = this.saveOrUpdate(dto, null);
				if (result != null && result.getHealthOrg() != null && result.getRound() != null) {
					if (result.getIsDuplicateHealthOrg()) {
						message.setErrorCode(1);
						message.setMessage("Đơn vị " + result.getHealthOrg().getName()
								+ " đã đăng ký tham gia vòng ngoại kiểm " + result.getRound().getName() + ".");
						return message;
					}
				}
			}
		}
		message.setErrorCode(0);
		message.setMessage("Thành công!");
		return message;
	}

	public static Date getTimeOfDay(Date date) {
		if (date != null) {
			Calendar calendar = Calendar.getInstance();
			calendar.setTime(date);
			return calendar.getTime();
		}
		return null;
	}

	@Override
	public List<HealthOrgEQARoundDto> getListByRoundID(UUID roundID) {
		return healthOrgEQARoundRepository.getListHealthOrgEQARoundByEQARoundId(roundID);
	}

	@Override
	public Integer countNumberOfHealthOrgEQARound() {
		return healthOrgEQARoundRepository.countNumberOfHealthOrgEQARound();
	}


	@Override
	public Boolean changeSampleTransferStatus(UUID healthOrgID, Integer status) {
		if (healthOrgID != null) {
			HealthOrgEQARound entity = healthOrgEQARoundRepository.getOne(healthOrgID);
			entity.setSampleTransferStatus(status);
			if(status != null 
					&& status == PIConst.SampleTransferStatus.Received.getValue()) {
				entity.setSampleReceivingDate(new Date());
			}else {
				entity.setSampleReceivingDate(null);
			}
			healthOrgEQARoundRepository.save(entity);
			return true;
		}
		return false;
	}
	
	@Override
	public Page<HealthOrgEQARoundDto> searchByTransferredSample(HealthOrgEQARoundSearchDto dto) {
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
		String orderBy = " ORDER BY hoer.round.createDate DESC, hoer.healthOrg.code ASC ";

		String sqlCount = "select count(hoer.id) from HealthOrgEQARound as hoer where hoer.sampleTransferStatus >= 2 ";
		String sql = "select new com.globits.PI.dto.HealthOrgEQARoundDto(hoer) from HealthOrgEQARound as hoer where hoer.sampleTransferStatus >= 2";

		if (dto.getText() != null && StringUtils.hasText(dto.getText())) {
			whereClause += " AND ( hoer.round.name LIKE :text OR hoer.round.code LIKE :text OR hoer.healthOrg.name LIKE :text OR hoer.healthOrg.code LIKE :text) ";
		}
		if (dto.getRoundId() != null) {
			whereClause += " AND ( hoer.round.id =:roundId ) ";
		}
		
		List<UUID> listHealthOrgId = null;
		if (!userInfo.getIsRoleAdmin()) {
			listHealthOrgId = userInHealthOrgService.getListHealthOrgIdByUser(null);
			if (listHealthOrgId != null && listHealthOrgId.size() > 0) {
				whereClause += " AND ( hoer.healthOrg.id in (:healthOrgIds) ) ";
			}
		}
		if(dto.getListStatus()!=null && dto.getListStatus().size()>0) {
			whereClause += " AND ( hoer.status in (:listStatus) ) ";
		}
		
		if(dto.getHasResult() != null) {
			whereClause += " AND (hoer.hasResult in :hasResult) ";
		}
		
		sql += whereClause + orderBy;
		sqlCount += whereClause;
		Query q = manager.createQuery(sql, HealthOrgEQARoundDto.class);
		Query qCount = manager.createQuery(sqlCount);

		if (dto.getText() != null && StringUtils.hasText(dto.getText())) {
			q.setParameter("text", '%' + dto.getText() + '%');
			qCount.setParameter("text", '%' + dto.getText() + '%');
		}
		if (dto.getRoundId() != null) {
			q.setParameter("roundId", dto.getRoundId());
			qCount.setParameter("roundId", dto.getRoundId());
		}

		if (!userInfo.getIsRoleAdmin()) {
			if (listHealthOrgId != null && listHealthOrgId.size() > 0) {
				q.setParameter("healthOrgIds", listHealthOrgId);
				qCount.setParameter("healthOrgIds", listHealthOrgId);
			}
		}
		if(dto.getListStatus()!=null && dto.getListStatus().size()>0) {
			q.setParameter("listStatus", dto.getListStatus());
			qCount.setParameter("listStatus", dto.getListStatus());
		}
		if(dto.getHasResult() != null) {
			q.setParameter("hasResult", dto.getHasResult());
			qCount.setParameter("hasResult", dto.getHasResult());
		}
		int startPosition = pageIndex * pageSize;
		q.setFirstResult(startPosition);
		q.setMaxResults(pageSize);
		List<HealthOrgEQARoundDto> entities = q.getResultList();
		long count = (long) qCount.getSingleResult();

		Pageable pageable = PageRequest.of(pageIndex, pageSize);
		Page<HealthOrgEQARoundDto> result = new PageImpl<HealthOrgEQARoundDto>(entities, pageable, count);
		return result;
	}

	@Override
	public List<HealthOrgEQARoundDto> getListHealthOrgEQARoundByEQARoundIdAndCurrentUser(UUID roundID) {
		if (roundID != null) {
			List<HealthOrgDto> healthOrgList = userInHealthOrgService.getListHealthOrgByUser(null);
			List<UUID> healthOrgIdList = healthOrgList.stream().map(org -> org.getId()).collect(Collectors.toList());
			String orderBy = " ORDER BY entity.createDate DESC";

			String sql = "SELECT new com.globits.PI.dto.HealthOrgEQARoundDto(entity) FROM HealthOrgEQARound as entity "
						+ "WHERE entity.round.id = :roundID AND entity.healthOrg.id IN :orgIDList";
			
			sql += orderBy;
			Query q = manager.createQuery(sql, HealthOrgEQARoundDto.class);

			q.setParameter("roundID", roundID);
			q.setParameter("orgIDList", healthOrgIdList);
			
			List<HealthOrgEQARoundDto> result = q.getResultList();

			return result;
		}
		return null;
	}

	@Override
	public Page<EQAPlanningDto> searchEQAPlanningByPage(HealthOrgEQARoundSearchDto dto) {
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

		Date dateNow = new Date();

		String whereClause = "";
		String orderBy = " ORDER BY planning.createDate DESC ";

		String sqlCount = "select count(planning.id) from EQAPlanning as planning where (1=1) ";
		String sql = "select new com.globits.PI.dto.EQAPlanningDto(planning) from EQAPlanning as planning where (1=1) ";

		if (dto.getText() != null && StringUtils.hasText(dto.getText())) {
			whereClause += " AND (planning.name LIKE :text OR planning.code LIKE :text ) ";
		}
		if (dto.getIsRunning() != null && dto.getIsRunning()) {
			whereClause += " AND ( planning.startDate <= :dateNow ) AND (planning.endDate >= :dateNow ) ";
		}

		if (dto.getPlanningId() != null) {
			whereClause += " AND (planning.id =:planningId ) ";
		}

		sql += whereClause + orderBy;
		sqlCount += whereClause;
		Query q = manager.createQuery(sql, EQAPlanningDto.class);
		Query qCount = manager.createQuery(sqlCount);

		if (dto.getText() != null && StringUtils.hasText(dto.getText())) {
			q.setParameter("text", '%' + dto.getText() + '%');
			qCount.setParameter("text", '%' + dto.getText() + '%');
		}
		if (dto.getIsRunning() != null && dto.getIsRunning()) {
			q.setParameter("dateNow", dateNow);
			qCount.setParameter("dateNow", dateNow);
		}
		if (dto.getPlanningId() != null) {
			q.setParameter("planningId", dto.getPlanningId());
			qCount.setParameter("planningId", dto.getPlanningId());
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
	public Boolean updateSubscriptionStatus(List<UUID> listId) {
		if(listId.size() > 0) {
			Integer status = PIConst.HealthOrgEQARoundStatus.Confirmed.getValue();
			healthOrgEQARoundRepository.updateSubscriptionStatus(status, listId);
			return true;
		}
		return null;
	}
	
	@Override
	public Boolean updateStatus(List<HealthOrgEQARoundDto> dtoList) {
		if(dtoList != null && dtoList.size() > 0) {
			for (HealthOrgEQARoundDto dto : dtoList) {
				HealthOrgEQARound entity = healthOrgEQARoundRepository.getHealthOrgEQARoundById(dto.getId());
				entity.setStatus(dto.getStatus());
				entity.setFeeStatus(dto.getFeeStatus());
				entity = healthOrgEQARoundRepository.save(entity);
				//return new HealthOrgEQARoundDto(entity);
			}
			return true;
		}
		return null;
	}

	@Override
	public List<HealthOrgEQARoundDto> getListHealthOrgManagementEQARoundByEQARoundId(UUID roundID) {
		if (roundID != null) {
			List<HealthOrgDto> healthOrgList = userInHealthOrgService.getListHealthOrgByUser(null);
			List<UUID> healthOrgIdList = healthOrgList.stream().map(org -> org.getId()).collect(Collectors.toList());
			String orderBy = " ORDER BY entity.createDate DESC";

			String sql = "SELECT new com.globits.PI.dto.HealthOrgEQARoundDto(entity) FROM HealthOrgEQARound as entity "
						+ "WHERE entity.round.id = :roundID AND  entity.healthOrg.isManagementUnit is true";
			
			sql += orderBy;
			Query q = manager.createQuery(sql, HealthOrgEQARoundDto.class);

			q.setParameter("roundID", roundID);
//			q.setParameter("orgIDList", healthOrgIdList);
			
			List<HealthOrgEQARoundDto> result = q.getResultList();

			return result;
		}
		return null;
	}

	@Override
	public Page<HealthOrgEQARoundDto> searchByPage(HealthOrgEQARoundSearchDto dto) {
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
//		if (userInfo == null || userInfo.getUser() == null || (!userInfo.getIsRoleAdmin() && userInfo.getHealthOrg() == null && userInfo.getHealthOrg().getId() == null)) {
//			return null;
//		}		

		String whereClause = "";
		String orderBy = " ORDER BY hoer.healthOrg.code ";

		String sqlCount = "select count(hoer.id) from HealthOrgEQARound as hoer where (1=1) ";
		String sql = "select new com.globits.PI.dto.HealthOrgEQARoundDto(hoer,true) from HealthOrgEQARound as hoer where (1=1) ";

		if (dto.getText() != null && StringUtils.hasText(dto.getText())) {
			whereClause += " AND ( hoer.round.name LIKE :text OR hoer.round.code LIKE :text OR hoer.healthOrg.name LIKE :text OR hoer.healthOrg.code LIKE :text) ";
		}
		if (dto.getRoundId() != null) {
			whereClause += " AND ( hoer.round.id =:roundId ) ";
		}
		if (dto.getIsRunning() != null && dto.getIsRunning() == true) {
			whereClause += " AND (hoer.sampleTransferStatus in (1,-1)) ";
		}
		if(dto.getTransferStatus() != null) {
			whereClause += " AND (hoer.sampleTransferStatus = :transferStatus) ";
		}
		if(dto.getHasResult() != null) {
			whereClause += " AND (hoer.hasResult in :hasResult) ";
		}
		
		if(dto.getAdministrativeUnitId() != null) {
			whereClause += " AND (hoer.healthOrg.administrativeUnit.id = :administrativeUnitId) ";
		}
		
		if(dto.getIsCheckPoint()) {
			whereClause += " AND (hoer.healthOrg.isManagementUnit is false or hoer.healthOrg.isManagementUnit is null ) ";
		}
		
		if(dto.getIsSampleTransferStatus()) {
			whereClause += " AND (hoer.sampleTransferStatus =:  sampleTransferStatus) ";
		}
		
		
//		if (!userInfo.getIsRoleAdmin() && userInfo.getHealthOrg() != null && userInfo.getHealthOrg().getId() != null) {
//			whereClause += " AND ( hoer.healthOrg.id =:healthOrgId ) ";
//		}
	
		List<UUID> listHealthOrgId = null;
		if (!userInfo.getIsRoleAdmin()) {
			listHealthOrgId = userInHealthOrgService.getListHealthOrgIdByUser(null);
			if (listHealthOrgId != null && listHealthOrgId.size() > 0) {
				whereClause += " AND ( hoer.healthOrg.id in (:healthOrgIds) ) ";
			}
		}
		if(dto.getStatusSentResults() != null && dto.getStatusSentResults() == true) {
			whereClause += " AND (hoer.statusSentResults = :statusSentResults) ";
		}
		
		if(dto.getListStatus()!=null && dto.getListStatus().size()>0) {
			whereClause += " AND ( hoer.status in (:listStatus) ) ";
		}
		
		sql += whereClause + orderBy;
		sqlCount += whereClause;
		
		Query q = manager.createQuery(sql, HealthOrgEQARoundDto.class);
		Query qCount = manager.createQuery(sqlCount);

		if (dto.getText() != null && StringUtils.hasText(dto.getText())) {
			q.setParameter("text", '%' + dto.getText() + '%');
			qCount.setParameter("text", '%' + dto.getText() + '%');
		}
		if (dto.getRoundId() != null) {
			q.setParameter("roundId", dto.getRoundId());
			qCount.setParameter("roundId", dto.getRoundId());
		}
		if(dto.getHasResult() != null) {
			q.setParameter("hasResult", dto.getHasResult());
			qCount.setParameter("hasResult", dto.getHasResult());
		}
		
		if(dto.getIsSampleTransferStatus()) {
//			whereClause += " AND (hoer.sampleTransferStatus =:  sampleTransferStatus) ";
			q.setParameter("sampleTransferStatus", PIConst.SampleTransferStatus.Received.getValue());
			qCount.setParameter("sampleTransferStatus", PIConst.SampleTransferStatus.Received.getValue());
		}
//		if (!userInfo.getIsRoleAdmin() && userInfo.getHealthOrg() != null && userInfo.getHealthOrg().getId() != null) {
//			q.setParameter("healthOrgId", userInfo.getHealthOrg().getId());
//			qCount.setParameter("healthOrgId", userInfo.getHealthOrg().getId());
//		}
		if (!userInfo.getIsRoleAdmin()) {
			if (listHealthOrgId != null && listHealthOrgId.size() > 0) {
				q.setParameter("healthOrgIds", listHealthOrgId);
				qCount.setParameter("healthOrgIds", listHealthOrgId);
			}
		}
		//
//		if (userInfo.getIsRoleAdmin() && userInfo.getHealthOrg() != null && userInfo.getHealthOrg().getIsManagementUnit()) {
//			if (listHealthOrgId != null && listHealthOrgId.size() > 0) {
//				q.setParameter("healthOrgIds", listHealthOrgId);
//				qCount.setParameter("healthOrgIds", listHealthOrgId);
//			}
//		}
		
		if (dto.getTransferStatus() != null) {
			q.setParameter("transferStatus", dto.getTransferStatus());
			qCount.setParameter("transferStatus", dto.getTransferStatus());
		}
		
		if (dto.getAdministrativeUnitId() != null) {
			q.setParameter("administrativeUnitId", dto.getAdministrativeUnitId());
			qCount.setParameter("administrativeUnitId", dto.getAdministrativeUnitId());
		}
		if(dto.getStatusSentResults() != null && dto.getStatusSentResults() == true) {
			q.setParameter("statusSentResults", dto.getStatusSentResults());
			qCount.setParameter("statusSentResults", dto.getStatusSentResults());
		}
		if(dto.getListStatus()!=null && dto.getListStatus().size()>0) {
			q.setParameter("listStatus", dto.getListStatus());
			qCount.setParameter("listStatus", dto.getListStatus());
		}
		
		List<HealthOrgEQARoundDto> entities ;
		long count = (long) qCount.getSingleResult();
		Page<HealthOrgEQARoundDto> result;
		if(dto.getIsExportExcel()) {
			entities = q.getResultList();
			result = new PageImpl<HealthOrgEQARoundDto>(entities);
		}else {
			int startPosition = pageIndex * pageSize;
			q.setFirstResult(startPosition);
			q.setMaxResults(pageSize);
			Pageable pageable = PageRequest.of(pageIndex, pageSize);
			 entities = q.getResultList();
			 result = new PageImpl<HealthOrgEQARoundDto>(entities, pageable, count);
		}
		
		return result;
	}

	@Override
	public List<HealthOrgEQARoundDto> getListHealthOrgEQARoundByEQARoundId(UUID roundID) {
		if (roundID != null) {
			String orderBy = " ORDER BY entity.createDate DESC";
			String sql = "SELECT new com.globits.PI.dto.HealthOrgEQARoundDto(entity) FROM HealthOrgEQARound as entity "
						+ "WHERE entity.round.id = :roundID ";		
			sql += orderBy;
			Query q = manager.createQuery(sql, HealthOrgEQARoundDto.class);
			q.setParameter("roundID", roundID);
			List<HealthOrgEQARoundDto> result = q.getResultList();

			return result;
		}
		return null;
	}

	@Override
	public HealthOrgEQARoundDto getHealthOrgEQARound(UUID healthOrgId, UUID roundId) {
		List<HealthOrgEQARound> listFind = healthOrgEQARoundRepository.getHealthOrgEQAByHealthOrgId(healthOrgId, roundId);
		return new HealthOrgEQARoundDto(listFind.get(0));
	}

	@Override
	public Boolean updateStatusSentResults(UUID healthOrgId, UUID roundId) {
		List<HealthOrgEQARound> listHealthOrgEQARound= null;
		if(healthOrgId != null && !healthOrgId.equals(new UUID(0L, 0L))) {
			listHealthOrgEQARound = healthOrgEQARoundRepository.getListByEQARoundAndHealthOrg(roundId, healthOrgId);
		}else {
			listHealthOrgEQARound = healthOrgEQARoundRepository.getHealthOrgEQARoundByEQARoundId(roundId);
		}
		if(listHealthOrgEQARound != null && listHealthOrgEQARound.size() > 0) {
			for(HealthOrgEQARound healthOrgEQARound: listHealthOrgEQARound) {
//				healthOrgEQARound.setStatusSentResults(true);
				healthOrgEQARoundRepository.save(healthOrgEQARound);
			}
			return true;
		}

		return null;
	}
}

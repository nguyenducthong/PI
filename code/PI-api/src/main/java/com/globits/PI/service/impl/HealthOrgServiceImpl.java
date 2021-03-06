package com.globits.PI.service.impl;

import java.util.ArrayList;
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
import com.globits.PI.domain.HealthOrg;
import com.globits.PI.domain.UserInHealthOrg;
import com.globits.PI.dto.EQARoundDto;
import com.globits.PI.dto.EQASampleSetDto;
import com.globits.PI.dto.HealthOrgDto;
import com.globits.PI.dto.HealthOrgEQARoundDto;
import com.globits.PI.dto.UserInHealthOrgDto;
import com.globits.PI.functiondto.EQASampleSetSearchDto;
import com.globits.PI.functiondto.HealthOrgEQARoundSearchDto;
import com.globits.PI.functiondto.HealthOrgSampleSetDetailDto;
import com.globits.PI.functiondto.HealthOrgSampleSetDto;
import com.globits.PI.functiondto.HealthOrgSearchDto;
import com.globits.PI.functiondto.UserInfoDto;
import com.globits.PI.repository.HealthOrgEQARoundRepository;
import com.globits.PI.repository.HealthOrgRepository;
import com.globits.PI.service.EQARoundService;
import com.globits.PI.service.EQASampleSetService;
import com.globits.PI.service.HealthOrgEQARoundService;
import com.globits.PI.repository.UserInHealthOrgRepository;
import com.globits.PI.service.HealthOrgService;
import com.globits.PI.service.UserInHealthOrgService;
import com.globits.core.domain.AdministrativeUnit;
import com.globits.core.domain.Person;
import com.globits.core.repository.AdministrativeUnitRepository;
import com.globits.core.repository.PersonRepository;
import com.globits.core.service.impl.GenericServiceImpl;
import com.globits.core.utils.SecurityUtils;
import com.globits.security.domain.Role;
import com.globits.security.domain.User;
import com.globits.security.repository.UserRepository;
import com.globits.security.service.RoleService;

@Transactional
@Service
public class HealthOrgServiceImpl extends GenericServiceImpl<HealthOrg, UUID> implements HealthOrgService {

	@Autowired
	private EntityManager manager;

	@Autowired
	private HealthOrgRepository healthOrgRepository;

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private AdministrativeUnitRepository administrativeUnitRepository;
	
	@Autowired
	private HealthOrgEQARoundService healthOrgEQARoundService;
	
	@Autowired
	private EQASampleSetService eQASampleSetService;

	@Autowired
	private UserInHealthOrgRepository userInHealthOrgRepository;

	@Autowired
	private EQARoundService eQARoundService;

	@Autowired
	private UserInHealthOrgService userInHealthOrgService;

	@Autowired
	private RoleService roleService;
	
	@Autowired
	private PersonRepository personRepository;

	
	@Override
	public Page<HealthOrgDto> searchByDto(HealthOrgSearchDto dto) {
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

		String sqlCount = "select count(eqap.id) from HealthOrg as eqap where (1=1) ";
		String sql = "select new com.globits.PI.dto.HealthOrgDto(eqap,true) from HealthOrg as eqap where (1=1) ";
		
		if (dto.getText() != null && StringUtils.hasText(dto.getText())) {

			whereClause += " AND ( eqap.name LIKE :text "
						+ " OR eqap.code LIKE :text "
						+ " OR eqap.address LIKE :text "
						+ " OR eqap.description LIKE :text )"
						+ " OR eqap.contactName LIKE :text ";
//						+ " OR eqap.healthOrgType.name LIKE :text ) ";
		}
		List<UUID> listHealthOrgId = null;
		if(!userInfo.getIsRoleAdmin()) {
			listHealthOrgId = userInHealthOrgService.getListHealthOrgIdByUser(null);
			if(listHealthOrgId != null & listHealthOrgId.size() > 0) {
				whereClause += " AND (eqap.id in :healthOrgId) ";
			}
		}
		
		if(dto.getAdministrativeUnitId() != null) {
			whereClause += " AND (eqap.administrativeUnit.id in :administrativeUnitId) ";
		}
		
		String orderClause = " ORDER BY eqap.code,eqap.name,eqap.contactName ";
		sql += whereClause + orderClause;
		
		sqlCount += whereClause;
		
		Query q = manager.createQuery(sql, HealthOrgDto.class);
		Query qCount = manager.createQuery(sqlCount);

		if (dto.getText() != null && StringUtils.hasText(dto.getText())) {
			q.setParameter("text", '%' + dto.getText() + '%');
			qCount.setParameter("text", '%' + dto.getText() + '%');
		}
		
		if(dto.getAdministrativeUnitId() != null) {
			q.setParameter("administrativeUnitId", dto.getAdministrativeUnitId());
			qCount.setParameter("administrativeUnitId",  dto.getAdministrativeUnitId());
		}
		
		if(!userInfo.getIsRoleAdmin()) {
			q.setParameter("healthOrgId", listHealthOrgId);
			qCount.setParameter("healthOrgId", listHealthOrgId);
		}
	
		int startPosition = pageIndex * pageSize;
		q.setFirstResult(startPosition);
		q.setMaxResults(pageSize);
		List<HealthOrgDto> entities = q.getResultList();
		long count = (long) qCount.getSingleResult();

		Pageable pageable = PageRequest.of(pageIndex, pageSize);
		Page<HealthOrgDto> result = new PageImpl<HealthOrgDto>(entities, pageable, count);
		return result;
	}

	@Override
	public HealthOrgDto saveOrUpdate(HealthOrgDto dto, UUID id) {
		if (dto != null) {
			HealthOrg entity = null;
			if(dto.getEmail() != null) {
				Boolean checkEmail = this.checkDuplicateEmail(id, dto.getEmail());
				if(checkEmail == null || checkEmail) {
					return null;
				}
			}

			if(id!=null) {
				entity = healthOrgRepository.getOne(id);
			}
			if(entity==null) {
				entity = healthOrgRepository.getByCode(dto.getCode());	
			}
			
			if (entity == null) {
				entity = new HealthOrg();
				if (dto.getIsManualSetCode() != null && dto.getIsManualSetCode() == true) {
					String code = dto.getCode();
					code=code.replace("s", "").replace("S", "").replace("-", "").replace(" ", "");
					Integer orderNumber = Integer.parseInt(code);
					entity.setOrderNumber(orderNumber);
					entity.setCode(dto.getCode().trim());
				} else {
					Integer orderNumber = healthOrgRepository.getMaxOrderNumber();
					if (orderNumber == null) {
						orderNumber = 0;
					}
					entity.setOrderNumber(orderNumber + 1);
					entity.setCode("S-" + String.format("%04d", entity.getOrderNumber()));
				}
			}else {
				if (dto.getIsManualSetCode() != null && dto.getIsManualSetCode() == true) {
					String code = dto.getCode();
					code=code.replace("s", "").replace("S", "").replace("-", "").replace(" ", "");
					Integer orderNumber = Integer.parseInt(code);
					entity.setOrderNumber(orderNumber);
					entity.setCode(dto.getCode().trim());
				}
			}
			entity.setName(dto.getName());
			entity.setDescription(dto.getDescription());
			entity.setContactName(dto.getContactName());
			entity.setContactPhone(dto.getContactPhone());
			entity.setAddress(dto.getAddress());
			entity.setEmail(dto.getEmail());
			entity.setSpecifyLevel(dto.getSpecifyLevel());
			entity.setTaxCodeOfTheUnit(dto.getTaxCodeOfTheUnit());
			entity.setUnitCodeOfProgramPEQAS(dto.getUnitCodeOfProgramPEQAS());
			entity.setOfficerPosion(dto.getOfficerPosion());
			entity.setFax(dto.getFax());
			AdministrativeUnit administrativeUnit = null;
			if (dto.getAdministrativeUnit() != null && dto.getAdministrativeUnit().getId() != null) {
				administrativeUnit = administrativeUnitRepository.getOne(dto.getAdministrativeUnit().getId());
			}
			entity.setAdministrativeUnit(administrativeUnit);


			Set<UserInHealthOrg> newListUser = new HashSet<UserInHealthOrg>();
			if (dto.getListUser() != null && dto.getListUser().size() > 0) {
				for (UserInHealthOrgDto uihoDto : dto.getListUser()) {

					UserInHealthOrg userInHealthOrg = null;
					if (uihoDto.getId() != null) {
						userInHealthOrg = userInHealthOrgRepository.getOne(uihoDto.getId());
					}

					if (userInHealthOrg == null) {
						userInHealthOrg = new UserInHealthOrg();
					}

					User user = null;
					if (uihoDto.getUser() != null && uihoDto.getUser().getId() != null) {
						user = userRepository.getOne(uihoDto.getUser().getId());
					}

					if (user == null) {
						return null;
					}

					userInHealthOrg.setUser(user);
					userInHealthOrg.setHealthOrg(entity);

					newListUser.add(userInHealthOrg);
				}
			}

			if (entity.getListUser() == null) {
				entity.setListUser(newListUser);
			} else {
				entity.getListUser().clear();
				entity.getListUser().addAll(newListUser);
			}

			entity = healthOrgRepository.save(entity);
//			if(publicService.checkUsername(entity.getCode()) ==  null) {
				User user = userRepository.findByUsername(entity.getCode());
				Person person = null;
				if(user==null) {
					user = new User();
					user.setUsername(entity.getCode());
					user.setEmail(dto.getEmail());
					if(dto.getPassword() != null) {
						user.setPassword(SecurityUtils.getHashPassword(dto.getPassword()));
					}else {
						user.setPassword(SecurityUtils.getHashPassword("123456"));
					}
					
					Role roleHEALTHORG = roleService.findByName(PIConst.ROLE_HEALTH_ORG);
					Role roleUSER = roleService.findByName(PIConst.ROLE_USER);
					Set<Role> roles = new HashSet<Role>();
					roles.add(roleUSER);
					roles.add(roleHEALTHORG);
					user.setRoles(roles);
					
					person = new Person();
					person.setDisplayName(dto.getName());
					person.setPhoneNumber(dto.getContactPhone());
					person.setEmail(dto.getEmail());
					person.setUser(user);
					user.setPerson(person);
					user = userRepository.save(user);
				}
				if(user != null) {
					if(entity != null) {
						List<UUID> listId = new ArrayList<UUID>();
						listId.add(entity.getId());
						userInHealthOrgService.saveHealthOrgByUser(user.getId(), listId);	
					}
				}
//			}
			if (entity != null) {
				return new HealthOrgDto(entity);
			}
			
		}
		return null;
	}

	@Override
	public HealthOrgDto getById(UUID id) {
		if (id != null) {
			HealthOrg entity = healthOrgRepository.getOne(id);
			if (entity != null) {
				return new HealthOrgDto(entity);
			}
		}
		return null;
	}

	@Override
	public Boolean deleteById(UUID id) {
		if (id != null) {
			HealthOrg entity = healthOrgRepository.getOne(id);
			if (entity != null) {
				healthOrgRepository.deleteById(id);
				return true;
			}
		}
		return null;
	}

	@Override
	public Boolean checkDuplicateCode(UUID id, String code) {
		if (code != null && StringUtils.hasText(code)) {
			HealthOrg entity = healthOrgRepository.getByCode(code);
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
	public Boolean checkDuplicateEmail(UUID id, String email) {
		if(email != null && StringUtils.hasText(email)) {
			List<HealthOrg> list = healthOrgRepository.getByEmail(email);
			if(list != null && list.size() > 0) {
				for(HealthOrg healthOrg: list) {
					if(id != null && healthOrg.getId().equals(id)) {
						return false;
					}
				}
				return true;
			}
			return false;
		}
		return false;
	}
 
	@Override
	public void setCodeForAllHealthOrg() {
		List<HealthOrg> list = this.healthOrgRepository.findAll();
		for (int i = 0; i < list.size(); i++) {
			HealthOrg he = list.get(i);
			he.setOrderNumber(i + 1);
			he.setCode("S-" + String.format("%04d", he.getOrderNumber()));
			this.save(he);
		}
	}

	@Override
	public HealthOrgSampleSetDto allocationSampleToHealthOrg(HealthOrgSampleSetDto dto) {
		if (dto != null && dto.getRound() != null) {
			if (dto.getListDetail() != null && dto.getListDetail().size() > 0) {
				for (HealthOrgSampleSetDetailDto de : dto.getListDetail()) {
					if (de.geteQASampleSetDto() != null && de.geteQASampleSetDto().getEqaRound() != null
							&& de.geteQASampleSetDto().getEqaRound().getId().equals(dto.getRound().getId())) {

//						EQASampleSet sampleSet = eQASampleSetService.findById(de.geteQASampleSetDto().getId());
						for (HealthOrgEQARoundDto he : de.getListHealthOrg()) {
							if (de.geteQASampleSetDto() != null && he.getRound() != null
									&& he.getRound().getId().equals(dto.getRound().getId())) {
								he.setSampleSet(de.geteQASampleSetDto());
								he = healthOrgEQARoundService.saveOrUpdate(he, he.getId());
							}
						}
					}
				}
			}
		}
		return dto;
	}

	@Override
	public HealthOrgSampleSetDto classifyHealthOrgByRound(UUID roundId, int numberToBreak) {
		if (roundId != null && numberToBreak > 1) {
			EQARoundDto round = eQARoundService.getDtoById(roundId);
			if (round != null) {
				HealthOrgSampleSetDto ret = new HealthOrgSampleSetDto();
				ret.setRound(round);
				HealthOrgEQARoundSearchDto healthOrgEQARoundSearchDto = new HealthOrgEQARoundSearchDto();
				EQARoundDto roundDto = new EQARoundDto();
				roundDto.setId(roundId);
				healthOrgEQARoundSearchDto.setRoundId(roundId);
				healthOrgEQARoundSearchDto.setPageIndex(1);
				healthOrgEQARoundSearchDto.setPageSize(1000000);
				healthOrgEQARoundSearchDto.setIsRunning(true);
				healthOrgEQARoundSearchDto.setFeeStatus(PIConst.FeeStatus.yes.getValue());
				healthOrgEQARoundSearchDto.setHasResult(false);
				List<Integer> listStatus = new ArrayList<Integer>();
				listStatus.add(PIConst.HealthOrgEQARoundStatus.New.getValue());
				listStatus.add(PIConst.HealthOrgEQARoundStatus.Confirmed.getValue());
				healthOrgEQARoundSearchDto.setListStatus(listStatus);
				Page<HealthOrgEQARoundDto> pages = healthOrgEQARoundService.searchByDto(healthOrgEQARoundSearchDto);
				List<HealthOrgEQARoundDto> list = pages.getContent();

				EQASampleSetSearchDto qQASampleSetSearchDto = new EQASampleSetSearchDto();
				qQASampleSetSearchDto.setEqaRoundId(roundId);
				qQASampleSetSearchDto.setPageIndex(1);
				qQASampleSetSearchDto.setPageSize(10000);
				Page<EQASampleSetDto> pageSampleSet = eQASampleSetService.searchByDto(qQASampleSetSearchDto);
				List<EQASampleSetDto> listSampleSet = pageSampleSet.getContent();
				if (listSampleSet != null) {
					ret.setListSampleSet(listSampleSet);
					if (list != null && numberToBreak != 50) {
						List<HealthOrgSampleSetDetailDto> listDetail = new ArrayList<HealthOrgSampleSetDetailDto>();

						HealthOrgSampleSetDetailDto detail1 = new HealthOrgSampleSetDetailDto();
						detail1.setNote("Mã đơn vị không chia hết cho " + numberToBreak);
						detail1.setListHealthOrg(new ArrayList<HealthOrgEQARoundDto>());

						HealthOrgSampleSetDetailDto detail2 = new HealthOrgSampleSetDetailDto();
						detail2.setNote("Mã đơn vị chia hết cho " + numberToBreak);
						detail2.setListHealthOrg(new ArrayList<HealthOrgEQARoundDto>());

						for (HealthOrgEQARoundDto he : list) {
							if (he.getHealthOrg() != null && he.getHealthOrg().getOrderNumber() != null
									&& he.getHealthOrg().getOrderNumber() % numberToBreak == 0) {
								detail2.getListHealthOrg().add(he);
							} else {
								detail1.getListHealthOrg().add(he);
							}
						}
						listDetail.add(detail1);
						listDetail.add(detail2);
						ret.setListDetail(listDetail);
					}else {
						int number = list.size() / 2;
						List<HealthOrgSampleSetDetailDto> listDetail = new ArrayList<HealthOrgSampleSetDetailDto>();
						HealthOrgSampleSetDetailDto detail1 = new HealthOrgSampleSetDetailDto();
						detail1.setNote("Nửa đầu danh sách");
						detail1.setListHealthOrg(new ArrayList<HealthOrgEQARoundDto>());

						HealthOrgSampleSetDetailDto detail2 = new HealthOrgSampleSetDetailDto();
						detail2.setNote("Nửa sau danh sách ");
						detail2.setListHealthOrg(new ArrayList<HealthOrgEQARoundDto>());

						for(int i = 0; i < list.size(); i++) {
							if(i < number) {
								detail1.getListHealthOrg().add(list.get(i));
							}else {
								detail2.getListHealthOrg().add(list.get(i));
							}
						}
						listDetail.add(detail1);
						listDetail.add(detail2);
						ret.setListDetail(listDetail);
					}
				}
				return ret;
			}
		}
		return null;
	}

	@Override
	public List<User> createAccountForAllHealthOrg() {
		List<HealthOrgDto> listHealthOrgs = healthOrgRepository.getAll();
		User healthOrgUser = new User();
		
		List<User> listHealthOrgUsers = new ArrayList<User>();
		Role roleHEALTHORG = roleService.findByName(PIConst.ROLE_HEALTH_ORG);
		Role roleUSER = roleService.findByName(PIConst.ROLE_USER);
		Set<Role> roles = new HashSet<Role>();
		
		if (roleHEALTHORG != null && roleUSER != null) {
			roles.clear();
			roles.add(roleHEALTHORG);
			roles.add(roleUSER);
		}
		if (listHealthOrgs != null && listHealthOrgs.size() > 0) {
			for (HealthOrgDto heal : listHealthOrgs) {
				HealthOrg healthOrg = healthOrgRepository.getOne(heal.getId());
				if (heal.getCode() != null) {
					healthOrgUser = userRepository.findByUsername(heal.getCode());
					if (healthOrgUser == null) {
						healthOrgUser = new User();
					}
					healthOrgUser.setUsername(heal.getCode());
					healthOrgUser.setPassword(SecurityUtils.getHashPassword("123456"));
					healthOrgUser.setRoles(roles);
				} else {
					return null;
				}
				healthOrgUser.setActive(true);
				healthOrgUser = userRepository.save(healthOrgUser);
				//tạo person
				
				Person person = new Person();
				person.setUser(healthOrgUser);
				if(heal.getName() != null) {
					person.setDisplayName(heal.getName());
				}
				if(heal.getContactPhone() != null) {
					person.setPhoneNumber(heal.getContactPhone());
				}
				if(heal.getEmail() != null) {
					person.setEmail(heal.getEmail());
				}
				else if(heal.getEmail() == null) {
					if(heal.getCode() != null) {
						person.setEmail(heal.getCode() + "@gmail.com");
					}
				}
				person = personRepository.save(person);
	
				List<UUID> listId = new ArrayList<UUID>();
				listId.add(healthOrg.getId());
				userInHealthOrgService.saveHealthOrgByUser(healthOrgUser.getId(), listId);
				listHealthOrgUsers.add(healthOrgUser);
			}
			return listHealthOrgUsers;
		}
		return null;
	}
	
	@Override
	public Page<HealthOrgDto> searchNotInRound(HealthOrgSearchDto dto) {
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

		String sqlCount = "select count(eqap.id) from HealthOrg as eqap where (1=1) ";
		String sql = "select new com.globits.PI.dto.HealthOrgDto(eqap) from HealthOrg as eqap where (1=1) ";
		
		if (dto.getEqaRoundId() != null) {
			whereClause += " AND eqap.id NOT IN (select hoer.healthOrg.id from HealthOrgEQARound as hoer where hoer.round.id IN (:eqaRoundId )) ";
		}
		if (dto.getText() != null && StringUtils.hasText(dto.getText())) {

			whereClause += " AND ( eqap.name LIKE :text "
						+ " OR eqap.code LIKE :text "
						+ " OR eqap.address LIKE :text "
						+ " OR eqap.description LIKE :text )"
						+ " OR eqap.contactName LIKE :text ";

		}

		sql += whereClause ;
		
		sqlCount += whereClause;
		Query q = manager.createQuery(sql, HealthOrgDto.class);
		Query qCount = manager.createQuery(sqlCount);

		if (dto.getEqaRoundId() != null) {
			q.setParameter("eqaRoundId", dto.getEqaRoundId());
			qCount.setParameter("eqaRoundId", dto.getEqaRoundId());
		}
		
		if (dto.getText() != null && StringUtils.hasText(dto.getText())) {
			q.setParameter("text", '%' + dto.getText() + '%');
			qCount.setParameter("text", '%' + dto.getText() + '%');
		}

		int startPosition = pageIndex * pageSize;
		q.setFirstResult(startPosition);
		q.setMaxResults(pageSize);
		List<HealthOrgDto> entities = q.getResultList();
		long count = (long) qCount.getSingleResult();

		Pageable pageable = PageRequest.of(pageIndex, pageSize);
		Page<HealthOrgDto> result = new PageImpl<HealthOrgDto>(entities, pageable, count);
		return result;
	}


}

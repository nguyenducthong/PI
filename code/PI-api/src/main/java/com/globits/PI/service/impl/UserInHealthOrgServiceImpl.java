package com.globits.PI.service.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import javax.persistence.Query;

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

import com.globits.PI.PIConst;
import com.globits.PI.domain.HealthOrg;
import com.globits.PI.domain.UserInHealthOrg;
import com.globits.PI.dto.HealthOrgDto;
import com.globits.PI.functiondto.SearchDto;
import com.globits.PI.functiondto.UserInfoDto;
import com.globits.PI.repository.UserInHealthOrgRepository;
import com.globits.PI.service.HealthOrgService;
import com.globits.PI.service.UserInHealthOrgService;
import com.globits.core.Constants;
import com.globits.core.service.impl.GenericServiceImpl;
import com.globits.security.domain.Role;
import com.globits.security.domain.User;
import com.globits.security.dto.UserDto;
import com.globits.security.service.UserService;

@Transactional
@Service
public class UserInHealthOrgServiceImpl extends GenericServiceImpl<UserInHealthOrg, UUID> implements UserInHealthOrgService {
	@Autowired
	UserInHealthOrgRepository userInHealthOrgRepository;
	@Autowired
	UserService userService;
	@Autowired
	HealthOrgService healthOrgService;
	
	@Override
	public UserInfoDto getUserInfoByUserLogin() {
		// TODO Auto-generated method stub
		UserInfoDto infoUser = null;
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		User modifiedUser = null;
		if (authentication != null) {
			modifiedUser = (User) authentication.getPrincipal();
			if (modifiedUser != null && modifiedUser.getId() != null) {
				infoUser = new UserInfoDto();
				infoUser.setUser(modifiedUser);
				
				if (infoUser.getUser().getRoles() != null && infoUser.getUser().getRoles().size() > 0 ) {
					for (Role item : infoUser.getUser().getRoles()) {
						if (item.getAuthority().equals(Constants.ROLE_ADMIN) || item.getName().equals(Constants.ROLE_ADMIN)) {
							infoUser.setIsRoleAdmin(true);
						}
						else if (item.getAuthority().equals(Constants.ROLE_USER) || item.getName().equals(Constants.ROLE_USER)) {
							infoUser.setIsRoleUser(true);
						}
						else if (item.getAuthority().equals(PIConst.ROLE_HEALTH_ORG) || item.getName().equals(PIConst.ROLE_HEALTH_ORG)) {
							infoUser.setIsRoleHealthOrg(true);
						}else if (item.getAuthority().equals(PIConst.ROLE_ADMINISTRATIVE_STAFF) || item.getName().equals(PIConst.ROLE_ADMINISTRATIVE_STAFF)) {
							infoUser.setIsRoleAdiministrativeStaff(true);
						}else if (item.getAuthority().equals(PIConst.ROLE_STAFF) || item.getName().equals(PIConst.ROLE_STAFF)) {
							infoUser.setIsRoleStaff(true);
						}
					}
				}
				
				List<UserInHealthOrg> listUserInHealthOrg = userInHealthOrgRepository.getAllByUserId(modifiedUser.getId());
				List<UUID> listUserInHealthOrgId = new ArrayList<UUID>();
				List<UUID> listHealthOrgId = new ArrayList<UUID>();
				infoUser.setListUserInHealthOrg(listUserInHealthOrg);
				if(listUserInHealthOrg!=null && listUserInHealthOrg.size()>0) {
					for (UserInHealthOrg userInHealthOrg : listUserInHealthOrg) {
						listUserInHealthOrgId.add(userInHealthOrg.getId());
						if(userInHealthOrg.getHealthOrg()!=null) {
							listHealthOrgId.add(userInHealthOrg.getHealthOrg().getId());
						}
					}
				}
				infoUser.setListUserInHealthOrgId(listUserInHealthOrgId);
				infoUser.setListHealthOrgId(listHealthOrgId);
				if (listUserInHealthOrg != null && listUserInHealthOrg.size() > 0) {
					if (listUserInHealthOrg.get(0) != null && listUserInHealthOrg.get(0).getHealthOrg() != null && listUserInHealthOrg.get(0).getHealthOrg().getId() != null) {
						infoUser.setHealthOrg(listUserInHealthOrg.get(0).getHealthOrg());
					}
				}
				
				return infoUser;
			}
		}
		
		return infoUser;
	}
	@Override
	public List<HealthOrgDto> getListHealthOrgByUser(Long userId){
		User user = null;
		if(userId!=null && userId>0L) {//Lấy user theo ID truyền vào
			user = userService.findById(userId);
		}
		if(user==null) {//Nếu không lấy được thì lấy theo User đăng nhập vào
			Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
			if (authentication != null) {
				user = (User) authentication.getPrincipal();
			}
		}
		if(user==null) {//nếu vẫn không lấy được thì dừng ở đây
			return null;
		}
		List<UserInHealthOrg> listUserInHealthOrg = userInHealthOrgRepository.getAllByUserId(user.getId());
		List<HealthOrgDto> ret = new ArrayList<HealthOrgDto>();
		if(listUserInHealthOrg!=null && listUserInHealthOrg.size()>0) {
			
			for (UserInHealthOrg userInHealthOrg : listUserInHealthOrg) {
				if(userInHealthOrg.getHealthOrg()!=null) {
					ret.add(new HealthOrgDto(userInHealthOrg.getHealthOrg(), true));
				}
			}
		}
		return ret;
	}
//	@Override
	public List<HealthOrgDto> getListHealthOrgByUser(Long userId,UUID roundId){
		User user = null;
		if(userId!=null && userId>0L) {//Lấy user theo ID truyền vào
			user = userService.findById(userId);
		}
		if(user==null) {//Nếu không lấy được thì lấy theo User đăng nhập vào
			Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
			if (authentication != null) {
				user = (User) authentication.getPrincipal();
			}
		}
		if(user==null) {//nếu vẫn không lấy được thì dừng ở đây
			return null;
		}
		List<UserInHealthOrg> listUserInHealthOrg = userInHealthOrgRepository.getAllByUserId(user.getId());
		List<HealthOrgDto> ret = new ArrayList<HealthOrgDto>();
		if(listUserInHealthOrg!=null && listUserInHealthOrg.size()>0) {
			
			for (UserInHealthOrg userInHealthOrg : listUserInHealthOrg) {
				if(userInHealthOrg.getHealthOrg()!=null) {
					ret.add(new HealthOrgDto(userInHealthOrg.getHealthOrg(), true));
				}
			}
		}
		return ret;
	}
	
	@Override
	public List<UUID> getListHealthOrgIdByUser(Long userId){
		User user = null;
		if(userId!=null && userId>0L) {//Lấy user theo ID truyền vào
			user = userService.findById(userId);
		}
		if(user==null) {//Nếu không lấy được thì lấy theo User đăng nhập vào
			Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
			if (authentication != null) {
				user = (User) authentication.getPrincipal();
			}
		}
		if(user==null) {//nếu vẫn không lấy được thì dừng ở đây
			return null;
		}
		List<UserInHealthOrg> listUserInHealthOrg = userInHealthOrgRepository.getAllByUserId(user.getId());
		List<UUID> ret = new ArrayList<UUID>();
		if(listUserInHealthOrg!=null && listUserInHealthOrg.size()>0) {
			
			for (UserInHealthOrg userInHealthOrg : listUserInHealthOrg) {
				if(userInHealthOrg.getHealthOrg()!=null) {
					ret.add(userInHealthOrg.getHealthOrg().getId());
				}
			}
		}
		return ret;
	}
	
	
	@Override
	public List<HealthOrgDto> saveHealthOrgByUser(Long userId,List<UUID> healthOrgIds) {
		List<HealthOrgDto> retVal = new ArrayList<HealthOrgDto>();
		User user = userService.findById(userId);
		if(user!=null) {
			List<UserInHealthOrg> ret = new ArrayList<UserInHealthOrg>();
			if(healthOrgIds!=null && healthOrgIds.size()>0) {
				for (UUID healthOrgId : healthOrgIds) {
					HealthOrg he = healthOrgService.findById(healthOrgId);
					if(he!=null) {
						UserInHealthOrg uhe = null;
						List<UserInHealthOrg> listFindUserInHealthOrg = userInHealthOrgRepository.getAllByUserIdAndHealthOrgId(userId, healthOrgId);
						if(listFindUserInHealthOrg!=null && listFindUserInHealthOrg.size()>0) {
							uhe = listFindUserInHealthOrg.get(0);
						}
						if(uhe==null) {
							uhe = new UserInHealthOrg();
							uhe.setUser(user);
							uhe.setHealthOrg(he);
						}
						ret.add(uhe);
					}
				}
				List<UserInHealthOrg> listOldUserInHealthOrg = userInHealthOrgRepository.getAllByUserId(userId);
				List<UserInHealthOrg> listDeleteUserInHealthOrg = new ArrayList<UserInHealthOrg>();
				if(listOldUserInHealthOrg!=null && listOldUserInHealthOrg.size()>0) {
					for (UserInHealthOrg uheOld : listOldUserInHealthOrg) {
						Boolean isDel = true;
						for (UserInHealthOrg re : ret) {
							if(uheOld.getHealthOrg().getId().equals(re.getHealthOrg().getId())) {
								isDel = false;
								break;
							}
						}
						if(isDel) {
							listDeleteUserInHealthOrg.add(uheOld);
						}
					}
				}
				if(listDeleteUserInHealthOrg.size()>0) {
					userInHealthOrgRepository.deleteInBatch(listDeleteUserInHealthOrg);
				}
				if(ret!=null && ret.size()>0) {
					for (UserInHealthOrg userInHealthOrg : ret) {
						userInHealthOrg = userInHealthOrgRepository.save(userInHealthOrg);
						if(userInHealthOrg.getHealthOrg()!=null) {
							retVal.add(new HealthOrgDto(userInHealthOrg.getHealthOrg()));
						}
					}
				}
			}
			else {
				List<UserInHealthOrg> listUserInHealthOrg = userInHealthOrgRepository.getAllByUserId(userId);
				if(listUserInHealthOrg!=null) {
					userInHealthOrgRepository.deleteInBatch(listUserInHealthOrg);
				}
			}
		}
		return retVal;
	}
	@Override
	public Page<UserDto> searchByDto(SearchDto dto) {
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
		
		String sqlCount = "select count(entity.id) from User as entity where (1=1) ";
		String sql = "select new com.globits.security.dto.UserDto(entity) from User as entity where (1=1) ";

		if (dto.getText() != null && StringUtils.hasText(dto.getText())) {
			whereClause += " AND ( entity.person.displayName LIKE :text OR entity.email  LIKE :text OR entity.username LIKE :text ) ";
		}
		
		sql+=whereClause;
		sqlCount+=whereClause;
		Query q = manager.createQuery(sql, UserDto.class);
		Query qCount = manager.createQuery(sqlCount);

		if (dto.getText() != null && StringUtils.hasText(dto.getText())) {
			q.setParameter("text", '%' + dto.getText() + '%');
			qCount.setParameter("text", '%' + dto.getText() + '%');
		}
		

		int startPosition = pageIndex * pageSize;
		q.setFirstResult(startPosition);
		q.setMaxResults(pageSize);
		List<UserDto> entities = q.getResultList();
		long count = (long) qCount.getSingleResult();
		
		Pageable pageable = PageRequest.of(pageIndex, pageSize);
		Page<UserDto> result = new PageImpl<UserDto>(entities, pageable, count);
		return result;
	}
	@Override
	public UserDto updateUser(Long userId, UserDto dto) {
		UserDto item = null;
		if(userId != null) {
			item = userService.findByUserId(userId);
		}
		if(dto != null && item != null ) {
			if(dto.getPerson() != null) {
				item.setPerson(dto.getPerson());
			}
			item.setEmail(dto.getEmail());
			item.setFirstName(dto.getFirstName());
			item.setLastName(dto.getLastName());
			item.setDisplayName(dto.getDisplayName());
			item = userService.save(item);
		}
		return item;
	}
	
	
	
}

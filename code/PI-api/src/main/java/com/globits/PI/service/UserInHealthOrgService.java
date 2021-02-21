package com.globits.PI.service;

import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Page;

import com.globits.PI.domain.UserInHealthOrg;
import com.globits.PI.dto.HealthOrgDto;
import com.globits.PI.functiondto.SearchDto;
import com.globits.PI.functiondto.UserInfoDto;
import com.globits.core.service.GenericService;
import com.globits.security.domain.User;
import com.globits.security.dto.UserDto;

public interface UserInHealthOrgService extends GenericService<UserInHealthOrg, UUID> {

	UserInfoDto getUserInfoByUserLogin();

	List<HealthOrgDto> saveHealthOrgByUser(Long userId, List<UUID> healthOrgIds);

	List<HealthOrgDto> getListHealthOrgByUser(Long userId);

	List<UUID> getListHealthOrgIdByUser(Long userId);
	
	Page<UserDto> searchByDto(SearchDto dto);
	
	public UserDto updateUser(Long userId, UserDto dto);
}

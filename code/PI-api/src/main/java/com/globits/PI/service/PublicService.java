package com.globits.PI.service;

import com.globits.PI.dto.HealthOrgDto;
import com.globits.PI.functiondto.RegisterDto;
import com.globits.security.domain.User;

public interface PublicService{

	RegisterDto signUpAndCreateHealthOrg(HealthOrgDto dto);

	User checkUsername(String username);

	User checkEmail(String email);

}

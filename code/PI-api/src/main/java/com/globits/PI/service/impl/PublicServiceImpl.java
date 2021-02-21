package com.globits.PI.service.impl;

import java.security.SecureRandom;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;

import javax.persistence.EntityManager;

import org.apache.commons.lang3.RandomStringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import com.globits.PI.PIConst;
import com.globits.PI.dto.HealthOrgDto;
import com.globits.PI.dto.HealthOrgEQARoundDto;
import com.globits.PI.dto.UserInHealthOrgDto;
import com.globits.PI.functiondto.RegisterDto;
import com.globits.PI.repository.HealthOrgEQARoundRepository;
import com.globits.PI.repository.HealthOrgRepository;
import com.globits.PI.service.HealthOrgEQARoundService;

import com.globits.PI.service.HealthOrgService;
import com.globits.PI.service.PublicService;
import com.globits.PI.service.UserInHealthOrgService;
import com.globits.PI.utils.EmailUtil;
import com.globits.core.domain.Person;
import com.globits.core.utils.SecurityUtils;
import com.globits.security.domain.Role;
import com.globits.security.domain.User;
import com.globits.security.dto.UserDto;
import com.globits.security.repository.RoleRepository;
import com.globits.security.repository.UserRepository;
import com.globits.security.service.RoleService;

@Transactional
@Service
public class PublicServiceImpl implements PublicService {

	@Autowired
	private EntityManager manager;

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private HealthOrgRepository healthOrgRepository;

	@Autowired
	private HealthOrgService healthOrgService;

	@Autowired
	private HealthOrgEQARoundService healthOrgEQARoundService;

	@Autowired
	private HealthOrgEQARoundRepository healthOrgEQARoundRepository;

	@Autowired
	private RoleRepository roleRepository;
	
	@Autowired
	RoleService roleService;
	
	@Autowired
	UserInHealthOrgService userInHealthOrgService;
	
	@Override
	public RegisterDto signUpAndCreateHealthOrg(HealthOrgDto dto) {
		RegisterDto result = null;
		HealthOrgDto healthOrg = null;
		if(dto != null) {
			boolean check = this.checkIsValid(dto);// check trùng username và email
			if (!check) {
				result = new RegisterDto();
				result.setDuplicateEmail(true);
				return result;
			}
			
			
			healthOrg = healthOrgService.saveOrUpdate(dto, null);
			if (healthOrg != null) {				
				
				result = new RegisterDto();
				result.setHealthOrg(healthOrg);
				result.setEmail(healthOrg.getEmail());
				result.setUsername(healthOrg.getCode());
				result.setPassword(dto.getPassword());

				System.out.println("======================signUpAndCreateHealthOrg======================");
				System.out.println("username:" + result.getUsername());
				System.out.println("password:" + result.getPassword());

				// Gửi email thông báo tài khoản mật khẩu
				String host = "";
				String subject = "Đăng ký tham gia";
				String body = "";
				body += "Chúc mừng bạn <b>" + result.getHealthOrg().getContactName() + "</b> thuộc đơn vị <b>"
						+ result.getHealthOrg().getName() + "</b>";
				body += " đã tạo thành công tài khoản <b>" + result.getUsername() + "</b> <br>";
				body += "Mật khẩu đăng nhập của bạn là: <b>" + result.getPassword() + "</b>";

				Boolean sendEmailSuccess = EmailUtil.sendEmail(host, result.getEmail(), subject, body);
				if (!sendEmailSuccess) {
					result.setSendEmailFailed(true);
				}
				
			}
			if (result == null) {
				if (healthOrg != null) {
					healthOrgService.delete(healthOrg.getId());
				}
			}
		}
		
		
		return result;
	}

	private boolean checkIsValid(HealthOrgDto dto) {
		User user = null;
		if (dto != null && dto != null && StringUtils.hasText(dto.getEmail())) {
			user = this.checkUsername(dto.getEmail());
			if (user == null) {
				user = this.checkEmail(dto.getEmail());
				if (user == null) {
					return true;
				}
			}
		}
		return false;
	}

	@Override
	public User checkUsername(String username) {
		User user = userRepository.findByUsername(username);
		return user;
	}

	@Override
	public User checkEmail(String email) {
		User user = userRepository.findByEmail(email);
		return user;
	}

}

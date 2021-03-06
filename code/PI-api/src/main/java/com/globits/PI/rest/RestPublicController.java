package com.globits.PI.rest;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.globits.PI.dto.EQARoundDto;
import com.globits.PI.dto.HealthOrgDto;
import com.globits.PI.functiondto.EQARoundSearchDto;
import com.globits.PI.functiondto.HealthOrgTypeSearchDto;
import com.globits.PI.functiondto.RegisterDto;
import com.globits.PI.service.EQARoundService;
import com.globits.PI.service.PublicService;
import com.globits.security.domain.User;
import com.globits.security.dto.UserDto;

@RestController
@RequestMapping("/public")
public class RestPublicController {
	@PersistenceContext
	private EntityManager manager;

	@Autowired
	private PublicService service;

	@Autowired
	private EQARoundService eQARoundService;


	@RequestMapping(value = "EQARound/search", method = RequestMethod.POST)
	public ResponseEntity<Page<EQARoundDto>> searchByDto(@RequestBody EQARoundSearchDto dto) {
		Page<EQARoundDto> result = eQARoundService.searchByDto(dto);
		return new ResponseEntity<Page<EQARoundDto>>(result, (result != null) ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
	}

	@RequestMapping(value = "/EQARound/getCurrent", method = RequestMethod.GET)
	public ResponseEntity<EQARoundDto> getCurentEQARound() {
		EQARoundDto result = eQARoundService.getCurentEQARound();
		return new ResponseEntity<EQARoundDto>(result, (result != null) ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
	}

	@RequestMapping(value = "signUpAndCreateHealthOrg", method = RequestMethod.POST)
	public ResponseEntity<RegisterDto> signUpAndCreateHealthOrg(@RequestBody HealthOrgDto dto) {
		RegisterDto result = service.signUpAndCreateHealthOrg(dto);
		return new ResponseEntity<RegisterDto>(result, (result != null) ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
	}

	@RequestMapping(value = "checkUsername", method = RequestMethod.POST)
	public ResponseEntity<UserDto> checkUsername(@RequestBody RegisterDto dto) {
		User result = null;
		if (StringUtils.hasLength(dto.getUsername())) {
			result = service.checkUsername(dto.getUsername());
			return new ResponseEntity<UserDto>((result != null && result.getId() != null) ? new UserDto(result) : null, HttpStatus.OK);
		}
		return new ResponseEntity<UserDto>((result != null && result.getId() != null) ? new UserDto(result) : null, HttpStatus.BAD_REQUEST);
	}

	@RequestMapping(value = "checkEmail", method = RequestMethod.POST)
	public ResponseEntity<UserDto> checkEmail(@RequestBody RegisterDto dto) {
		User result = null;
		if (StringUtils.hasLength(dto.getEmail())) {
			result = service.checkEmail(dto.getEmail());
			return new ResponseEntity<UserDto>((result != null && result.getId() != null) ? new UserDto(result) : null, HttpStatus.OK);
		}
		return new ResponseEntity<UserDto>((result != null && result.getId() != null) ? new UserDto(result) : null, HttpStatus.BAD_REQUEST);
	}
	

}

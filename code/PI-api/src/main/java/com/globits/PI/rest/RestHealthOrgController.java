package com.globits.PI.rest;

import java.util.List;
import java.util.UUID;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.globits.PI.PIConst;
import com.globits.PI.dto.HealthOrgDto;
import com.globits.PI.functiondto.HealthOrgSampleSetDto;
import com.globits.PI.functiondto.HealthOrgSearchDto;
import com.globits.PI.repository.HealthOrgRepository;
import com.globits.PI.service.HealthOrgService;
import com.globits.core.Constants;
import com.globits.security.domain.User;

@RestController
@RequestMapping("/api/HealthOrg")
public class RestHealthOrgController {
	@PersistenceContext
	private EntityManager manager;

	@Autowired
	private HealthOrgService service;

	@Autowired
	private HealthOrgRepository repository;

	@Secured({ Constants.ROLE_ADMIN,Constants.ROLE_USER, PIConst.ROLE_HEALTH_ORG})
	@RequestMapping(value = "/search", method = RequestMethod.POST)
	public ResponseEntity<Page<HealthOrgDto>> searchByDto(@RequestBody HealthOrgSearchDto dto) {
		Page<HealthOrgDto> result = service.searchByDto(dto);
		return new ResponseEntity<Page<HealthOrgDto>>(result, (result != null) ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
	}

	@Secured({ Constants.ROLE_ADMIN,Constants.ROLE_USER, PIConst.ROLE_HEALTH_ORG})
	@RequestMapping(value = "/getAll", method = RequestMethod.GET)
	public ResponseEntity<List<HealthOrgDto>> getAll() {
		List<HealthOrgDto> result = repository.getAll();
		return new ResponseEntity<List<HealthOrgDto>>(result, (result != null) ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
	}

	@Secured({ Constants.ROLE_ADMIN,Constants.ROLE_USER})
	@RequestMapping(method = RequestMethod.POST)
	public ResponseEntity<HealthOrgDto> create(@RequestBody HealthOrgDto dto) {
		HealthOrgDto result = service.saveOrUpdate(dto, null);
		return new ResponseEntity<HealthOrgDto>(result, (result != null) ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
	}

	@Secured({ Constants.ROLE_ADMIN,Constants.ROLE_USER, PIConst.ROLE_HEALTH_ORG})
	@RequestMapping(value = "/{id}", method = RequestMethod.PUT)
	public ResponseEntity<HealthOrgDto> update(@RequestBody HealthOrgDto dto, @PathVariable("id") UUID id) {
		HealthOrgDto result = service.saveOrUpdate(dto, id);
		return new ResponseEntity<HealthOrgDto>(result, (result != null) ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
	}
	
	@Secured({ Constants.ROLE_ADMIN,Constants.ROLE_USER, PIConst.ROLE_HEALTH_ORG})
	@RequestMapping(value = "/checkCode",method = RequestMethod.GET)
	public ResponseEntity<Boolean> checkDuplicateCode(@RequestParam(value = "id", required=false) UUID id, @RequestParam("code") String code) {
		Boolean result = service.checkDuplicateCode(id, code);
		return new ResponseEntity<Boolean>(result, (result != null) ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
	}
	
	@Secured({ Constants.ROLE_ADMIN,Constants.ROLE_USER, PIConst.ROLE_HEALTH_ORG})
	@RequestMapping(value = "/checkEmail",method = RequestMethod.GET)
	public ResponseEntity<Boolean> checkDuplicateEmail(@RequestParam(value = "id", required=false) UUID id, @RequestParam("email") String email) {
		Boolean result = service.checkDuplicateEmail(id, email);
		return new ResponseEntity<Boolean>(result, (result != null) ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
	}

	@Secured({Constants.ROLE_ADMIN, PIConst.ROLE_HEALTH_ORG})
	@RequestMapping(value = "/{id}", method = RequestMethod.GET)
	public ResponseEntity<HealthOrgDto> getById(@PathVariable("id") String id) {
		HealthOrgDto result = service.getById(UUID.fromString(id));
		return new ResponseEntity<HealthOrgDto>(result, (result != null) ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
	}

	@Secured({Constants.ROLE_ADMIN})
	@RequestMapping(value = "/{id}", method = RequestMethod.DELETE)
	public ResponseEntity<Boolean> deleteById(@PathVariable("id") String id) {
		Boolean result = service.deleteById(UUID.fromString(id));
		return new ResponseEntity<Boolean>(result, (result != null) ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
	}
	
	@Secured({Constants.ROLE_ADMIN})
	@RequestMapping(value = "/setCodeForAllHealthOrg", method = RequestMethod.POST)
	public void setCodeForAllHealthOrg() {
		service.setCodeForAllHealthOrg();
	}
	
	@Secured({Constants.ROLE_ADMIN, PIConst.ROLE_STAFF})
	@RequestMapping(value = "/allocationSampleToHealthOrg", method = RequestMethod.POST)
	public HealthOrgSampleSetDto allocationSampleToHealthOrg(@RequestBody HealthOrgSampleSetDto dto) {
		return service.allocationSampleToHealthOrg(dto);
	}
	
	@Secured({Constants.ROLE_ADMIN, PIConst.ROLE_STAFF})
	@RequestMapping(value = "/classifyHealthOrgByRound/{roundId}/{numberToBreak}", method = RequestMethod.POST)
	public HealthOrgSampleSetDto classifyHealthOrgByRound(@PathVariable UUID roundId,@PathVariable int numberToBreak) {
		return service.classifyHealthOrgByRound(roundId,numberToBreak);
	}
	
	@Secured({Constants.ROLE_ADMIN})
	@RequestMapping(value = "/createAccountForAllHealthOrg", method = RequestMethod.POST)
	public List<User> createAccountForAllHealthOrg() {
		return service.createAccountForAllHealthOrg();
	}
	
	@Secured({ Constants.ROLE_ADMIN,Constants.ROLE_USER,PIConst.ROLE_ADMINISTRATIVE_STAFF})
	@RequestMapping(value = "/searchNotInRound", method = RequestMethod.POST)
	public ResponseEntity<Page<HealthOrgDto>> searchNotInRound(@RequestBody HealthOrgSearchDto dto) {
		Page<HealthOrgDto> result = service.searchNotInRound(dto);
		return new ResponseEntity<Page<HealthOrgDto>>(result, (result != null) ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
	}
}

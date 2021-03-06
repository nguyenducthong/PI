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
import org.springframework.web.bind.annotation.RestController;

import com.globits.PI.PIConst;
import com.globits.PI.dto.EQAPlanningDto;
import com.globits.PI.dto.EQARoundDto;
import com.globits.PI.dto.HealthOrgDto;
import com.globits.PI.dto.HealthOrgEQARoundDto;
import com.globits.PI.functiondto.HealthOrgEQARoundSearchDto;
import com.globits.PI.repository.HealthOrgEQARoundRepository;
import com.globits.PI.service.HealthOrgEQARoundService;
import com.globits.core.Constants;
import com.globits.core.dto.ResultMessageDto;

@RestController
@RequestMapping("/api/HealthOrgEQARound")
public class RestHealthOrgEQARoundController {
	@PersistenceContext
	private EntityManager manager;

	@Autowired
	private HealthOrgEQARoundService service;

	@Autowired
	private HealthOrgEQARoundRepository repository;

	@Secured({ Constants.ROLE_ADMIN,Constants.ROLE_USER, PIConst.ROLE_HEALTH_ORG, PIConst.ROLE_ADMINISTRATIVE_STAFF, PIConst.ROLE_STAFF })
	@RequestMapping(value = "search", method = RequestMethod.POST)
	public ResponseEntity<Page<HealthOrgEQARoundDto>> searchByDto(@RequestBody HealthOrgEQARoundSearchDto dto) {
		Page<HealthOrgEQARoundDto> result = service.searchByDto(dto);
		return new ResponseEntity<Page<HealthOrgEQARoundDto>>(result, (result != null) ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
	}
	
	@Secured({ Constants.ROLE_ADMIN,Constants.ROLE_USER,PIConst.ROLE_ADMINISTRATIVE_STAFF, PIConst.ROLE_STAFF, PIConst.ROLE_HEALTH_ORG})
	@RequestMapping(value = "searchHealthOrg", method = RequestMethod.POST)
	public ResponseEntity<Page<HealthOrgDto>> searchHealthOrg(@RequestBody HealthOrgEQARoundSearchDto dto) {
		Page<HealthOrgDto> result = service.searchHealthOrg(dto);
		return new ResponseEntity<Page<HealthOrgDto>>(result, (result != null) ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
	}

	@Secured({ Constants.ROLE_ADMIN,Constants.ROLE_USER, PIConst.ROLE_ADMINISTRATIVE_STAFF, PIConst.ROLE_STAFF, PIConst.ROLE_HEALTH_ORG})
	@RequestMapping(value = "getListHealthOrgEQARoundByEQARoundId/{id}", method = RequestMethod.GET)
	public ResponseEntity<List<HealthOrgEQARoundDto>> getListHealthOrgEQARoundByEQARoundId(@PathVariable("id") String id) {
		List<HealthOrgEQARoundDto> result = repository.getListHealthOrgEQARoundByEQARoundId(UUID.fromString(id));
		return new ResponseEntity<List<HealthOrgEQARoundDto>>(result, (result != null) ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
	}
	
	@Secured({ Constants.ROLE_ADMIN,Constants.ROLE_USER, PIConst.ROLE_ADMINISTRATIVE_STAFF, PIConst.ROLE_STAFF, PIConst.ROLE_HEALTH_ORG})
	@RequestMapping(method = RequestMethod.POST)
	public ResponseEntity<HealthOrgEQARoundDto> create(@RequestBody HealthOrgEQARoundDto dto) {
		HealthOrgEQARoundDto result = service.saveOrUpdate(dto, null);
		return new ResponseEntity<HealthOrgEQARoundDto>(result, (result != null) ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
	}

	@Secured({ Constants.ROLE_ADMIN,Constants.ROLE_USER, PIConst.ROLE_ADMINISTRATIVE_STAFF, PIConst.ROLE_STAFF, PIConst.ROLE_HEALTH_ORG})
	@RequestMapping(value = "/{id}", method = RequestMethod.PUT)
	public ResponseEntity<HealthOrgEQARoundDto> update(@RequestBody HealthOrgEQARoundDto dto, @PathVariable("id") UUID id) {
		HealthOrgEQARoundDto result = service.saveOrUpdate(dto, id);
		return new ResponseEntity<HealthOrgEQARoundDto>(result, (result != null) ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
	}

	@Secured({Constants.ROLE_ADMIN,Constants.ROLE_USER, PIConst.ROLE_HEALTH_ORG, PIConst.ROLE_ADMINISTRATIVE_STAFF, PIConst.ROLE_STAFF})
	@RequestMapping(value = "/{id}", method = RequestMethod.GET)
	public ResponseEntity<HealthOrgEQARoundDto> getById(@PathVariable("id") String id) {
		HealthOrgEQARoundDto result = service.getById(UUID.fromString(id));
		return new ResponseEntity<HealthOrgEQARoundDto>(result, (result != null) ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
	}

	@Secured({Constants.ROLE_ADMIN, PIConst.ROLE_ADMINISTRATIVE_STAFF, PIConst.ROLE_STAFF, PIConst.ROLE_HEALTH_ORG})
	@RequestMapping(value = "/{id}", method = RequestMethod.DELETE)
	public ResponseEntity<Boolean> deleteById(@PathVariable("id") String id) {
		Boolean result = service.deleteById(UUID.fromString(id));
		return new ResponseEntity<Boolean>(result, (result != null) ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
	}
	@Secured({ Constants.ROLE_ADMIN,Constants.ROLE_USER, PIConst.ROLE_ADMINISTRATIVE_STAFF, PIConst.ROLE_STAFF, PIConst.ROLE_HEALTH_ORG})
	@RequestMapping(value = "/getAll", method = RequestMethod.GET)
	public ResponseEntity<List<HealthOrgEQARoundDto>> getAll() {
		List<HealthOrgEQARoundDto> result = repository.getAll();
		return new ResponseEntity<List<HealthOrgEQARoundDto>>(result, (result != null) ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
	}
	
//	@Secured({ Constants.ROLE_ADMIN,Constants.ROLE_USER})
//	@RequestMapping(value = "/checkCode",method = RequestMethod.GET)
//	public ResponseEntity<Boolean> checkDuplicateCode(@RequestParam(value = "id", required=false) Long id, @RequestParam("code") String code) {
//		Boolean result = service.checkDuplicateCode(id, code);
//		return new ResponseEntity<Boolean>(result, (result != null) ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
//	}

	@Secured({ Constants.ROLE_ADMIN,Constants.ROLE_USER, PIConst.ROLE_HEALTH_ORG, PIConst.ROLE_ADMINISTRATIVE_STAFF, PIConst.ROLE_STAFF})
	@RequestMapping(value = "searchEQARoundByPage", method = RequestMethod.POST)
	public ResponseEntity<Page<EQARoundDto>> searchEQARoundByPage(@RequestBody HealthOrgEQARoundSearchDto dto) {
		Page<EQARoundDto> result = service.searchEQARoundByPage(dto);
		return new ResponseEntity<Page<EQARoundDto>>(result, (result != null) ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
	}

	@Secured({Constants.ROLE_ADMIN, Constants.ROLE_USER, PIConst.ROLE_HEALTH_ORG, PIConst.ROLE_ADMINISTRATIVE_STAFF, PIConst.ROLE_STAFF, PIConst.ROLE_COORDINATOR, PIConst.ROLE_SAMPLE_ADMIN})
	@RequestMapping(value = "/healthOrgRegisterRound/{roundId}", method = RequestMethod.GET)
	public ResponseEntity<HealthOrgEQARoundDto> healthOrgRegisterRound(@PathVariable("roundId") UUID roundId) {
		HealthOrgEQARoundDto result = service.healthOrgRegisterRound(roundId);
		return new ResponseEntity<HealthOrgEQARoundDto>(result, (result != null) ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
	}

	@Secured({Constants.ROLE_ADMIN, Constants.ROLE_USER, PIConst.ROLE_HEALTH_ORG, PIConst.ROLE_ADMINISTRATIVE_STAFF, PIConst.ROLE_STAFF, PIConst.ROLE_COORDINATOR, PIConst.ROLE_SAMPLE_ADMIN})
	@RequestMapping(value = "/handleCancelRegistration/{id}", method = RequestMethod.GET)
	public ResponseEntity<HealthOrgEQARoundDto> handleCancelRegistration(@PathVariable("id") UUID id) {
		HealthOrgEQARoundDto result = service.handleCancelRegistration(id);
		return new ResponseEntity<HealthOrgEQARoundDto>(result, (result != null) ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
	}
	
	@Secured({Constants.ROLE_ADMIN, Constants.ROLE_USER, PIConst.ROLE_HEALTH_ORG,PIConst.ROLE_ADMINISTRATIVE_STAFF, PIConst.ROLE_STAFF})
	@RequestMapping(value = "/cancelRegistration/{healthOrgId}/{roundId}", method = RequestMethod.POST)
	public ResponseEntity<HealthOrgEQARoundDto> cancelRegistration(@PathVariable("healthOrgId") UUID healthOrgId,@PathVariable("roundId") UUID roundId) {
		HealthOrgEQARoundDto result = service.cancelRegistration(healthOrgId,roundId);
		return new ResponseEntity<HealthOrgEQARoundDto>(result, (result != null) ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
	}
	
	@Secured({ Constants.ROLE_ADMIN, Constants.ROLE_USER, PIConst.ROLE_HEALTH_ORG,PIConst.ROLE_ADMINISTRATIVE_STAFF, PIConst.ROLE_STAFF})
	@RequestMapping(value = "/addMultiple", method = RequestMethod.POST)
	public ResponseEntity<ResultMessageDto> addMultiple(@RequestBody List<HealthOrgEQARoundDto> dtoList) {
		ResultMessageDto result = service.addMultiple(dtoList);
		return new ResponseEntity<ResultMessageDto>(result, (result != null) ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
	}
	
	@Secured({ Constants.ROLE_ADMIN, Constants.ROLE_USER, PIConst.ROLE_HEALTH_ORG, PIConst.ROLE_STAFF, PIConst.ROLE_ADMINISTRATIVE_STAFF, PIConst.ROLE_STAFF, PIConst.ROLE_COORDINATOR, PIConst.ROLE_SAMPLE_ADMIN})
	@RequestMapping(value = "/countNumberOfHealthOrgEQARound", method = RequestMethod.GET)
	public ResponseEntity<Integer> countNumberOfHealthOrgEQARound() {
		Integer result = service.countNumberOfHealthOrgEQARound();
		return new ResponseEntity<Integer>(result, HttpStatus.OK);
	}

	@Secured({ Constants.ROLE_ADMIN, Constants.ROLE_USER, PIConst.ROLE_HEALTH_ORG, PIConst.ROLE_STAFF, PIConst.ROLE_ADMINISTRATIVE_STAFF, PIConst.ROLE_STAFF})
	@RequestMapping(value = "/changeSampleTransferStatus/{id}", method = RequestMethod.POST)
	public ResponseEntity<Boolean> changeSampleTransferStatus(@PathVariable("id") UUID healthOrgID, @RequestBody Integer status) {
		Boolean result = service.changeSampleTransferStatus(healthOrgID , status);
		return new ResponseEntity<Boolean>(result, result ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
	}

	@Secured({ Constants.ROLE_ADMIN,Constants.ROLE_USER, PIConst.ROLE_HEALTH_ORG, PIConst.ROLE_STAFF, PIConst.ROLE_ADMINISTRATIVE_STAFF, PIConst.ROLE_STAFF})
	@RequestMapping(value = "/searchByTransferredSample", method = RequestMethod.POST)
	public ResponseEntity<Page<HealthOrgEQARoundDto>> searchByTransferredSample(@RequestBody HealthOrgEQARoundSearchDto dto) {
		Page<HealthOrgEQARoundDto> result = service.searchByTransferredSample(dto);
		return new ResponseEntity<Page<HealthOrgEQARoundDto>>(result, (result != null) ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
	}
	
	@Secured({ Constants.ROLE_ADMIN,Constants.ROLE_USER, PIConst.ROLE_HEALTH_ORG,PIConst.ROLE_ADMINISTRATIVE_STAFF, PIConst.ROLE_STAFF})
	@RequestMapping(value = "getListHealthOrgEQARoundByEQARoundIdAndUser/{id}", method = RequestMethod.GET)
	public ResponseEntity<List<HealthOrgEQARoundDto>> getListHealthOrgEQARoundByEQARoundIdAndUser(@PathVariable("id") UUID roundID) {
		List<HealthOrgEQARoundDto> result = service.getListHealthOrgEQARoundByEQARoundIdAndCurrentUser(roundID);
		return new ResponseEntity<List<HealthOrgEQARoundDto>>(result, (result != null) ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
	}
	
	@Secured({ Constants.ROLE_ADMIN,Constants.ROLE_USER, PIConst.ROLE_HEALTH_ORG, PIConst.ROLE_ADMINISTRATIVE_STAFF, PIConst.ROLE_STAFF})
	@RequestMapping(value = "searchEQAPlanningByPage", method = RequestMethod.POST)
	public ResponseEntity<Page<EQAPlanningDto>> searchEQAPlanningByPage(@RequestBody HealthOrgEQARoundSearchDto dto) {
		Page<EQAPlanningDto> result = service.searchEQAPlanningByPage(dto);
		return new ResponseEntity<Page<EQAPlanningDto>>(result, (result != null) ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
	}
	@Secured({ Constants.ROLE_ADMIN,Constants.ROLE_USER, PIConst.ROLE_HEALTH_ORG, PIConst.ROLE_ADMINISTRATIVE_STAFF, PIConst.ROLE_STAFF})
	@RequestMapping(value = "updateSubscriptionStatus", method = RequestMethod.POST)
	public ResponseEntity<Boolean> updateSubscriptionStatus(@RequestBody List<UUID> listId) {
		Boolean result = service.updateSubscriptionStatus(listId);
		return new ResponseEntity<Boolean>(result, result ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
	}
	
	@Secured({ Constants.ROLE_ADMIN, Constants.ROLE_USER, PIConst.ROLE_HEALTH_ORG,PIConst.ROLE_ADMINISTRATIVE_STAFF, PIConst.ROLE_STAFF})
	@RequestMapping(value = "/updateStatus", method = RequestMethod.POST)
	public ResponseEntity<Boolean> updateStatus(@RequestBody List<HealthOrgEQARoundDto> dtoList) {
		Boolean result = service.updateStatus(dtoList);
		return new ResponseEntity<Boolean>(result, (result != null) ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
	}
	
	@Secured({ Constants.ROLE_ADMIN,Constants.ROLE_USER, PIConst.ROLE_HEALTH_ORG,PIConst.ROLE_ADMINISTRATIVE_STAFF, PIConst.ROLE_STAFF})
	@RequestMapping(value = "getListHealthOrgManagementEQARoundByEQARoundId/{id}", method = RequestMethod.GET)
	public ResponseEntity<List<HealthOrgEQARoundDto>> getListHealthOrgManagementEQARoundByEQARoundId(@PathVariable("id") UUID roundID) {
		List<HealthOrgEQARoundDto> result = service.getListHealthOrgManagementEQARoundByEQARoundId(roundID);
		return new ResponseEntity<List<HealthOrgEQARoundDto>>(result, (result != null) ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
	}
	
	@Secured({ Constants.ROLE_ADMIN,Constants.ROLE_USER, PIConst.ROLE_HEALTH_ORG, PIConst.ROLE_ADMINISTRATIVE_STAFF, PIConst.ROLE_STAFF })
	@RequestMapping(value = "searchByPage", method = RequestMethod.POST)
	public ResponseEntity<Page<HealthOrgEQARoundDto>> searchByPage(@RequestBody HealthOrgEQARoundSearchDto dto) {
		Page<HealthOrgEQARoundDto> result = service.searchByPage(dto);
		return new ResponseEntity<Page<HealthOrgEQARoundDto>>(result, (result != null) ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
	}
	
	@Secured({ Constants.ROLE_ADMIN,Constants.ROLE_USER, PIConst.ROLE_HEALTH_ORG,PIConst.ROLE_ADMINISTRATIVE_STAFF, PIConst.ROLE_STAFF})
	@RequestMapping(value = "listHealthOrgEQARoundByEQARoundId/{id}", method = RequestMethod.GET)
	public ResponseEntity<List<HealthOrgEQARoundDto>> getListHealthOrgEQARoundByEQARoundId(@PathVariable("id") UUID roundID) {
		List<HealthOrgEQARoundDto> result = service.getListHealthOrgEQARoundByEQARoundId(roundID);
		return new ResponseEntity<List<HealthOrgEQARoundDto>>(result, (result != null) ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
	}
	
	@Secured({Constants.ROLE_ADMIN, Constants.ROLE_USER, PIConst.ROLE_HEALTH_ORG,PIConst.ROLE_ADMINISTRATIVE_STAFF, PIConst.ROLE_STAFF})
	@RequestMapping(value = "/getHealthOrgEQARound/{healthOrgId}/{roundId}", method = RequestMethod.GET)
	public ResponseEntity<HealthOrgEQARoundDto> getHealthOrgEQARound(@PathVariable("healthOrgId") UUID healthOrgId,@PathVariable("roundId") UUID roundId) {
		HealthOrgEQARoundDto result = service.getHealthOrgEQARound(healthOrgId,roundId);
		return new ResponseEntity<HealthOrgEQARoundDto>(result, (result != null) ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
	}
	
	@Secured({ Constants.ROLE_ADMIN,Constants.ROLE_USER, PIConst.ROLE_HEALTH_ORG, PIConst.ROLE_ADMINISTRATIVE_STAFF, PIConst.ROLE_STAFF})
	@RequestMapping(value = "updateStatusSentResults/{healthOrgId}/{roundId}", method = RequestMethod.GET)
	public ResponseEntity<Boolean> updateStatusSentResults(@PathVariable("healthOrgId") UUID healthOrgId,@PathVariable("roundId") UUID roundId) {
		Boolean result = service.updateStatusSentResults(healthOrgId, roundId);
		return new ResponseEntity<Boolean>(result, result ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
	}
}

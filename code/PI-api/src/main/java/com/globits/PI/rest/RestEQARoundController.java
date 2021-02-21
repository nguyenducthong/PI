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
import com.globits.PI.dto.EQARoundDto;
import com.globits.PI.functiondto.EQARoundSearchDto;
import com.globits.PI.service.EQARoundService;
import com.globits.core.Constants;

@RestController
@RequestMapping("/api/EQARound")
public class RestEQARoundController {
	@PersistenceContext
	private EntityManager manager;

	@Autowired
	private EQARoundService service;

	@Secured({ Constants.ROLE_ADMIN,Constants.ROLE_USER, PIConst.ROLE_HEALTH_ORG, PIConst.ROLE_STAFF, PIConst.ROLE_ADMINISTRATIVE_STAFF, PIConst.ROLE_COORDINATOR,PIConst.ROLE_SAMPLE_ADMIN})	
	@RequestMapping(value = "/search", method = RequestMethod.POST)
	public ResponseEntity<Page<EQARoundDto>> searchByDto(@RequestBody EQARoundSearchDto dto) {
		Page<EQARoundDto> result = service.searchByDto(dto);
		return new ResponseEntity<Page<EQARoundDto>>(result, (result != null) ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
	}

	@Secured({ Constants.ROLE_ADMIN,Constants.ROLE_USER,PIConst.ROLE_ADMINISTRATIVE_STAFF, PIConst.ROLE_STAFF, PIConst.ROLE_COORDINATOR, PIConst.ROLE_HEALTH_ORG})
	@RequestMapping(value = "getEQARoundsByPlanning/{id}", method = RequestMethod.GET)
	public List<EQARoundDto> getEQARoundsByYear(@PathVariable UUID id) {
		List<EQARoundDto> result = service.getEQARoundsByPlanning(id);
		return result;
	}

	@Secured({ Constants.ROLE_ADMIN,Constants.ROLE_USER, PIConst.ROLE_COORDINATOR, PIConst.ROLE_HEALTH_ORG})
	@RequestMapping(value = "/{id}", method = RequestMethod.GET)
	public ResponseEntity<EQARoundDto> getById(@PathVariable UUID id) {
		EQARoundDto result = service.getDtoById(id);
		return new ResponseEntity<EQARoundDto>(result, (result != null) ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
	}

	@Secured({ Constants.ROLE_ADMIN,Constants.ROLE_USER, PIConst.ROLE_COORDINATOR})
	@RequestMapping(method = RequestMethod.POST)
	public ResponseEntity<EQARoundDto> save(@RequestBody EQARoundDto dto) {
		EQARoundDto result = service.saveOrUpdate(dto);
		return new ResponseEntity<EQARoundDto>(result, (result != null) ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
	}

	@Secured({ Constants.ROLE_ADMIN,Constants.ROLE_USER, PIConst.ROLE_COORDINATOR})
	@RequestMapping(value = "/{id}", method = RequestMethod.PUT)
	public ResponseEntity<EQARoundDto> update(@RequestBody EQARoundDto dto, @PathVariable("id") Long id) {
		EQARoundDto result = service.saveOrUpdate(dto);
		return new ResponseEntity<EQARoundDto>(result, (result != null) ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
	}
	
	@Secured({ Constants.ROLE_ADMIN,Constants.ROLE_USER, PIConst.ROLE_COORDINATOR, PIConst.ROLE_HEALTH_ORG})
	@RequestMapping(value = "/checkCode",method = RequestMethod.GET)
	public ResponseEntity<Boolean> checkDuplicateCode(@RequestParam(value = "id", required=false) UUID id, @RequestParam("code") String code) {
		Boolean result = service.checkDuplicateCode(id, code);
		return new ResponseEntity<Boolean>(result, (result != null) ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
	}

	@Secured({Constants.ROLE_ADMIN,"ROLE_STUDENT_MANAGERMENT", PIConst.ROLE_COORDINATOR})
	@RequestMapping(value = "/{id}", method = RequestMethod.DELETE)
	public ResponseEntity<Boolean> deleteById(@PathVariable("id") String id) {
		Boolean result = service.deleteById(UUID.fromString(id));
		return new ResponseEntity<Boolean>(result, (result != null)  ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
	}
	
	@Secured({ Constants.ROLE_ADMIN, Constants.ROLE_USER, PIConst.ROLE_HEALTH_ORG, PIConst.ROLE_COORDINATOR, PIConst.ROLE_STAFF, PIConst.ROLE_SAMPLE_ADMIN, PIConst.ROLE_ADMINISTRATIVE_STAFF})
	@RequestMapping(value = "/countNumberOfEQARound", method = RequestMethod.GET)
	public ResponseEntity<Integer> countNumberOfEQARound() {
		Integer result = service.countNumberOfEQARound();
		return new ResponseEntity<Integer>(result, HttpStatus.OK);
	}

}

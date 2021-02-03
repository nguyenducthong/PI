package com.globits.PI.rest;

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
import com.globits.PI.dto.EQAPlanningDto;
import com.globits.PI.functiondto.EQAPlanningSearchDto;
import com.globits.PI.service.EQAPlanningService;
import com.globits.core.Constants;

@RestController
@RequestMapping("/api/EQAPlanning")
public class RestEQAPlanningController {
	@PersistenceContext
	private EntityManager manager;

	@Autowired
	private EQAPlanningService service;

	@Secured({ Constants.ROLE_ADMIN,Constants.ROLE_USER,PIConst.ROLE_ADMINISTRATIVE_STAFF, PIConst.ROLE_STAFF, PIConst.ROLE_COORDINATOR, PIConst.ROLE_HEALTH_ORG})
	@RequestMapping(value = "searchByDto", method = RequestMethod.POST)
	public ResponseEntity<Page<EQAPlanningDto>> searchByDto(@RequestBody EQAPlanningSearchDto dto) {
		Page<EQAPlanningDto> result = service.searchByDto(dto);
		return new ResponseEntity<Page<EQAPlanningDto>>(result, (result != null) ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
	}

	@Secured({ Constants.ROLE_ADMIN,Constants.ROLE_USER, PIConst.ROLE_COORDINATOR})
	@RequestMapping(method = RequestMethod.POST)
	public ResponseEntity<EQAPlanningDto> create(@RequestBody EQAPlanningDto dto) {
		EQAPlanningDto result = service.saveOrUpdate(dto, null);
		return new ResponseEntity<EQAPlanningDto>(result, (result != null) ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
	}

	@Secured({ Constants.ROLE_ADMIN,Constants.ROLE_USER, PIConst.ROLE_COORDINATOR})
	@RequestMapping(value = "/{id}", method = RequestMethod.PUT)
	public ResponseEntity<EQAPlanningDto> update(@RequestBody EQAPlanningDto dto, @PathVariable("id") UUID id) {
		EQAPlanningDto result = service.saveOrUpdate(dto, id);
		return new ResponseEntity<EQAPlanningDto>(result, (result != null) ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
	}
	
	@Secured({ Constants.ROLE_ADMIN,Constants.ROLE_USER, PIConst.ROLE_COORDINATOR})
	@RequestMapping(value = "/checkCode",method = RequestMethod.GET)
	public ResponseEntity<Boolean> checkDuplicateCode(@RequestParam(value = "id", required=false) UUID id, @RequestParam("code") String code) {
		Boolean result = service.checkDuplicateCode(id, code);
		return new ResponseEntity<Boolean>(result, (result != null) ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
	}

	@Secured({Constants.ROLE_ADMIN,"ROLE_STUDENT_MANAGERMENT", PIConst.ROLE_COORDINATOR, PIConst.ROLE_HEALTH_ORG})
	@RequestMapping(value = "getById/{id}", method = RequestMethod.GET)
	public ResponseEntity<EQAPlanningDto> getById(@PathVariable("id") String id) {
		EQAPlanningDto result = service.getById(UUID.fromString(id));
		return new ResponseEntity<EQAPlanningDto>(result, (result != null) ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
	}

	@Secured({Constants.ROLE_ADMIN,"ROLE_STUDENT_MANAGERMENT", PIConst.ROLE_COORDINATOR})
	@RequestMapping(value = "/{id}", method = RequestMethod.DELETE)
	public ResponseEntity<Boolean> deleteById(@PathVariable("id") String id) {
		Boolean result = service.deleteById(UUID.fromString(id));
		return new ResponseEntity<Boolean>(result, (result != null) ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
	}
	
//	@Secured({Constants.ROLE_ADMIN,"ROLE_STUDENT_MANAGERMENT", PIConst.ROLE_COORDINATOR, PIConst.ROLE_HEALTH_ORG})
//	@RequestMapping(value = "/checkNotBeingUsed/{id}", method = RequestMethod.GET)
//	public ResponseEntity<Boolean> checkNotBeingUsed(@PathVariable("id") String id) {
//		Boolean result = service.checkNotBeingUsed(UUID.fromString(id));
//		return new ResponseEntity<Boolean>(result, HttpStatus.OK);
//	}

}

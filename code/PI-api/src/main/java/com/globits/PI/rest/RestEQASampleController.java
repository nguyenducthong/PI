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
import com.globits.PI.dto.EQASampleDto;
import com.globits.PI.functiondto.EQASampleSearchDto;
import com.globits.PI.service.EQASampleService;
import com.globits.core.Constants;

@RestController
@RequestMapping("/api/EQASample")
public class RestEQASampleController {
	@PersistenceContext
	private EntityManager manager;

	@Autowired
	private EQASampleService service;

	@Secured({ Constants.ROLE_ADMIN,Constants.ROLE_USER, PIConst.ROLE_STAFF,PIConst.ROLE_SAMPLE_ADMIN})
	@RequestMapping(value = "/searchByDto", method = RequestMethod.POST)
	public ResponseEntity<Page<EQASampleDto>> searchByDto(@RequestBody EQASampleSearchDto dto) {
		Page<EQASampleDto> result = service.searchByDto(dto);
		return new ResponseEntity<Page<EQASampleDto>>(result, (result != null) ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
	}

	@Secured({ Constants.ROLE_ADMIN,Constants.ROLE_USER, PIConst.ROLE_STAFF,PIConst.ROLE_SAMPLE_ADMIN})
	@RequestMapping(method = RequestMethod.POST)
	public ResponseEntity<EQASampleDto> create(@RequestBody EQASampleDto dto) {
		EQASampleDto result = service.saveOrUpdate(dto, null);
		return new ResponseEntity<EQASampleDto>(result, (result != null) ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
	}

	@Secured({ Constants.ROLE_ADMIN,Constants.ROLE_USER, PIConst.ROLE_STAFF,PIConst.ROLE_SAMPLE_ADMIN})
	@RequestMapping(value = "/{id}", method = RequestMethod.PUT)
	public ResponseEntity<EQASampleDto> update(@RequestBody EQASampleDto dto, @PathVariable("id") UUID id) {
		EQASampleDto result = service.saveOrUpdate(dto, id);
		return new ResponseEntity<EQASampleDto>(result, (result != null) ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
	}
	
	@Secured({ Constants.ROLE_ADMIN,Constants.ROLE_USER, PIConst.ROLE_STAFF,PIConst.ROLE_SAMPLE_ADMIN})
	@RequestMapping(value = "/checkCode",method = RequestMethod.GET)
	public ResponseEntity<Boolean> checkDuplicateCode(@RequestParam(value = "id", required=false) UUID id, @RequestParam("code") String code) {
		Boolean result = service.checkDuplicateCode(id, code);
		return new ResponseEntity<Boolean>(result, (result != null) ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
	}

	@Secured({Constants.ROLE_ADMIN,"ROLE_STUDENT_MANAGERMENT", PIConst.ROLE_STAFF,PIConst.ROLE_SAMPLE_ADMIN})
	@RequestMapping(value = "getById/{id}", method = RequestMethod.GET)
	public ResponseEntity<EQASampleDto> getById(@PathVariable("id") String id) {
		EQASampleDto result = service.getById(UUID.fromString(id));
		return new ResponseEntity<EQASampleDto>(result, (result != null) ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
	}

	@Secured({Constants.ROLE_ADMIN,"ROLE_STUDENT_MANAGERMENT", PIConst.ROLE_STAFF,PIConst.ROLE_SAMPLE_ADMIN})
	@RequestMapping(value = "/{id}", method = RequestMethod.DELETE)
	public ResponseEntity<Boolean> deleteById(@PathVariable("id") String id) {
		Boolean result = service.deleteById(UUID.fromString(id));
		return new ResponseEntity<Boolean>(result, (result != null) ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
	}
	
	@Secured({Constants.ROLE_ADMIN,"ROLE_STUDENT_MANAGERMENT", PIConst.ROLE_STAFF,PIConst.ROLE_SAMPLE_ADMIN})
	@RequestMapping(value = "getByRoundId/{id}", method = RequestMethod.GET)
	public ResponseEntity<List<EQASampleDto>> getByRoundId(@PathVariable("id") String id) {
		List<EQASampleDto> result = service.getByRoundId(UUID.fromString(id));
		return new ResponseEntity<List<EQASampleDto>>(result, (result != null) ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
	}

	@Secured({Constants.ROLE_ADMIN,"ROLE_STUDENT_MANAGERMENT", PIConst.ROLE_STAFF,PIConst.ROLE_SAMPLE_ADMIN})
	@RequestMapping(value = "countByRoundId/{id}", method = RequestMethod.GET)
	public ResponseEntity<Integer> countByRoundId(@PathVariable("id") String id) {
		Integer result = service.countByRoundId(UUID.fromString(id));
		return new ResponseEntity<Integer>(result, (result != null) ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
	}
}

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
import com.globits.PI.dto.EQASampleSetDto;
import com.globits.PI.functiondto.EQASampleSetSearchDto;
import com.globits.PI.service.EQASampleSetService;
import com.globits.core.Constants;

@RestController
@RequestMapping("/api/EQASampleSet")
public class RestEQASampleSetController {

	@PersistenceContext
	private EntityManager manager;

	@Autowired
	private EQASampleSetService service;

	@Secured({ Constants.ROLE_ADMIN,Constants.ROLE_USER, PIConst.ROLE_STAFF,PIConst.ROLE_ADMINISTRATIVE_STAFF,PIConst.ROLE_SAMPLE_ADMIN})
	@RequestMapping(value = "searchByDto", method = RequestMethod.POST)
	public ResponseEntity<Page<EQASampleSetDto>> searchByDto(@RequestBody EQASampleSetSearchDto dto) {
		Page<EQASampleSetDto> result = service.searchByDto(dto);
		return new ResponseEntity<Page<EQASampleSetDto>>(result, (result != null) ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
	}

	@Secured({ Constants.ROLE_ADMIN,Constants.ROLE_USER, PIConst.ROLE_STAFF,PIConst.ROLE_SAMPLE_ADMIN})
	@RequestMapping(method = RequestMethod.POST)
	public ResponseEntity<EQASampleSetDto> create(@RequestBody EQASampleSetDto dto) {
		EQASampleSetDto result = service.saveOrUpdate(dto, null);
		return new ResponseEntity<EQASampleSetDto>(result, (result != null) ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
	}

	@Secured({ Constants.ROLE_ADMIN,Constants.ROLE_USER, PIConst.ROLE_STAFF,PIConst.ROLE_SAMPLE_ADMIN})
	@RequestMapping(value = "/{id}", method = RequestMethod.PUT)
	public ResponseEntity<EQASampleSetDto> update(@RequestBody EQASampleSetDto dto, @PathVariable("id") UUID id) {
		EQASampleSetDto result = service.saveOrUpdate(dto, id);
		return new ResponseEntity<EQASampleSetDto>(result, (result != null) ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
	}
	
	@Secured({ Constants.ROLE_ADMIN,Constants.ROLE_USER, PIConst.ROLE_STAFF,PIConst.ROLE_SAMPLE_ADMIN})
	@RequestMapping(value = "/checkCode",method = RequestMethod.GET)
	public ResponseEntity<Boolean> checkDuplicateCode(@RequestParam(value = "id", required=false) UUID id, @RequestParam("code") String code) {
		Boolean result = service.checkDuplicateCode(id, code);
		return new ResponseEntity<Boolean>(result, (result != null) ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
	}

	@Secured({Constants.ROLE_ADMIN,"ROLE_STUDENT_MANAGERMENT", PIConst.ROLE_STAFF,PIConst.ROLE_SAMPLE_ADMIN})
	@RequestMapping(value = "getById/{id}", method = RequestMethod.GET)
	public ResponseEntity<EQASampleSetDto> getById(@PathVariable("id") String id) {
		EQASampleSetDto result = service.getById(UUID.fromString(id));
		return new ResponseEntity<EQASampleSetDto>(result, (result != null) ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
	}

	@Secured({Constants.ROLE_ADMIN,"ROLE_STUDENT_MANAGERMENT", PIConst.ROLE_STAFF,PIConst.ROLE_SAMPLE_ADMIN})
	@RequestMapping(value = "/{id}", method = RequestMethod.DELETE)
	public ResponseEntity<Boolean> deleteById(@PathVariable("id") String id) {
		Boolean result = service.deleteById(UUID.fromString(id));
		return new ResponseEntity<Boolean>(result, (result != null) ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
	}
	
	@Secured({Constants.ROLE_ADMIN,"ROLE_STUDENT_MANAGERMENT", PIConst.ROLE_STAFF,PIConst.ROLE_SAMPLE_ADMIN})
	@RequestMapping(value = "/getSampleSetByRoundID/{id}", method = RequestMethod.GET)
	public ResponseEntity<List<EQASampleSetDto>> getSampleSetByRoundID(@PathVariable("id") String id) {
		List<EQASampleSetDto> result = service.getSampleSetByRoundID(UUID.fromString(id));
		return new ResponseEntity<List<EQASampleSetDto>>(result, (result != null) ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
	}

}

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
import com.globits.PI.dto.ReagentDto;
import com.globits.PI.functiondto.ReagentSearchDto;
import com.globits.PI.repository.ReagentRepository;
import com.globits.PI.service.ReagentService;
import com.globits.core.Constants;

@RestController
@RequestMapping("/api/reagent")
public class RestReagentController {
	@PersistenceContext
	private EntityManager manager;

	@Autowired
	private ReagentService service;

	@Autowired
	private ReagentRepository repository;

	@Secured({ Constants.ROLE_ADMIN,Constants.ROLE_USER, PIConst.ROLE_HEALTH_ORG})
	@RequestMapping(value = "searchByDto", method = RequestMethod.POST)
	public ResponseEntity<Page<ReagentDto>> searchByDto(@RequestBody ReagentSearchDto dto) {
		Page<ReagentDto> result = service.searchByDto(dto);
		return new ResponseEntity<Page<ReagentDto>>(result, (result != null) ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
	}

	@Secured({ Constants.ROLE_ADMIN,Constants.ROLE_USER, PIConst.ROLE_HEALTH_ORG})
	@RequestMapping(value = "getAll", method = RequestMethod.GET)
	public ResponseEntity<List<ReagentDto>> getAll() {
		List<ReagentDto> result = repository.getAll();
		return new ResponseEntity<List<ReagentDto>>(result, (result != null) ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
	}

	@Secured({ Constants.ROLE_ADMIN,Constants.ROLE_USER})
	@RequestMapping(method = RequestMethod.POST)
	public ResponseEntity<ReagentDto> create(@RequestBody ReagentDto dto) {
		ReagentDto result = service.saveOrUpdate(dto, null);
		return new ResponseEntity<ReagentDto>(result, (result != null) ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
	}

	@Secured({ Constants.ROLE_ADMIN,Constants.ROLE_USER})
	@RequestMapping(value = "/{id}", method = RequestMethod.PUT)
	public ResponseEntity<ReagentDto> update(@RequestBody ReagentDto dto, @PathVariable("id") UUID id) {
		ReagentDto result = service.saveOrUpdate(dto, id);
		return new ResponseEntity<ReagentDto>(result, (result != null) ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
	}
	
	@Secured({ Constants.ROLE_ADMIN,Constants.ROLE_USER, PIConst.ROLE_HEALTH_ORG})
	@RequestMapping(value = "/checkCode",method = RequestMethod.GET)
	public ResponseEntity<Boolean> checkDuplicateCode(@RequestParam(value = "id", required=false) UUID id, @RequestParam("code") String code) {
		Boolean result = service.checkDuplicateCode(id, code);
		return new ResponseEntity<Boolean>(result, (result != null) ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
	}

	@Secured({Constants.ROLE_ADMIN,"ROLE_STUDENT_MANAGERMENT", PIConst.ROLE_HEALTH_ORG})
	@RequestMapping(value = "getById/{id}", method = RequestMethod.GET)
	public ResponseEntity<ReagentDto> getById(@PathVariable("id") String id) {
		ReagentDto result = service.getById(UUID.fromString(id));
		return new ResponseEntity<ReagentDto>(result, (result != null) ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
	}

	@Secured({Constants.ROLE_ADMIN,"ROLE_STUDENT_MANAGERMENT"})
	@RequestMapping(value = "/{id}", method = RequestMethod.DELETE)
	public ResponseEntity<Boolean> deleteById(@PathVariable("id") String id) {
		Boolean result = service.deleteById(UUID.fromString(id));
		return new ResponseEntity<Boolean>(result, (result != null) ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
	}
}


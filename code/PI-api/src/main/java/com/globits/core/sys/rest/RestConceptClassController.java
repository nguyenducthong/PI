package com.globits.core.sys.rest;

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

import com.globits.PI.functiondto.SearchDto;
import com.globits.core.Constants;
import com.globits.core.sys.dto.ConceptClassDto;
import com.globits.core.sys.service.ConceptClassService;

@RestController
@RequestMapping("/api/conceptClass")
public class RestConceptClassController {
	@PersistenceContext
	private EntityManager manager;

	@Autowired
	private ConceptClassService service;

	@Secured({ Constants.ROLE_ADMIN,Constants.ROLE_USER})
	@RequestMapping(value = "searchByDto", method = RequestMethod.POST)
	public ResponseEntity<Page<ConceptClassDto>> searchByDto(@RequestBody SearchDto dto) {
		Page<ConceptClassDto> result = service.searchByDto(dto);
		return new ResponseEntity<Page<ConceptClassDto>>(result, (result != null) ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
	}

	@Secured({ Constants.ROLE_ADMIN,Constants.ROLE_USER})
	@RequestMapping(method = RequestMethod.POST)
	public ResponseEntity<ConceptClassDto> create(@RequestBody ConceptClassDto dto) {
		ConceptClassDto result = service.saveOrUpdate(dto, null);
		return new ResponseEntity<ConceptClassDto>(result, (result != null) ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
	}

	@Secured({ Constants.ROLE_ADMIN,Constants.ROLE_USER})
	@RequestMapping(value = "/{id}", method = RequestMethod.PUT)
	public ResponseEntity<ConceptClassDto> update(@RequestBody ConceptClassDto dto, @PathVariable("id") UUID id) {
		ConceptClassDto result = service.saveOrUpdate(dto, id);
		return new ResponseEntity<ConceptClassDto>(result, (result != null) ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
	}
	
	@Secured({ Constants.ROLE_ADMIN,Constants.ROLE_USER})
	@RequestMapping(value = "/checkCode",method = RequestMethod.GET)
	public ResponseEntity<Boolean> checkDuplicateCode(@RequestParam(value = "id", required=false) UUID id, @RequestParam("code") String code) {
		Boolean result = service.checkDuplicateCode(id, code);
		return new ResponseEntity<Boolean>(result, (result != null) ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
	}

	@Secured({Constants.ROLE_ADMIN,"ROLE_STUDENT_MANAGERMENT"})
	@RequestMapping(value = "getById/{id}", method = RequestMethod.GET)
	public ResponseEntity<ConceptClassDto> getById(@PathVariable("id") String id) {
		ConceptClassDto result = service.getById(UUID.fromString(id));
		return new ResponseEntity<ConceptClassDto>(result, (result != null) ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
	}

	@Secured({Constants.ROLE_ADMIN,"ROLE_STUDENT_MANAGERMENT"})
	@RequestMapping(value = "/{id}", method = RequestMethod.DELETE)
	public ResponseEntity<Boolean> deleteById(@PathVariable("id") String id) {
		Boolean result = service.deleteById(UUID.fromString(id));
		return new ResponseEntity<Boolean>(result, (result != null) ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
	}


}

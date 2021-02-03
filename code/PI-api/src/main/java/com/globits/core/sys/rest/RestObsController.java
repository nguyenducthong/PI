package com.globits.core.sys.rest;

import java.util.UUID;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.globits.core.Constants;
import com.globits.core.sys.dto.ObsDto;
import com.globits.core.sys.service.ObsService;

@RestController
@RequestMapping("/api/Obs")
public class RestObsController {
	@PersistenceContext
	private EntityManager manager;

	@Autowired
	private ObsService service;

	@Secured({ Constants.ROLE_ADMIN,Constants.ROLE_USER})
	@RequestMapping(method = RequestMethod.POST)
	public ResponseEntity<ObsDto> create(@RequestBody ObsDto dto) {
		ObsDto result = service.saveOrUpdate(dto, null);
		return new ResponseEntity<ObsDto>(result, (result != null) ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
	}

	@Secured({ Constants.ROLE_ADMIN,Constants.ROLE_USER})
	@RequestMapping(value = "/{id}", method = RequestMethod.PUT)
	public ResponseEntity<ObsDto> update(@RequestBody ObsDto dto, @PathVariable("id") UUID id) {
		ObsDto result = service.saveOrUpdate(dto, id);
		return new ResponseEntity<ObsDto>(result, (result != null) ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
	}
	
	@Secured({Constants.ROLE_ADMIN,"ROLE_STUDENT_MANAGERMENT"})
	@RequestMapping(value = "getById/{id}", method = RequestMethod.GET)
	public ResponseEntity<ObsDto> getById(@PathVariable("id") String id) {
		ObsDto result = service.getById(UUID.fromString(id));
		return new ResponseEntity<ObsDto>(result, (result != null) ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
	}

	@Secured({Constants.ROLE_ADMIN,"ROLE_STUDENT_MANAGERMENT"})
	@RequestMapping(value = "/{id}", method = RequestMethod.DELETE)
	public ResponseEntity<Boolean> deleteById(@PathVariable("id") String id) {
		Boolean result = service.deleteById(UUID.fromString(id));
		return new ResponseEntity<Boolean>(result, (result != null) ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
	}


}

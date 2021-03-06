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
import com.globits.PI.dto.EQASampleTubeDto;
import com.globits.PI.functiondto.EQASampleTubeSearchDto;
import com.globits.PI.repository.EQASampleTubeRepository;
import com.globits.PI.service.EQASampleTubeService;
import com.globits.core.Constants;

@RestController
@RequestMapping("/api/EQASampleTube")
public class RestEQASampleTubeController {

	@PersistenceContext
	private EntityManager manager;

	@Autowired
	private EQASampleTubeService service;

	@Autowired
	private EQASampleTubeRepository repository;

	@Secured({ Constants.ROLE_ADMIN,Constants.ROLE_USER, PIConst.ROLE_STAFF, PIConst.ROLE_ADMINISTRATIVE_STAFF})
	@RequestMapping(value = "searchByDto", method = RequestMethod.POST)
	public ResponseEntity<Page<EQASampleTubeDto>> searchByDto(@RequestBody EQASampleTubeSearchDto dto) {
		Page<EQASampleTubeDto> result = service.searchByDto(dto);
		return new ResponseEntity<Page<EQASampleTubeDto>>(result, (result != null) ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
	}

	@Secured({ Constants.ROLE_ADMIN,Constants.ROLE_USER, PIConst.ROLE_STAFF, PIConst.ROLE_ADMINISTRATIVE_STAFF})
	@RequestMapping(method = RequestMethod.POST)
	public ResponseEntity<EQASampleTubeDto> create(@RequestBody EQASampleTubeDto dto) {
		EQASampleTubeDto result = service.saveOrUpdate(dto, null);
		return new ResponseEntity<EQASampleTubeDto>(result, (result != null) ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
	}

	@Secured({ Constants.ROLE_ADMIN,Constants.ROLE_USER, PIConst.ROLE_STAFF, PIConst.ROLE_ADMINISTRATIVE_STAFF})
	@RequestMapping(value = "/{id}", method = RequestMethod.PUT)
	public ResponseEntity<EQASampleTubeDto> update(@RequestBody EQASampleTubeDto dto, @PathVariable("id") UUID id) {
		EQASampleTubeDto result = service.saveOrUpdate(dto, id);
		return new ResponseEntity<EQASampleTubeDto>(result, (result != null) ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
	}
	
	@Secured({ Constants.ROLE_ADMIN,Constants.ROLE_USER, PIConst.ROLE_STAFF, PIConst.ROLE_ADMINISTRATIVE_STAFF})
	@RequestMapping(value = "/checkCode",method = RequestMethod.GET)
	public ResponseEntity<Boolean> checkDuplicateCode(@RequestParam(value = "id", required=false) UUID id, @RequestParam("code") String code) {
		Boolean result = service.checkDuplicateCode(id, code);
		return new ResponseEntity<Boolean>(result, (result != null) ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
	}

	@Secured({Constants.ROLE_ADMIN,"ROLE_STUDENT_MANAGERMENT", Constants.ROLE_USER, PIConst.ROLE_STAFF, PIConst.ROLE_ADMINISTRATIVE_STAFF})
	@RequestMapping(value = "getById/{id}", method = RequestMethod.GET)
	public ResponseEntity<EQASampleTubeDto> getById(@PathVariable("id") String id) {
		EQASampleTubeDto result = service.getById(UUID.fromString(id));
		return new ResponseEntity<EQASampleTubeDto>(result, (result != null) ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
	}

	@Secured({Constants.ROLE_ADMIN, PIConst.ROLE_HEALTH_ORG, Constants.ROLE_USER,"ROLE_STUDENT_MANAGERMENT", PIConst.ROLE_STAFF, PIConst.ROLE_ADMINISTRATIVE_STAFF})
	@RequestMapping(value = "getByHealthOrgEQARoundId/{id}", method = RequestMethod.GET)
	public ResponseEntity<List<EQASampleTubeDto>> getByHealthOrgEQARoundId(@PathVariable("id") String id) {
		List<EQASampleTubeDto> result = repository.getByHealthOrgEQARoundId(UUID.fromString(id));
		return new ResponseEntity<List<EQASampleTubeDto>>(result, (result != null) ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
	}
	
	@Secured({Constants.ROLE_ADMIN, "ROLE_STUDENT_MANAGERMENT",Constants.ROLE_USER, PIConst.ROLE_STAFF, PIConst.ROLE_ADMINISTRATIVE_STAFF})
	@RequestMapping(value = "getByHealthOrgEQARoundIdAdmin/{id}", method = RequestMethod.GET)
	public ResponseEntity<List<EQASampleTubeDto>> getByHealthOrgEQARoundIdAdmin(@PathVariable("id") String id) {
		List<EQASampleTubeDto> result = repository.getByHealthOrgEQARoundIdAdmin(UUID.fromString(id));
		return new ResponseEntity<List<EQASampleTubeDto>>(result, (result != null) ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
	}
	
	@Secured({Constants.ROLE_ADMIN,"ROLE_STUDENT_MANAGERMENT",Constants.ROLE_USER, PIConst.ROLE_STAFF, PIConst.ROLE_ADMINISTRATIVE_STAFF})
	@RequestMapping(value = "getByHealthOrgAdnEQARound/{roundId}/{healthOrgId}", method = RequestMethod.GET)
	public ResponseEntity<List<EQASampleTubeDto>> getByHealthOrgAdnEQARound(@PathVariable("roundId") String roundId, @PathVariable("healthOrgId") String healthOrgId) {
		List<EQASampleTubeDto> result = repository.getByHealthOrgAndEQARound(UUID.fromString(roundId), UUID.fromString(healthOrgId));
		return new ResponseEntity<List<EQASampleTubeDto>>(result, (result != null) ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
	}

	@Secured({Constants.ROLE_ADMIN,"ROLE_STUDENT_MANAGERMENT",Constants.ROLE_USER, PIConst.ROLE_STAFF,PIConst.ROLE_ADMINISTRATIVE_STAFF})
	@RequestMapping(value = "/{id}", method = RequestMethod.DELETE)
	public ResponseEntity<Boolean> deleteById(@PathVariable("id") String id) {
		Boolean result = service.deleteById(UUID.fromString(id));
		return new ResponseEntity<Boolean>(result, (result != null) ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
	}
	
	@Secured({ Constants.ROLE_ADMIN, Constants.ROLE_USER, PIConst.ROLE_HEALTH_ORG, PIConst.ROLE_STAFF, PIConst.ROLE_COORDINATOR, PIConst.ROLE_SAMPLE_ADMIN, PIConst.ROLE_ADMINISTRATIVE_STAFF})
	@RequestMapping(value = "/countNumberOfCorrectSampleTube", method = RequestMethod.GET)
	public ResponseEntity<Integer> countNumberOfCorrectSampleTube() {
		Integer result = service.countNumberOfCorrectSampleTube();
		return new ResponseEntity<Integer>(result, HttpStatus.OK);
	}
	
	@Secured({ Constants.ROLE_ADMIN, Constants.ROLE_USER, PIConst.ROLE_HEALTH_ORG, PIConst.ROLE_STAFF, PIConst.ROLE_COORDINATOR, PIConst.ROLE_SAMPLE_ADMIN, PIConst.ROLE_ADMINISTRATIVE_STAFF})
	@RequestMapping(value = "/countNumberOfIncorrectSampleTube", method = RequestMethod.GET)
	public ResponseEntity<Integer> countNumberOfIncorrectSampleTube() {
		Integer result = service.countNumberOfIncorrectSampleTube();
		return new ResponseEntity<Integer>(result, HttpStatus.OK);
	}
	
	@Secured({ Constants.ROLE_ADMIN, Constants.ROLE_USER, PIConst.ROLE_HEALTH_ORG, PIConst.ROLE_STAFF, PIConst.ROLE_COORDINATOR, PIConst.ROLE_SAMPLE_ADMIN, PIConst.ROLE_ADMINISTRATIVE_STAFF})
	@RequestMapping(value = "/countNumberOfNotSubmittedSampleTube", method = RequestMethod.GET)
	public ResponseEntity<Integer> countNumberOfNotSubmittedSampleTube() {
		Integer result = service.countNumberOfNotSubmittedSampleTube();
		return new ResponseEntity<Integer>(result, HttpStatus.OK);
	}
	
}

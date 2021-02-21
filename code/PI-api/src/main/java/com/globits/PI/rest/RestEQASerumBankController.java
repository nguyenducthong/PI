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
import com.globits.PI.dto.EQASerumBankDto;
import com.globits.PI.functiondto.EQASerumBankSearchDto;
import com.globits.PI.service.EQASerumBankService;
import com.globits.core.Constants;

@RestController
@RequestMapping("/api/eQASerumBank")
public class RestEQASerumBankController {
	@PersistenceContext
	private EntityManager manager;

	@Autowired
	private EQASerumBankService service;

	@Secured({ Constants.ROLE_ADMIN,Constants.ROLE_USER, PIConst.ROLE_STAFF,PIConst.ROLE_SAMPLE_ADMIN})
	@RequestMapping(value = "searchByDto", method = RequestMethod.POST)
	public ResponseEntity<Page<EQASerumBankDto>> searchByDto(@RequestBody EQASerumBankSearchDto dto) {
		Page<EQASerumBankDto> result = service.searchByDto(dto);
		return new ResponseEntity<Page<EQASerumBankDto>>(result, (result != null) ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
	}

	@Secured({ Constants.ROLE_ADMIN,Constants.ROLE_USER, PIConst.ROLE_STAFF,PIConst.ROLE_SAMPLE_ADMIN})
	@RequestMapping(method = RequestMethod.POST)
	public ResponseEntity<EQASerumBankDto> create(@RequestBody EQASerumBankDto dto) {
		EQASerumBankDto result = service.saveOrUpdate(dto, null);
		return new ResponseEntity<EQASerumBankDto>(result, (result != null) ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
	}

	@Secured({ Constants.ROLE_ADMIN,Constants.ROLE_USER, PIConst.ROLE_STAFF,PIConst.ROLE_SAMPLE_ADMIN})
	@RequestMapping(value = "/{id}", method = RequestMethod.PUT)
	public ResponseEntity<EQASerumBankDto> update(@RequestBody EQASerumBankDto dto, @PathVariable("id") UUID id) {
		EQASerumBankDto result = service.saveOrUpdate(dto, id);
		return new ResponseEntity<EQASerumBankDto>(result, (result != null) ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
	}
	
	@Secured({ Constants.ROLE_ADMIN,Constants.ROLE_USER, PIConst.ROLE_STAFF,PIConst.ROLE_SAMPLE_ADMIN})
	@RequestMapping(value = "/checkCode",method = RequestMethod.GET)
	public ResponseEntity<Boolean> checkDuplicateCode(@RequestParam(value = "id", required=false) UUID id, @RequestParam("code") String code) {
		Boolean result = service.checkDuplicateCode(id, code);
		return new ResponseEntity<Boolean>(result, (result != null) ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
	}
	
	@Secured({ Constants.ROLE_ADMIN,Constants.ROLE_USER, PIConst.ROLE_STAFF,PIConst.ROLE_SAMPLE_ADMIN})
	@RequestMapping(value = "/checkCodeSerum",method = RequestMethod.GET)
	public ResponseEntity<Boolean> checkDuplicateCodeSerum(@RequestParam(value = "id", required=false) UUID id, @RequestParam("code") String code) {
		Boolean result = service.checkDuplicateCodeSerum(id, code);
		return new ResponseEntity<Boolean>(result, (result != null) ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
	}

	@Secured({Constants.ROLE_ADMIN,"ROLE_STUDENT_MANAGERMENT", PIConst.ROLE_STAFF,PIConst.ROLE_SAMPLE_ADMIN})
	@RequestMapping(value = "getById/{id}", method = RequestMethod.GET)
	public ResponseEntity<EQASerumBankDto> getById(@PathVariable("id") String id) {
		EQASerumBankDto result = service.getById(UUID.fromString(id));
		return new ResponseEntity<EQASerumBankDto>(result, (result != null) ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
	}

	@Secured({Constants.ROLE_ADMIN,"ROLE_STUDENT_MANAGERMENT", PIConst.ROLE_STAFF,PIConst.ROLE_SAMPLE_ADMIN})
	@RequestMapping(value = "/{id}", method = RequestMethod.DELETE)
	public ResponseEntity<Boolean> deleteById(@PathVariable("id") String id) {
		Boolean result = service.deleteById(UUID.fromString(id));
		return new ResponseEntity<Boolean>(result, (result != null) ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
	}

}

package com.globits.PI.rest;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.globits.PI.PIConst;
import com.globits.PI.functiondto.SearchDto;
import com.globits.PI.service.EQAAdministrativeUnitsService;
import com.globits.core.Constants;
import com.globits.core.dto.AdministrativeUnitDto;

@RestController
@RequestMapping("/api/AdministrativeUnit")
public class RestEQAAdministrativeUnitController {
	
	@Autowired
	private EQAAdministrativeUnitsService service;
	
	@Secured({ Constants.ROLE_ADMIN, PIConst.ROLE_HEALTH_ORG})
	@RequestMapping(value = "/searchByDto", method = RequestMethod.POST)
	public ResponseEntity<Page<AdministrativeUnitDto>> searchByDto(@RequestBody SearchDto dto){
		Page<AdministrativeUnitDto> result = service.searchByDto(dto);
		return new ResponseEntity<Page<AdministrativeUnitDto>>(result, (result != null) ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
	}
	
	@Secured({ Constants.ROLE_ADMIN,Constants.ROLE_USER})
	@RequestMapping(value = "/checkCode",method = RequestMethod.GET)
	public ResponseEntity<Boolean> checkDuplicateCode(@RequestParam(value = "id", required=false) UUID id, @RequestParam("code") String code) {
		Boolean result = service.checkDuplicateCode(id, code);
		return new ResponseEntity<Boolean>(result, (result != null) ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
	}

}

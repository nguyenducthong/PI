package com.globits.PI.rest;

import java.text.ParseException;
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
import com.globits.PI.dto.EQAResultReportDto;
import com.globits.PI.functiondto.EQAResultReportSearchDto;
import com.globits.PI.functiondto.EQASampleTubeResultConclusionDto;
import com.globits.PI.service.EQAResultReportService;
import com.globits.core.Constants;

@RestController
@RequestMapping("/api/EQAResultReport")
public class RestEQAResultReportController {
	@PersistenceContext
	private EntityManager manager;

	@Autowired
	private EQAResultReportService service;

	@Secured({ Constants.ROLE_ADMIN, Constants.ROLE_USER, PIConst.ROLE_HEALTH_ORG, PIConst.ROLE_STAFF, PIConst.ROLE_ADMINISTRATIVE_STAFF})
	@RequestMapping(value = "searchByDto", method = RequestMethod.POST)
	public ResponseEntity<Page<EQAResultReportDto>> searchByDto(@RequestBody EQAResultReportSearchDto dto) {
		Page<EQAResultReportDto> result = service.searchByDto(dto);
		return new ResponseEntity<Page<EQAResultReportDto>>(result, (result != null) ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
	}
	
	@Secured({ Constants.ROLE_ADMIN, Constants.ROLE_USER, PIConst.ROLE_HEALTH_ORG, PIConst.ROLE_STAFF, PIConst.ROLE_ADMINISTRATIVE_STAFF})
	@RequestMapping(value = "searchByDtoAll", method = RequestMethod.POST)
	public ResponseEntity<Page<EQAResultReportDto>> searchByDtoAll(@RequestBody EQAResultReportSearchDto dto) {
		Page<EQAResultReportDto> result = service.searchByDtoAll(dto);
		return new ResponseEntity<Page<EQAResultReportDto>>(result, (result != null) ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
	}

	@Secured({ Constants.ROLE_ADMIN,Constants.ROLE_USER, PIConst.ROLE_STAFF, PIConst.ROLE_ADMINISTRATIVE_STAFF, PIConst.ROLE_HEALTH_ORG})
	@RequestMapping(value = "getAllResultByHealthOrgEQARoundId/{id}", method = RequestMethod.GET)
	public List<EQAResultReportDto> getAllResultByHealthOrgEQARoundId(@PathVariable UUID id) {
		List<EQAResultReportDto> result = service.getAllResultByHealthOrgEQARoundId(id);
		return result;
	}
	
	@Secured({ Constants.ROLE_ADMIN,Constants.ROLE_USER, PIConst.ROLE_HEALTH_ORG, PIConst.ROLE_STAFF, PIConst.ROLE_ADMINISTRATIVE_STAFF})
	@RequestMapping(value = "/{id}", method = RequestMethod.GET)
	public ResponseEntity<EQAResultReportDto> getById(@PathVariable UUID id) {
		EQAResultReportDto result = service.getById(id);
		return new ResponseEntity<EQAResultReportDto>(result, (result != null) ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
	}
	@Secured({ Constants.ROLE_ADMIN,Constants.ROLE_USER, PIConst.ROLE_HEALTH_ORG})
	@RequestMapping(method = RequestMethod.POST)
	public ResponseEntity<EQAResultReportDto> create(@RequestBody EQAResultReportDto dto) throws ParseException {
		EQAResultReportDto result = service.saveOrUpdate(dto, null);
		return new ResponseEntity<EQAResultReportDto>(result, (result != null) ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
	}

	@Secured({ Constants.ROLE_ADMIN,Constants.ROLE_USER, PIConst.ROLE_HEALTH_ORG})
	@RequestMapping(value = "/{id}", method = RequestMethod.PUT)
	public ResponseEntity<EQAResultReportDto> update(@RequestBody EQAResultReportDto dto, @PathVariable("id") UUID id) throws ParseException {
		EQAResultReportDto result = service.saveOrUpdate(dto, id);
		return new ResponseEntity<EQAResultReportDto>(result, (result != null) ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
	}

	@Secured({Constants.ROLE_ADMIN, PIConst.ROLE_HEALTH_ORG, PIConst.ROLE_STAFF})
	@RequestMapping(value = "getById/{id}", method = RequestMethod.GET)
	public ResponseEntity<EQAResultReportDto> getById(@PathVariable("id") String id) {
		EQAResultReportDto result = service.getById(UUID.fromString(id));
		return new ResponseEntity<EQAResultReportDto>(result, (result != null) ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
	}

	@Secured({Constants.ROLE_ADMIN, PIConst.ROLE_HEALTH_ORG, Constants.ROLE_USER})
	@RequestMapping(value = "/{id}", method = RequestMethod.DELETE)
	public ResponseEntity<Boolean> deleteById(@PathVariable("id") String id) {
		Boolean result = service.deleteById(UUID.fromString(id));
		return new ResponseEntity<Boolean>(result, (result != null) ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
	}

	@Secured({Constants.ROLE_ADMIN, PIConst.ROLE_HEALTH_ORG})
	@RequestMapping(value = "/updateResultReportConclusionBySampleTube/{id}/{isFinalResult}", method = RequestMethod.POST)
	public ResponseEntity<Boolean> updateResultReportConclusionBySampleTube(@RequestBody List<EQASampleTubeResultConclusionDto> dtoList, @PathVariable("id") UUID orgID,@PathVariable("isFinalResult") Boolean isFinalResult) {
		Boolean result = service.updateResultReportConclusionBySampleTube(dtoList, orgID,isFinalResult);
		return new ResponseEntity<Boolean>(result ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
	}
	@Secured({Constants.ROLE_ADMIN})
	@RequestMapping(value = "/updateFinalResultStatus/{reportId}/{isFinalResult}", method = RequestMethod.POST)
	public ResponseEntity<EQAResultReportDto> updateFinalResultStatus(@PathVariable("reportId") UUID reportId,@PathVariable("isFinalResult") Boolean isFinalResult) {
		EQAResultReportDto result = service.updateFinalResultStatus(reportId,isFinalResult);
		if(result!=null) {
			return new ResponseEntity<EQAResultReportDto>(result, HttpStatus.OK);
		}
		else {
			return new ResponseEntity<EQAResultReportDto>(HttpStatus.BAD_REQUEST);
		}
		
	}
	
	@Secured({Constants.ROLE_ADMIN, PIConst.ROLE_HEALTH_ORG, PIConst.ROLE_STAFF})
	@RequestMapping(value = "/getEQASampleTubeResultConclusionDtoByHealthOrgEQARoundId/{id}", method = RequestMethod.GET)
	public ResponseEntity<List<EQASampleTubeResultConclusionDto>> getEQASampleTubeResultConclusionDtoByHealthOrgEQARoundId(@PathVariable("id") UUID orgID) {
		List<EQASampleTubeResultConclusionDto> result = service.getEQASampleTubeResultConclusionDtoByHealthOrgEQARoundId(orgID);
		return new ResponseEntity<List<EQASampleTubeResultConclusionDto>>(result, HttpStatus.OK);
	}
	

	
	@Secured({ Constants.ROLE_ADMIN,Constants.ROLE_USER, PIConst.ROLE_STAFF, PIConst.ROLE_ADMINISTRATIVE_STAFF, PIConst.ROLE_HEALTH_ORG})
	@RequestMapping(value = "getAllResultByHealthOrgManagementEQARoundId/{id}", method = RequestMethod.GET)
	public List<EQAResultReportDto> getAllResultByHealthOrgManagementEQARoundId(@PathVariable UUID id) {
		List<EQAResultReportDto> result = service.getAllResultByHealthOrgEQARoundId(id);
		return result;
	}
	
	@Secured({ Constants.ROLE_ADMIN,Constants.ROLE_USER, PIConst.ROLE_STAFF,PIConst.ROLE_SAMPLE_ADMIN})
	@RequestMapping(value = "/checkReagentByHealthOrgRound",method = RequestMethod.GET)
	public ResponseEntity<Boolean> checkDuplicateCode(@RequestParam(value = "idHealthOrgRound", required=false) UUID idHealthOrgRound,@RequestParam(value = "id", required=false) UUID id, @RequestParam(value = "idReagent", required=false) UUID idReagent, @RequestParam("typeMethod") Integer typeMethod) {
		Boolean result = service.checkReagent(id,idHealthOrgRound, idReagent, typeMethod);
		return new ResponseEntity<Boolean>(result, (result != null) ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
	}

	@Secured({ Constants.ROLE_ADMIN,Constants.ROLE_USER, PIConst.ROLE_STAFF,PIConst.ROLE_SAMPLE_ADMIN})
	@RequestMapping(value = "/checkCountReport",method = RequestMethod.GET)
	public ResponseEntity<Integer> checkCountReport(@RequestParam(value = "id", required=false) UUID id) {
		Integer result = service.countResultReport(id);
		return new ResponseEntity<Integer>(result, (result != null) ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
	}

}

package com.globits.PI.rest;

import com.globits.PI.PIConst;
import com.globits.PI.dto.EQASampleDto;
import com.globits.PI.dto.EQASerumBankDto;
import com.globits.PI.dto.EQASerumBottleDto;
import com.globits.PI.functiondto.EQASerumbottleSearchDto;
import com.globits.PI.service.EQASerumBottleService;
import com.globits.core.Constants;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.*;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/SerumBottle")
public class RestEQASerumBottleController {

    @PersistenceContext
    private EntityManager manager;

    @Autowired
    private EQASerumBottleService service;

    @Secured({ Constants.ROLE_ADMIN,Constants.ROLE_USER, PIConst.ROLE_STAFF,PIConst.ROLE_SAMPLE_ADMIN})
    @RequestMapping(value = "searchByDto", method = RequestMethod.POST)
    public ResponseEntity<Page<EQASerumBottleDto>> searchByDto(@RequestBody EQASerumbottleSearchDto dto) {
        Page<EQASerumBottleDto> result = service.searchByDto(dto);
        return new ResponseEntity<Page<EQASerumBottleDto>>(result, (result != null) ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
    }

    @Secured({ Constants.ROLE_ADMIN,Constants.ROLE_USER, PIConst.ROLE_STAFF,PIConst.ROLE_SAMPLE_ADMIN})
    @RequestMapping(method = RequestMethod.POST)
    public ResponseEntity<EQASerumBottleDto> create(@RequestBody EQASerumBottleDto dto) {
        EQASerumBottleDto result = service.saveOrUpdate(dto, null);
        return new ResponseEntity<EQASerumBottleDto>(result, (result != null) ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
    }

    @Secured({ Constants.ROLE_ADMIN,Constants.ROLE_USER, PIConst.ROLE_STAFF,PIConst.ROLE_SAMPLE_ADMIN})
    @RequestMapping(value = "/{id}", method = RequestMethod.PUT)
    public ResponseEntity<EQASerumBottleDto> update(@RequestBody EQASerumBottleDto dto, @PathVariable("id") UUID id) {
        EQASerumBottleDto result = service.saveOrUpdate(dto, id);
        return new ResponseEntity<EQASerumBottleDto>(result, (result != null) ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
    }

    @Secured({Constants.ROLE_ADMIN, PIConst.ROLE_STAFF,PIConst.ROLE_SAMPLE_ADMIN})
    @RequestMapping(value = "getById/{id}", method = RequestMethod.GET)
    public ResponseEntity<EQASerumBottleDto> getById(@PathVariable("id") String id) {
        EQASerumBottleDto result = service.getById(UUID.fromString(id));
        return new ResponseEntity<EQASerumBottleDto>(result, (result != null) ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
    }
    @Secured({Constants.ROLE_ADMIN, PIConst.ROLE_STAFF,PIConst.ROLE_SAMPLE_ADMIN})
    @RequestMapping(value = "/checkCode", method = RequestMethod.GET)
    public ResponseEntity<Boolean> checkDuplicateCode(@RequestParam(value = "id", required=false) UUID id, @RequestParam("code") String code) {
		Boolean result = service.checkDuplicateCode(id, code);
		return new ResponseEntity<Boolean>(result, (result != null) ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
	}
	
    @Secured({Constants.ROLE_ADMIN, PIConst.ROLE_STAFF,PIConst.ROLE_SAMPLE_ADMIN})
    @RequestMapping(value = "/{id}", method = RequestMethod.DELETE)
    public ResponseEntity<Boolean> deleteById(@PathVariable("id") String id) {
        Boolean result = service.deleteById(UUID.fromString(id));
        return new ResponseEntity<Boolean>(result, (result != null) ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
    }

    @Secured({Constants.ROLE_ADMIN, PIConst.ROLE_STAFF,PIConst.ROLE_SAMPLE_ADMIN})
    @RequestMapping(value = "/getBySerumBank", method = RequestMethod.POST)
    public ResponseEntity<List<EQASerumBottleDto>> getBySerumBank(@RequestBody EQASerumBankDto serumBank){
        List<EQASerumBottleDto> result = service.getBySerumBank(serumBank);
        return new ResponseEntity<List<EQASerumBottleDto>>(result, (result != null) ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
    }
    
    @Secured({Constants.ROLE_ADMIN, PIConst.ROLE_STAFF,PIConst.ROLE_SAMPLE_ADMIN})
    @RequestMapping(value = "/saveOrUpdateMultiple/{id}", method = RequestMethod.POST)
    public ResponseEntity<Boolean> saveOrUpdateMultiple(@RequestBody List<EQASerumBottleDto> dtoList, @PathVariable("id") UUID serumBankID){
        service.saveOrUpdateMultiple(dtoList, serumBankID);
        return new ResponseEntity<Boolean>(true, HttpStatus.OK);
    }
}

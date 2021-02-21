package com.globits.PI.rest;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.globits.PI.PIConst;
import com.globits.PI.dto.HealthOrgDto;
import com.globits.PI.functiondto.HealthOrgEQARoundSearchDto;
import com.globits.PI.functiondto.SearchDto;
import com.globits.PI.functiondto.UserInfoDto;
import com.globits.PI.service.UserInHealthOrgService;
import com.globits.core.Constants;
import com.globits.security.dto.UserDto;

@RestController
@RequestMapping("/api/UserInHealthOrg")
public class RestUserInHealthOrgController {
	@Autowired
	UserInHealthOrgService userInHealthOrgService;
	/*@Secured({Constants.ROLE_ADMIN,"ROLE_STUDENT_MANAGERMENT"})
	@RequestMapping(value = "/upload",method = RequestMethod.POST, consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public void saveUploadFile(@RequestParam("uploadfile") MultipartFile file) {
		try {
			byte[] bytes = file.getBytes();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		System.out.println(file.getOriginalFilename()+":"+file.getContentType()+":"+file.getSize());
	}
	
	@PreAuthorize("isAuthenticated()")
	@RequestMapping(value = "/download",method = RequestMethod.GET)
	public void getFile() {
		System.out.println("GET");
	}*/
	@Secured({Constants.ROLE_ADMIN})
	@RequestMapping(value = "/save/{userId}",method = RequestMethod.POST)
	public List<HealthOrgDto> saveHealthOrgByUser(@PathVariable Long userId,@RequestBody List<UUID> healthOrgIds) {
		return userInHealthOrgService.saveHealthOrgByUser(userId, healthOrgIds);
	}
	
	@Secured({Constants.ROLE_ADMIN,PIConst.ROLE_HEALTH_ORG})
	@RequestMapping(value = "/getListHealthOrgByUser/{userId}",method = RequestMethod.GET)
	public List<HealthOrgDto> getListHealthOrgByUser(@PathVariable Long userId){
		return userInHealthOrgService.getListHealthOrgByUser(userId);
	}
	
	@Secured({ Constants.ROLE_ADMIN})
	@RequestMapping(value = "/searchByDto", method = RequestMethod.POST)
	public ResponseEntity<Page<UserDto>> searchByDto(@RequestBody SearchDto dto) {
		Page<UserDto> result = userInHealthOrgService.searchByDto(dto);
		return new ResponseEntity<Page<UserDto>>(result, (result != null) ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
	}
	
	@Secured({Constants.ROLE_ADMIN})
	@RequestMapping(value = "/getUserInfoByUserLogin",method = RequestMethod.GET)
	public UserInfoDto getUserInfoByUserLogin() {
		return userInHealthOrgService.getUserInfoByUserLogin();
	}
	
	@Secured({Constants.ROLE_ADMIN, Constants.ROLE_USER,PIConst.ROLE_HEALTH_ORG, PIConst.ROLE_ADMINISTRATIVE_STAFF, PIConst.ROLE_COORDINATOR, PIConst.ROLE_SAMPLE_ADMIN, PIConst.ROLE_STAFF})
	@RequestMapping(value = "/saveUser",method = RequestMethod.POST)
	public ResponseEntity<UserDto> create(@RequestBody UserDto dto) {
		UserDto result = userInHealthOrgService.updateUser(null, dto);
		return new ResponseEntity<UserDto>(result, (result != null) ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
	}
	
	@Secured({Constants.ROLE_ADMIN, Constants.ROLE_USER,PIConst.ROLE_HEALTH_ORG, PIConst.ROLE_ADMINISTRATIVE_STAFF, PIConst.ROLE_COORDINATOR, PIConst.ROLE_SAMPLE_ADMIN, PIConst.ROLE_STAFF})
	@RequestMapping(value = "/saveUser/{id}",method = RequestMethod.PUT)
	public ResponseEntity<UserDto> update(@RequestBody UserDto dto, @PathVariable("id") Long id) {
		UserDto result = userInHealthOrgService.updateUser(id, dto);
		return new ResponseEntity<UserDto>(result, (result != null) ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
	}
}

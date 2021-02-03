package com.globits.listeners;


import java.io.InputStream;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;

import javax.xml.stream.XMLInputFactory;
import javax.xml.stream.XMLStreamException;
import javax.xml.stream.XMLStreamReader;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationListener;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;

import com.globits.PI.PIConst;
import com.globits.core.dto.PersonDto;
import com.globits.core.utils.CommonUtils;
import com.globits.security.domain.Role;
import com.globits.security.dto.RoleDto;
import com.globits.security.dto.UserDto;
import com.globits.security.service.RoleService;
import com.globits.security.service.UserService;

@Component
public class ApplicationStartupListener implements ApplicationListener<ContextRefreshedEvent>, InitializingBean {

	private static boolean eventFired = false;

	@Autowired
	private RoleService roleService;

	@Autowired
	private UserService userService;
	
	@Autowired
	private Environment env;
//	@Autowired
//	private ResourceDefService resDefService;

	private static final Logger logger = LoggerFactory.getLogger(ApplicationStartupListener.class);

	@Override
	public void onApplicationEvent(ContextRefreshedEvent event) {

		if (eventFired) {
			return;
		}
		
		if(com.globits.core.Constants.FileUploadPath==null) {
			com.globits.core.Constants.FileUploadPath = env.getProperty("fileUploadPath");
		}
		
		logger.info("Application started.");

		eventFired = true;
		
		try {
			createRoles();
		} catch (XMLStreamException e) {
			e.printStackTrace();
		}

		createAdminUser();	
		if(PIConst.PathUploadDocumentAttachment == null) {
			PIConst.PathUploadDocumentAttachment = env.getProperty("documentattachment.file.folder");
		}
	}

	@Override
	public void afterPropertiesSet() throws Exception {
	}

	private void createAdminUser() {

		UserDto userDto = userService.findByUsername(com.globits.core.Constants.USER_ADMIN_USERNAME);

		if (CommonUtils.isNotNull(userDto)) {
			return;
		}

		userDto = new UserDto();
		userDto.setUsername(com.globits.core.Constants.USER_ADMIN_USERNAME);
		//userDto.setPassword(SecurityUtils.getHashPassword("admin"));
		userDto.setPassword("admin");
		userDto.setEmail("admin@globits.net");
		userDto.setActive(true);
		userDto.setDisplayName("Admin User");
		userDto.setRoles(new HashSet<RoleDto>());
		
		Role role = roleService.findByName(com.globits.core.Constants.ROLE_ADMIN);
		userDto.getRoles().add(new RoleDto(role));
		role = roleService.findByName(com.globits.core.Constants.ROLE_SUPER_ADMIN);
		userDto.getRoles().add(new RoleDto(role));
//		userDto.getRoles().addAll(Arrays.asList(new RoleDto(role)));
		
		PersonDto person = new PersonDto();
		person.setGender("M");
		person.setFirstName("Admin");
		person.setLastName("User");
		person.setDisplayName("Admin User");
		
		userDto.setPerson(person);
		
		try {
			userService.save(userDto);
		} catch (Exception ex) {
			ex.printStackTrace();
		}
	}

	private void createRoles() throws XMLStreamException {

		List<String> roleNames = new ArrayList<>();
		List<String> descriptions = new ArrayList<>();
		XMLInputFactory inputFactory = XMLInputFactory.newInstance();
		InputStream in = getClass().getClassLoader().getResourceAsStream("sys-roles.xml");
		XMLStreamReader streamReader = inputFactory.createXMLStreamReader(in, "UTF-8");

		streamReader.nextTag();
		streamReader.nextTag();

		while (streamReader.hasNext()) {
			if (streamReader.isStartElement()) {
				switch (streamReader.getLocalName()) {
					case "name": {
						roleNames.add(streamReader.getElementText());
						break;
					}
					case "description":{
						descriptions.add(streamReader.getElementText());
						break;
					}
				}
			}
			streamReader.next();
		}

		streamReader.close();

		for (int i=0;i<roleNames.size();i++) {
			String roleName =  roleNames.get(i);
			String description = roleName;
			if(descriptions!=null && i<descriptions.size()) {
				description = descriptions.get(i);
			}
			createRoleIfNotExist(roleName,description);	
		}
	}

	private void createRoleIfNotExist(String roleName, String description) {

		if (CommonUtils.isEmpty(roleName)) {
			return;
		}

		Role role = roleService.findByName(roleName);

		if (CommonUtils.isNotNull(role)) {
			return;
		}

		if (role == null) {
			role = new Role();
			role.setName(roleName);
		}

		try {
			roleService.save(role);
		} catch (Exception ex) {
			ex.printStackTrace();
		}
	}
}

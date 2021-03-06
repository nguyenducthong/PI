import static org.junit.Assert.assertTrue;

import javax.transaction.Transactional;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.Page;
import org.springframework.test.context.junit4.SpringRunner;

//import com.globits.PI.repository.HealthOrgRepository;
//import com.globits.PI.repository.TechnicianRepository;
//import com.globits.PI.service.TechnicianService;
import com.globits.config.DatabaseConfig;
import com.globits.security.dto.UserDto;
import com.globits.security.service.UserService;

//@RunWith(SpringRunner.class)
//@SpringBootTest(classes = DatabaseConfig.class)
public class TechnicianTest {

	@Autowired
	UserService service;

//	@Autowired
//	TechnicianService technicianService;
//	
//	@Autowired
//	TechnicianRepository technicianRepository;
//	
//	@Autowired
//	HealthOrgRepository healthOrgRepository;

	
//	@Test
	public void testGetUserWorks() {
		Page<UserDto> page = service.findByPage(1, 10);
		assertTrue(page.getTotalElements() >= 0);
	}
	@Test
	@Transactional
	public void testSave() {
//		HealthOrg healthOrg = new HealthOrg();
//		healthOrg.setName("Test");
//		healthOrg = healthOrgRepository.save(healthOrg);
//		List<Technician> list= technicianRepository.findAll();
//		Technician te = new Technician();
//		HealthOrg healthOrg = healthOrgRepository.getOne(1L);
//		//te.setHealthOrg(healthOrg);
//		te.setDescription("Test");
//		te.setFirstName("Đăng");
//		te = technicianRepository.save(te);
//		System.out.print(te.getId());
	}
}

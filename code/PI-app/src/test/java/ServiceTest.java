import static org.junit.Assert.assertTrue;

import java.util.List;
import java.util.UUID;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.Page;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.globits.PI.domain.EQARound;
import com.globits.PI.domain.EQASampleSet;
//import com.globits.PI.functiondto.EQASampleSetSearchDto;
//import com.globits.PI.functiondto.PivotTableResultConclusionDataDto;
//import com.globits.PI.repository.EQARoundRepository;
//import com.globits.PI.repository.EQASampleSetRepository;
//import com.globits.PI.service.EQAResultReportService;
//import com.globits.PI.service.EQARoundService;
//import com.globits.PI.service.HealthOrgService;
//import com.globits.PI.service.impl.EQAResultReportServiceImpl;
import com.globits.config.DatabaseConfig;
import com.globits.core.utils.CoreDateTimeUtil;
import com.globits.security.dto.UserDto;
import com.globits.security.service.UserService;

@RunWith(SpringRunner.class)
@SpringBootTest(classes = DatabaseConfig.class)
@Transactional(propagation = Propagation.REQUIRED)
public class ServiceTest {

	@Autowired
	UserService service;
//	@Autowired
//	HealthOrgService healthOrgService;
//	@Autowired
//	EQARoundService eqaRoundService;
//	@Autowired
//	EQARoundRepository eQARoundRepository;
//	@Autowired
//	EQASampleSetRepository eQASampleSetRepository;
//	@Autowired
//	EQAResultReportService eQAResultReportService;
	
//	@Test
//	public void testResult() {
//		List<PivotTableResultConclusionDataDto>  ret = eQAResultReportService.getListResultByRoundId( UUID.fromString("d5835747-f23e-49cb-9cdc-246d84e870f3"));
//		if(ret!=null && ret.size()>0) {
//			for (PivotTableResultConclusionDataDto pivotTableResultConclusionDataDto : ret) {
//				System.out.println(pivotTableResultConclusionDataDto.toString());
//			}
//		}
//	}
//	
//	public void test() {
//		List<EQASampleSet> list = eQASampleSetRepository.findAll();
//		System.out.print(list);
//	}
	
	public void testString() {
		String test = "s-0567";
		String ret = test.replace("s", "").replace("S", "").replace("-", "").replace(" ", "").replace("-", "");
		System.out.print(ret);
	}
	
	public void testGetUserWorks() {
		Page<UserDto> page = service.findByPage(1, 10);
		assertTrue(page.getTotalElements() >= 0);
	}
	
	public void intToString() {
		String formatted = String.format("%04d", 3);
		System.out.print(formatted);
	}
//	@Test
//	public void setCodeForAll() {
//		healthOrgService.setCodeForAllHealthOrg();
//	}
////	@Test
//	public void Time() {
//		Integer ret = eqaRoundService.checkOrderNumber(2020);
//		System.out.println(ret);
//		System.out.println(CoreDateTimeUtil.getLastTimeInYear(2020));
//		System.out.println(CoreDateTimeUtil.getFirstTimeInYear(2020));
//	}
}

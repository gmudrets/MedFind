package openu.MedFind;

import lombok.extern.slf4j.Slf4j;
import openu.MedFind.config.FirebaseConfig;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import javax.annotation.PostConstruct;
import java.io.IOException;

@Slf4j
@SpringBootApplication
public class MedFindApplication {

	@PostConstruct
	public void initApp() throws IOException {
		new FirebaseConfig().firebaseInit();
	}

	public static void main(String[] args) {
		SpringApplication.run(MedFindApplication.class, args);
	}

}

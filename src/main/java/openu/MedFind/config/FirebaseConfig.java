package openu.MedFind.config;
import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.util.Objects;

@Slf4j
@Component
public class FirebaseConfig {
    public void firebaseInit() throws IOException {
        var serviceAccount =
                new FileInputStream(new File(Objects.requireNonNull(getClass().getClassLoader().getResource("serviceAccountKey.json")).getFile()));

        var options = FirebaseOptions.builder()
                .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                .build();
        if (FirebaseApp.getApps().isEmpty()) {
            log.info("Initializing firebase");
            FirebaseApp.initializeApp(options);
        }
    }
}

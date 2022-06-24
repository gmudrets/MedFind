package openu.MedFind.scheduled;


import lombok.extern.slf4j.Slf4j;
import openu.MedFind.dto.ActiveAlertType;
import openu.MedFind.dto.AlertType;
import openu.MedFind.dto.AlertsResponse;
import openu.MedFind.repositories.AlertEntryRepository;
import openu.MedFind.repositories.MedicineEntryRepository;
import openu.MedFind.services.WebClientHelper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.stream.Stream;

import static java.time.temporal.ChronoUnit.DAYS;

@Slf4j
@Component
@Configuration
@EnableScheduling
public class AlertsNotificationScheduler {

    private static final long WEEK_DAYS = 7L;
    private static final String FROM_EMAIL = "medfind.alerts@gmail.com";
    private static final String EMAIL_SUBJECT = "MEDFIND ALERT";

    private static final String ONESIGNAL_URL = "https://onesignal.com/api/v1";
    private static final String ONESIGNAL_ENDPOINT = "/notifications";
    @Value("${medfind.alerts.appid}")
    private String ONESIGNAL_APP_ID;
    @Value("${medfind.alerts.authtoken}")
    private String ONESIGNAL_AUTH_TOKEN;


    @Autowired
    SimpMessagingTemplate template;

    @Autowired
    private AlertEntryRepository alertEntryRepository;

    @Autowired
    private JavaMailSender emailSender;

    @Autowired
    private MedicineEntryRepository medicineEntryRepository;

    private List<AlertsResponse> getAllScheduleAlerts() {
        List<AlertsResponse> activeAlerts = new ArrayList<>();

        for (var alert : alertEntryRepository.findAll()) {
            // Delete expired alerts
            if (LocalDateTime.now().isAfter(alert.getAlertExpiration())) {
                alertEntryRepository.delete(alert);
                continue;
            }

            if (alert.getAlertType() == AlertType.FIXED) {
                if (LocalDateTime.now().isAfter(alert.getFixedDate())) {
                    activeAlerts.add(new AlertsResponse(alert.getId(), alert.getAlertName(), alert.getRegNum(),
                            alert.getMedicineHebName(), alert.getUserUuid(), alert.getUserEmail(), ActiveAlertType.SCHEDULE));
                    alertEntryRepository.delete(alert);
                }
            } else {
                var dateNow = LocalDateTime.now();

                if (alert.getDay() == dateNow.getDayOfWeek().getValue() + 1 &&
                        DAYS.between(alert.getLastTriggered(), dateNow) >= WEEK_DAYS * (alert.getWeek() - 1)) {
                    var alertDate = LocalDate.now().atTime(alert.getHour(), alert.getMinute());

                    if (alertDate.isAfter(dateNow)) {
                        activeAlerts.add(new AlertsResponse(alert.getId(), alert.getAlertName(), alert.getRegNum(),
                                alert.getMedicineHebName(), alert.getUserUuid(), alert.getUserEmail(), ActiveAlertType.SCHEDULE));
                        alert.triggered();
                        alert.setLastTriggered(LocalDateTime.now());
                        alertEntryRepository.save(alert);
                    }
                }
            }
        }

        return activeAlerts;
    }

    private List<AlertsResponse> getAllExpirationAlerts() {
        List<AlertsResponse> expirationAlerts = new ArrayList<>();

        var dateNow = new Date();

        for(var medicine : medicineEntryRepository.findAll()) {
            if(!medicine.isExpirationAlertSent() && medicine.getExpiration().after(dateNow)) {
                expirationAlerts.add(new AlertsResponse(0L, medicine.getHebName(), medicine.getRegNum(), medicine.getHebName(),
                        medicine.getUuid(), medicine.getUserEmail(), ActiveAlertType.EXPIRATION));
                medicine.setExpirationAlertSent(true);
                medicineEntryRepository.save(medicine);
            }
        }

        return expirationAlerts;
    }

    @Scheduled(fixedRate = 60000)
    public void scheduleFixedRateTask() {
        for(final var alert : Stream.concat(getAllScheduleAlerts().stream(), getAllExpirationAlerts().stream()).toList()) {
            emailAlert(alert);
            sendBrowserNotification(alert);
        }

    }

    private void emailAlert(AlertsResponse alert) {
        if(alert.userEmail() != null) {
            var message = new SimpleMailMessage();
            message.setFrom(FROM_EMAIL);
            message.setTo(alert.userEmail());
            message.setSubject(EMAIL_SUBJECT);
            message.setText(String.format("%s alert: \n %s \n for Medicine %s \n",
                    alert.alertType().name(), alert.alertName(), alert.medicineHebName()));
            emailSender.send(message);
        }
    }

    private void sendBrowserNotification(AlertsResponse alert) {
        var body = Mono.just(
                String.format("""
                        {
                             "app_id": "%s",
                             "include_external_user_ids": ["%s"],
                             "contents": {
                                  "en": "%s alert: %s for Medicine %s"
                             },
                             "headings": {
                                  "en": "%s"
                             },
                             "channel_for_external_user_ids": "push",
                             "allowLocalhostAsSecureOrigin": "true"
                        }""",
                        ONESIGNAL_APP_ID,
                        alert.user(),
                        alert.alertName(),
                        alert.alertType().name(), alert.alertName(), alert.medicineHebName())
        );

        var result = WebClientHelper.webClientRestPostCallWithAuth(
                ONESIGNAL_URL,
                ONESIGNAL_ENDPOINT,
                body,
                String.class,
                "Basic " + ONESIGNAL_AUTH_TOKEN
        );

        log.info("Browser alert notification response: " + result);
    }
}

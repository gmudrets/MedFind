package openu.MedFind.scheduled;


import openu.MedFind.dto.ActiveAlertsResponse;
import openu.MedFind.dto.AlertType;
import openu.MedFind.repositories.AlertEntryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import static java.time.temporal.ChronoUnit.DAYS;

@Configuration
@EnableScheduling
public class AlertsNotificationScheduler {

    private static final long WEEK_DAYS = 7L;

    @Autowired
    SimpMessagingTemplate template;

    @Autowired
    private AlertEntryRepository alertEntryRepository;

    private List<ActiveAlertsResponse> getAllAlerts() {
        List<ActiveAlertsResponse> activeAlerts = new ArrayList<>();

        var usersAlerts = alertEntryRepository.findAll();

        for (var alert : usersAlerts) {
            // Delete expired alerts
            if (LocalDateTime.now().isAfter(alert.getAlertExpiration())) {
                alertEntryRepository.delete(alert);
                continue;
            }

            if (alert.getAlertType() == AlertType.FIXED) {
                if (LocalDateTime.now().isAfter(alert.getFixedDate())) {
                    activeAlerts.add(new ActiveAlertsResponse(alert.getId(), alert.getAlertName(), alert.getRegNum()));
                    alertEntryRepository.delete(alert);
                }
            } else {
                var dateNow = LocalDateTime.now();

                if (alert.getDay() == dateNow.getDayOfWeek().getValue() &&
                        DAYS.between(alert.getLastTriggered(), dateNow) > WEEK_DAYS * alert.getWeek()) {
                    var alertDate = LocalDate.now().atTime(alert.getHour(), alert.getMinute());

                    if (alertDate.isAfter(dateNow)) {
                        activeAlerts.add(new ActiveAlertsResponse(alert.getId(), alert.getAlertName(), alert.getRegNum()));
                        alert.triggered();
                        alert.setLastTriggered(LocalDateTime.now());
                        alertEntryRepository.save(alert);
                    }
                }
            }
        }

        return activeAlerts;
    }

    @Scheduled(fixedRate = 20000)
    public void scheduleFixedRateTask() {
        template.convertAndSend("/wss-alerts/message", getAllAlerts());
    }

}

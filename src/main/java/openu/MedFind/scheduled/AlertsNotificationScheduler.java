package openu.MedFind.scheduled;


import openu.MedFind.dto.ActiveAlertType;
import openu.MedFind.dto.AlertType;
import openu.MedFind.dto.AlertsResponse;
import openu.MedFind.repositories.AlertEntryRepository;
import openu.MedFind.repositories.MedicineEntryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import static java.time.temporal.ChronoUnit.DAYS;

@Configuration
@EnableScheduling
public class AlertsNotificationScheduler {

    private static final long WEEK_DAYS = 7L;

    @Autowired
    SimpMessagingTemplate template;

    @Autowired
    private AlertEntryRepository alertEntryRepository;

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
                    activeAlerts.add(new AlertsResponse(alert.getId(), alert.getAlertName(), alert.getRegNum(), alert.getUserUuid(), ActiveAlertType.SCHEDULE));
                    alertEntryRepository.delete(alert);
                }
            } else {
                var dateNow = LocalDateTime.now();

                if (alert.getDay() == dateNow.getDayOfWeek().getValue() + 1 &&
                        DAYS.between(alert.getLastTriggered(), dateNow) >= WEEK_DAYS * (alert.getWeek() - 1)) {
                    var alertDate = LocalDate.now().atTime(alert.getHour(), alert.getMinute());

                    if (alertDate.isAfter(dateNow)) {
                        activeAlerts.add(new AlertsResponse(alert.getId(), alert.getAlertName(), alert.getRegNum(), alert.getUserUuid(), ActiveAlertType.SCHEDULE));
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
                expirationAlerts.add(new AlertsResponse(0L, medicine.getHebName(), medicine.getRegNum(), medicine.getUuid(), ActiveAlertType.EXPIRATION));
                medicine.setExpirationAlertSent(true);
                medicineEntryRepository.save(medicine);
            }
        }

        return expirationAlerts;
    }

    @Scheduled(fixedRate = 60000)
    public void scheduleFixedRateTask() {
        var alerts = Stream.concat(getAllScheduleAlerts().stream(), getAllExpirationAlerts().stream())
                .collect(Collectors.toList());

        if(!alerts.isEmpty()) {
            template.convertAndSend("/wss-alerts/message", alerts);
        }
    }

}

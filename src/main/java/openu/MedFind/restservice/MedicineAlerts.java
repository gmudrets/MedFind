package openu.MedFind.restservice;

import com.google.firebase.auth.FirebaseAuthException;
import openu.MedFind.dto.ActiveAlertsResponse;
import openu.MedFind.dto.AlertEntry;
import openu.MedFind.dto.AlertType;
import openu.MedFind.exceptions.TokenException;
import openu.MedFind.repositories.AlertEntryRepository;
import openu.MedFind.services.FirebaseValidator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import static java.time.temporal.ChronoUnit.DAYS;

// To allow access to nodejs local instance for development purposes
@CrossOrigin(origins = "https://localhost:3000")
@RestController
public class MedicineAlerts {

    @Autowired
    private AlertEntryRepository alertEntryRepository;

    private static final long WEEK_DAYS = 7L;


    @SafeVarargs
    private static boolean listsSizeEqual(List<Integer>... values) {
        if (values.length == 0) {
            return true;
        }
        var checkedValue = values[0].size();

        for (var i = 1; i < values.length; i++) {
            if (values[i].size() != checkedValue) {
                return false;
            }
        }
        return true;
    }

    @GetMapping("/api/AddFixedAlert")
    public void AddFixedAlert(@RequestHeader(name = "idToken", required = false) String idToken,
                              @RequestParam String alertName,
                              @RequestParam String regNum,
                              @RequestParam @DateTimeFormat(pattern = "dd.MM.yyyy-HH:mm") LocalDateTime alertExpiration,
                              @RequestParam @DateTimeFormat(pattern = "dd.MM.yyyy-HH:mm") List<LocalDateTime> fixedDateList) throws TokenException {

        String uuid;

        try {
            uuid = FirebaseValidator.getUidFromIdToken(idToken);
        } catch (FirebaseAuthException e) {
            throw new TokenException("User not found.", e);
        }

        var alertUuid = UUID.randomUUID();

        for (var date : fixedDateList) {
            alertEntryRepository.save(AlertEntry.builder()
                    .userUuid(uuid)
                    .alertName(alertName)
                    .regNum(regNum)
                    .alertUuid(alertUuid)
                    .alertExpiration(alertExpiration)
                    .fixedDate(date)
                    .lastTriggered(LocalDateTime.now())
                    .alertType(AlertType.FIXED)
                    .build()
            );
        }
    }

    @GetMapping("/api/AddScheduleAlert")
    public void AddScheduleAlert(@RequestHeader(name = "idToken", required = false) String idToken,
                                 @RequestParam String alertName,
                                 @RequestParam String regNum,
                                 @RequestParam @DateTimeFormat(pattern = "dd.MM.yyyy-HH:mm") LocalDateTime alertExpiration,
                                 @RequestParam List<Integer> days,
                                 @RequestParam List<Integer> hours,
                                 @RequestParam List<Integer> minutes,
                                 @RequestParam List<Integer> weeks
    ) throws TokenException {

        String uuid;

        try {
            uuid = FirebaseValidator.getUidFromIdToken(idToken);
        } catch (FirebaseAuthException e) {
            throw new TokenException("User not found.", e);
        }

        if (!listsSizeEqual(days, hours, minutes, weeks)) {
            throw new IllegalArgumentException("Schedule lists should have the same number of elements");
        }

        var alertUuid = UUID.randomUUID();

        for (var i = 0; i < days.size(); i++) {
            var day = days.get(i);
            var hour = hours.get(i);
            var minute = minutes.get(i);
            var week = weeks.get(i);

            if (day <= 0 || hour <= 0 || minute <= 0 || week <= 0) {
                throw new IllegalArgumentException("time cannot be <= 0");
            }

            alertEntryRepository.save(AlertEntry.builder()
                    .userUuid(uuid)
                    .alertName(alertName)
                    .regNum(regNum)
                    .alertUuid(alertUuid)
                    .alertExpiration(alertExpiration)
                    .day(day)
                    .hour(hour)
                    .minute(minute)
                    .week(week)
                    .lastTriggered(LocalDateTime.now())
                    .alertType(AlertType.SCHEDULE)
                    .build()
            );
        }
    }

    @GetMapping("/api/DeleteAlertById")
    public void DeleteAlertById(@RequestHeader(name = "idToken", required = false) String idToken,
                                @RequestParam Long id) throws TokenException {

        if(!FirebaseValidator.isIdTokenValid(idToken)) {
            throw new TokenException("User not found.");
        }

        alertEntryRepository.deleteById(id);
    }


    @GetMapping("/api/GetUserAlertsList")
    public List<AlertEntry> GetUserAlertsList(@RequestHeader(name = "idToken", required = false) String idToken) throws TokenException {

        try {
            return alertEntryRepository.findAllByUserUuid(FirebaseValidator.getUidFromIdToken(idToken));
        } catch (FirebaseAuthException e) {
            throw new TokenException("User not found.", e);
        }
    }

    @GetMapping("/api/GetActiveAlerts")
    public List<ActiveAlertsResponse> GetActiveAlerts(@RequestHeader(name = "idToken", required = false) String idToken) throws TokenException {

        List<AlertEntry> userAlerts;
        List<ActiveAlertsResponse> activeAlerts = new ArrayList<>();

        try {
            userAlerts = alertEntryRepository.findAllByUserUuid(FirebaseValidator.getUidFromIdToken(idToken));
        } catch (FirebaseAuthException e) {
            throw new TokenException("User not found.", e);
        }

        for (var alert : userAlerts) {

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
}
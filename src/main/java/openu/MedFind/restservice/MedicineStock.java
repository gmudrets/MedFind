package openu.MedFind.restservice;

import com.google.firebase.auth.FirebaseAuthException;
import openu.MedFind.dto.MedicineEntry;
import openu.MedFind.dto.MedicineUnits;
import openu.MedFind.exceptions.TokenException;
import openu.MedFind.repositories.MedicineEntryRepository;
import openu.MedFind.services.FirebaseValidator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.validation.constraints.Min;
import java.util.Date;
import java.util.List;

@CrossOrigin(origins = "https://localhost:3000")
@RestController
@Validated
public class MedicineStock {

    @Autowired
    private MedicineEntryRepository medicineEntryRepository;

    private boolean isEntryBelongToUser(String uuid, Long id) {
        return medicineEntryRepository.existsByIdAndUuid(id, uuid);
    }

    @GetMapping("/api/AddMedicineToStock")
    public void AddMedicineToStock(@RequestHeader(name = "idToken", required = false) String idToken,
                                     @RequestParam String drugRegNum,
                                     @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) Date expiration,
                                     @RequestParam MedicineUnits units,
                                     @RequestParam @Min(1) int count,
                                     @RequestParam boolean shared) throws TokenException {

        String uuid;

        try {
            uuid = FirebaseValidator.getUidFromIdToken(idToken);
        } catch (FirebaseAuthException e) {
            throw new TokenException("User not found.", e);
        }

        medicineEntryRepository.save(MedicineEntry.builder()
                .regNum(drugRegNum)
                .expiration(expiration)
                .units(units)
                .count(count)
                .shared(shared)
                .uuid(uuid)
                .build());
    }

    @GetMapping("/api/DeleteMedicineFromStock")
    public void DeleteMedicineFromStock(@RequestHeader(name = "idToken", required = false) String idToken,
                                   @RequestParam Long id) throws TokenException {

        String uuid;

        try {
            uuid = FirebaseValidator.getUidFromIdToken(idToken);
        } catch (FirebaseAuthException e) {
            throw new TokenException("User not found.", e);
        }

        if(!isEntryBelongToUser(uuid, id)) {
            throw new IllegalAccessError("id does not exist or user is not authorized to delete it");
        }

        medicineEntryRepository.deleteById(id);
    }

    @GetMapping("/api/UpdateMedicineInStock")
    public void UpdateMedicineInStock(@RequestHeader(name = "idToken", required = false) String idToken,
                                   @RequestParam String drugRegNum,
                                   @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) Date expiration,
                                   @RequestParam MedicineUnits units,
                                   @RequestParam @Min(1) int count,
                                   @RequestParam boolean shared) throws TokenException {

        String uuid;

        try {
            uuid = FirebaseValidator.getUidFromIdToken(idToken);
        } catch (FirebaseAuthException e) {
            throw new TokenException("User not found.", e);
        }

        var entry = medicineEntryRepository.findByRegNumAndUuid(drugRegNum, uuid);

        if(entry != null) {
            entry.setExpiration(expiration);
            entry.setUnits(units);
            entry.setCount(count);
            entry.setShared(shared);
            medicineEntryRepository.save(entry);
        }
    }

    @GetMapping("/api/GetAllUserStockMedicine")
    public List<MedicineEntry> GetAllUserStockMedicine(@RequestHeader(name = "idToken", required = false) String idToken) throws TokenException {
        String uuid;

        try {
            uuid = FirebaseValidator.getUidFromIdToken(idToken);
        } catch (FirebaseAuthException e) {
            throw new TokenException("User not found.", e);
        }

        return medicineEntryRepository.findAllByUuid(uuid);
    }


}

package openu.MedFind.restservice;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import openu.MedFind.dto.BrochureResults;
import openu.MedFind.dto.MedicineResults;
import openu.MedFind.dto.RequestBrochureByDrugRegNum;
import openu.MedFind.dto.RequestMedicineByName;
import openu.MedFind.exceptions.TokenException;
import openu.MedFind.services.FirebaseValidator;
import openu.MedFind.services.WebClientHelper;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

// To allow access to nodejs local instance for development purposes
@CrossOrigin(origins = "https://localhost:3000")
@RestController
public class MedicineQuery {

    private static final String HEALTH_MINISTRY_SITE = "https://israeldrugs.health.gov.il/GovServiceList/IDRServer";
    private static final String SEARCH_BY_NAME_ENDPOINT = "/SearchByName";
    private static final String GET_SPECIFIC_DRUG_ENDPOINT = "/GetSpecificDrug";

    @GetMapping("/api/SearchMedicine")
    public MedicineResults SearchMedicine(@RequestHeader(name = "idToken") String idToken,
                                          @RequestParam String name,
                                          @RequestParam boolean prescription,
                                          @RequestParam int pageIndex) throws JsonProcessingException, TokenException {

        if(!FirebaseValidator.isIdTokenValid(idToken)){
            throw new TokenException("User not found.");
        }
        var response = WebClientHelper.webClientRestCall(
                HEALTH_MINISTRY_SITE,
                SEARCH_BY_NAME_ENDPOINT,
                Mono.just(new RequestMedicineByName(name, prescription, false, pageIndex, 0)),
                RequestMedicineByName.class
        );

        return new ObjectMapper().readValue(response, MedicineResults.class);
    }

    @GetMapping("/api/GetBrochure")
    public BrochureResults GetBrochure(@RequestHeader(name = "idToken") String idToken,
                                       @RequestParam String drugRegNum) throws JsonProcessingException, TokenException {

        if(!FirebaseValidator.isIdTokenValid(idToken)){
            throw new TokenException("User not found.");
        }

        var response = WebClientHelper.webClientRestCall(
                HEALTH_MINISTRY_SITE,
                GET_SPECIFIC_DRUG_ENDPOINT,
                Mono.just(new RequestBrochureByDrugRegNum(drugRegNum)),
                RequestBrochureByDrugRegNum.class
        );

        return new ObjectMapper().readValue(response, BrochureResults.class);
    }
}


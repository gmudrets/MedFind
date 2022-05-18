package openu.MedFind.restservice;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import openu.MedFind.dto.*;
import openu.MedFind.exceptions.TokenException;
import openu.MedFind.services.FirebaseValidator;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClient.RequestBodySpec;
import org.springframework.web.reactive.function.client.WebClient.RequestHeadersSpec;
import org.springframework.web.reactive.function.client.WebClient.UriSpec;
import reactor.core.publisher.Mono;

import java.time.Duration;
import java.time.temporal.ChronoUnit;
import java.util.Collections;

// To allow access to nodejs local instance for development purposes
@CrossOrigin(origins = "https://localhost:3000")
@RestController
public class MedicineQuery {

    private static final Duration WEB_CLIENT_TIMEOUT = Duration.of(1, ChronoUnit.MINUTES);
    private static final String HEALTH_MINISTRY_SITE = "https://israeldrugs.health.gov.il/GovServiceList/IDRServer";
    private static final String SEARCH_BY_NAME_ENDPOINT = "/SearchByName";
    private static final String SEARCH_GENERIC = "/SearchGeneric";
    private static final String GET_SPECIFIC_DRUG_ENDPOINT = "/GetSpecificDrug";


    private <T> String webClientRestCall(String url, String uri, Mono<T> body, Class<T> clazz) {
        var client = WebClient.builder()
                .baseUrl(url)
                .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .defaultUriVariables(Collections.singletonMap("url", url))
                .build();

        UriSpec<RequestBodySpec> uriSpec = client.post();
        RequestBodySpec bodySpec = uriSpec.uri(uri);
        RequestHeadersSpec<?> headersSpec = bodySpec.body(body, clazz);

        return headersSpec.retrieve().bodyToMono(String.class).block(WEB_CLIENT_TIMEOUT);
    }

    @GetMapping("/api/SearchMedicine")
    public MedicineResults SearchMedicine(@RequestHeader(name = "idToken", required = true) String idToken,
                                          @RequestParam(required = true) String name,
                                          @RequestParam(required = true) boolean prescription,
                                          @RequestParam(required = true) int pageIndex) throws JsonProcessingException, TokenException {

        if(!FirebaseValidator.isIdTokenValid(idToken)){
            throw new TokenException("User not found.");
        }
        var response = webClientRestCall(
                HEALTH_MINISTRY_SITE,
                SEARCH_BY_NAME_ENDPOINT,
                Mono.just(new RequestMedicineByName(name, prescription, false, pageIndex, 0)),
                RequestMedicineByName.class
        );

        return new ObjectMapper().readValue(response, MedicineResults.class);
    }

    @GetMapping("/api/GetBrochure")
    public BrochureResults GetBrochure(@RequestHeader(name = "idToken", required = true) String idToken,
                                       @RequestParam(required = true) String drugRegNum) throws JsonProcessingException, TokenException {

        if(!FirebaseValidator.isIdTokenValid(idToken)){
            throw new TokenException("User not found.");
        }

        var response = webClientRestCall(
                HEALTH_MINISTRY_SITE,
                GET_SPECIFIC_DRUG_ENDPOINT,
                Mono.just(new RequestBrochureByDrugRegNum(drugRegNum)),
                RequestBrochureByDrugRegNum.class
        );

        return new ObjectMapper().readValue(response, BrochureResults.class);
    }

    @GetMapping("/api/SearchGeneric")
    public MedicineResults SearchGeneric(@RequestParam String val,
                                         @RequestParam String name,
                                         @RequestParam int pageIndex) throws JsonProcessingException {

        String response = webClientRestCall(
                HEALTH_MINISTRY_SITE,
                SEARCH_GENERIC,
                Mono.just(new RequestGenericMedicine(val, name, null, null, null, pageIndex, 1)),
                RequestGenericMedicine.class
        );
        String results = "{\"results\":" +response+ "}";
        return new ObjectMapper().readValue(results, MedicineResults.class);
    }
}


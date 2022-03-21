package openu.MedFind.restservice;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import openu.MedFind.dto.MedicineResults;
import openu.MedFind.dto.RequestMedicineByName;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClient.RequestBodySpec;
import org.springframework.web.reactive.function.client.WebClient.RequestHeadersSpec;
import org.springframework.web.reactive.function.client.WebClient.UriSpec;
import reactor.core.publisher.Mono;

import java.time.Duration;
import java.time.temporal.ChronoUnit;
import java.util.Collections;

@RestController
public class MedicineQuery {

    private static final Duration WEB_CLIENT_TIMEOUT = Duration.of(1, ChronoUnit.MINUTES);
    private static final String HEALTH_MINISTRY_SITE = "https://israeldrugs.health.gov.il/GovServiceList/IDRServer";
    private static final String SEARCH_BY_NAME_ENDPOINT = "/SearchByName";


    private <T> String webClientRestCall(String url, String uri, Mono<T> body, Class<T> clazz) {
        var client = WebClient.builder()
                .baseUrl(url)
                .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .defaultUriVariables(Collections.singletonMap("url", url))
                .build();

        UriSpec<RequestBodySpec> uriSpec = client.post();
        RequestBodySpec bodySpec = uriSpec.uri(SEARCH_BY_NAME_ENDPOINT);
        RequestHeadersSpec<?> headersSpec = bodySpec.body(body, clazz);

        return headersSpec.retrieve().bodyToMono(String.class).block(WEB_CLIENT_TIMEOUT);
    }



    @GetMapping("/api/SearchMedicine")
    public MedicineResults SearchMedicine(@RequestParam String name,
                                 @RequestParam boolean prescription,
                                 @RequestParam int pageIndex) throws JsonProcessingException {

        String response = webClientRestCall(
                HEALTH_MINISTRY_SITE,
                SEARCH_BY_NAME_ENDPOINT,
                Mono.just(new RequestMedicineByName(name, prescription, false, pageIndex, 0)),
                RequestMedicineByName.class
        );

        return new ObjectMapper().readValue(response, MedicineResults.class);
    }
}

package openu.MedFind.services;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import reactor.core.publisher.Mono;

import java.time.Duration;
import java.time.temporal.ChronoUnit;
import java.util.Collections;

public class WebClientHelper {

    private static final Duration WEB_CLIENT_TIMEOUT = Duration.of(1, ChronoUnit.MINUTES);

    public static <T> String webClientRestCall(String url, String uri, Mono<T> body, Class<T> clazz) {
        var client = org.springframework.web.reactive.function.client.WebClient.builder()
                .baseUrl(url)
                .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .defaultUriVariables(Collections.singletonMap("url", url))
                .build();

        org.springframework.web.reactive.function.client.WebClient.UriSpec<org.springframework.web.reactive.function.client.WebClient.RequestBodySpec> uriSpec = client.post();
        org.springframework.web.reactive.function.client.WebClient.RequestBodySpec bodySpec = uriSpec.uri(uri);
        org.springframework.web.reactive.function.client.WebClient.RequestHeadersSpec<?> headersSpec = bodySpec.body(body, clazz);

        return headersSpec.retrieve().bodyToMono(String.class).block(WEB_CLIENT_TIMEOUT);
    }
}

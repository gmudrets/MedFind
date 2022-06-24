package openu.MedFind.services;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClient.RequestBodySpec;
import org.springframework.web.reactive.function.client.WebClient.RequestHeadersSpec;
import org.springframework.web.reactive.function.client.WebClient.UriSpec;
import reactor.core.publisher.Mono;

import java.time.Duration;
import java.time.temporal.ChronoUnit;
import java.util.Collections;

public class WebClientHelper {

    private static final Duration WEB_CLIENT_TIMEOUT = Duration.of(1, ChronoUnit.MINUTES);

    public static <T> String webClientRestPostCall(String url, String uri, Mono<T> body, Class<T> clazz) {
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

    public static <T> String webClientRestPostCallWithAuth(String url, String uri, Mono<T> body, Class<T> clazz, String authHeader) {
        var client = WebClient.builder()
                .baseUrl(url)
                .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .defaultHeader(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON_VALUE)
                .defaultHeader(HttpHeaders.AUTHORIZATION, authHeader)
                .defaultUriVariables(Collections.singletonMap("url", url))
                .build();

        UriSpec<RequestBodySpec> uriSpec = client.post();
        RequestBodySpec bodySpec = uriSpec.uri(uri);
        RequestHeadersSpec<?> headersSpec = bodySpec.body(body, clazz);

        return headersSpec.retrieve().bodyToMono(String.class).block(WEB_CLIENT_TIMEOUT);
    }

}

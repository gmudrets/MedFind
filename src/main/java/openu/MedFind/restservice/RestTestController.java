package openu.MedFind.restservice;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class RestTestController {

    @GetMapping("/api/hello")
    public String hello() {
        return "Hello cruel world :D";
    }
}

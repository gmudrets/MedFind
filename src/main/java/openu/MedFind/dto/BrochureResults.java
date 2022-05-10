package openu.MedFind.dto;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import openu.MedFind.deserializers.BrochureResultDeserializer;


@JsonDeserialize(using = BrochureResultDeserializer.class)
public record BrochureResults(
        String consumerBrochure,
        String doctorBrochure){
}

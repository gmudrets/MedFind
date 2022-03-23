package openu.MedFind.dto;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import openu.MedFind.deserializers.MedicineResultsDeserializer;

import java.util.List;


@JsonDeserialize(using = MedicineResultsDeserializer.class)
public record MedicineResults(List<Result> results) {

    public void add(Result result) {
        results.add(result);
    }

    public record Result(String dragRegNum,
                         String dragHebName,
                         String dosageForm,
                         String dragEnName,
                         List<String> activeComponents,
                         List<String> images,
                         double customerPrice,
                         boolean health,
                         String activeComponentsDisplayName,
                         String barcodes,
                         boolean prescription,
                         String secondarySymptom) {
    }
}

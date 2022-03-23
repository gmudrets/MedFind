package openu.MedFind.deserializers;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.deser.std.StdDeserializer;
import openu.MedFind.dto.MedicineResults;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

public class MedicineResultsDeserializer extends StdDeserializer<MedicineResults> {
    public MedicineResultsDeserializer() {
        this(null);
    }

    public MedicineResultsDeserializer(Class<?> vc) {
        super(vc);
    }

    @Override
    public MedicineResults deserialize(JsonParser jsonParser, DeserializationContext deserializationContext)
            throws IOException {

        var resultsNode = (JsonNode) jsonParser.getCodec().readTree(jsonParser).get("results");
        var medicineResults = new MedicineResults(new ArrayList<>());

        if (resultsNode.isArray()) {
            for (final var objNode : resultsNode) {

                List<String> activeComponents = new ArrayList<>();
                List<String> images = new ArrayList<>();
                objNode.get("activeComponents").forEach(node -> activeComponents.add(node.get("componentName").asText()));
                objNode.get("images").forEach(node -> images.add(node.get("url").asText()));

                medicineResults.add(new MedicineResults.Result(
                        objNode.get("dragRegNum").asText(),
                        objNode.get("dragHebName").asText(),
                        objNode.get("dosageForm").asText(),
                        objNode.get("dragEnName").asText(),
                        activeComponents,
                        images,
                        objNode.get("customerPrice").asDouble(),
                        objNode.get("health").asBoolean(),
                        objNode.get("activeComponentsDisplayName").asText(),
                        objNode.get("barcodes").asText(),
                        objNode.get("prescription").asBoolean(),
                        objNode.get("secondarySymptom").asText()
                ));
            }
        }

        return medicineResults;
    }
}

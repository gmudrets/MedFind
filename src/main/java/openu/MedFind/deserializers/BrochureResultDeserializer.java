package openu.MedFind.deserializers;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.deser.std.StdDeserializer;
import openu.MedFind.dto.BrochureResults;
import openu.MedFind.dto.MedicineResults;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

public class BrochureResultDeserializer extends StdDeserializer<BrochureResults> {
    public BrochureResultDeserializer() {
        this(null);
    }

    public BrochureResultDeserializer(Class<?> vc) {
        super(vc);
    }

    @Override
    public BrochureResults deserialize(JsonParser jsonParser, DeserializationContext deserializationContext)
            throws IOException {

        var resultsNode = (JsonNode) jsonParser.getCodec().readTree(jsonParser).get("brochure");
        BrochureResults brochureResults = null;

        if (resultsNode.isArray()) {
            String consumerUrl = null;
            String doctorUrl = null;
            for (final var objNode : resultsNode) {
                String type = objNode.get("type").asText();
                String lng = objNode.get("lng").asText();
                if (lng.equals("עברית")){
                    if (type.equals("עלון לצרכן")){
                        consumerUrl = objNode.get("url").asText();
                    }
                    else if (type.equals("עלון לרופא")){
                        doctorUrl = objNode.get("url").asText();
                    }
                }
            }
            brochureResults = new BrochureResults(consumerUrl, doctorUrl);
        }

        return brochureResults;
    }
}

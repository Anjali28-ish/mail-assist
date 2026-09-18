
        package com.email.writer.service;

import com.email.writer.dto.EmailRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

import java.util.HashMap;
import java.util.Map;

@Service
public class EmailGeneratorService {

    private final WebClient webClient;
    private final String apiKey;
    private final ObjectMapper objectMapper;

    public EmailGeneratorService(
            WebClient.Builder webClientBuilder,
            @Value("${gemini.api.url}") String baseUrl,
            @Value("${gemini.api.key}") String geminiApiKey) {

        this.webClient = webClientBuilder
                .baseUrl(baseUrl)
                .build();

        this.apiKey = geminiApiKey;
        this.objectMapper = new ObjectMapper();
    }

    public String generateEmailReply(EmailRequest emailRequest) {

        // Build prompt
        String prompt = buildPrompt(emailRequest);

        try {

            // Build JSON safely using ObjectMapper
            Map<String, Object> requestBody = new HashMap<>();

            requestBody.put("model", "gemini-3.8-flash");
            requestBody.put("input", prompt);

            String jsonRequest = objectMapper.writeValueAsString(requestBody);

            System.out.println("Gemini Request Body:");
            System.out.println(jsonRequest);

            // Send request to Gemini
            String response = webClient.post()
                    .uri(uriBuilder -> uriBuilder
                            .path("/v1beta/interactions")
                            .build())
                    .header("x-goog-api-key", apiKey)
                    .header("Content-Type", "application/json")
                    .bodyValue(jsonRequest)
                    .retrieve()

                    // IMPORTANT:
                    // Print Gemini's actual error instead of hiding it
                    .onStatus(
                            status -> status.isError(),
                            clientResponse -> clientResponse
                                    .bodyToMono(String.class)
                                    .flatMap(errorBody -> {

                                        System.err.println(
                                                "GEMINI API ERROR: "
                                                        + errorBody
                                        );

                                        return reactor.core.publisher.Mono.error(
                                                new RuntimeException(
                                                        "Gemini API Error: "
                                                                + errorBody
                                                )
                                        );
                                    })
                    )

                    .bodyToMono(String.class)
                    .block();

            System.out.println("Gemini Response:");
            System.out.println(response);

            // Extract generated reply
            return extractResponseContent(response);

        } catch (Exception e) {

            System.err.println(
                    "Email generation failed: "
                            + e.getMessage()
            );

            throw new RuntimeException(
                    "Failed to generate email reply",
                    e
            );
        }
    }

    private String extractResponseContent(String response) {

        try {

            JsonNode root = objectMapper.readTree(response);

            JsonNode steps = root.path("steps");

            if (!steps.isArray() || steps.isEmpty()) {
                throw new RuntimeException(
                        "Gemini response does not contain steps."
                );
            }

            // Find model_output step
            for (JsonNode step : steps) {

                if ("model_output".equals(
                        step.path("type").asText()
                )) {

                    JsonNode content = step.path("content");

                    if (content.isArray() && !content.isEmpty()) {

                        for (JsonNode contentItem : content) {

                            if ("text".equals(
                                    contentItem.path("type").asText()
                            )) {

                                return contentItem
                                        .path("text")
                                        .asText();
                            }
                        }
                    }
                }
            }

            throw new RuntimeException(
                    "No generated text found in Gemini response."
            );

        } catch (Exception e) {

            throw new RuntimeException(
                    "Failed to parse Gemini response: "
                            + response,
                    e
            );
        }
    }

    private String buildPrompt(EmailRequest emailRequest) {

        StringBuilder prompt = new StringBuilder();

        prompt.append(
                "Generate a professional email reply for the following email.\n"
        );

        if (emailRequest.getTone() != null
                && !emailRequest.getTone().isEmpty()) {

            prompt.append("Use a ")
                    .append(emailRequest.getTone())
                    .append(" tone.\n");
        }

        prompt.append("\nOriginal Email:\n")
                .append(emailRequest.getEmailContent());

        return prompt.toString();
    }
}


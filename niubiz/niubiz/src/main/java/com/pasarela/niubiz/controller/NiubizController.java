package com.pasarela.niubiz.controller;

import com.pasarela.niubiz.service.NiubizService;
import com.pasarela.niubiz.service.TokenStorageService;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException; 
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

@RestController
@RequestMapping("/api/niubiz")
@CrossOrigin(origins = "http://localhost:5173/")
public class NiubizController {

    private final NiubizService niubizService;
    private final TokenStorageService tokenStorageService;

    public NiubizController(NiubizService niubizService, TokenStorageService tokenStorageService) {
        this.niubizService = niubizService;
        this.tokenStorageService = tokenStorageService;
    }
    // Endpoint para generar token de sesion
    @PostMapping("/generate-session-token")
    public ResponseEntity<Map<String, Object>> generateSessionToken(@RequestBody Map<String, Object> requestBody) {
        Map<String, Object> response = new HashMap<>();
        try {

            double amount = ((Number) requestBody.get("amount")).doubleValue();

            //  Guardamos el monto total(amount) en el TSS(no ideal)
            tokenStorageService.storeAmount(amount);

            // Generar token de acceso
            String accessToken = niubizService.generateAccessToken();
            // Guardamos el token de acceso en el TSS
            tokenStorageService.storeAccessToken(accessToken);
            response.put("accessToken", accessToken);
            System.out.println("Access Token generado: " + accessToken);

            // Generar token de sesión
            String sessionToken = niubizService.generateSessionToken(accessToken, amount);
            response.put("sessionToken", sessionToken);
            System.out.println("Session Token generado: " + sessionToken);

            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            // En caso de error
            response.put("error", "Error al generar los tokens de acceso y sesion");
            return ResponseEntity.status(500).body(response);
        }
    }
    // Endpoint para recibir repuesta del fomulario de pago de niubiz
    @PostMapping(value = "/response-form", consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE)
    public ResponseEntity<String> handleFormUrlEncodedResponse(
            @RequestParam Map<String, String> formData,
            HttpServletResponse response) {
        try {
            String channel = formData.get("channel");
            if (Objects.equals(channel, "web")){
                String transactionToken = formData.get("transactionToken");
                String customerEmail = formData.get("customerEmail");
                System.out.println("Transaction Token: " + transactionToken);
                System.out.println("customerEmail: " + customerEmail);

                // Guardamos el token de transacion en el TSS
                tokenStorageService.storeTransactionToken(transactionToken);
            }

            // Redireccion inmediata a la web luego de recibir la respuesta
            response.sendRedirect("http://localhost:5173/response");

            return ResponseEntity.ok("Respuesta procesada correctamente");

        // Redirigir en caso de error (aun no configurado)
        } catch (Exception e) {
            try {
                response.sendRedirect("http://localhost:5173/error");
            } catch (IOException ioException) {
                ioException.printStackTrace();
            }
            return ResponseEntity.ok("Error en el pago, intenta nuevamente");
        }
    }

    // Endpoint para generar el token de autorización(último token)
    @PostMapping("/generate-authorization-token")
    public ResponseEntity<Map<String, Object>> generateAuthorizationToken(
            @RequestParam String purchaseNumber) {
        Map<String, Object> response = new HashMap<>();
        // Recuperamos los token de scceso y transaccion
        String accessToken = tokenStorageService.getAccessToken();
        String transactionId = tokenStorageService.getTransactionToken();
        System.out.println("Token de acceso auth: " + accessToken);
        System.out.println("Transaction Id auth: " + transactionId);
        try {
            //data para la autorización
            Map<String, Object> order = Map.of(
                    "tokenId", transactionId,
                    "purchaseNumber", purchaseNumber,
                    "amount", tokenStorageService.getAmount(),
                    "currency", "PEN"
            );

            // Generamos el token de autorizacion
            Map<String, Object> authorizationResponse = niubizService.generateAuthorizationToken(accessToken, order);
            response.putAll(authorizationResponse);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // timeout
    @GetMapping("/timeout")
    public ResponseEntity<String> handleTimeout(@RequestParam("id") String purchaseNumber) {
        try {
            return ResponseEntity.ok("Tiempo de espera manejado correctamente.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al manejar el tiempo de espera: " + e.getMessage());
        }
    }
}
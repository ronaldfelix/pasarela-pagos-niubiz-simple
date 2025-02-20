package com.pasarela.niubiz.service;

import org.springframework.stereotype.Service;

@Service
public class TokenStorageService {
    private String accessToken;
    private String transactionToken;
    private Double amount;

    public void storeAccessToken(String acessToken) {
        this.accessToken = acessToken;
    }
    public void storeTransactionToken(String transactionToken) {
        this.transactionToken = transactionToken;
    }
    public void storeAmount(Double amount) {
        this.amount = amount;
    }

    public String getAccessToken() {
        if (this.accessToken == null) {
            throw new RuntimeException("Access Token no válido");
        }
        return this.accessToken;
    }
    public String getTransactionToken() {
        if (this.transactionToken == null) {
            throw new RuntimeException("Transaction Token no válido");
        }
        return this.transactionToken;
    }
    public Double getAmount() {
        if (this.amount == 0.0d) {
            throw new RuntimeException("Amount no válido");
        }
        return this.amount;
    }
}
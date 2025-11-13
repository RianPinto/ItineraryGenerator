package com.dds.api_gateway;


import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.KeyFactory;
import java.security.PublicKey;
import java.security.spec.X509EncodedKeySpec;
import java.util.Base64;

@Component
public class JwtPublicKeyProvider {

    private final PublicKey publicKey;

    public JwtPublicKeyProvider(@Value("${jwt.public-key}") String publicKeyProperty) throws Exception {
        String key = publicKeyProperty
                .replace("\\n", "\n") // Convert escaped newlines to real newlines
                .replace("-----BEGIN PUBLIC KEY-----", "")
                .replace("-----END PUBLIC KEY-----", "")
                .replaceAll("\\s+", ""); // Remove extra whitespace

        byte[] decoded = Base64.getDecoder().decode(key);
        X509EncodedKeySpec spec = new X509EncodedKeySpec(decoded);
        this.publicKey = KeyFactory.getInstance("RSA").generatePublic(spec);
    }

    public PublicKey getPublicKey() {
        return publicKey;
    }
}
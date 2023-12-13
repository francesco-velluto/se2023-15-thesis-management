const { v4: uuidv4 } = require('uuid');

config = {
    saml: {
        cert: "MIIDHTCCAgWgAwIBAgIJE/DEl64RrFP3MA0GCSqGSIb3DQEBCwUAMCwxKjAoBgNVBAMTIWRldi04NGRucm13bnN3Z3piZjUyLmV1LmF1dGgwLmNvbTAeFw0yMzExMjkyMTAxNDVaFw0zNzA4MDcyMTAxNDVaMCwxKjAoBgNVBAMTIWRldi04NGRucm13bnN3Z3piZjUyLmV1LmF1dGgwLmNvbTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAIZdYBOMUxlbTFPWUpS4cL1ymzgtqwotiRvkrtPReKUXDLu6JZAvFe2nJzy5GaZCs4fhpumRPaVoaiYFDCz20s2X3sX7UCLnDK+x8Pmh5VeQXc2y5MGl45yJCwBFXe2f+HataLFvWaX1AKC0t7AGdEdrxZDq8yJ8ajWqxxehyH0jrOK2QQ2rdOjdncvx8YM4Oo14+qEkcm/tOqHWS0pylhRr5TvLFvVn/LbHLVkaoIJs7Y9K/h1K6VrT1y5VM8AVZyZmE1TwdVFZf2fPoDO11flAt08sHPfA1Gw3Uub/WT3YbY8T/YuiwYbiRfevreHRKxtBCdstEqvQGd3eH9OQuz0CAwEAAaNCMEAwDwYDVR0TAQH/BAUwAwEB/zAdBgNVHQ4EFgQUz4wQF1UMEd//9FQf1sYf8wUTWz0wDgYDVR0PAQH/BAQDAgKEMA0GCSqGSIb3DQEBCwUAA4IBAQAxSUGEdyeNtJpR8hnod7GKckdxUjHiT/FUvX+niYh1oh2OJ6GJGLMvWXsZad0Lr5POWLICIFH/vBPYrJi+m20sjc/Iil3/forvTgYF01h3i9im4x1hLM9pdepKujDk7+PTjCzH6BHtoiYk7/8rAJgK/yelaAOFMYqVuydL3PCK6ya31ew8ihY0to/bkSXgiX2Swc9iJp39dGyWBzBU8mEKspuQQXIcFt1zSVFfNup4Pt6Idlb0sIItEuP2e/KYtGHow72BYz2mF8Ssbb2esTsWVN6pNl3wBAAoUrnzG8zMw0afD7LwJ/YIbrVlmRaws7+ElZ30kUbJQ/tes1uAd6jl",
        entryPoint: "https://dev-84dnrmwnswgzbf52.eu.auth0.com/samlp/pPAQU4v21WlZyLVOcMU5bKywySW6VPuv",
        options: {
            failureRedirect: "/api/authentication/login",
            failureFlash: true
        },
        logoutUrl: "https://dev-84dnrmwnswgzbf52.eu.auth0.com/samlp/pPAQU4v21WlZyLVOcMU5bKywySW6VPuv/logout"
    },
    session: {
        resave: false,
        secret: uuidv4(),
        saveUninitialized: true
    }
};

module.exports = config;


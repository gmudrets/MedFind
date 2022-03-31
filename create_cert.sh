#!/usr/bin/env bash


$1 -noprompt -genkeypair -keyalg RSA -keysize 2048 -storetype PKCS12 -keystore build/.keyStore/key.cert -validity 3650 -dname "CN=medfind.com, OU=Medfind, O=Medfind, L=Israel, S=Israel, C=IL" -keypass SecretP4ss -storepass SecretP4ss
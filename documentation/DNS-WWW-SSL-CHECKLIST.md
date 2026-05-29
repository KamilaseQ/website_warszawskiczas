# DNS / WWW / SSL checklist

Stan sprawdzony: 2026-05-29.

- `www.warszawskiczas.pl` jest już `CNAME` do `warszawskiczas.pl`.
- `warszawskiczas.pl` rozwiązuje się obecnie na `77.37.55.160` i `91.108.123.40` oraz dwa adresy IPv6 Hostingera.
- `https://www.warszawskiczas.pl` nadal ma błąd certyfikatu dla hosta `www` (`SEC_E_WRONG_PRINCIPAL` / `NET::ERR_CERT_COMMON_NAME_INVALID`).
- `https://warszawskiczas.pl/oferta` działa poprawnie i robi `308` do `/produkty`.

W Hostingerze trzeba odnowić/wystawić SSL obejmujący oba hosty:

- `warszawskiczas.pl`
- `www.warszawskiczas.pl`

Po tej zmianie kodowe redirecty w `next.config.js` będą mogły bezpiecznie przekierować `www` na `https://warszawskiczas.pl`. Bez poprawnego certyfikatu przeglądarka blokuje wejście zanim użytkownik zobaczy redirect.

Szybka weryfikacja po zmianie DNS/SSL:

```bash
curl -I http://www.warszawskiczas.pl/kontakt-z-nami
curl -I https://www.warszawskiczas.pl/kontakt-z-nami
curl -I https://warszawskiczas.pl/kontakt-z-nami
```

Oczekiwany efekt: `301` albo `308` do `https://warszawskiczas.pl/kontakt`.

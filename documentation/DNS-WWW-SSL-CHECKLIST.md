# DNS / WWW / SSL checklist

Stan sprawdzony: `warszawskiczas.pl` i `www.warszawskiczas.pl` wskazuja na rozne serwery.

- `warszawskiczas.pl` -> `45.84.206.3`
- `www.warszawskiczas.pl` -> `34.120.137.41`
- `https://www.warszawskiczas.pl` ma blad certyfikatu dla hosta `www`.
- `http://www.warszawskiczas.pl` zwraca `404` z innego serwera, zanim request trafi do aplikacji.

W Hostingerze trzeba ustawic `www` jako alias tej samej strony co apex `warszawskiczas.pl`, a potem odnowic/wystawic SSL obejmujacy oba hosty:

- `warszawskiczas.pl`
- `www.warszawskiczas.pl`

Po tej zmianie kodowe redirecty w `next.config.js` i Apache redirecty w `public/.htaccess` beda mogly przekierowac `www` na `https://warszawskiczas.pl`.

Szybka weryfikacja po zmianie DNS/SSL:

```bash
curl -I http://www.warszawskiczas.pl/kontakt-z-nami
curl -I https://www.warszawskiczas.pl/kontakt-z-nami
curl -I https://warszawskiczas.pl/kontakt-z-nami
```

Oczekiwany efekt: `301` albo `308` do `https://warszawskiczas.pl/kontakt`.

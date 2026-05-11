import type { Metadata } from 'next'
import Link from 'next/link'
import { ContactLink } from '@/components/contact-link'
import { Container, Section, Heading, Text } from '@/components/ui'
import { ADDRESS, CONTACT_EMAIL, CONTACT_PHONE, CONTACT_PHONE_RAW } from '@/lib/config'

export const metadata: Metadata = {
  title: 'Polityka prywatności',
  description:
    'Informacja o przetwarzaniu danych osobowych przez butik Warszawski Czas zgodnie z RODO.',
}

const LAST_UPDATED = '2026-05-09'

export default function PolitykaPrywatnosciPage() {
  return (
    <Section spacing="lg" className="pt-32 lg:pt-40">
      <Container size="narrow">
        <p className="font-sans text-[10px] font-bold uppercase tracking-[0.4em] text-accent-gold">
          Dokument prawny
        </p>
        <Heading as="h1" size="xl" className="mt-4">
          Polityka prywatności
        </Heading>
        <p className="mt-4 font-sans text-xs uppercase tracking-[0.25em] text-muted-foreground">
          Ostatnia aktualizacja: {LAST_UPDATED}
        </p>

        <div className="mt-12 space-y-12 border-l border-accent-gold/40 pl-8">
          <section>
            <Heading as="h2" size="sm">1. Administrator danych</Heading>
            <Text muted className="mt-4 text-base leading-relaxed">
              Cenimy Twoją prywatność. Poniżej znajdziesz podstawowe informacje
              o tym, jak postępujemy z danymi udostępnianymi w trakcie kontaktu
              z butikiem.
            </Text>
            <Text muted className="mt-4 text-base leading-relaxed">
              Administratorem Twoich danych osobowych jest butik Warszawski Czas
              z siedzibą przy {ADDRESS.street}, {ADDRESS.postal} {ADDRESS.city}.
              W sprawach dotyczących przetwarzania danych osobowych można kontaktować
              się z administratorem pod adresem{' '}
              <a href={`mailto:${CONTACT_EMAIL}`} className="text-accent-gold underline">
                {CONTACT_EMAIL}
              </a>{' '}
              lub telefonicznie:{' '}
              <a href={`tel:${CONTACT_PHONE_RAW}`} className="text-accent-gold underline whitespace-nowrap">
                {CONTACT_PHONE}
              </a>
              .
            </Text>
          </section>

          <section>
            <Heading as="h2" size="sm">2. Zakres przetwarzanych danych</Heading>
            <Text muted className="mt-4 text-base leading-relaxed">
              W związku z korzystaniem z formularza kontaktowego oraz prowadzoną
              korespondencją administrator może przetwarzać następujące dane osobowe:
              imię i nazwisko, adres e-mail, numer telefonu, treść wiadomości,
              a także techniczne dane sesyjne (adres IP, źródło wejścia, ścieżka
              poruszania się po serwisie) wykorzystywane do obsługi zgłoszenia
              i ochrony przed nadużyciami.
            </Text>
          </section>

          <section>
            <Heading as="h2" size="sm">3. Cele i podstawy prawne przetwarzania</Heading>
            <ul className="mt-4 space-y-3 font-sans text-base leading-relaxed text-muted-foreground">
              <li>
                <strong className="text-foreground">Obsługa zapytania złożonego przez formularz kontaktowy</strong> —
                podstawą jest zgoda osoby, której dane dotyczą (art. 6 ust. 1 lit. a RODO)
                oraz podjęcie działań na żądanie tej osoby przed zawarciem umowy
                (art. 6 ust. 1 lit. b RODO).
              </li>
              <li>
                <strong className="text-foreground">Prowadzenie korespondencji i odpowiedź na zapytania</strong> —
                podstawą jest prawnie uzasadniony interes administratora polegający
                na obsłudze klienta (art. 6 ust. 1 lit. f RODO).
              </li>
              <li>
                <strong className="text-foreground">Zapewnienie bezpieczeństwa serwisu i ochrona przed nadużyciami</strong> —
                podstawą jest prawnie uzasadniony interes administratora
                (art. 6 ust. 1 lit. f RODO).
              </li>
              <li>
                <strong className="text-foreground">Realizacja obowiązków wynikających z przepisów prawa</strong> —
                podstawą jest art. 6 ust. 1 lit. c RODO, w szczególności w zakresie
                przepisów podatkowych i rachunkowych w odniesieniu do zawartych transakcji.
              </li>
            </ul>
          </section>

          <section>
            <Heading as="h2" size="sm">4. Okres przechowywania danych</Heading>
            <Text muted className="mt-4 text-base leading-relaxed">
              Dane przetwarzane w celu obsługi zapytania kontaktowego przechowywane
              są przez okres niezbędny do prowadzenia korespondencji i obsługi
              sprawy. Dane związane z zawartymi transakcjami przechowywane są
              przez okres wynikający z obowiązujących przepisów prawa,
              w szczególności prawa podatkowego i rachunkowego.
            </Text>
          </section>

          <section>
            <Heading as="h2" size="sm">5. Odbiorcy danych</Heading>
            <Text muted className="mt-4 text-base leading-relaxed">
              Odbiorcami danych mogą być wyłącznie podmioty świadczące na rzecz
              administratora usługi niezbędne do prowadzenia serwisu i obsługi
              zapytań: dostawca hostingu, dostawca poczty elektronicznej (SMTP),
              dostawcy usług IT i podmioty świadczące obsługę księgowo-prawną —
              każdorazowo na podstawie umów powierzenia przetwarzania danych
              osobowych. Dane nie są sprzedawane ani udostępniane podmiotom trzecim
              do celów marketingowych.
            </Text>
          </section>

          <section>
            <Heading as="h2" size="sm">6. Przekazywanie danych poza EOG</Heading>
            <Text muted className="mt-4 text-base leading-relaxed">
              Administrator nie przekazuje danych osobowych do państw trzecich
              poza Europejski Obszar Gospodarczy. W przypadku gdy korzystanie
              z usług niektórych dostawców wiązałoby się z takim transferem,
              odbywa się on wyłącznie na podstawie odpowiednich zabezpieczeń
              przewidzianych w RODO (m.in. standardowych klauzul umownych
              zatwierdzonych przez Komisję Europejską).
            </Text>
          </section>

          <section>
            <Heading as="h2" size="sm">7. Prawa osoby, której dane dotyczą</Heading>
            <Text muted className="mt-4 text-base leading-relaxed">
              W związku z przetwarzaniem danych osobowych przysługują Ci następujące prawa:
            </Text>
            <ul className="mt-4 space-y-2 font-sans text-base leading-relaxed text-muted-foreground list-disc pl-6">
              <li>prawo dostępu do swoich danych oraz uzyskania ich kopii,</li>
              <li>prawo do sprostowania (poprawiania) danych,</li>
              <li>prawo do usunięcia danych („prawo do bycia zapomnianym"),</li>
              <li>prawo do ograniczenia przetwarzania,</li>
              <li>prawo do przenoszenia danych,</li>
              <li>prawo do wniesienia sprzeciwu wobec przetwarzania na podstawie prawnie uzasadnionego interesu,</li>
              <li>prawo do cofnięcia zgody w dowolnym momencie — bez wpływu na zgodność z prawem przetwarzania dokonanego przed cofnięciem,</li>
              <li>prawo do wniesienia skargi do organu nadzorczego — Prezesa Urzędu Ochrony Danych Osobowych (ul. Stawki 2, 00-193 Warszawa).</li>
            </ul>
            <Text muted className="mt-4 text-base leading-relaxed">
              Aby skorzystać z powyższych praw, skontaktuj się z administratorem
              pod adresem{' '}
              <a href={`mailto:${CONTACT_EMAIL}`} className="text-accent-gold underline">
                {CONTACT_EMAIL}
              </a>
              .
            </Text>
          </section>

          <section>
            <Heading as="h2" size="sm">8. Dobrowolność podania danych</Heading>
            <Text muted className="mt-4 text-base leading-relaxed">
              Podanie danych osobowych jest dobrowolne, jednak ich niepodanie
              może uniemożliwić obsługę zapytania złożonego przez formularz
              kontaktowy lub realizację transakcji.
            </Text>
          </section>

          <section>
            <Heading as="h2" size="sm">9. Pliki cookies</Heading>
            <Text muted className="mt-4 text-base leading-relaxed">
              Serwis wykorzystuje wyłącznie techniczne pliki cookies niezbędne
              do prawidłowego działania strony (m.in. zapamiętanie stanu sesji
              użytkownika i ochrona formularzy przed nadużyciami). Nie korzystamy
              obecnie z plików cookies o charakterze analitycznym ani marketingowym.
              W każdej chwili możesz zarządzać plikami cookies w ustawieniach
              swojej przeglądarki.
            </Text>
          </section>

          <section>
            <Heading as="h2" size="sm">10. Zautomatyzowane podejmowanie decyzji i profilowanie</Heading>
            <Text muted className="mt-4 text-base leading-relaxed">
              Twoje dane osobowe nie podlegają zautomatyzowanemu podejmowaniu
              decyzji, w tym profilowaniu, które wywoływałoby wobec Ciebie
              skutki prawne lub w istotny sposób na Ciebie wpływało.
            </Text>
          </section>

          <section>
            <Heading as="h2" size="sm">11. Zmiany polityki prywatności</Heading>
            <Text muted className="mt-4 text-base leading-relaxed">
              Administrator zastrzega sobie prawo do zmiany niniejszej polityki
              prywatności. Aktualna wersja zawsze dostępna jest pod tym adresem,
              a data ostatniej aktualizacji wskazana jest na początku dokumentu.
            </Text>
          </section>
        </div>

        <div className="mt-16 flex flex-col gap-4 sm:flex-row sm:items-center">
          <ContactLink
            source="polityka"
            className="inline-flex items-center justify-center bg-foreground px-8 py-3 font-serif text-xs uppercase tracking-[0.25em] text-background transition-colors hover:bg-accent-gold hover:text-foreground"
          >
            Skontaktuj się z nami
          </ContactLink>
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-sans text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground hover:text-accent-gold transition-colors"
          >
            <span aria-hidden>←</span> Powrót na stronę główną
          </Link>
        </div>
      </Container>
    </Section>
  )
}

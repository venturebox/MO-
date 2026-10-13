# mObywatel 2.0 – Aplikacja PWA (1:1)

Aplikacja Progressive Web App (PWA) odwzorowująca 1:1 interfejs i działanie aplikacji **mObywatel 2.0** w trybie jasnym (Light Mode), z dokładnym odwzorowaniem kolorów, typografii i elementów urzędowych.

## 📱 Zawartość i funkcje

1. **Górny pasek (Header)**:
   - Oficjalny wektorowy **Herb Rzeczypospolitej Polskiej** (Orzeł Biały)
   - Chatbot **mAsystent**
   - Skrzynka pocztowa **e-Doręczenia**
   - Dzwonek **Powiadomienia** z czerwoną kropką aktywności
2. **Nagłówek sekcji**:
   - Oficjalny, lekki tytuł **Dokumenty** (500 Medium)
3. **Kaskadowy portfel kart (1:1)**:
   - **mPrawo jazdy** (fioletowo-amarantowy gradient z symbolem PL i kategoriami)
   - **mDowód** (błękitno-cyjanowy gradient z orłem i oficjalnymi danymi)
   - **Moje pojazdy** (złoto-pomarańczowy ciepły gradient)
   - *Interakcja*: kliknięcie karty wysuwa ją na wierzch stosu, ponowne kliknięcie otwiera szczegóły dokumentu lub podstronę pojazdów.
4. **Pasek akcji**:
   - Link **Zarządzaj** (`#0066cc`) – zmienia kolejność kart w portfelu
   - Zaokrąglony prostokątny przycisk **+ Dodaj dokument** w kolorze urzędowym (`#1662fe`)
5. **Dedykowany ekran „Moje pojazdy”**:
   - Lista zarejestrowanych pojazdów:
     - **MERCEDES-BENZ B 200** (`EBE7XC8`) – OC: 🟢, Badanie techniczne: 🔴
     - **NISSAN QASHQAI J12** (`WZ705EH`, VIN: `SJNTAAJ12U1025846`) – OC: 🟢, Badanie techniczne: 🟢
   - Izometryczne avatary 3D pojazdów CEPiK
   - Ramka informacyjna o aktualizacji danych
   - Pełnoszerokościowy przycisk **Aktualizuj dane** (`#1662fe`)
6. **Ekran „Szczegóły pojazdu” (1:1 ze zrzutem ekranu)**:
   - Czas na żywo: `Czas: GG:MM:SS DD.MM.RRRR`
   - Ostrzeżenie ⚠️ o wygasłym badaniu technicznym (dla Mercedesa B 200) z przyciskiem *Pobierz dane*
   - Dane VIN i rejestracji z działającymi przyciskami **Kopiuj**
   - 4 kafelki szybkiego dostępu: **Historia pojazdu**, **mStłuczka**, **Punkty karne**, **Mandaty**
   - Wiersz *Ostatnia aktualizacja* z pigułką **Aktualizuj**
   - 5 rozwijanych sekcji akordeonowych:
     1. Badanie techniczne
     2. Polisa OC
     3. Pozwolenie czasowe
     4. Dowód rejestracyjny
     5. Dane pojazdu
7. **Dolny pasek nawigacji (5 zakładek)**:
   - Dokumenty, Usługi, Kod QR, Szukaj, Więcej
8. **Wsparcie PWA**:
   - `manifest.json` oraz `sw.js` (Service Worker) – pełne działanie offline i instalacja na telefonie.

---

## 🚀 Jak uruchomić aplikację lokalnie

```bash
node server.js
```

Aplikacja dostępna pod adresem:
👉 **http://localhost:3000**

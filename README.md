# mObywatel 2.0 – Aplikacja PWA (1:1)

Aplikacja Progressive Web App (PWA) odwzorowująca 1:1 interfejs i działanie aplikacji **mObywatel 2.0** w trybie ciemnym (Dark Mode), zgodnie z załączonym zrzutem ekranu.

## 📱 Zawartość i funkcje

1. **Górny pasek (Header)**:
   - Czerwona ikona z Godłem Rzeczypospolitej Polskiej (Orzeł Biały)
   - Ikona chatbota **mAsystent** (w pełni interaktywny czat)
   - Ikona skrzynki pocztowej **e-Doręczenia**
   - Ikona dzwonka **Powiadomienia** z czerwoną kropką aktywności
2. **Nagłówek sekcji**:
   - Wyrazisty, oficjalny tytuł **Dokumenty**
3. **Kaskadowy portfel kart (1:1 ze screenem)**:
   - **mPrawo jazdy** (fioletowo-amarantowy gradient z okrągłym symbolem PL i kategoriami)
   - **mDowód** (niebiesko-cyjanowy gradient z orłem i oficjalnymi danymi)
   - **Moje pojazdy** (złoto-pomarańczowy ciepły gradient z podsumowaniem badania technicznego i OC)
   - *Interakcja*: kliknięcie karty wysuwa ją na wierzch stosu z płynną animacją, a ponowne kliknięcie otwiera pełny widok dokumentu z **dynamicznym zegarem autentyczności** oraz **obracającym się hologramem**!
4. **Pasek akcji**:
   - Przycisk **Zarządzaj** (po lewej, w kolorze błękitnym) – zmienia układ kart
   - Pływający przycisk pigułka **+ Dodaj dokument** (po prawej) – otwiera listę dokumentów (mLegitymacja, Karta Dużej Rodziny, itp.)
5. **Dolny pasek nawigacji (5 zakładek)**:
   - **Dokumenty** (wyróżniona aktywna pigułka)
   - **Usługi** (Historia pojazdu, punkty karne, e-recepty)
   - **Kod QR** (symulator skanera QR do potwierdzania tożsamości)
   - **Szukaj** (szybkie wyszukiwanie usług)
   - **Więcej** (ustawienia i bezpieczeństwo)
6. **Wsparcie PWA**:
   - `manifest.json` oraz `sw.js` (Service Worker) – pełne działanie offline i możliwość instalacji jako natywna aplikacja na ekranie telefonu.

---

## 🚀 Jak uruchomić aplikację

W folderze projektu `/Users/wojtekzapora/Documents/venturebox/apka`:

### Opcja 1: Przez Node.js (zalecane)
```bash
npm start
```
lub:
```bash
node server.js
```

### Opcja 2: Przez Python
```bash
python3 -m http.server 3000
```

Następnie otwórz w przeglądarce:
👉 **http://localhost:3000**

---

## 📲 Jak zainstalować jako PWA na telefonie

1. Uruchom serwer na komputerze (`npm start`).
2. Podłącz telefon do tej samej sieci Wi-Fi i otwórz adres `http://<IP_Twojego_komputera>:3000` (np. `http://192.168.1.50:3000`).
3. W menu przeglądarki (Chrome na Androidzie lub Safari na iOS) wybierz:
   - Android: **"Zainstaluj aplikację"** lub **"Dodaj do ekranu głównego"**
   - iOS: Ikona udostępniania ➔ **"Do ekranu początkowego"**
4. Aplikacja uruchamia się na pełnym ekranie bez pasków przeglądarki, dokładnie jak natywna aplikacja ze zrzutu ekranu!

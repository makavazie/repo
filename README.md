# Skor Takip Mobil Uygulaması (Expo + React Native)

Bu proje, Flashscore feed kaynağından canlı skorları çekip mobilde listelemek için hazırlanmış bir başlangıç uygulamasıdır.

## Hiç yazılım bilmeden kurulum (Windows / macOS)

Aşağıdaki adımları sırayla uygula. Takıldığın yerde sadece ekran görüntüsü atman yeterli olur.

### 1) Gerekli programları kur

- **Node.js LTS** indir ve kur: https://nodejs.org/
- **VS Code** kur: https://code.visualstudio.com/
- Telefona **Expo Go** kur:
  - Android: Play Store
  - iPhone: App Store

> Node.js kurduktan sonra bilgisayarı bir kez yeniden başlatman iyi olur.

### 2) Projeyi bilgisayarına al

Bu proje klasörü sende zaten varsa bu adımı geç.

GitHub'dan aldıysan:

```bash
git clone <REPO_LINKIN>
cd <REPO_KLASOR_ADI>
```

### 3) VS Code terminalini aç

- VS Code içinde bu proje klasörünü aç.
- Üst menüden **Terminal > New Terminal** tıkla.
- Açılan terminalde aşağıdaki komutları gir.

### 4) Paketleri kur

```bash
npm install
```

### 5) Uygulamayı başlat

```bash
npm run start
```

Bu komuttan sonra terminalde bir **QR kod** çıkacak.

### 6) Telefonda aç

- Telefon ve bilgisayar **aynı Wi‑Fi** ağına bağlı olsun.
- Telefonda Expo Go’yu aç.
- QR kodu okut.
- Uygulama telefonda açılır.

---


## Senin durumun (VS Code zaten var)

Sende VS Code olduğu için sadece şunları yapman yeterli:

1. Node.js LTS kurulu değilse kur: https://nodejs.org/
2. Telefona Expo Go kur (Android/iOS mağaza).
3. VS Code ile proje klasörünü aç.
4. VS Code'da **Terminal > New Terminal** aç.
5. Sırayla çalıştır:

```bash
npm install
npm run start
```

6. Çıkan QR kodu Expo Go ile okut.


## Çok sık yaşanan sorunlar (çok basit çözüm)

### Sorun: `npm` komutu çalışmıyor
- Node.js doğru kurulmamış olabilir. Node.js LTS'i tekrar kur.
- Yeni terminal açıp tekrar dene.

### Sorun: Expo Go sürümü SDK 54 ama proje SDK 52
- Bu repo artık SDK 54'e güncellendi. Eğer eski paketler kaldıysa temiz kurulum yap:
  ```bash
  rm -rf node_modules package-lock.json
  npm install
  npx expo start -c
  ```
- Windows kullanıyorsan `rm -rf` yerine:
  ```powershell
  rmdir /s /q node_modules
  del package-lock.json
  npm install
  npx expo start -c
  ```

### Sorun: `expo-asset cannot be found` hatası
- Proje klasöründe şu komutu çalıştır:
  ```bash
  npx expo install expo-asset
  ```
- Sonra tekrar başlat:
  ```bash
  npm run start
  ```


### Sorun: QR kodu okutup bağlanmıyor
- Telefon ve bilgisayar aynı internette mi kontrol et.
- VPN kapat.
- Terminalde `npm run start -- --tunnel` komutunu dene.

### Sorun: Feed verisi boş geliyor
- Flashscore feed bazen bölgesel/istek başlığına duyarlı olabilir.
- Uygulamada fallback feed denemesi var (`/310` ve `/10`).

---

## Veri Kaynağı

- Canlı feed adayları:
  - `https://global.flashscore.ninja/310/x/feed/f_`
  - `https://global.flashscore.ninja/10/x/feed/f_` (fallback)
- Maç sayfası: `https://m.flashscore.com.tr/mac/{match_id}/`
- H2H sayfası: `https://m.flashscore.com.tr/mac/{match_id}/?t=h2h`
- İstatistik feed: `https://global.flashscore.ninja/10/x/feed/df_st_1_{match_id}`

> Not: Kaynak sitenin kullanım koşulları ve lisans şartlarını doğrulamadan üretim ortamında kullanmayın.

## Mimari

- `App.tsx`: Ana ekran, yükleme/yenileme ve hata yönetimi.
- `src/services/flashscoreService.ts`: Feed çağrısı yapan servis (header + fallback mantığı içerir).
- `src/utils/flashscoreParser.ts`: Ham feed metnini `Match` modeline parse eder.
- `src/utils/flashscoreUrls.ts`: maç/h2h/istatistik URL üreticileri.
- `src/components/MatchCard.tsx`: Tek maç kartının UI bileşeni ve hızlı link butonları.

## Test

```bash
npm test
```

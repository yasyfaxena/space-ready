import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type Locale = "en" | "id";

const USD_PER_IDR = 1 / 16000;

const dict = {
  en: {
    "nav.home": "Home",
    "nav.locations": "Locations",
    "nav.workspaces": "Workspaces",
    "nav.membership": "Membership",
    "nav.pricing": "Pricing",
    "nav.amenities": "Amenities",
    "nav.how": "How It Works",
    "nav.enterprise": "Enterprise",
    "nav.help": "Help Center",
    "nav.menu": "Menu",
    "cta.signup": "Sign Up",
    "cta.book": "Book a Space",
    "cta.bookNow": "Book Now",
    "cta.dashboard": "My Account",
    "cta.logout": "Log out",
    "cta.login": "Log in",
    "auth.loginTitle": "Welcome back",
    "auth.loginSubtitle": "Sign in to book a space and manage your access.",
    "auth.email": "Email",
    "auth.password": "Password",
    "auth.fullName": "Full name",
    "auth.phone": "Phone",
    "auth.company": "Company (optional)",
    "auth.noAccount": "New to Sattabi?",
    "auth.createAccount": "Create an account",
    "auth.haveAccount": "Already have an account?",
    "auth.signingIn": "Signing in…",
    "auth.creating": "Creating account…",
    "auth.loginRequired": "Please log in to continue with your booking.",
    "dash.title": "My account",
    "dash.bookings": "My bookings",
    "dash.empty": "You have no bookings yet.",
    "dash.upcoming": "Upcoming",
    "dash.past": "Past",
    "dash.cancel": "Cancel booking",
    "dash.cancelled": "Cancelled",
    "dash.viewPass": "View QR pass",
    "detail.availability": "Hourly availability",
    "detail.availabilityHint":
      "Pick a date, then choose the hours you need. Grey slots are already booked.",
    "detail.booked": "Booked",
    "detail.free": "Available",
    "detail.selected": "Selected",
    "detail.date": "Date",
    "detail.people": "Number of people",
    "detail.duration": "Duration",
    "detail.estTotal": "Estimated total",
    "detail.selectSlot": "Select at least one time slot",
    "detail.amenities": "Amenities",
    "book.review": "Review your booking",
    "book.total": "Total",
    "book.pay": "Confirm & Pay",
    "book.processing": "Processing payment…",
    "book.confirmed": "Booking confirmed",
    "book.qrTitle": "Your QR access pass",
    "book.qrHint":
      "Scan this code at the entrance gate. We have also emailed a copy to you.",
    "common.hours": "hours",
    "common.people": "people",
    "common.loading": "Loading…",
  },
  id: {
    "nav.home": "Beranda",
    "nav.locations": "Lokasi",
    "nav.workspaces": "Ruang Kerja",
    "nav.membership": "Keanggotaan",
    "nav.pricing": "Harga",
    "nav.amenities": "Fasilitas",
    "nav.how": "Cara Kerja",
    "nav.enterprise": "Perusahaan",
    "nav.help": "Pusat Bantuan",
    "nav.menu": "Menu",
    "cta.signup": "Daftar",
    "cta.book": "Pesan Ruang",
    "cta.bookNow": "Pesan Sekarang",
    "cta.dashboard": "Akun Saya",
    "cta.logout": "Keluar",
    "cta.login": "Masuk",
    "auth.loginTitle": "Selamat datang kembali",
    "auth.loginSubtitle": "Masuk untuk memesan ruang dan mengelola akses Anda.",
    "auth.email": "Email",
    "auth.password": "Kata sandi",
    "auth.fullName": "Nama lengkap",
    "auth.phone": "Nomor telepon",
    "auth.company": "Perusahaan (opsional)",
    "auth.noAccount": "Baru di Sattabi?",
    "auth.createAccount": "Buat akun",
    "auth.haveAccount": "Sudah punya akun?",
    "auth.signingIn": "Sedang masuk…",
    "auth.creating": "Membuat akun…",
    "auth.loginRequired": "Silakan masuk terlebih dahulu untuk melanjutkan pemesanan.",
    "dash.title": "Akun saya",
    "dash.bookings": "Pemesanan saya",
    "dash.empty": "Anda belum memiliki pemesanan.",
    "dash.upcoming": "Akan datang",
    "dash.past": "Selesai",
    "dash.cancel": "Batalkan pemesanan",
    "dash.cancelled": "Dibatalkan",
    "dash.viewPass": "Lihat QR akses",
    "detail.availability": "Ketersediaan per jam",
    "detail.availabilityHint":
      "Pilih tanggal, lalu pilih jam yang Anda butuhkan. Kotak abu-abu sudah dipesan.",
    "detail.booked": "Sudah dipesan",
    "detail.free": "Tersedia",
    "detail.selected": "Dipilih",
    "detail.date": "Tanggal",
    "detail.people": "Jumlah orang",
    "detail.duration": "Durasi",
    "detail.estTotal": "Perkiraan total",
    "detail.selectSlot": "Pilih minimal satu jam",
    "detail.amenities": "Fasilitas",
    "book.review": "Tinjau pemesanan Anda",
    "book.total": "Total",
    "book.pay": "Konfirmasi & Bayar",
    "book.processing": "Memproses pembayaran…",
    "book.confirmed": "Pemesanan dikonfirmasi",
    "book.qrTitle": "QR akses Anda",
    "book.qrHint":
      "Pindai kode ini di gerbang masuk. Salinannya juga kami kirim ke email Anda.",
    "common.hours": "jam",
    "common.people": "orang",
    "common.loading": "Memuat…",
  },
} satisfies Record<Locale, Record<string, string>>;

export type TranslationKey = keyof (typeof dict)["en"];

type Ctx = {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: TranslationKey) => string;
  money: (idr: number) => string;
  moneyText: (text: string) => string;
};

const I18nContext = createContext<Ctx | null>(null);

export function formatMoney(idr: number, locale: Locale) {
  if (locale === "id") {
    return "Rp " + Math.round(idr).toLocaleString("id-ID");
  }
  const usd = idr * USD_PER_IDR;
  return (
    "$" +
    usd.toLocaleString("en-US", {
      minimumFractionDigits: usd < 100 ? 2 : 0,
      maximumFractionDigits: usd < 100 ? 2 : 0,
    })
  );
}

/** Converts "Rp 950,000 / month" style copy into the active currency. */
export function convertPriceText(text: string, locale: Locale) {
  return text.replace(/Rp\s?([\d.,]+)/g, (_match, digits: string) => {
    const value = Number(digits.replace(/[.,]/g, ""));
    if (!Number.isFinite(value)) return _match;
    return formatMoney(value, locale);
  });
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");

  useEffect(() => {
    const stored = window.localStorage.getItem("sattabi-locale");
    if (stored === "id" || stored === "en") setLocaleState(stored);
  }, []);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    window.localStorage.setItem("sattabi-locale", l);
    document.documentElement.lang = l;
  }, []);

  const value = useMemo<Ctx>(
    () => ({
      locale,
      setLocale,
      t: (key) => dict[locale][key] ?? dict.en[key] ?? key,
      money: (idr) => formatMoney(idr, locale),
      moneyText: (text) => convertPriceText(text, locale),
    }),
    [locale, setLocale],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used inside I18nProvider");
  return ctx;
}

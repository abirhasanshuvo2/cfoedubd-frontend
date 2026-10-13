export interface SystemFaqItem {
  id: number | string;
  question: string;
  answer: string;
}

export interface SystemFaqData {
  title?: string | null;
  subtitle?: string | null;
  items?: SystemFaqItem[] | null;
}

export interface SystemInformation {
  name: string;
  motto: string;
  tagline: string;
  description: string;
  address: string;
  email: string;
  phone: string;
  mobile: string;
  whatsapp?: string;
  whatsapp_no?: string;
  website: string;
  facebook: string;
  instagram: string;
  twitter: string;
  linked_in: string;
  youtube: string;
  logo: string | null;
  secondary_logo: string | null;
  icon: string | null;
  menu_logo: string | null;
  popup_image: string | null;
  popup_link: string | null;
  terms_condition: string | null;
  privacy_policy: string | null;
  faq?: SystemFaqData | null;
  about_first_section: string | null;
  about_second_section: string | null;
  about_video: string | null;
  students: number | string | null;
  graduates: number | string | null;
  classes: number | string | null;
  promo_code?: string | null;
  promo_discount?: string | number | null;
  promo_text?: string | null;
  announcement_title?: string | null;
  announcement_text?: string | null;
  announcement_link?: string | null;
  announcement_active?: boolean | null;
}

export interface SystemInfoApiResponse {
  success: boolean;
  data: SystemInformation;
  isLive?: boolean;
  error?: string;
}

export const DEFAULT_SYSTEM_INFO: SystemInformation = {
  name: "Chartered Officer Limited",
  motto: "Building Financial Leaders for Tomorrow",
  tagline: "Practical Skills. Real Placement. Lasting Careers.",
  description: "The CFO Foundation of Bangladesh (CFO BD) is a non-profit organization comprised of current and future Chief Financial Officers (CFOs) that is registered with the Registrar of Joint Stock Companies and Firms (RJSC), Ministry of Commerce, Government of the People's Republic of Bangladesh, under registration number s-13064/2019. The mission of this organization is to exchange ideas, thoughts, and expertise through organizing knowledge-building conferences, seminars, and training, contributing to vital national policy, improving stakeholders, developing financial culture, and serving society as a whole",
  address: "City Centre 90/1, Level-25 (Lift-26), Motijheel C/A, Dhaka-1000",
  email: "cfoedubd@gmail.com",
  phone: "+880 1713378787",
  mobile: "+8801713378787",
  whatsapp: "+8801713378787",
  whatsapp_no: "+8801713378787",
  website: "https://cfoedubd.com",
  facebook: "https://www.facebook.com/CharteredOfficersLimited",
  instagram: "https://www.instagram.com/info.col.com.bd/",
  twitter: "#",
  linked_in: "https://www.linkedin.com/company/chartered-officer-ltd/",
  youtube: "https://www.youtube.com/@charteredfinancialofficer-5894",
  logo: "http://127.0.0.1:8000/system-images/logos/1-20251007100023-ssg-logo.png",
  secondary_logo: "http://127.0.0.1:8000/system-images/secondary-logos/1-20251007100023-ssg-secondary.png",
  icon: "http://127.0.0.1:8000/system-images/icons/1-20251007100024-ssg-icon.png",
  menu_logo: null,
  popup_image: null,
  popup_link: null,
  terms_condition: null,
  privacy_policy: null,
  faq: {
    title: "A new question",
    subtitle: "a new description",
    items: [
      {
        id: 1,
        question: "a new question",
        answer: "the answer of that question",
      },
      {
        id: 2,
        question: "What course do you offer for cfoedubd",
        answer: "We offer a range of courses covering traditional and modern corporate topics like Chartered Financial Officer (CFO), VAT & TAX, Human Resource Management (HRM), Supply Chain Management (SCM), and Financial Technology (FinTech).",
      },
    ],
  },
  about_first_section: null,
  about_second_section: null,
  about_video: null,
  students: null,
  graduates: null,
  classes: null,
  promo_code: "COL-EXEC",
  promo_discount: "10%",
  promo_text: "স্পেশাল সিজন ডিসকাউন্ট কোড: COL-EXEC ব্যবহার করে যেকোনো ব্যাচে অতিরিক্ত ছাড় উপভোগ করুন!",
  announcement_title: "অ্যাডমিশন ওরিয়েন্টেশন ২০২৬",
  announcement_text: "আসন্ন লাইভ ব্যাচসমূহে আসন সংখ্যা সীমিত। দ্রুত রেজিস্ট্রেশন করুন।",
  announcement_link: "/courses",
  announcement_active: true,
};

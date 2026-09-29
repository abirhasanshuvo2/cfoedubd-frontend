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
  about_first_section: string | null;
  about_second_section: string | null;
  about_video: string | null;
  students: number | string | null;
  graduates: number | string | null;
  classes: number | string | null;
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
  description: "Chartered Officer Limited (COL) provides professional skill-development programs in Financial Leadership, Fintech, VAT & TAX, and Supply Chain Management. Participants gain hands-on, practical training designed to boost their on-the-job productivity, with many receiving corporate placement opportunities during or after completing the program. COL works closely with the CFO Foundation of Bangladesh, a non-profit body registered with the RJSC (Reg. No. s-13064/2019) that promotes financial knowledge-sharing through conferences, seminars, and training across the country.",
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
  about_first_section: null,
  about_second_section: null,
  about_video: null,
  students: null,
  graduates: null,
  classes: null,
};

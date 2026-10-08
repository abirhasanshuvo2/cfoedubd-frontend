export const DUMMY_PERSON_AVATAR = '/dummy-avatar.svg';

export interface Mentor {
  name: string;
  role: string;
  company: string;
  experience: string;
  avatar: string;
}

export interface CourseModule {
  week: number;
  title: string;
  topics: string[];
  project?: string;
}

export interface Course {
  id: string;
  slug: string;
  title: string;
  titleEn: string;
  category: string;
  categoryLabel: string;
  badge: string;
  batchNumber: string;
  startDate: string;
  startDateEn: string;
  schedule: string;
  scheduleEn: string;
  duration: string;
  durationEn: string;
  totalClasses: number;
  seatsLeft: number;
  totalSeats: number;
  price: number;
  originalPrice: number;
  rating: number;
  enrolledCount: number;
  tags: string[];
  mentors: Mentor[];
  description: string;
  descriptionEn: string;
  syllabus: CourseModule[];
  skillsLearned: string[];
  projects: string[];
  prerequisites: string[];
  tools: string[];
  isPopular?: boolean;
  isFeatured?: boolean;
  educator?: string;
  educatorDesignation?: string | null;
  educatorAvatar?: string | null;
  educatorBio?: string | null;
  educatorRating?: number | null;
  thumbnail?: string;
  image?: string;
  classId?: string;
  days?: string[];
  timeSlot?: string;
  language?: string | null;
  level?: string;
  minAge?: number;
  maxAge?: number;
  endDate?: string | null;
  meetLink?: string | null;
  video?: string | null;
  vide?: string | null;
  videoLink?: string | null;
  video_link?: string | null;
  video_url?: string | null;
  totalStudents?: number;
  status?: number;
}

export interface Workshop {
  id: string;
  title: string;
  titleEn: string;
  instructor: string;
  instructorRole: string;
  instructorCompany: string;
  date: string;
  time: string;
  category: string;
  registeredCount: number;
  totalSeats: number;
  isLiveNow?: boolean;
}

export interface Testimonial {
  id: string;
  name: string;
  course: string;
  previousRole: string;
  currentRole: string;
  company: string;
  companyLogoText: string;
  avatar: string;
  comment: string;
  commentEn: string;
  rating: number;
}

export const CATEGORIES = [
  { id: 'all', label: 'সব কোর্স ও ডিপ্লোমা', labelEn: 'All Courses & Diplomas', icon: 'Sparkles' },
  { id: 'cfo-flagship', label: 'চার্টার্ড ফাইন্যান্সিয়াল অফিসার (CFO)', labelEn: 'Chartered Financial Officer', icon: 'Award' },
  { id: 'cse-courses', label: 'সিএসই ও সফটওয়্যার কোর্স (CSE)', labelEn: 'CSE & Software Engineering', icon: 'Cpu' },
  { id: 'tax-vat', label: 'কাস্টমস, ভ্যাট ও ট্যাক্সেশন', labelEn: 'Customs, VAT & TAX', icon: 'FileText' },
  { id: 'fintech-erp', label: 'ফিনটেক ও এসএপি-ফাইকো (SAP-FICO)', labelEn: 'Fintech & SAP-FICO ERP', icon: 'Cpu' },
  { id: 'fpa-valuation', label: 'ফাইন্যান্সিয়াল প্ল্যানিং ও ভ্যালুয়েশন (FP&A)', labelEn: 'FP&A & Corporate Valuation', icon: 'TrendingUp' },
  { id: 'supply-chain', label: 'সাপ্লাই চেইন ও লিন সিক্স সিগমা', labelEn: 'Logistics & Supply Chain', icon: 'Truck' },
  { id: 'hrm-legal', label: 'এইচআরএম ও বাংলাদেশ শ্রম আইন', labelEn: 'HRM & Labor Law', icon: 'Users' },
  { id: 'ias-ifrs', label: 'আইএএস, আইএফআরএস ও অডিট (IAS/IFRS)', labelEn: 'IAS, IFRS & Auditing', icon: 'ShieldCheck' },
];

export interface ApiCourse {
  id: number;
  class_id: string;
  name: string;
  category: string;
  educator: string;
  total_students: number;
  meet_link: string | null;
  video?: string | null;
  vide?: string | null;
  video_link?: string | null;
  video_url?: string | null;
  days: string[];
  time: string;
  language: string | null;
  level: string;
  min_age: number;
  max_age: number;
  start_date: string | null;
  end_date: string | null;
  price: number;
  status: number;
}

export interface ResolvedCourseVideo {
  hasVideo: boolean;
  rawUrl: string | null;
  embedUrl: string;
  autoplayEmbedUrl: string;
  thumbnailUrl: string | null;
  isDirectVideoFile: boolean;
  directVideoUrl: string | null;
}

export function resolveCourseVideo(
  rawInput: string | null | undefined,
  backendBaseUrl: string = 'http://127.0.0.1:8000'
): ResolvedCourseVideo {
  const defaultYoutubeId = '-HeZs3qthR8';
  const trimmed = typeof rawInput === 'string' ? rawInput.trim() : '';

  if (!trimmed) {
    return {
      hasVideo: false,
      rawUrl: `https://www.youtube.com/watch?v=${defaultYoutubeId}&t=1s`,
      embedUrl: `https://www.youtube.com/embed/${defaultYoutubeId}?start=1&rel=0`,
      autoplayEmbedUrl: `https://www.youtube.com/embed/${defaultYoutubeId}?autoplay=1&start=1&rel=0`,
      thumbnailUrl: `https://img.youtube.com/vi/${defaultYoutubeId}/hqdefault.jpg`,
      isDirectVideoFile: false,
      directVideoUrl: null,
    };
  }

  // Handle relative storage paths from Laravel backend (e.g., "/storage/videos/..." or "storage/...")
  let normalizedUrl = trimmed;
  if (trimmed.startsWith('/storage/') || trimmed.startsWith('storage/')) {
    const cleanBase = backendBaseUrl.replace(/\/$/, '');
    const cleanPath = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
    normalizedUrl = `${cleanBase}${cleanPath}`;
  }

  // 1. Check if it's a direct video file (.mp4, .webm, .ogg, .mov)
  const isDirectFile = /\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(normalizedUrl);
  if (isDirectFile) {
    return {
      hasVideo: true,
      rawUrl: normalizedUrl,
      embedUrl: normalizedUrl,
      autoplayEmbedUrl: normalizedUrl,
      thumbnailUrl: null,
      isDirectVideoFile: true,
      directVideoUrl: normalizedUrl,
    };
  }

  // 2. Check if it's a YouTube URL (watch?v=, youtu.be/, embed/, shorts/, live/)
  const ytRegex =
    /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?|shorts|live)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/i;
  const ytMatch = normalizedUrl.match(ytRegex);
  if (ytMatch && ytMatch[1]) {
    const videoId = ytMatch[1];
    const timeMatch = normalizedUrl.match(/[?&](?:t|start)=(\d+)/i);
    const startParam = timeMatch && timeMatch[1] ? `&start=${timeMatch[1]}` : '';
    return {
      hasVideo: true,
      rawUrl: normalizedUrl,
      embedUrl: `https://www.youtube.com/embed/${videoId}?rel=0${startParam}`,
      autoplayEmbedUrl: `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0${startParam}`,
      thumbnailUrl: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
      isDirectVideoFile: false,
      directVideoUrl: null,
    };
  }

  // 3. Check if it's a Vimeo URL
  const vimeoMatch = normalizedUrl.match(/vimeo\.com\/(?:video\/)?(\d+)/i);
  if (vimeoMatch && vimeoMatch[1]) {
    const vimeoId = vimeoMatch[1];
    return {
      hasVideo: true,
      rawUrl: normalizedUrl,
      embedUrl: `https://player.vimeo.com/video/${vimeoId}`,
      autoplayEmbedUrl: `https://player.vimeo.com/video/${vimeoId}?autoplay=1`,
      thumbnailUrl: null,
      isDirectVideoFile: false,
      directVideoUrl: null,
    };
  }

  // 4. Check if it's a Google Drive video link
  const driveMatch = normalizedUrl.match(/drive\.google\.com\/file\/d\/([^/]+)/i);
  if (driveMatch && driveMatch[1]) {
    const driveId = driveMatch[1];
    const previewUrl = `https://drive.google.com/file/d/${driveId}/preview`;
    return {
      hasVideo: true,
      rawUrl: normalizedUrl,
      embedUrl: previewUrl,
      autoplayEmbedUrl: previewUrl,
      thumbnailUrl: null,
      isDirectVideoFile: false,
      directVideoUrl: null,
    };
  }

  // 5. Fallback for any other embeddable or custom video URL
  return {
    hasVideo: true,
    rawUrl: normalizedUrl,
    embedUrl: normalizedUrl,
    autoplayEmbedUrl: normalizedUrl,
    thumbnailUrl: null,
    isDirectVideoFile: false,
    directVideoUrl: null,
  };
}

export const INITIAL_API_COURSES: ApiCourse[] = [
  {
    id: 6,
    class_id: "CLS-CRVNJ2AKP1",
    name: "Flutter Courses",
    category: "CSE Courses",
    educator: "Mr Teacher S",
    total_students: 0,
    meet_link: null,
    vide: "https://www.youtube.com/watch?v=-HeZs3qthR8&t=1s",
    video: "https://www.youtube.com/watch?v=-HeZs3qthR8&t=1s",
    days: [],
    time: "morning",
    language: null,
    level: "mixed",
    min_age: 0,
    max_age: 0,
    start_date: null,
    end_date: null,
    price: 0,
    status: 1
  },
  {
    id: 5,
    class_id: "CLS-6A96AF322ED21",
    name: "Flutter state management",
    category: "CSE Courses",
    educator: "Md. Abir Hasan",
    total_students: 1,
    meet_link: "https://meet.google.com/def-uvw",
    vide: "https://www.youtube.com/watch?v=-HeZs3qthR8&t=1s",
    video: "https://www.youtube.com/watch?v=-HeZs3qthR8&t=1s",
    days: ["Monday", "Wednesday", "Friday"],
    time: "evening",
    language: "English",
    level: "advanced",
    min_age: 25,
    max_age: 60,
    start_date: "2026-09-01",
    end_date: "2027-03-20",
    price: 70000,
    status: 1
  },
  {
    id: 2,
    class_id: "CLS-002",
    name: "Laravel REST API Masterclass",
    category: "CSE Courses",
    educator: "Mr Teacher S",
    total_students: 2,
    meet_link: "https://meet.google.com/def-uvw",
    vide: "https://www.youtube.com/watch?v=-HeZs3qthR8&t=1s",
    video: "https://www.youtube.com/watch?v=-HeZs3qthR8&t=1s",
    days: ["Monday", "Wednesday", "Friday"],
    time: "evening",
    language: "English",
    level: "intermediate",
    min_age: 18,
    max_age: 50,
    start_date: "2026-09-15",
    end_date: "2026-12-15",
    price: 8000,
    status: 1
  },
  {
    id: 1,
    class_id: "CLS-001",
    name: "Machine Learning Course",
    category: "CSE Courses",
    educator: "Mr Teacher S",
    total_students: 2,
    meet_link: null,
    vide: "https://www.youtube.com/watch?v=-HeZs3qthR8&t=1s",
    video: "https://www.youtube.com/watch?v=-HeZs3qthR8&t=1s",
    days: [],
    time: "morning",
    language: "Bengali",
    level: "beginner",
    min_age: 0,
    max_age: 0,
    start_date: null,
    end_date: null,
    price: 5000,
    status: 1
  }
];

export function adaptApiCourseToCfoCourse(item: any): Course {
  const courseId = item.id ? String(item.id) : String(Math.floor(Math.random() * 1000));
  const rawName = item.name || item.title || item.course_name || 'Professional Certification Course';
  const parsedPrice = typeof item.price === 'number' ? item.price : parseInt(item.price, 10) || 0;
  const isFree = parsedPrice === 0;
  const days = Array.isArray(item.days) ? item.days : [];
  const daysText = days.length > 0 ? days.join(', ') : 'রবি, মঙ্গল ও বৃহস্পতি';
  const time = typeof item.time === 'string' ? item.time : 'evening';
  const timeText = time === 'morning' ? 'সকাল ৯:০০ - ১১:৩০' : 'সন্ধ্যা ৭:৩০ - ৯:৩০';
  const timeTextEn = time === 'morning' ? 'Morning 9:00 AM - 11:30 AM' : 'Evening 7:30 PM - 9:30 PM';
  const rawLevel = typeof item.level === 'string' ? item.level : 'Professional';
  const levelUpper = rawLevel.toUpperCase();
  const rawCat = String(item.category || '').toLowerCase();

  let categoryKey = 'cse-courses';
  let categoryLabel = 'সিএসই ও সফটওয়্যার কোর্স';
  if (rawCat.includes('cfo') || rawCat.includes('finance') || rawCat.includes('chartered')) {
    categoryKey = 'cfo-flagship';
    categoryLabel = 'চার্টার্ড ফাইন্যান্সিয়াল অফিসার (CFO)';
  } else if (rawCat.includes('tax') || rawCat.includes('vat') || rawCat.includes('customs')) {
    categoryKey = 'tax-vat';
    categoryLabel = 'কাস্টমস, ভ্যাট ও ট্যাক্সেশন';
  } else if (rawCat.includes('sap') || rawCat.includes('erp') || rawCat.includes('fintech')) {
    categoryKey = 'fintech-erp';
    categoryLabel = 'ফিনটেক ও এসএপি-ফাইকো (SAP-FICO)';
  } else if (rawCat.includes('valuation') || rawCat.includes('fp&a') || rawCat.includes('fpa')) {
    categoryKey = 'fpa-valuation';
    categoryLabel = 'ফাইন্যান্সিয়াল প্ল্যানিং ও ভ্যালুয়েশন';
  } else if (rawCat.includes('supply') || rawCat.includes('scm') || rawCat.includes('logistics')) {
    categoryKey = 'supply-chain';
    categoryLabel = 'সাপ্লাই চেইন ও লিন সিক্স সিগমা';
  } else if (rawCat.includes('hrm') || rawCat.includes('law') || rawCat.includes('labor')) {
    categoryKey = 'hrm-legal';
    categoryLabel = 'এইচআরএম ও বাংলাদেশ শ্রম আইন';
  } else if (rawCat.includes('ifrs') || rawCat.includes('ias') || rawCat.includes('audit')) {
    categoryKey = 'ias-ifrs';
    categoryLabel = 'আইএএস, আইএফআরএস ও অডিট';
  }

  const educatorName = item.educator || item.instructor || item.teacher || 'Senior Faculty Member';
  const educatorAvatar =
    item.educator_avatar ||
    item.educator_image ||
    item.instructor_avatar ||
    item.instructor_image ||
    item.avatar ||
    null;
  const educatorDesignation =
    item.educator_designation ||
    item.instructor_designation ||
    item.designation ||
    item.educator_title ||
    null;
  const educatorBio =
    item.educator_bio ||
    item.instructor_bio ||
    item.bio ||
    null;
  const educatorRating =
    typeof item.educator_rating === 'number'
      ? item.educator_rating
      : typeof item.rating === 'number' && item.rating > 0
      ? item.rating
      : null;
  const totalStudentsNum = typeof item.total_students === 'number' ? item.total_students : 0;

  // Extract video link from backend response (supports video, vide, video_link, video_url, etc.)
  let rawVideoLink: string | null =
    item.video ||
    item.vide ||
    item.video_link ||
    item.video_url ||
    item.videoLink ||
    item.videoUrl ||
    item.demo_video ||
    item.demo_video_link ||
    item.demo_video_url ||
    item.youtube_link ||
    item.youtube_url ||
    item.intro_video ||
    null;

  if (!rawVideoLink && item && typeof item === 'object') {
    const matchingVideoKey = Object.keys(item).find(
      (k) =>
        k.toLowerCase().includes('vide') &&
        typeof item[k] === 'string' &&
        item[k].trim().length > 0
    );
    if (matchingVideoKey) {
      rawVideoLink = item[matchingVideoKey].trim();
    }
  }

  return {
    id: `api-${courseId}`,
    slug: rawName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `course-${courseId}`,
    title: rawName,
    titleEn: rawName,
    category: categoryKey,
    categoryLabel: item.category || categoryLabel,
    badge: isFree ? 'ফ্রি কোর্স' : `${levelUpper} ব্যাচ`,
    batchNumber: item.class_id || `Batch-${courseId}`,
    startDate: item.start_date || 'চলতি সেশনে ওপেন',
    startDateEn: item.start_date || 'Open Admission',
    schedule: `${timeText} (${daysText})`,
    scheduleEn: `${timeTextEn} (${daysText})`,
    duration: item.start_date && item.end_date ? `${item.start_date} হতে ${item.end_date}` : '৬ মাস মেয়াদি হ্যান্ডস-অন ট্র্যাক',
    durationEn: item.start_date && item.end_date ? `${item.start_date} to ${item.end_date}` : '6 Months Hands-on Track',
    totalClasses: levelUpper.includes('ADVANCED') ? 48 : 36,
    seatsLeft: Math.max(5, 38 - totalStudentsNum),
    totalSeats: 40,
    price: parsedPrice,
    originalPrice: isFree ? 0 : Math.round(parsedPrice * 1.6),
    rating: typeof item.rating === 'number' ? item.rating : 0,
    enrolledCount: totalStudentsNum,
    tags: [
      item.category || 'Professional Track',
      rawLevel,
      ...(item.language ? [item.language] : []),
    ],
    mentors: [
      {
        name: educatorName,
        role: item.category || 'Lead Educator',
        company: 'Chartered Officer Limited (cfoedubd.com)',
        experience: `${rawLevel} Level`,
        avatar: DUMMY_PERSON_AVATAR,
      },
    ],
    educator: educatorName,
    educatorAvatar: educatorAvatar,
    educatorDesignation: educatorDesignation,
    educatorBio: educatorBio,
    educatorRating: educatorRating,
    classId: item.class_id || `CLS-${courseId}`,
    days: days,
    timeSlot: time,
    language: item.language || null,
    level: rawLevel,
    minAge: typeof item.min_age === 'number' ? item.min_age : 0,
    maxAge: typeof item.max_age === 'number' ? item.max_age : 0,
    endDate: item.end_date || null,
    meetLink: item.meet_link || null,
    video: rawVideoLink,
    vide: rawVideoLink,
    videoLink: rawVideoLink,
    video_link: rawVideoLink,
    video_url: rawVideoLink,
    totalStudents: totalStudentsNum,
    status: typeof item.status === 'number' ? item.status : 1,
    description:
      item.description ||
      `${rawName} (${item.category || 'Professional Program'}) — পরিচালিত হচ্ছে ${educatorName}-এর তত্ত্বাবধানে।`,
    descriptionEn:
      item.descriptionEn ||
      `${rawName} (${item.category || 'Professional Program'}) — conducted by ${educatorName}.`,
    syllabus: Array.isArray(item.syllabus) ? item.syllabus : [],
    skillsLearned: Array.isArray(item.skillsLearned) ? item.skillsLearned : [],
    projects: Array.isArray(item.projects) ? item.projects : [],
    prerequisites: Array.isArray(item.prerequisites) ? item.prerequisites : [],
    tools: Array.isArray(item.tools) ? item.tools : [],
    isFeatured: parsedPrice > 10000 || levelUpper.includes('ADVANCED'),
  };
}

export const HIRING_PARTNERS = [
  { name: 'Beximco Group', role: 'Conglomerate Finance', count: '35+ CFO Graduates' },
  { name: 'Square Pharmaceuticals', role: 'Corporate Accounts', count: '28+ Officers' },
  { name: 'Grameenphone', role: 'Treasury & FP&A', count: '24+ Analysts' },
  { name: 'City Bank PLC', role: 'Commercial & Trade Finance', count: '30+ Managers' },
  { name: 'BRAC Bank', role: 'Credit & Risk Management', count: '22+ Specialists' },
  { name: 'Unilever Bangladesh', role: 'Supply Chain & Costing', count: '18+ Leads' },
  { name: 'BAT Bangladesh', role: 'Corporate Reporting', count: '15+ Accountants' },
  { name: 'IDLC Finance', role: 'Corporate Investment', count: '19+ Executives' },
  { name: 'Pran-RFL Group', role: 'Factory VAT & Tax Head', count: '40+ Officers' },
  { name: 'Walton Hi-Tech', role: 'ERP Financial Systems', count: '25+ Leads' },
  { name: 'Meghna Group (MGI)', role: 'Customs & Port Logistics', count: '20+ Managers' },
  { name: 'Apex Footwear Ltd', role: 'Internal Audit & Control', count: '16+ Controllers' },
];

export const COURSES: Course[] = [
  {
    id: 'cfo-flagship-1yr',
    slug: 'chartered-financial-officer-program',
    title: 'Chartered Financial Officer (CFO) - ১ বছর মেয়াদি ফ্ল্যাগশিপ প্রোগ্রাম',
    titleEn: 'Chartered Financial Officer (CFO) - 1-Year Executive Program',
    category: 'cfo-flagship',
    categoryLabel: 'ফ্ল্যাগশিপ চার্টার্ড প্রোগ্রাম',
    badge: 'ফ্ল্যাগশিপ প্রোগ্রাম',
    batchNumber: 'ব্যাচ ১৮ (ফল সেশন)',
    startDate: '২৮ সেপ্টেম্বর, ২০২৬',
    startDateEn: 'Sep 28, 2026',
    schedule: 'শুক্র ও শনিবার সন্ধ্যা ৭:০০ - ৯:৩০ (অনলাইন ও হাইব্রিড)',
    scheduleEn: 'Fri & Sat 7:00 PM - 9:30 PM (Online & Campus)',
    duration: '১ বছর (৩টি সেমিস্টার, ৯০+ ক্লাস)',
    durationEn: '1 Year (3 Semesters, 90+ Classes)',
    totalClasses: 92,
    seatsLeft: 8,
    totalSeats: 45,
    price: 45000,
    originalPrice: 60000,
    rating: 4.95,
    enrolledCount: 840,
    tags: ['CFO Certification', 'Corporate Governance', 'Financial Leadership', 'ACCA Pathway', 'Executive Leadership'],
    mentors: [
      {
        name: 'মো. শফিকুল আলম, FCA, FCMA',
        role: 'প্রতিষ্ঠাতা ও প্রিন্সিপাল মেন্টর',
        company: 'Chartered Officer Limited & Ex-Group CFO',
        experience: '২৫+ বছর করপোরেট ও ফাইন্যান্সিয়াল লিডারশিপ',
        avatar: DUMMY_PERSON_AVATAR,
      },
      {
        name: 'কাজী জহিরুল ইসলাম, FCA, ACCA',
        role: 'লিড ফ্যাকাল্টি - করপোরেট ফাইন্যান্স',
        company: 'পার্টনার, এক্রিডিটেড অডিট ফার্ম ও কনসালট্যান্ট',
        experience: '১৮+ বছর করপোরেট রিপোর্টিং ও ভ্যালুয়েশন',
        avatar: DUMMY_PERSON_AVATAR,
      },
    ],
    description: 'কর্পোরেট জগতের শীর্ষ ফাইন্যান্সিয়াল লিডার বা CFO হতে প্রয়োজনীয় ফাইন্যান্সিয়াল লিডারশিপ, আইএফআরএস প্র্যাকটিক্যাল অ্যাপ্লিকেশন, এসএপি ফাইকো ইআরপি, ভ্যাট ও ট্যাক্স আইন এবং ট্রেজারি ম্যানেজমেন্টের পূর্ণাঙ্গ প্র্যাকটিক্যাল জ্ঞান অর্জন করুন। ৩টি সেমিস্টারে বিভক্ত ইন্ডাস্ট্রি-ফার্স্ট কারিকুলাম।',
    descriptionEn: 'Equip yourself with practical leadership skills, SAP-FICO ERP, IFRS implementation, Income Tax Act 2023, VAT Act 2012, and Boardroom Treasury Management across 3 comprehensive semesters to lead as a top Chief Financial Officer.',
    syllabus: [
      {
        week: 1,
        title: 'সেমিস্টার ১: ফাইন্যান্সিয়াল লিডারশিপ, ফিনটেক ও আইএফআরএস পার্ট-১',
        topics: [
          'Financial Leadership & Strategic Change Management in Corporate Sector',
          'Fintech Foundations: TallyPrime Enterprise & Advanced Financial Excel',
          'Financial Statement Analysis, Ratio Interpretation & Working Capital Optimization',
          'Business Application with IAS 1, IAS 2, IAS 16 & IFRS 15 Revenue Accounting',
          'Live Corporate Case Study: Transitioning from Accountant to Strategic Business Partner',
        ],
        project: 'কর্পোরেট ফাইন্যান্সিয়াল ড্যাশবোর্ড ও ৩ বছরের হিস্টোরিক্যাল স্টেটমেন্ট অডিট প্রজেক্ট',
      },
      {
        week: 2,
        title: 'সেমিস্টার ২: বিজনেস প্ল্যানিং (FP&A), SAP-FICO ও ভ্যাট-ট্যাক্স কমপ্লায়েন্স',
        topics: [
          'Strategic Business Planning & Analysis (FP&A): Rolling Forecasts & Zero-Base Budgeting',
          'Enterprise ERP Implementation: SAP-FICO (GL, AP, AR, Asset Accounting, Cost Center)',
          'Corporate Income Tax Act 2023: Tax Planning, Allowable Expenses, Minimum Tax & TDS',
          'VAT Act 2012: Input Tax Credit, Mushak 6.3, 6.5, 9.1 Return Filing & VDS Deductions',
          'IAS 12 Income Taxes & IFRS 16 Leases Corporate Calculation Models',
        ],
        project: 'মাল্টিন্যাশনাল কোম্পানির জন্য পূর্ণাঙ্গ SAP FICO চার্ট অফ অ্যাকাউন্টস ও ভ্যাট রিটার্ন প্রস্তুতকরণ',
      },
      {
        week: 3,
        title: 'সেমিস্টার ৩: কোম্পানি অ্যাফেয়ার্স, ট্রেজারি, ইন্টারনাল অডিট ও অ্যাডভান্সড রিপোর্টিং',
        topics: [
          'Company Act 1994, RJSC Compliance & Secretarial Practices for CFOs',
          'Banking Relationship, Trade Finance (LC, UPAS, Offshore Banking) & FX Hedging',
          'Internal Control Framework (COSO), Enterprise Risk Management (ERM) & Fraud Auditing',
          'Corporate Business Valuation (DCF, Comparable Multiples, M&A Modeling)',
          'Boardroom Reporting, Investor Pitching & Preparation for Annual Convocation',
        ],
        project: 'ক্যাপস্টোন প্রজেক্ট: একটি লিস্টেড কোম্পানির জন্য এক্সিকিউটিভ CFO স্ট্র্যাটেজিক মাস্টারপ্ল্যান',
      },
    ],
    skillsLearned: [
      'Strategic Financial Leadership',
      'SAP-FICO ERP Financials',
      'Corporate Tax Act 2023 & NBR SROs',
      'VAT Act 2012 & Mushak Compliance',
      'IFRS & IAS Practical Application',
      'Treasury & Trade Finance Operations',
      'Corporate Valuation & Financial Modeling',
      'Internal Audit & Board Reporting',
    ],
    projects: [
      'লিস্টেড ফার্মের জন্য সম্পূর্ণ আইএফআরএস কমপ্লায়েন্ট অডিটেড ব্যালেন্স শিট প্রস্তুতকরণ',
      'এসএপি-ফাইকো (SAP-FICO) সিস্টেমে মাল্টি-ব্রাঞ্চ ইআরপি ট্রানজেকশন সিমুলেশন',
      'কর্পোরেট গ্রুপ অব ইন্ডাস্ট্রিজের জন্য ট্যাক্স-অপ্টিমাইজড ইনকাম ট্যাক্স রিটার্ন ফাইল',
    ],
    prerequisites: ['বাণিজ্য বিভাগে স্নাতক/স্নাতকোত্তর বা ন্যূনতম ২ বছরের অ্যাকাউন্টিং/ফাইন্যান্স কাজের অভিজ্ঞতা'],
    tools: ['SAP-FICO ERP', 'TallyPrime Enterprise', 'Microsoft Excel for Finance', 'Power BI', 'NBR e-Tax Portal'],
    isPopular: true,
    isFeatured: true,
  },
  {
    id: 'diploma-vat-tax',
    slug: 'post-graduate-diploma-customs-vat-tax-trade',
    title: 'Professional PGD in Customs, VAT, TAX & Trade Management',
    titleEn: 'Professional PGD in Customs, VAT, TAX & Trade Management',
    category: 'tax-vat',
    categoryLabel: 'ট্যাক্স ও ভ্যাট একাডেমি',
    badge: 'ডিগ্রি ডিপ্লোমা',
    batchNumber: 'ব্যাচ ১২',
    startDate: '৫ অক্টোবর, ২০২৬',
    startDateEn: 'Oct 5, 2026',
    schedule: 'শুক্র ও শনিবার বিকাল ৪:০০ - ৬:৩০',
    scheduleEn: 'Fri & Sat 4:00 PM - 6:30 PM',
    duration: '৬ মাস (৪৮টি লাইভ ক্লাস ও ল্যাব)',
    durationEn: '6 Months (48 Live Classes)',
    totalClasses: 48,
    seatsLeft: 12,
    totalSeats: 50,
    price: 22500,
    originalPrice: 32000,
    rating: 4.92,
    enrolledCount: 1120,
    tags: ['Income Tax Act 2023', 'VAT Act 2012', 'Customs SRO', 'Bonded Warehouse', 'NBR Compliance'],
    mentors: [
      {
        name: 'মোহাম্মদ মনিরুজ্জামান, FCMA',
        role: 'সাবেক এনবিআর টেক্সটাইল ভ্যাট কমিটির কনসালট্যান্ট',
        company: 'Tax & VAT Legal Advisory Group',
        experience: '২২+ বছর ট্যাক্সেশন ও কাস্টমস লিগ্যাল প্র্যাকটিস',
        avatar: DUMMY_PERSON_AVATAR,
      },
    ],
    description: 'নতুন আয়কর আইন ২০২৩, ভ্যাট আইন ২০১২ এবং আন্তর্জাতিক কাস্টমস রুলস অনুযায়ী প্র্যাকটিক্যাল হ্যান্ডস-অন ট্রেনিং। এসআরও ইন্টারপ্রিটেশন, মুসক ৬.৩, মুসক ৯.১ সাবমিশন এবং বন্ডেড ওয়্যারহাউস অডিট সিস্টেম সরাসরি শিখুন।',
    descriptionEn: 'Master the New Income Tax Act 2023, VAT Act 2012, Customs Act, and international trade operations through real NBR portal filings and case studies.',
    syllabus: [
      {
        week: 1,
        title: 'সেকশন ১: ইনকাম ট্যাক্স অ্যাক্ট ২০২৩ ও করপোরেট ট্যাক্স প্ল্যানিং',
        topics: [
          'আয়কর আইন ২০২৩ এর মূল পরিবর্তন ও কর্পোরেট কর হার',
          'Tax Deducted at Source (TDS): ধারা ও রুলস অনুযায়ী সঠিক কর্তন',
          'Allowable vs Inadmissible Expenses under Section 49 & 55',
          'Transfer Pricing & International Transactions Compliance',
        ],
      },
      {
        week: 2,
        title: 'সেকশন ২: মূসক ও সম্পূরক শুল্ক আইন ২০১২ ও প্র্যাকটিক্যাল কমপ্লায়েন্স',
        topics: [
          'মূল্য সংযোজন কর (VAT) বেসিক কনসেপ্ট ও ইনপুট ট্যাক্স ক্রেডিট রুলস',
          'মুসক ৬.১, ৬.২, ৬.৩, ৬.৫ চালান তৈরি ও ইনভয়েস ম্যানেজমেন্ট',
          'মুসক ৯.১ অনলাইন রিটার্ন প্রস্তুতকরণ এবং সাবমিশন পদ্ধতি',
          'VDS (ভ্যাট উৎসে কর্তন) ও সরকারি ট্রেজারি চালান যাচাইকরণ',
        ],
      },
      {
        week: 3,
        title: 'সেকশন ৩: কাস্টমস আইন, এক্সপোর্ট-ইমপোর্ট ও বন্ডেড ওয়্যারহাউস',
        topics: [
          'Customs Assessment, HS Code Classification & Valuation Rules',
          'Export-Import Letter of Credit (LC) Terms & Incoterms 2020',
          'Special Bonded Warehouse (SBW) License, Audit & UD/UP Reconciliation',
          'Handling Customs & VAT Audits, Appeals & Dispute Resolution',
        ],
      },
    ],
    skillsLearned: ['Income Tax Act 2023', 'VAT Act 2012', 'Mushak 9.1 Filing', 'TDS & VDS Deductions', 'Customs Tariff & HS Code', 'Bonded Warehouse Audit'],
    projects: ['একটি ম্যানুফ্যাকচারিং প্ল্যান্টের ৩ মাসের ভ্যাট রিটার্ন অডিট ও মুসক ৯.১ আপলোড', 'কর্পোরেট ইনকাম ট্যাক্স রিটার্ন ফাইল অ্যাসেসমেন্ট'],
    prerequisites: ['অ্যাকাউন্টিং বেসিক্স ও ট্যাক্সেশনের প্রতি আগ্রহ'],
    tools: ['NBR e-Tax Portal', 'NBR IVAS Online VAT System', 'Excel Tax Calculation Sheets'],
    isPopular: true,
    isFeatured: true,
  },
  {
    id: 'pgd-sap-fico-fintech',
    slug: 'advanced-fintech-sap-fico-financial-analytics',
    title: 'Advanced Fintech with SAP-FICO & Financial Analytics (Power BI)',
    titleEn: 'Advanced Fintech with SAP-FICO & Financial Analytics (Power BI)',
    category: 'fintech-erp',
    categoryLabel: 'ফিনটেক ও এসএপি ইআরপি',
    badge: 'প্রফেশনাল ডিপ্লোমা',
    batchNumber: 'ব্যাচ ০৯',
    startDate: '১২ অক্টোবর, ২০২৬',
    startDateEn: 'Oct 12, 2026',
    schedule: 'রবি ও বুধবার রাত ৮:৩০ - ১০:৩০',
    scheduleEn: 'Sun & Wed 8:30 PM - 10:30 PM',
    duration: '৫ মাস (৪০টি লাইভ ল্যাব ক্লাস)',
    durationEn: '5 Months (40 Live Lab Sessions)',
    totalClasses: 40,
    seatsLeft: 10,
    totalSeats: 40,
    price: 25000,
    originalPrice: 35000,
    rating: 4.88,
    enrolledCount: 650,
    tags: ['SAP FICO', 'Enterprise ERP', 'Power BI for Finance', 'Financial Modeling', 'Fintech Tools'],
    mentors: [
      {
        name: 'ফারুক আহমেদ, SAP Certified FICO Consultant',
        role: 'সিনিয়র এসএপি আর্কিটেক্ট',
        company: 'গ্লোবাল ইআরপি সলিউশনস পার্টনার',
        experience: '১৬+ বছর এসএপি রোলআউট ও কনফিগারেশন',
        avatar: DUMMY_PERSON_AVATAR,
      },
    ],
    description: 'মাল্টিন্যাশনাল ও বড় কর্পোরেট গ্রুপগুলোতে ব্যবহৃত শীর্ষ ইআরপি সফটওয়্যার SAP-FICO এর জেনারেল লেজার, অ্যাকাউন্টস পেয়েবল, অ্যাকাউন্টস রিসিভেবল, ফিক্সড অ্যাসেট এবং কস্টিং কনফিগারেশন শিখুন। সাথে থাকছে পাওয়ার বিআই দিয়ে রিয়েল-টাইম ফাইন্যান্সিয়াল ড্যাশবোর্ড তৈরি।',
    descriptionEn: 'Configure enterprise-grade SAP-FICO modules (GL, AP, AR, Asset Accounting, Cost Center) and design interactive real-time C-suite executive financial dashboards using Power BI and DAX.',
    syllabus: [
      {
        week: 1,
        title: 'মডিউল ১: এসএপি ইআরপি এন্টারপ্রাইজ স্ট্রাকচার ও জেনারেল লেজার (FI-GL)',
        topics: [
          'SAP Architecture, Company Code, Chart of Accounts, Fiscal Year Variant',
          'General Ledger Master Data, Posting Periods & Document Splitting',
          'Foreign Currency Valuation & Accrual/Deferral Posting in SAP',
        ],
      },
      {
        week: 2,
        title: 'মডিউল ২: অ্যাকাউন্টস পেয়েবল (AP), রিসিভেবল (AR) ও অ্যাসেট অ্যাকাউন্টিং (AA)',
        topics: [
          'Vendor Master Data, Automatic Payment Program (F110) & Withholding Tax in SAP',
          'Customer Credit Management, Dunning Procedures & Cash Application',
          'Asset Class, Depreciation Key Setup, Capitalization of CIP & Asset Retirement',
        ],
      },
      {
        week: 3,
        title: 'মডিউল ৩: কন্ট্রোলিং (CO) বেসিক ও পাওয়ার বিআই ফাইন্যান্সিয়াল অ্যানালিটিক্স',
        topics: [
          'Cost Center Accounting, Profit Center Accounting & Internal Orders',
          'Connecting SAP Data into Microsoft Power BI via Data Gateway',
          'Executive KPI Dashboard: EBITDA, Liquidity, DSO, DPO & Variance Analysis',
        ],
      },
    ],
    skillsLearned: ['SAP FICO Configuration', 'Enterprise GL, AP, AR, AA', 'Power BI Financial Dashboarding', 'DAX Financial Formulas', 'ERP Audit Trails'],
    projects: ['একটি ম্যানুফ্যাকচারিং কোম্পানির জন্য এন্টারপ্রাইজ এসএপি-ফাইকো ব্লুপ্রিন্ট কনফিগারেশন', 'বোর্ড ডিরেক্টরদের জন্য লাইভ পাওয়ার বিআই এক্সিকিউটিভ ড্যাশবোর্ড'],
    prerequisites: ['অ্যাকাউন্টিং ডেবিট-ক্রেডিট জ্ঞান ও সাধারণ এক্সেল দক্ষতা'],
    tools: ['SAP S/4HANA & ECC 6.0', 'Microsoft Power BI', 'Advanced Excel'],
    isPopular: true,
    isFeatured: false,
  },
  {
    id: 'pgd-fpa-valuation',
    slug: 'financial-planning-analysis-corporate-valuation',
    title: 'Corporate Financial Planning & Analysis (FP&A) and Business Valuation',
    titleEn: 'Corporate Financial Planning & Analysis (FP&A) and Business Valuation',
    category: 'fpa-valuation',
    categoryLabel: 'এফপি অ্যান্ড এ ও ভ্যালুয়েশন',
    badge: 'এক্সিকিউটিভ কোর্স',
    batchNumber: 'ব্যাচ ০৭',
    startDate: '২০ অক্টোবর, ২০২৬',
    startDateEn: 'Oct 20, 2026',
    schedule: 'সোম ও বৃহস্পতিবার রাত ৮:০০ - ১০:০০',
    scheduleEn: 'Mon & Thu 8:00 PM - 10:00 PM',
    duration: '৪ মাস (৩২টি প্র্যাকটিক্যাল সেশন)',
    durationEn: '4 Months (32 Live Sessions)',
    totalClasses: 32,
    seatsLeft: 14,
    totalSeats: 35,
    price: 20000,
    originalPrice: 28000,
    rating: 4.9,
    enrolledCount: 480,
    tags: ['FP&A', 'DCF Valuation', 'M&A Modeling', 'Strategic Budgeting', 'Scenario Analysis'],
    mentors: [
      {
        name: 'নজরুল ইসলাম, FCA',
        role: 'ভাইস প্রেসিডেন্ট ও হেড অফ ট্রেজারি',
        company: 'লিডিং কমার্শিয়াল ব্যাংক পিএলসি',
        experience: '১৭+ বছর ইনভেস্টমেন্ট ব্যাংকিং ও ফাইন্যান্সিয়াল মডেলিং',
        avatar: DUMMY_PERSON_AVATAR,
      },
    ],
    description: 'আধুনিক করপোরেট এফপি&এ স্ট্র্যাটেজি, ৩-স্টেটমেন্ট ডাইনামিক ফাইন্যান্সিয়াল মডেলিং, ডিসকাউন্টেড ক্যাশ ফ্লো (DCF) বিজনেস ভ্যালুয়েশন, মার্জার অ্যান্ড অ্যাকুইজিশন (M&A) অ্যানালাইসিস এবং বাজেট ভ্যারিয়েন্স ট্র্যাকিং শিখুন।',
    descriptionEn: 'Build 3-statement integrated financial forecast models, perform discounted cash flow (DCF) business valuation, sensitivity stress testing, and scenario planning.',
    syllabus: [
      {
        week: 1,
        title: 'পার্ট ১: ইন্টিগ্রেটেড ৩-স্টেটমেন্ট ফাইন্যান্সিয়াল মডেলিং',
        topics: [
          'Historical Financial Statement Restructuring & Clean-up',
          'Revenue Drivers, Cost Drivers & CapEx Depreciation Schedules',
          'Dynamic Debt Schedule, Revolver Mechanics & Circular Reference Resolution',
        ],
      },
      {
        week: 2,
        title: 'পার্ট ২: ডিসকাউন্টেড ক্যাশ ফ্লো (DCF) ও কর্পোরেট ভ্যালুয়েশন',
        topics: [
          'Free Cash Flow to Firm (FCFF) vs Free Cash Flow to Equity (FCFE)',
          'Cost of Capital (WACC), Beta Unlevering/Relevering & Terminal Value',
          'Trading Comps (EV/EBITDA, P/E) & Precedent Transaction Benchmarking',
        ],
      },
      {
        week: 3,
        title: 'পার্ট ৩: বাজেট প্ল্যানিং, রোলিং ফোরকাস্ট ও সিনারিও সিমুলেশন',
        topics: [
          'Budget vs Actual Variance Analysis & Waterfall Attribution',
          'Monte Carlo Simulation & Sensitivity Data Tables',
          'CFO Executive Pitch Deck & Board Investment Memo Preparation',
        ],
      },
    ],
    skillsLearned: ['Dynamic 3-Statement Modeling', 'WACC & DCF Corporate Valuation', 'Rolling Forecasts & Budgeting', 'Sensitivity Stress Testing', 'M&A Deal Modeling'],
    projects: ['ঢাকা স্টক এক্সচেঞ্জ (DSE) তালিকাভুক্ত কোম্পানির কমপ্লিট DCF ভ্যালুয়েশন মডেল', 'মাল্টি-সিনারিও করপোরেট ফাইভ ইয়ার বিজনেস প্ল্যান'],
    prerequisites: ['ফাইন্যান্সিয়াল স্টেটমেন্ট ও ব্যালেন্স শিট বোঝার দক্ষতা'],
    tools: ['Microsoft Excel (Financial Modeling Toolkit)', 'Capital IQ Benchmark Data'],
    isPopular: false,
    isFeatured: true,
  },
  {
    id: 'diploma-supply-chain',
    slug: 'post-graduate-diploma-supply-chain-lean-six-sigma',
    title: 'Post Graduate Diploma in Logistics & Supply Chain (with Lean Six Sigma)',
    titleEn: 'Post Graduate Diploma in Logistics & Supply Chain (with Lean Six Sigma)',
    category: 'supply-chain',
    categoryLabel: 'সাপ্লাই চেইন একাডেমি',
    badge: 'প্রফেশনাল ডিপ্লোমা',
    batchNumber: 'ব্যাচ ১১',
    startDate: '২৫ অক্টোবর, ২০২৬',
    startDateEn: 'Oct 25, 2026',
    schedule: 'শুক্র ও শনিবার সকাল ১০:০০ - ১২:৩০',
    scheduleEn: 'Fri & Sat 10:00 AM - 12:30 PM',
    duration: '৪ মাস (৩২টি লাইভ ক্লাস)',
    durationEn: '4 Months (32 Live Classes)',
    totalClasses: 32,
    seatsLeft: 11,
    totalSeats: 45,
    price: 18500,
    originalPrice: 26000,
    rating: 4.87,
    enrolledCount: 520,
    tags: ['Supply Chain Analytics', 'Lean Six Sigma', 'Warehouse Management', 'Procurement', 'Inventory Optimization'],
    mentors: [
      {
        name: 'সৈয়দ মাহবুবুর রহমান, CSCA',
        role: 'সাপ্লাই চেইন ডিরেক্টর ও ইন্ডাস্ট্রি কনসালট্যান্ট',
        company: 'Ex-BAT & Leading FMCG Multinational',
        experience: '২০+ বছর এন্ড-টু-এন্ড সাপ্লাই চেইন ম্যানেজমেন্ট',
        avatar: DUMMY_PERSON_AVATAR,
      },
    ],
    description: 'এন্ড-টু-এন্ড সাপ্লাই চেইন প্ল্যানিং, কৌশলগত সোর্সিং ও প্রকিউরমেন্ট, ওয়্যারহাউস ও ইনভেন্টরি অপটিমাইজেশন (EOQ, Safety Stock) এবং লিন সিক্স সিগমা গ্রিন বেল্ট মেথডোলজি দিয়ে অপারেশনাল অপচয় দূর করার প্র্যাকটিক্যাল গাইড।',
    descriptionEn: 'Master end-to-end supply chain logistics, demand forecasting, international procurement, warehouse operations, and Lean Six Sigma Green Belt process optimization.',
    syllabus: [
      {
        week: 1,
        title: 'মডিউল ১: স্ট্র্যাটেজিক সাপ্লাই চেইন প্ল্যানিং ও ডিমান্ড ফোরকাস্টিং',
        topics: [
          'Supply Chain Operations Reference (SCOR) Framework',
          'Demand Planning, Time Series Forecasting & Sales and Operations Planning (S&OP)',
          'Strategic Sourcing, Supplier Negotiation & Kraljic Matrix Analysis',
        ],
      },
      {
        week: 2,
        title: 'মডিউল ২: ওয়্যারহাউস, ইনভেন্টরি কন্ট্রোল ও ট্রান্সপোর্টেশন লজিস্টিকস',
        topics: [
          'Economic Order Quantity (EOQ), Safety Stock & ABC-FSN Classification',
          'Warehouse Layout Design, 5S Implementation & Barcode/RFID Technology',
          'Port Clearance, Freight Forwarding, Custom Tariffs & Incoterms 2020',
        ],
      },
      {
        week: 3,
        title: 'মডিউল ৩: লিন সিক্স সিগমা গ্রিন বেল্ট (DMAIC) মেথডোলজি',
        topics: [
          'Define, Measure, Analyze, Improve, Control (DMAIC) Roadmap',
          'Value Stream Mapping (VSM) & Waste (Muda) Identification',
          'Statistical Process Control (SPC), Pareto Charts & Root Cause Fishbone Analysis',
        ],
      },
    ],
    skillsLearned: ['Demand & Supply Planning', 'Inventory Control Models', 'Lean Six Sigma DMAIC', 'Procurement & Negotiation', 'Warehouse Management Systems'],
    projects: ['একটি এফএমসিজি প্ল্যান্টের জন্য ইনভেন্টরি হোল্ডিং কস্ট ২৫% হ্রাসের লিন কেস স্টাডি', 'এন্ড-টু-এন্ড গ্লোবাল প্রকিউরমেন্ট ও ফ্রেইট অপটিমাইজেশন প্ল্যান'],
    prerequisites: ['স্নাতক ডিগ্রি বা সাপ্লাই চেইন/অপারেশনসে আগ্রহ'],
    tools: ['Minitab', 'Advanced Excel SCM Model', 'WMS Software Simulation'],
    isPopular: false,
    isFeatured: false,
  },
  {
    id: 'diploma-hrm-labor-law',
    slug: 'professional-pgd-human-resource-management-labor-law',
    title: 'Professional PGD in Human Resource Management & Bangladesh Labor Law',
    titleEn: 'Professional PGD in Human Resource Management & Bangladesh Labor Law',
    category: 'hrm-legal',
    categoryLabel: 'এইচআর ও শ্রম আইন',
    badge: 'প্রফেশনাল ডিপ্লোমা',
    batchNumber: 'ব্যাচ ১০',
    startDate: '১ নভেম্বর, ২০২৬',
    startDateEn: 'Nov 1, 2026',
    schedule: 'শুক্র ও শনিবার সন্ধ্যা ৬:৩০ - ৯:০০',
    scheduleEn: 'Fri & Sat 6:30 PM - 9:00 PM',
    duration: '৪ মাস (৩২টি লাইভ ক্লাস)',
    durationEn: '4 Months (32 Live Classes)',
    totalClasses: 32,
    seatsLeft: 15,
    totalSeats: 40,
    price: 18000,
    originalPrice: 25000,
    rating: 4.85,
    enrolledCount: 390,
    tags: ['Labor Law 2006', 'Labor Rules 2015', 'Payroll Management', 'Strategic HRM', 'Employee Relations'],
    mentors: [
      {
        name: 'ড. ফারহানা ইয়াসমিন',
        role: 'হেড অফ এইচআর ও করপোরেট লিগ্যাল অ্যাডভাইজার',
        company: 'মাল্টিন্যাশনাল টেলিকম ও কনসাল্টিং গ্রুপ',
        experience: '১৮+ বছর হিউম্যান রিসোর্স স্ট্র্যাটেজি ও লেবার ল',
        avatar: DUMMY_PERSON_AVATAR,
      },
    ],
    description: 'বাংলাদেশ শ্রম আইন ২০০৬ (২০১৮ পর্যন্ত সংশোধিত) এবং বাংলাদেশ শ্রম বিধিমালা ২০১৫ অনুযায়ী নিয়োগ, ডিসিপ্লিনারি অ্যাকশন, গ্র্যাচুইটি, প্রভিডেন্ট ফান্ড ও পে-রোল ম্যানেজমেন্টের খুঁটিনাটি। সাথে আধুনিক স্ট্র্যাটেজিক এইচআর ও কেপিআই মূল্যায়ন।',
    descriptionEn: 'In-depth practical understanding of the Bangladesh Labor Act 2006 & Labor Rules 2015 covering employment contracts, disciplinary actions, separation, gratuity, provident fund, and payroll.',
    syllabus: [
      {
        week: 1,
        title: 'অংশ ১: বাংলাদেশ শ্রম আইন ২০০৬ (নিয়োগ, সার্ভিস বুক ও ছুটি বিধিমালা)',
        topics: [
          'Classification of Workers, Probation Period, Letter of Appointment & Service Book',
          'Working Hours, Overtime Calculation, Festival Leaves & Annual Earned Leaves',
          'Maternity Benefits, Health, Hygiene, Workplace Safety & Emergency Provisions',
        ],
      },
      {
        week: 2,
        title: 'অংশ ২: ডিসিপ্লিনারি প্রসিডিংস, শোকজ নোটিশ ও সেপারেশন ম্যানেজমেন্ট',
        topics: [
          'Misconduct Definitions, Draft Show Cause Notice & Charge Sheet Formulation',
          'Domestic Inquiry Protocol, Principles of Natural Justice & Punishment Orders',
          'Termination, Retrenchment, Discharge, Layoff & Legal Severance Benefits (Gratuity, PF)',
        ],
      },
      {
        week: 3,
        title: 'অংশ ৩: স্ট্র্যাটেজিক এইচআরএম, কেপিআই অ্যাসেসমেন্ট ও পে-রোল ম্যানেজমেন্ট',
        topics: [
          'HR Budgeting, Salary Structure Formulation (Basic, HRA, Medical, Allowances)',
          'Balanced Scorecard, OKR vs KPI Performance Management System (PMS)',
          'Industrial Relations, Trade Unions, Collective Bargaining & Labor Court Litigations',
        ],
      },
    ],
    skillsLearned: ['Labor Act 2006 & Rules 2015', 'Drafting Legal Show-cause & Inquiries', 'Corporate Payroll & TDS Deductions', 'KPI/OKR Appraisal Models', 'Dispute Resolution & Grievance'],
    projects: ['একটি পূর্ণাঙ্গ করপোরেট ডিসিপ্লিনারি ইনকোয়ারি প্রসিডিং ফাইল ড্রাফটিং', '৫০০ কর্মচারীর জন্য কমপ্লায়েন্ট পে-রোল ও বেনিফিট স্ট্রাকচার ডিজাইন'],
    prerequisites: ['এইচআর প্রফেশনাল, অ্যাডমিন কর্মকর্তা বা যে কোনো গ্র্যাজুয়েট'],
    tools: ['HRIS Software Templates', 'Excel Automated Payroll Sheets', 'Labor Court Case Precedents'],
    isPopular: false,
    isFeatured: false,
  },
  {
    id: 'cert-ias-ifrs-isa',
    slug: 'professional-executive-certificate-ias-ifrs-isa',
    title: 'Professional Executive Certificate in IAS, IFRS & ISA Implementation',
    titleEn: 'Professional Executive Certificate in IAS, IFRS & ISA Implementation',
    category: 'ias-ifrs',
    categoryLabel: 'অ্যাকাউন্টিং স্ট্যান্ডার্ডস',
    badge: 'সার্টিফিকেট কোর্স',
    batchNumber: 'ব্যাচ ০৮',
    startDate: '৮ নভেম্বর, ২০২৬',
    startDateEn: 'Nov 8, 2026',
    schedule: 'শনিবার ও মঙ্গলবার রাত ৮:০০ - ১০:০০',
    scheduleEn: 'Sat & Tue 8:00 PM - 10:00 PM',
    duration: '৩ মাস (২৪টি এক্সটেনসিভ সেশন)',
    durationEn: '3 Months (24 Extensive Sessions)',
    totalClasses: 24,
    seatsLeft: 12,
    totalSeats: 35,
    price: 16500,
    originalPrice: 22000,
    rating: 4.91,
    enrolledCount: 310,
    tags: ['IFRS 9', 'IFRS 15', 'IFRS 16', 'IAS 12', 'Auditing Standards ISA'],
    mentors: [
      {
        name: 'মো. শফিকুল আলম, FCA, FCMA',
        role: 'প্রিন্সিপাল ফ্যাকাল্টি',
        company: 'Chartered Officer Limited',
        experience: '২৫+ বছর কর্পোরেট রিপোর্টিং ও অডিট প্র্যাকটিস',
        avatar: DUMMY_PERSON_AVATAR,
      },
    ],
    description: 'আন্তর্জাতিক অ্যাকাউন্টিং স্ট্যান্ডার্ড (IAS) এবং ইন্টারন্যাশনাল ফাইন্যান্সিয়াল রিপোর্টিং স্ট্যান্ডার্ডস (IFRS) এর জটিল মানদণ্ডগুলো (IFRS 9, IFRS 15, IFRS 16) বাস্তব কর্পোরেট ব্যালেন্স শিটে প্রয়োগ করার পূর্ণাঙ্গ প্রায়োগিক প্রশিক্ষণ।',
    descriptionEn: 'Hands-on practical mastery over major International Financial Reporting Standards (IFRS 9, 15, 16, IAS 12) with full disclosure templates and auditor working papers.',
    syllabus: [
      {
        week: 1,
        title: 'মডিউল ১: আইএফআরএস ১৫ (রেভিনিউ ফ্রম কন্ট্রাক্টস উইথ কাস্টমারস)',
        topics: [
          '5-Step Revenue Recognition Model in Corporate Contracts',
          'Identifying Performance Obligations, Variable Consideration & Principal vs Agent',
          'Contract Asset, Contract Liability & Disclosure Requirements',
        ],
      },
      {
        week: 2,
        title: 'মডিউল ২: আইএফআরএস ১৬ (লিজেস) ও আইএএস ১২ (ইনকাম ট্যাক্সেস)',
        topics: [
          'Right of Use (ROU) Asset & Lease Liability Amortization Schedule',
          'Short-term & Low-value Lease Exemptions and Remeasurement Rules',
          'Deferred Tax Asset (DTA) vs Deferred Tax Liability (DTL) Reconciliation',
        ],
      },
      {
        week: 3,
        title: 'মডিউল ৩: আইএফআরএস ৯ (ফাইন্যান্সিয়াল ইন্সট্রুমেন্টস) ও আইএসএ অডিট ফ্রেমওয়ার্ক',
        topics: [
          'Classification and Measurement of Financial Assets (Amortized Cost, FVOCI, FVTPL)',
          'Expected Credit Loss (ECL) Impairment Provisioning Model for Banks & Corporates',
          'International Standards on Auditing (ISA) Audit Evidence & Key Audit Matters (KAM)',
        ],
      },
    ],
    skillsLearned: ['IFRS 15 Revenue 5-Step Model', 'IFRS 16 Lease Calculation Schedules', 'IFRS 9 Expected Credit Loss', 'Deferred Tax Calculations', 'ISA Audit Standards'],
    projects: ['একটি রিয়েল এস্টেট ও ম্যানুফ্যাকচারিং কোম্পানির জন্য আইএফআরএস ১৫ ও ১৬ কমপ্লায়েন্স শিট', 'এক্সিকিউটিভ অডিটেড ফাইনাল অ্যাকাউন্টস ডিসক্লোজার প্যাক'],
    prerequisites: ['অ্যাকাউন্টিং ডিগ্রি বা হিসাবরক্ষণ কাজের অভিজ্ঞতা'],
    tools: ['Excel IFRS Calculation Engines', 'Published Annual Reports of Listed Firms'],
    isPopular: false,
    isFeatured: false,
  },
];

export const WORKSHOPS: Workshop[] = [
  {
    id: 'ws-cfo-roadmap',
    title: 'করপোরেট ফাইন্যান্সিয়াল লিডার ও CFO হওয়ার পূর্ণাঙ্গ রোডম্যাপ',
    titleEn: 'Roadmap to Becoming a Chief Financial Officer (CFO) in Bangladesh',
    instructor: 'মো. শফিকুল আলম, FCA, FCMA',
    instructorRole: 'প্রতিষ্ঠাতা ও প্রিন্সিপাল মেন্টর',
    instructorCompany: 'Chartered Officer Limited (COL)',
    date: '২০ সেপ্টেম্বর, ২০২৬',
    time: 'রাত ৮:৩০ - ১০:০০',
    category: 'cfo-flagship',
    registeredCount: 540,
    totalSeats: 600,
    isLiveNow: false,
  },
  {
    id: 'ws-tax-act-2023',
    title: 'নতুন আয়কর আইন ২০২৩ ও বার্ষিক কর্পোরেট ট্যাক্স রিটার্ন ফাইলিং মাস্টারক্লাস',
    titleEn: 'Masterclass on Income Tax Act 2023 & Corporate Tax Filing',
    instructor: 'মোহাম্মদ মনিরুজ্জামান, FCMA',
    instructorRole: 'ভ্যাট ও ট্যাক্স স্পেশালিস্ট',
    instructorCompany: 'Tax Advisory Group',
    date: '২২ সেপ্টেম্বর, ২০২৬',
    time: 'রাত ৮:০০ - ৯:৩০',
    category: 'tax-vat',
    registeredCount: 680,
    totalSeats: 700,
    isLiveNow: true,
  },
  {
    id: 'ws-sap-fico-demo',
    title: 'মাল্টিন্যাশনাল কোম্পানিতে এসএপি-ফাইকো (SAP-FICO) ইআরপির বাস্তব ব্যবহার',
    titleEn: 'Practical Implementation of SAP-FICO ERP in Multinationals',
    instructor: 'ফারুক আহমেদ',
    instructorRole: 'এসএপি সার্টিফাইড আর্কিটেক্ট',
    instructorCompany: 'Global ERP Solutions',
    date: '২৫ সেপ্টেম্বর, ২০২৬',
    time: 'রাত ৯:০০ - ১০:৩০',
    category: 'fintech-erp',
    registeredCount: 420,
    totalSeats: 500,
    isLiveNow: false,
  },
  {
    id: 'ws-dcf-valuation',
    title: 'মার্জার ও ইনভেস্টমেন্টের জন্য ডিসকাউন্টেড ক্যাশ ফ্লো (DCF) ভ্যালুয়েশন টেকনিকস',
    titleEn: 'Discounted Cash Flow (DCF) Valuation for M&A & Private Equity',
    instructor: 'নজরুল ইসলাম, FCA',
    instructorRole: 'ভাইস প্রেসিডেন্ট',
    instructorCompany: 'Leading Commercial Bank PLC',
    date: '২৮ সেপ্টেম্বর, ২০২৬',
    time: 'রাত ৮:৩০ - ১০:০০',
    category: 'fpa-valuation',
    registeredCount: 390,
    totalSeats: 450,
    isLiveNow: false,
  },
];

export interface FaqItem {
  question: string;
  questionEn: string;
  answer: string;
  answerEn: string;
}

export const FAQS: FaqItem[] = [
  {
    question: 'CFOEDUBD-তে কী কী কোর্স অফার করা হয়?',
    questionEn: 'What courses do you offer at CFOEDUBD?',
    answer: 'আমরা চার্টার্ড ফাইন্যান্সিয়াল অফিসার (CFO), ভ্যাট ও ট্যাক্স, হিউম্যান রিসোর্স ম্যানেজমেন্ট (HRM), সাপ্লাই চেইন ম্যানেজমেন্ট এবং ফাইন্যান্সিয়াল টেকনোলজি (FinTech)-এর মতো প্রফেশনাল কোর্সসমূহ অফার করে থাকি।',
    answerEn: 'We offer a range of courses covering traditional topics like Chartered Financial Officer, VAT & TAX, Human Resource Management, Supply Chain Management, Financial Technology',
  },
  {
    question: 'প্রশিক্ষক কারা?',
    questionEn: 'Who are the instructors?',
    answer: 'আমাদের প্রশিক্ষকবৃন্দ স্ব-স্ব ক্ষেত্রে দীর্ঘদিনের অভিজ্ঞতাসম্পন্ন শীর্ষস্থানীয় পেশাদার। তাঁরা বাস্তব জীবনের কেস স্টাডি ও অভিজ্ঞতা ক্লাসরুমে তুলে ধরেন, যা শিক্ষার্থীদের ব্যবহারিক ও প্রাসঙ্গিক জ্ঞান নিশ্চিত করে।',
    answerEn: 'Our instructors are industry professionals with extensive experience in their respective fields. They bring real-world insights into the classroom, ensuring a practical and relevant learning experience',
  },
  {
    question: 'আপনারা কি অনলাইন কোর্স পরিচালনা করেন?',
    questionEn: 'Do you offer online courses?',
    answer: 'হ্যাঁ, শিক্ষার্থীদের সুবিধার কথা বিবেচনা করে আমরা সরাসরি অফলাইন ও অনলাইন উভয় মাধ্যমেই কোর্স পরিচালনা করে থাকি। আমাদের অনলাইন প্ল্যাটফর্মটি সম্পূর্ণ ইন্টারঅ্যাক্টিভ এবং এতে লাইভ সেশনের সুবিধা রয়েছে।',
    answerEn: 'Yes, we offer both in-person and online courses to cater to the diverse needs of our students. Our online platform is interactive and features live sessions, ensuring a comprehensive learning experience.',
  },
  {
    question: 'ভর্তির জন্য পূর্বশর্ত কী কী?',
    questionEn: 'What are the prerequisites for enrolling?',
    answer: 'কোর্স ভেদে পূর্বশর্ত ভিন্ন হয় যা প্রতিটি কোর্সের বিস্তারিত পৃষ্ঠায় উল্লেখ থাকে। সাধারণত ফিন্যান্স বা সংশ্লিষ্ট ক্ষেত্রে প্রাথমিক ধারণা থাকলেই অংশগ্রহণ করা যায়।',
    answerEn: 'Prerequisites vary by course and are specified on the course description page. Generally, a foundational understanding of finance or a related field is recommended.',
  },
  {
    question: 'আপনারা কি করপোরেট ট্রেনিং প্রদান করেন?',
    questionEn: 'Do you offer corporate training?',
    answer: 'হ্যাঁ, ফিন্যান্স এবং ফিনটেক ক্ষেত্রে কর্মীদের দক্ষতা বৃদ্ধির লক্ষ্যে আমরা বিভিন্ন প্রতিষ্ঠানের জন্য কাস্টমাইজড ট্রেনিং সল্যুশন প্রদান করে থাকি।',
    answerEn: 'Yes, we provide tailor-made training solutions for organizations looking to upskill their workforce in finance and FinTech.',
  },
];

export const TESTIMONIALS: Testimonial[] = [];

export interface VerifiedCertificate {
  id: string;
  credentialId: string;
  studentName: string;
  studentEmail: string;
  courseTitle: string;
  courseTitleEn: string;
  batchNumber: string;
  issueDate: string;
  verificationCode: string;
  btebRegistrationNo: string;
  grade: string;
  score?: number;
  status: 'Verified & Active' | 'Active' | 'Revoked';
  leadFaculty: string;
  modulesCompleted: number;
  capstoneProject: string;
}

export const CERTIFICATES_DB: VerifiedCertificate[] = [
  {
    id: 'COL-CFO-2025-9921',
    credentialId: 'COL-CFO-2025-9921',
    studentName: 'তানভীর আহমেদ চৌধুরী',
    studentEmail: 'tanvir.ahmed@conglomerate-bd.com',
    courseTitle: 'Chartered Financial Officer (CFO) 1-Year Program',
    courseTitleEn: 'Chartered Financial Officer (CFO) 1-Year Program',
    batchNumber: 'ব্যাচ ১৮ (Cohort 18)',
    issueDate: '১৫ আগস্ট, ২০২৫',
    verificationCode: 'COL-AUTH-992184',
    btebRegistrationNo: 'COL/TR/2024/09812',
    grade: 'Executive Distinction (CGPA 3.96 / 4.00)',
    status: 'Verified & Active',
    leadFaculty: 'মো. শফিকুল আলম, FCA, FCMA',
    modulesCompleted: 36,
    capstoneProject: 'DSE তালিকাভুক্ত টেক্সটাইল গ্রুপ পুনর্বিন্যাস ও ৩০০ কোটি টাকার করপোরেট বন্ড ইস্যু মডেলিং',
  },
  {
    id: 'COL-VAT-2024-8842',
    credentialId: 'COL-VAT-2024-8842',
    studentName: 'ফারজানা আক্তার, ACA',
    studentEmail: 'farzana.akhtar@pharmagroup.com',
    courseTitle: 'PGD in Customs, VAT, TAX & Trade Management',
    courseTitleEn: 'Post Graduate Diploma in Customs, VAT, TAX & Trade Management',
    batchNumber: 'ব্যাচ ১২ (Cohort 12)',
    issueDate: '১০ ডিসেম্বর, ২০২৪',
    verificationCode: 'COL-AUTH-884210',
    btebRegistrationNo: 'COL/TR/2024/07421',
    grade: 'A+ (Top 1% Percentile)',
    status: 'Verified & Active',
    leadFaculty: 'মোহাম্মদ মনিরুজ্জামান, FCMA',
    modulesCompleted: 24,
    capstoneProject: 'নতুন আয়কর আইন ২০২৩ অনুযায়ী মাল্টিন্যাশনাল ফার্মা ট্রান্সফার প্রাইসিং ও মুসক ৯.১ ফাইল',
  },
  {
    id: 'COL-SAP-2025-4120',
    credentialId: 'COL-SAP-2025-4120',
    studentName: 'মাহমুদুল হাসান',
    studentEmail: 'mahmud.h@fmcg-corp.com',
    courseTitle: 'Advanced Fintech with SAP-FICO & Power BI Analytics',
    courseTitleEn: 'Advanced Fintech with SAP-FICO & Power BI Analytics',
    batchNumber: 'ব্যাচ ০৯ (Cohort 09)',
    issueDate: '২২ মে, ২০২৫',
    verificationCode: 'COL-AUTH-412078',
    btebRegistrationNo: 'COL/TR/2025/03119',
    grade: 'Executive Distinction (A+)',
    status: 'Verified & Active',
    leadFaculty: 'ফারুক আহমেদ (SAP Solution Architect)',
    modulesCompleted: 16,
    capstoneProject: 'এন্টারপ্রাইজ এসএপি এস/৪ হানা জেনারেল লেজার (GL) ও পাওয়ার বিআই ড্যাশবোর্ড বাস্তবায়ন',
  },
  {
    id: 'COL-SCM-2025-3319',
    credentialId: 'COL-SCM-2025-3319',
    studentName: 'আহমেদ সাদিক',
    studentEmail: 'ahmed.sadiq@electronics-plc.com',
    courseTitle: 'PGD in Logistics, Port Customs & Supply Chain Analytics',
    courseTitleEn: 'PGD in Logistics, Port Customs & Supply Chain Analytics',
    batchNumber: 'ব্যাচ ০৭ (Cohort 07)',
    issueDate: '৫ মার্চ, ২০২৫',
    verificationCode: 'COL-AUTH-331945',
    btebRegistrationNo: 'COL/TR/2024/05914',
    grade: 'A+ (Honors)',
    status: 'Verified & Active',
    leadFaculty: 'মো. শফিকুল আলম, FCA, FCMA',
    modulesCompleted: 18,
    capstoneProject: 'চট্টগ্রাম বন্দর সিঅ্যান্ডএফ কাস্টমস ক্লিয়ারেন্স ও লিন সিক্স সিগমা ইনভেন্টরি অটোমেশন',
  },
];

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  titleEn: string;
  category: string;
  categoryLabel: string;
  excerpt: string;
  excerptEn: string;
  keyTakeaways: string[];
  content: string[];
  readTime: string;
  date: string;
  publishedDate: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  coverImage: string;
  tags: string[];
  relatedCourseId: string;
}

export const BLOG_POSTS: BlogPost[] = [
  {
    id: 'blog-1',
    slug: 'income-tax-act-2023-corporate-implications',
    title: 'নতুন আয়কর আইন ২০২৩: করপোরেট প্রতিষ্ঠান ও সিএফওদের প্রস্তুতি নির্দেশিকা',
    titleEn: 'Income Tax Act 2023: Comprehensive Strategic Guide for Corporate CFOs',
    category: 'tax-vat',
    categoryLabel: 'করপোরেট ট্যাক্স ও অডিট',
    excerpt: 'নতুন আয়কর আইনের আওতায় ন্যূনতম করের হার, উইথহোল্ডিং ট্যাক্স ও ধারা ৮২সি এর প্রয়োগ সংক্রান্ত খুঁটিনাটি বিশ্লেষণ।',
    excerptEn: 'Detailed analytical roadmap for corporate tax compliance, withholding tax schedules, and Section 82C minimum tax under Income Tax Act 2023.',
    keyTakeaways: [
      'ধারা ৮২সি অনুযায়ী গ্রস রিসিপ্টসের উপর ন্যূনতম করের পরিধি এবং রিয়াত কাঠামো।',
      'ত্রৈমাসিক ও মাসিক ভিত্তিতে এনবিআরের অনলাইন পোর্টালে উইথহোল্ডিং ট্যাক্স রিটার্ন জমাদান।',
      'মাল্টিন্যাশনাল প্রতিষ্ঠানের ইন্টার-কোম্পানি ট্রানজেকশনে আর্মস লেন্থ প্রাইসিং ও ট্রান্সফার প্রাইসিং কমপ্লায়েন্স।'
    ],
    content: [
      'আয়কর আইন ২০২৩ বাংলাদেশের করপোরেট ফিন্যান্সের ক্ষেত্রে একটি বড় রূপান্তর নিয়ে এসেছে। নতুন এই বিধিমালার অধীনে ট্যাক্স ডিডাকশন অ্যাট সোর্স (TDS), ক্যাপিটাল এক্সপেন্ডিচার অ্যালাউন্স, এবং ই-রিটার্ন কমপ্লায়েন্স প্রতিটি সিএফও এবং হেড অব ফিন্যান্সের জন্য কেন্দ্রীয় আলোচ্য বিষয় হয়ে উঠেছে।',
      'ধারা ৮২সি ও মিনিমাম ট্যাক্স কাঠামো: নতুন বিধিমালার আলোকে গ্রস রিসিপ্টসের উপর ন্যূনতম করের হিসাব এবং কোনো কোনো খাতে আগাম করই চূড়ান্ত করদায় হিসেবে গণ্য হবে তা নির্ধারণ করা আবশ্যক। বিশেষ করে রপ্তানিমুখী তৈরি পোশাক ও শিল্প খাতে উৎসে কর কর্তনের বিধানাবলী সূক্ষ্মভাবে পর্যালোচনা করা প্রয়োজন।',
      'ইন্টারন্যাশনাল ট্রান্সফার প্রাইসিং (TP): মাল্টিন্যাশনাল সাবসিডিয়ারি এবং সিস্টার কনসার্নদের মধ্যে ইন্টার-কোম্পানি লেনদেনের ক্ষেত্রে আর্মস লেন্থ প্রাইসিং নীতি বজায় রাখা ও চার্টার্ড অ্যাকাউন্ট্যান্টস ফার্ম দ্বারা ভেরিফাইড অডিট রিপোর্ট জমাদান বাধ্যতামূলক করা হয়েছে।',
      'চার্টার্ড অফিসার লিমিটেড (COL) পরিচালিত পোস্ট গ্র্যাজুয়েট ডিপ্লোমা ইন ট্যাক্সেশন অ্যান্ড করপোরেট ল প্রোগ্রামে বাস্তব কেস স্টাডির মাধ্যমে এই প্রতিটি ধারা প্র্যাকটিক্যালি শেখানো হয়।'
    ],
    readTime: '৬ মিনিট পাঠ',
    date: '১৪ জুন, ২০২৫',
    publishedDate: '১৪ জুন, ২০২৫',
    author: {
      name: 'মো. শফিকুল আলম, FCA, FCMA',
      role: 'প্রধান ফ্যাকাল্টি ও এক্সিকিউটিভ ডিরেক্টর, COL',
      avatar: DUMMY_PERSON_AVATAR,
    },
    coverImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=500&fit=crop',
    tags: ['আয়কর আইন ২০২৩', 'Corporate Tax', 'CFO Leadership', 'Tax Return', 'NBR Rules'],
    relatedCourseId: 'vat-tax-customs-diploma',
  },
  {
    id: 'blog-2',
    slug: 'financial-modeling-dcf-valuation-bangladesh',
    title: 'বাংলাদেশের শীর্ষ করপোরেট প্রতিষ্ঠানে ডিসিএফ (DCF) ভ্যালুয়েশন ও ফিন্যান্সিয়াল মডেলিংয়ের ব্যবহার',
    titleEn: 'Discounted Cash Flow (DCF) Valuation in Bangladeshi Conglomerates',
    category: 'cfo-finance',
    categoryLabel: 'ফিন্যান্সিয়াল মডেলিং',
    excerpt: 'ডিএসই এবং ওটিসি প্ল্যাটফর্মে তালিকাভুক্ত কোম্পানিগুলোর মার্জার ও অধিগ্রহণে (M&A) ডব্লিউএসিসি এবং ফ্রি ক্যাশ ফ্লো নির্ণয়ের ধাপে ধাপে গাইড।',
    excerptEn: 'Step-by-step masterclass on DCF financial modeling, Free Cash Flow to Firm (FCFF), and WACC computations for DSE listed companies.',
    keyTakeaways: [
      'ফ্রি ক্যাশ ফ্লো টু ফার্ম (FCFF) এবং ফ্রি ক্যাশ ফ্লো টু ইক্যুইটি (FCFE) এর তাত্ত্বিক ও ব্যবহারিক পার্থক্য।',
      'ওয়েটেড অ্যাভারেজ কস্ট অব ক্যাপিটাল (WACC) নির্ধারণে দেশীয় কর কাঠামো ও ট্রেজারি বিল ইল্ড কার্ভ ব্যবহার।',
      'টার্মিনাল গ্রোথ রেট এবং এক্সিট ইভি/ইবিআইটিডিএ মাল্টিপল ভিত্তিক সেনসিটিভিটি ম্যাট্রিক্স তৈরি।'
    ],
    content: [
      'কৌশলগত বিনিয়োগ এবং অধিগ্রহণের ক্ষেত্রে সঠিক ভ্যালুয়েশন ছাড়া বোর্ড অব ডিরেক্টরস অনুমোদন দিতে পারে না। বাংলাদেশের শিল্পখাতে বর্তমানে ফ্রি ক্যাশ ফ্লো টু ফার্ম (FCFF) এবং ওয়াক (WACC) নির্ধারণে উন্নত মাইক্রোসফট এক্সেল ও পাওয়ার বিআই ব্যবহৃত হচ্ছে।',
      'ঐতিহাসিক ৩-৫ বছরের পিঅ্যান্ডএল ও ব্যালান্স শিট নরমালাইজেশন করে নন-অপারেটিং ইনকাম এবং এককালীন ব্যয়গুলো বাদ দিয়ে অপারেটিং মার্জিন আলাদা করা হয়।',
      'টার্মিনাল ভ্যালু এবং এক্সিট মাল্টিপল নির্ধারণের ক্ষেত্রে দেশীয় জিডিপি প্রবৃদ্ধি ও দীর্ঘমেয়াদি মুদ্রাস্ফীতির হার বিবেচনায় নিয়ে সেনসিটিভিটি টেবিল তৈরি করা জরুরি।'
    ],
    readTime: '৮ মিনিট পাঠ',
    date: '২ মে, ২০২৫',
    publishedDate: '২ মে, ২০২৫',
    author: {
      name: 'মোহাম্মদ তানভীর আহমেদ, এফসিএ',
      role: 'গ্রুপ সিএফও ও লিড ট্রেইনার',
      avatar: DUMMY_PERSON_AVATAR,
    },
    coverImage: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=500&fit=crop',
    tags: ['DCF Valuation', 'Financial Modeling', 'WACC', 'Excel Modeling', 'Investment Banking'],
    relatedCourseId: 'cfo-executive-program',
  },
  {
    id: 'blog-3',
    slug: 'sap-fico-enterprise-automation-guide',
    title: 'এসএপি এস/৪ হানা (SAP S/4HANA) ফিকো দিয়ে করপোরেট অ্যাকাউন্টস অটোমেশন',
    titleEn: 'Automating Corporate Finance & Ledger Reporting with SAP-FICO',
    category: 'fintech-erp',
    categoryLabel: 'ফিনটেক ও এন্টারপ্রাইজ ইআরপি',
    excerpt: 'জেনারেল লেজার (FI-GL), অ্যাকাউন্টস পেয়াবল (FI-AP) এবং অটোমেটিক মান্থ-এন্ড ক্লোজিং কনফিগারেশনের বিস্তারিত।',
    excerptEn: 'Comprehensive guide to SAP S/4HANA FI-GL, FI-AP, and automated month-end financial closing workflows.',
    keyTakeaways: [
      'চার্ট অব অ্যাকাউন্টস (COA) স্ট্রাকচারিং ও রিয়েল-টাইম সাব-লেজার ইন্টিগ্রেশন।',
      'ব্যাংক অটো-রিকনসিলিয়েশন ও ভেন্ডর পেমেন্ট ক্লিয়ারিং প্রসেস অপটিমাইজেশন।',
      'মাসিক আর্থিক বিবরণী (P&L, Balance Sheet) নিমিষে এক্সট্রাক্ট করার কনফিগারেশন।'
    ],
    content: [
      'ম্যানুয়াল স্প্রেডশিটের যুগ শেষ। শীর্ষস্থানীয় ফার্মাসিউটিক্যালস, টেক্সটাইল এবং এফএমসিজি প্রতিষ্ঠানগুলো এখন সম্পূর্ণভাবে এসএপি এস/৪ হানা ইআরপি সিস্টেমে নিজেদের অর্থ ও হিসাবরক্ষণ পরিচালনা করছে।',
      'জেনারেল লেজার (FI-GL) এবং অ্যাকাউন্টস পেয়াবল (FI-AP) এর মাধ্যমে শত শত ভেন্ডর ইনভয়েস ও ব্যাংক লেনদেনের স্বয়ংক্রিয় রিকনসিলিয়েশন নিশ্চিত করা যায়, যা অডিটে শতভাগ স্বচ্ছতা আনে।',
      'চার্টার্ড অফিসার লিমিটেডের ল্যাবে শিক্ষার্থীরা সরাসরি লাইভ এসএপি এস/৪ হানা সার্ভারে কনফিগারেশন প্র্যাকটিস করার সুযোগ পান।'
    ],
    readTime: '৫ মিনিট পাঠ',
    date: '২১ এপ্রিল, ২০২৫',
    publishedDate: '২১ এপ্রিল, ২০২৫',
    author: {
      name: 'ফারুক আহমেদ',
      role: 'এসএপি সলিউশন আর্কিটেক্ট ও সিনিয়র ফ্যাকাল্টি',
      avatar: DUMMY_PERSON_AVATAR,
    },
    coverImage: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&h=500&fit=crop',
    tags: ['SAP FICO', 'ERP', 'Finance Automation', 'Accounting', 'PowerBI'],
    relatedCourseId: 'fintech-sap-fico-mastery',
  },
];

export interface PracticeChallenge {
  id: string;
  title: string;
  titleEn: string;
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  timeEstimate: string;
  tags: string[];
  description: string;
  descriptionEn: string;
  starterCode: string;
  solutionCode: string;
  testCases: {
    input: string;
    expected: string;
    expectedOutput: string;
    description: string;
  }[];
}

export const PRACTICE_CHALLENGES: PracticeChallenge[] = [
  {
    id: 'calc-wacc',
    title: 'ডব্লিউএসিসি (WACC) মূলধন ব্যয় নির্ধারণ অ্যালগরিদম',
    titleEn: 'Weighted Average Cost of Capital (WACC) Calculation',
    category: 'JavaScript',
    difficulty: 'Easy',
    timeEstimate: '১৫ মিনিট',
    tags: ['WACC', 'Corporate Finance', 'Valuation', 'CFO Core'],
    description: 'একটি প্রতিষ্ঠানের ইক্যুইটি অনুপাত, ডেট অনুপাত, কস্ট অব ইক্যুইটি (Ke), কস্ট অব ডেট (Kd) এবং করপোরেট কর হার (t) ইনপুট নিয়ে সঠিক WACC (দশমিকে ২ স্থান পর্যন্ত) রিটার্ন করুন।',
    descriptionEn: 'Calculate the WACC given weight of equity, weight of debt, cost of equity, pre-tax cost of debt, and corporate tax rate.',
    starterCode: `function calculateWACC(weightEquity, weightDebt, costEquity, costDebt, taxRate) {
  // WACC = (E/V * Re) + (D/V * Rd * (1 - Tc))
  // Return the calculated rate rounded to 2 decimal places (e.g. 10.45)
  return 0;
}`,
    solutionCode: `function calculateWACC(weightEquity, weightDebt, costEquity, costDebt, taxRate) {
  const equityPart = weightEquity * costEquity;
  const debtPart = weightDebt * costDebt * (1 - taxRate);
  return Number((equityPart + debtPart).toFixed(2));
}`,
    testCases: [
      {
        input: '0.6, 0.4, 14, 8, 0.25',
        expected: '10.8',
        expectedOutput: '10.8',
        description: 'সাধারণ মূলধন কাঠামো (৬০% ইক্যুইটি, ৪০% ডেট, ২৫% কর)',
      },
      {
        input: '1.0, 0.0, 12, 0, 0.25',
        expected: '12',
        expectedOutput: '12',
        description: '১০০% ইক্যুইটি ভিত্তিক প্রতিষ্ঠান',
      },
    ],
  },
  {
    id: 'calc-vat-mushak',
    title: 'মুসক ৯.১ ভ্যাট ও নিট প্রদেয় কর ক্যালকুলেটর',
    titleEn: 'NBR VAT 9.1 Net Payable Computation',
    category: 'React',
    difficulty: 'Medium',
    timeEstimate: '২০ মিনিট',
    tags: ['NBR VAT', 'Mushak 9.1', 'Input Tax', 'Taxation'],
    description: 'মোট বিক্রয়মূল্য (Gross Sales) এবং ইনপুট কাঁচামালের ক্রয়ের উপর প্রদত্ত ভ্যাট (Input Tax Credit) থেকে ১৫% স্ট্যান্ডার্ড রেটে নেট সরকারি ট্রেজারি পেমেন্ট নির্ধারণ করুন।',
    descriptionEn: 'Compute the net VAT payable to government treasury after deducting eligible input tax credit.',
    starterCode: `function calculateNetVAT(grossSales, inputTaxCredit, vatRate = 0.15) {
  // Output VAT = grossSales * vatRate
  // Net Payable = Output VAT - inputTaxCredit
  return 0;
}`,
    solutionCode: `function calculateNetVAT(grossSales, inputTaxCredit, vatRate = 0.15) {
  const outputVAT = grossSales * vatRate;
  const payable = Math.max(0, outputVAT - inputTaxCredit);
  return Math.round(payable);
}`,
    testCases: [
      {
        input: '1000000, 90000, 0.15',
        expected: '60000',
        expectedOutput: '60000',
        description: '১৫% স্ট্যান্ডার্ড ভ্যাট রেটে ইনপুট ক্রেডিট কর্তন',
      },
    ],
  },
  {
    id: 'dcf-npv',
    title: 'ডিসকাউন্টেড ক্যাশ ফ্লো (DCF) এবং নিট বর্তমান মূল্য (NPV)',
    titleEn: 'Discounted Cash Flow Net Present Value (NPV)',
    category: 'Algorithms',
    difficulty: 'Hard',
    timeEstimate: '২৫ মিনিট',
    tags: ['DCF', 'NPV', 'Capital Budgeting', 'Financial Modeling'],
    description: 'প্রারম্ভিক বিনিয়োগ (Initial Investment), ডিসকাউন্ট রেট (r), এবং পরবর্তী বছরগুলোর নগদ প্রবাহের অ্যারে নিয়ে নিট প্রেজেন্ট ভ্যালু (NPV) নির্ধারণ করুন।',
    descriptionEn: 'Calculate NPV given initial outlay, discount rate, and an array of periodic future cash flows.',
    starterCode: `function calculateNPV(initialOutlay, discountRate, cashFlows) {
  // NPV = Sum of [ CF_t / (1 + r)^t ] - initialOutlay
  return 0;
}`,
    solutionCode: `function calculateNPV(initialOutlay, discountRate, cashFlows) {
  let pvSum = 0;
  for (let t = 0; t < cashFlows.length; t++) {
    pvSum += cashFlows[t] / Math.pow(1 + discountRate, t + 1);
  }
  return Math.round(pvSum - initialOutlay);
}`,
    testCases: [
      {
        input: '500000, 0.10, [150000, 200000, 250000, 180000]',
        expected: '111669',
        expectedOutput: '111669',
        description: '১০% ডিসকাউন্ট রেটে ৪ বছরের ক্যাশফ্লো এনপিভি',
      },
    ],
  },
];





import { NextResponse } from 'next/server';
import { FAQS } from '@/data/cfo-data';

export interface DynamicFaqItem {
  id: string;
  category: 'all' | 'courses' | 'instructors' | 'online' | 'prerequisites' | 'corporate' | 'certification';
  categoryLabelBn: string;
  categoryLabelEn: string;
  question: string;
  questionEn: string;
  answer: string;
  answerEn: string;
}

const EXTENDED_FAQS: DynamicFaqItem[] = [
  {
    id: 'faq-1',
    category: 'courses',
    categoryLabelBn: 'কোর্স ও কারিকুলাম',
    categoryLabelEn: 'Courses & Curriculum',
    question: 'CFOEDUBD-তে কী কী কোর্স অফার করা হয়?',
    questionEn: 'What courses do you offer at CFOEDUBD?',
    answer: 'আমরা চার্টার্ড ফাইন্যান্সিয়াল অফিসার (CFO), ভ্যাট ও ট্যাক্স (VAT & Tax), হিউম্যান রিসোর্স ম্যানেজমেন্ট (HRM), সাপ্লাই চেইন ম্যানেজমেন্ট (SCM) এবং ফাইন্যান্সিয়াল টেকনোলজি (FinTech)-এর মতো প্রফেশনাল ক্যারিয়ার ট্র্যাক ও এক্সিকিউটিভ প্রোগ্রাম অফার করে থাকি।',
    answerEn: 'We offer a range of courses covering traditional and modern corporate topics like Chartered Financial Officer (CFO), VAT & TAX, Human Resource Management (HRM), Supply Chain Management (SCM), and Financial Technology (FinTech).',
  },
  {
    id: 'faq-2',
    category: 'instructors',
    categoryLabelBn: 'প্রশিক্ষক ও মেন্টর',
    categoryLabelEn: 'Instructors & Mentors',
    question: 'প্রশিক্ষক কারা?',
    questionEn: 'Who are the instructors?',
    answer: 'আমাদের প্রশিক্ষকবৃন্দ স্ব-স্ব ক্ষেত্রে ১০+ বছরের অভিজ্ঞতাসম্পন্ন শীর্ষস্থানীয় কর্পোরেট প্রফেশনাল, লিডিং এমএনসি ও ব্যাংকিং এক্সিকিউটিভ। তাঁরা বাস্তব জীবনের কেস স্টাডি, প্র্যাকটিকাল এক্সেল মডেল ও রিয়েল-ওয়ার্ল্ড ট্যাক্স ফাইলিং ক্লাসরুমে তুলে ধরেন।',
    answerEn: 'Our instructors are seasoned industry leaders, CFOs, and consultants with 10+ years of corporate experience in top MNCs, conglomerates, and financial institutions, providing practical real-world training.',
  },
  {
    id: 'faq-3',
    category: 'online',
    categoryLabelBn: 'অনলাইন ও লাইভ ক্লাস',
    categoryLabelEn: 'Online & Live Sessions',
    question: 'আপনারা কি অনলাইন কোর্স পরিচালনা করেন?',
    questionEn: 'Do you offer online courses?',
    answer: 'হ্যাঁ, শিক্ষার্থীদের সুবিধার কথা বিবেচনা করে আমরা সরাসরি ইন্টারেক্টিভ লাইভ অনলাইন ও ইন-পার্সন উভয় মাধ্যমেই ক্লাস পরিচালনা করি। প্রতিটি লাইভ ক্লাসের হাই-ডেফিনিশন রেকর্ডিং ও লেকচার নোটস স্টুডেন্ট এলএমএস পোর্টালে সারাজীবনের জন্য সংরক্ষিত থাকে।',
    answerEn: 'Yes, we offer fully interactive live online courses as well as hybrid options. All live class recordings, study materials, and practical templates are accessible 24/7 inside the Student LMS portal.',
  },
  {
    id: 'faq-4',
    category: 'prerequisites',
    categoryLabelBn: 'যোগ্যতা ও পূর্বশর্ত',
    categoryLabelEn: 'Prerequisites & Eligibility',
    question: 'ভর্তির জন্য পূর্বশর্ত কী কী?',
    questionEn: 'What are the prerequisites for enrolling?',
    answer: 'কোর্স ভেদে পূর্বশর্ত কিছুটা ভিন্ন হয়। তবে সাধারণ অর্থে ফিন্যান্স, কমার্স বা বিজনেস ব্যাকগ্রাউন্ড অথবা পেশাগত কাজে দক্ষতা বাড়াতে আগ্রহী যে কোনো গ্র্যাজুয়েট বা কর্মরত প্রফেশনাল এই কোর্সগুলোতে সফলভাবে অংশ নিতে পারেন। কোনো পূর্ববর্তী কোডিং জ্ঞান প্রয়োজন নেই।',
    answerEn: 'Prerequisites vary by track. Generally, basic familiarity with commerce/business or a keen interest in corporate career development is recommended. Foundational modules are included in every course.',
  },
  {
    id: 'faq-5',
    category: 'corporate',
    categoryLabelBn: 'কর্পোরেট ট্রেনিং',
    categoryLabelEn: 'Corporate Training',
    question: 'আপনারা কি করপোরেট ট্রেনিং প্রদান করেন?',
    questionEn: 'Do you offer corporate training?',
    answer: 'হ্যাঁ, বিভিন্ন কর্পোরেট প্রতিষ্ঠান, ব্যাংক ও বহুজাতিক কোম্পানির কর্মীদের জন্য আমরা কাস্টমাইজড অন-সাইট ও ভার্চুয়াল আপস্কিলিং প্রোগ্রাম, ভ্যাট কমপ্লায়েন্স কর্মশালা এবং ফিনটেক বুটক্যাম্প পরিচালনা করে থাকি।',
    answerEn: 'Yes, we deliver tailor-made corporate training solutions, on-site workshops, VAT compliance drills, and enterprise upskilling programs for organizations and corporate teams.',
  },
  {
    id: 'faq-6',
    category: 'certification',
    categoryLabelBn: 'সার্টিফিকেট ও স্বীকৃতি',
    categoryLabelEn: 'Certification & Recognition',
    question: 'কোর্স শেষে কি ভেরিফায়েড সার্টিফিকেট দেওয়া হয়?',
    questionEn: 'Will I receive a verified certificate upon completion?',
    answer: 'হ্যাঁ, প্রতিটি কোর্স ও ক্যাপস্টোন প্রজেক্ট সফলভাবে সম্পন্নের পর ডিজিটাল কিউআর কোড এবং ইউনিক ক্রেডেনশিয়াল আইডি সম্বলিত ভেরিফাইড সার্টিফিকেট প্রদান করা হয় যা লিঙ্কডইন এবং আন্তর্জাতিকভাবে যাচাইযোগ্য।',
    answerEn: 'Yes, upon completing the course and capstone project, students receive an industry-recognized certificate with a QR code and verifiable credential ID valid on LinkedIn and CVs.',
  },
  {
    id: 'faq-7',
    category: 'courses',
    categoryLabelBn: 'কোর্স ফি ও পেমেন্ট',
    categoryLabelEn: 'Fees & Installments',
    question: 'কোর্স ফি কি কিস্তিতে (EMI/Installment) পরিশোধ করা সম্ভব?',
    questionEn: 'Is installment or EMI payment available for courses?',
    answer: 'হ্যাঁ, আমাদের লং-টার্ম এক্সিকিউটিভ ও ফ্ল্যাগশিপ ট্র্যাকগুলোতে ০% সুদে ক্রেডিট কার্ড ইএমআই অথবা বিকাশ/নগদ-এর মাধ্যমে ২ থেকে ৩ কিস্তিতে ফি পরিশোধের বিশেষ সুবিধা রয়েছে।',
    answerEn: 'Yes, for executive diploma tracks we offer 2-3 interest-free flexible installment options as well as 0% EMI via major partner bank credit cards.',
  },
];

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get('category') || 'all';
  const query = (searchParams.get('q') || '').toLowerCase().trim();

  let results = EXTENDED_FAQS;

  if (category !== 'all') {
    results = results.filter((item) => item.category === category);
  }

  if (query) {
    results = results.filter(
      (item) =>
        item.question.toLowerCase().includes(query) ||
        item.questionEn.toLowerCase().includes(query) ||
        item.answer.toLowerCase().includes(query) ||
        item.answerEn.toLowerCase().includes(query)
    );
  }

  return NextResponse.json({
    success: true,
    count: results.length,
    data: results,
  });
}

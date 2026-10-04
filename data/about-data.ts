export interface AboutMetric {
  number: string;
  numberEn: string;
  label: string;
  labelEn: string;
  description?: string;
  descriptionEn?: string;
}

export interface CoreValue {
  id: number;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  iconName: string;
}

export interface AboutData {
  title: string;
  titleEn: string;
  tagline: string;
  taglineEn: string;
  registrationNumber: string;
  ministry: string;
  ministryEn: string;
  story: {
    foundationBn: string;
    foundationEn: string;
    instituteBn: string;
    instituteEn: string;
  };
  vision: {
    titleBn: string;
    titleEn: string;
    contentBn: string;
    contentEn: string;
  };
  mission: {
    titleBn: string;
    titleEn: string;
    contentBn: string;
    contentEn: string;
  };
  metrics: AboutMetric[];
  coreValues: CoreValue[];
  videoUrl: string;
  youtubeId: string;
}

export const OFFICIAL_ABOUT_DATA: AboutData = {
  title: 'আমাদের সম্পর্কে',
  titleEn: 'About Us',
  tagline: 'চার্টার্ড অফিসার লিমিটেড (COL) — সিএফও ফাউন্ডেশন অব বাংলাদেশ',
  taglineEn: 'Chartered Officer Limited (COL) — CFO Foundation of Bangladesh',
  registrationNumber: 'S-13064/2019',
  ministry: 'যৌথমূলধন কোম্পানি ও ফার্মসমূহের পরিদপ্তর (RJSC), বাণিজ্য মন্ত্রণালয়, গণপ্রজাতন্ত্রী বাংলাদেশ সরকার',
  ministryEn: 'Registrar of Joint Stock Companies and Firms (RJSC), Ministry of Commerce, Government of the People\'s Republic of Bangladesh',
  story: {
    foundationBn:
      'সিএফও ফাউন্ডেশন অব বাংলাদেশ (CFO BD) বর্তমান ও ভবিষ্যৎ চিফ ফাইন্যান্সিয়াল অফিসারদের (CFO) সমন্বয়ে গঠিত একটি অলাভজনক পেশাজীবী সংগঠন। এটি গণপ্রজাতন্ত্রী বাংলাদেশ সরকারের বাণিজ্য মন্ত্রণালয়ের অধীন রেজিস্ট্রার অব জয়েন্ট স্টক কোম্পানিজ অ্যান্ড ফার্মস (RJSC)-এ নিবন্ধিত (রেজিস্ট্রেশন নম্বর: S-13064/2019)। সংগঠনের মূল লক্ষ্য হলো জ্ঞানভিত্তিক সম্মেলন, সেমিনার ও পেশাগত প্রশিক্ষণের মাধ্যমে অভিজ্ঞতা ও মতামত বিনিময় করা, জাতীয় রাজস্ব ও অর্থনৈতিক নীতি প্রণয়নে অবদান রাখা, অংশীজনদের সক্ষমতা বৃদ্ধি এবং সামগ্রিক সমাজ ও অর্থনৈতিক সংস্কৃতির উন্নয়ন ঘটানো।',
    foundationEn:
      'The CFO Foundation of Bangladesh (CFO BD) is a non-profit organization comprised of current and future Chief Financial Officers (CFOs) that is registered with the Registrar of Joint Stock Companies and Firms (RJSC), Ministry of Commerce, Government of the People\'s Republic of Bangladesh, under registration number S-13064/2019. The mission of this organization is to exchange ideas, thoughts, and expertise through organizing knowledge-building conferences, seminars, and training, contributing to vital national policy, improving stakeholders, developing financial culture, and serving society as a whole.',
    instituteBn:
      'চার্টার্ড অফিসার লিমিটেড (COL) প্রতিষ্ঠিত হয়েছে পেশাজীবী ও শিক্ষার্থীদের এমন বাস্তবমুখী জ্ঞান ও প্রায়োগিক দক্ষতা প্রদানের লক্ষ্যে, যা কর্মক্ষেত্রে তাঁদের উৎপাদনশীলতা উল্লেখযোগ্যভাবে বৃদ্ধি করে এবং প্রতিষ্ঠানের কৌশলগত লক্ষ্য অর্জনে কার্যকর ভূমিকা পালন নিশ্চিত করে।',
    instituteEn:
      'Chartered Officer Limited (COL) was established to provide knowledge and skills that considerably strengthen the on-the-job productivity of its course participants, consequently enhancing their contributions to the organization\'s goals.',
  },
  vision: {
    titleBn: 'আমাদের লক্ষ্য (Our Vision)',
    titleEn: 'Our Vision',
    contentBn:
      'একটি উদ্ভাবনী, সময়োপযোগী ও বাস্তবমুখী প্রায়োগিক কারিকুলামের মাধ্যমে শিক্ষার্থীদের কর্মক্ষেত্রে সরাসরি উপযোগী ইন্ডাস্ট্রি-রেডি প্রফেশনাল হিসেবে রূপান্তর করে ফাইন্যান্স ও ফিনটেক শিক্ষায় বাংলাদেশের সবচেয়ে নির্ভরযোগ্য ও পছন্দের শীর্ষ প্রশিক্ষণ প্রতিষ্ঠান হিসেবে স্বীকৃতি অর্জন করা।',
    contentEn:
      'To be the preferred training institute for finance and FinTech education, recognized for transforming students into industry-ready professionals through an innovative, relevant, and practical curriculum.',
  },
  mission: {
    titleBn: 'আমাদের মিশন (Our Mission)',
    titleEn: 'Our Mission',
    contentBn:
      'ফাইন্যান্স এবং ফাইন্যান্সিয়াল টেকনোলজিতে শীর্ষস্থানীয় পেশাদার প্রশিক্ষণ নিশ্চিত করা, যা শিক্ষার্থী ও কর্পোরেট প্রতিষ্ঠানসমূহকে অপারেশনাল শ্রেষ্ঠত্ব ও গ্লোবাল মার্কেটপ্লেসে টেকসই প্রতিযোগিতামূলক সুবিধা অর্জনে সক্ষম করে তোলে।',
    contentEn:
      'To provide top-notch professional training in finance and financial technology that enables individuals and organizations to achieve operational excellence and competitive edge in the global marketplace.',
  },
  metrics: [
    {
      number: '২,০০০+',
      numberEn: '2000+',
      label: 'নিবন্ধিত শিক্ষার্থী ও কর্পোরেট এক্সিকিউটিভ',
      labelEn: 'Students Enrolled',
      description: 'সারাদেশের ব্যাংক, মাল্টিন্যাশনাল ও স্বনামধন্য শিল্পগ্রুপের কর্মকর্তা',
      descriptionEn: 'Across leading banks, MNCs and national conglomerates',
    },
    {
      number: '৯৮%',
      numberEn: '98%',
      label: 'সফল গ্র্যাজুয়েট ও ক্যারিয়ার রূপান্তর হার',
      labelEn: 'Graduates Success Rate',
      description: 'কোর্স শেষে তাৎক্ষণিক পদোন্নতি ও প্রায়োগিক বাস্তবায়ন',
      descriptionEn: 'Immediate post-program career acceleration and promotion',
    },
    {
      number: '৯০+',
      numberEn: '90+',
      label: 'বিশেষায়িত প্রফেশনাল লাইভ ও ল্যাব ক্লাস',
      labelEn: 'Specialized Classes',
      description: 'এসএপি-ফাইকো, এনবিআর ই-ট্যাক্স, ভ্যাট ৯.১ ও অডিট কেস স্টাডি',
      descriptionEn: 'Hands-on SAP S/4HANA, NBR e-Tax portal, VAT 9.1 and live case labs',
    },
  ],
  coreValues: [
    {
      id: 1,
      title: 'প্রায়োগিক প্রাসঙ্গিকতা',
      titleEn: 'Practical Relevance',
      description: 'আমরা সরাসরি কর্মক্ষেত্রের বাস্তব চ্যালেঞ্জভিত্তিক প্রায়োগিক প্রশিক্ষণে জোর দিই, যাতে শিক্ষার্থীরা অর্জিত জ্ঞান কাজে লাগিয়ে প্রতিষ্ঠানে তাৎক্ষণিক অবদান রাখতে পারেন।',
      descriptionEn: 'We focus on hands-on training that directly correlates with real-world applications in finance and FinTech, ensuring that our graduates are immediately valuable to employers.',
      iconName: 'Award',
    },
    {
      id: 2,
      title: 'মানসম্মত শিক্ষা',
      titleEn: 'Quality Education',
      description: 'শিক্ষার গুণগত মানে কোনো আপস নয়। প্রতিটি কোর্স শীর্ষস্থানীয় ফেলো চার্টার্ড অ্যাকাউন্ট্যান্টস (FCA) এবং কর্পোরেট বিশেষজ্ঞদের দ্বারা সুপরিকল্পিতভাবে পরিচালিত।',
      descriptionEn: 'Our commitment to quality is uncompromising, featuring courses designed and delivered by industry experts.',
      iconName: 'GraduationCap',
    },
    {
      id: 3,
      title: 'উদ্ভাবন ও ফিনটেক রূপান্তর',
      titleEn: 'Innovation',
      description: 'দ্রুত পরিবর্তনশীল অর্থনৈতিক পরিমণ্ডলে প্রযুক্তিগত অগ্রগতি ও ফিনটেক ইকোসিস্টেমের সর্বশেষ ধারা অনুযায়ী কারিকুলাম নিয়মিত আধুনিকায়ন করা হয়।',
      descriptionEn: 'In a rapidly evolving financial landscape, we prioritize staying ahead of industry trends, particularly in financial technology, to offer the most current and impactful education.',
      iconName: 'Sparkles',
    },
    {
      id: 4,
      title: 'পেশাদার সততা ও নীতিশাস্ত্র',
      titleEn: 'Professional Integrity',
      description: 'উচ্চতম পেশাদারিত্ব ও নৈতিক মূল্যবোধ অনুশীলন নিশ্চিত করা, যা শিক্ষার্থীদের শুধু দক্ষ কর্মী নয়, সুনাগরিক হিসেবেও গড়ে তোলে।',
      descriptionEn: 'We instill the highest levels of professionalism and ethical conduct in our students, preparing them not just for a career but also for responsible citizenship.',
      iconName: 'ShieldCheck',
    },
    {
      id: 5,
      title: 'পারস্পরিক জ্ঞান বিনিময়',
      titleEn: 'Collaborative Learning',
      description: 'শিক্ষার্থী, অভিজ্ঞ প্রশিক্ষক এবং ইন্ডাস্ট্রি লিডারদের মাঝে উন্মুক্ত ও গঠনমূলক নেটওয়ার্কিং ও অভিজ্ঞতা আদান-প্রদানের পরিবেশ।',
      descriptionEn: 'We encourage a cooperative educational environment where students, instructors, and industry professionals can exchange ideas and best practices.',
      iconName: 'Users',
    },
    {
      id: 6,
      title: 'গ্লোবাল স্ট্যান্ডার্ড ও বিস্তৃতি',
      titleEn: 'Global Reach',
      description: 'আন্তর্জাতিক মানদণ্ড অনুসরণে প্রণীত কোর্স, যা শিক্ষার্থীদের দেশীয় ও বৈশ্বিক যেকোনো চ্যালেঞ্জিং অর্থনীতিতে নেতৃত্বদানে দক্ষ করে তোলে।',
      descriptionEn: 'Our courses are designed with a global perspective, aiming to equip students with the skills and knowledge needed to succeed in any market around the world.',
      iconName: 'Compass',
    },
    {
      id: 7,
      title: 'লার্নার ও ক্লায়েন্ট কেন্দ্রিক সেবা',
      titleEn: 'Customer Focus',
      description: 'শিক্ষার্থী ও করপোরেট ক্লায়েন্টদের প্রত্যাশা পূরণ ও আন্তরিক সহায়তা প্রদানে আমরা শতভাগ প্রতিশ্রুতিবদ্ধ।',
      descriptionEn: 'We are committed to exceeding the expectations of our students and corporate clients, providing exceptional service and customizable training solutions.',
      iconName: 'Building2',
    },
  ],
  videoUrl: 'https://www.youtube.com/watch?v=-HeZs3qthR8&t=1s',
  youtubeId: '-HeZs3qthR8',
};

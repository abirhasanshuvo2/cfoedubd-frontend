export interface SuccessStoryItem {
  id: number | string;
  name: string;
  designation?: string | null;
  company?: string | null;
  batch?: string | null;
  photo?: string | null;
  story: string;
  video_url?: string | null;
  created_at?: string | null;
  is_local?: boolean;
}

export const INITIAL_SUCCESS_STORIES: SuccessStoryItem[] = [
  {
    id: 1,
    name: 'Mohammad Tanvir Hasan, ACA',
    designation: 'Head of Financial Planning & Analysis (FP&A)',
    company: 'Meghna Group of Industries',
    batch: 'Batch 14 (CFO Executive Program)',
    photo: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1600&auto=format&fit=crop',
    story: 'Completing the Chartered Financial Officer program completely transformed my strategic approach to treasury management, working capital optimization, and board-level financial reporting.',
    video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    created_at: '2025-11-15',
  },
  {
    id: 2,
    name: 'Farhana Akhter, FCMA',
    designation: 'Director of Taxation & Corporate Governance',
    company: 'Apex Footwear Ltd',
    batch: 'Batch 11 (VAT & Tax Mastery)',
    photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1600&auto=format&fit=crop',
    story: 'The hands-on NBR IVAS online filing simulations and practical tribunal case law studies gave me absolute confidence in handling high-stakes corporate audits and VAT assessments.',
    video_url: '',
    created_at: '2025-12-02',
  },
  {
    id: 3,
    name: 'Kazi Ashfaqur Rahman',
    designation: 'Senior SAP-FICO Consultant & Controller',
    company: 'Beximco Pharmaceuticals',
    batch: 'Batch 09 (Fintech & SAP ERP)',
    photo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=1600&auto=format&fit=crop',
    story: 'Access to the live SAP S/4HANA enterprise server combined with real DSE-listed financial model case studies bridge the gap between financial theory and boardroom execution.',
    video_url: '',
    created_at: '2026-01-10',
  },
  {
    id: 4,
    name: 'Syeda Nusrat Jahan',
    designation: 'Chief Financial Officer (CFO)',
    company: 'Standard Chartered Global Services',
    batch: 'Batch 08 (Advanced Leadership & M&A)',
    photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1600&auto=format&fit=crop',
    story: 'Guided directly by practicing Fellow Chartered Accountants (FCA), this cohort elevated my executive presence, cross-border M&A negotiations, and multi-currency capital restructuring.',
    video_url: '',
    created_at: '2026-02-18',
  },
  {
    id: 5,
    name: 'Arifur Rahman Chowdhury',
    designation: 'Head of Global Supply Chain & Trade Finance',
    company: 'Square Pharmaceuticals',
    batch: 'Batch 12 (SCM & Trade Governance)',
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1600&auto=format&fit=crop',
    story: 'In-depth mastery over letter of credit (LC) structuring, customs HS-code dispute resolution, and international supply chain analytics expedited my promotion to department leadership.',
    video_url: '',
    created_at: '2026-03-05',
  },
  {
    id: 6,
    name: 'Mahmudul Karim, FCA',
    designation: 'Partner & Senior Audit Lead',
    company: 'Karim & Associates Chartered Accountants',
    batch: 'Batch 10 (Financial Modeling & ERP)',
    photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=1600&auto=format&fit=crop',
    story: 'The pedagogy is second to none in Bangladesh. Real corporate disclosures, rigorous financial modeling under pressure, and invaluable peer networking across top CFOs.',
    video_url: '',
    created_at: '2026-03-22',
  },
];

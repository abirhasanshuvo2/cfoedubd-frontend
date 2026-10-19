import BrandLoader from '@/components/BrandLoader';

export default function Loading() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center p-8 bg-[#F8FAFC] dark:bg-slate-950 transition-colors">
      <BrandLoader size="lg" />
    </div>
  );
}

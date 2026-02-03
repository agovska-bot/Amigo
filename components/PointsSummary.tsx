
import React from 'react';
import { useAppContext } from '../context/AppContext';
import { useTranslation } from '../hooks/useTranslation';

const PointsSummary: React.FC = () => {
  const { courageStars } = useAppContext();
  const { t } = useTranslation();

  return (
    <div className="bg-white/80 backdrop-blur-sm p-6 rounded-[2rem] border-2 border-white shadow-xl flex items-center justify-center gap-4">
        <div className="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center text-3xl">
            🌟
        </div>
        <div className="text-left">
            <span className="text-4xl font-black text-slate-900 leading-none block">{courageStars}</span>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">
                {t('points_summary.points', 'Courage Stars')}
            </p>
        </div>
    </div>
  );
};

export default PointsSummary;

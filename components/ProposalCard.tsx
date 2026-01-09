
import React from 'react';
import { format, parseISO } from 'date-fns';
import { LongHolidayProposal } from '../types';
import { getAiRecommendation } from '../services/gemini';

interface ProposalCardProps {
  proposal: LongHolidayProposal;
}

const ProposalCard: React.FC<ProposalCardProps> = ({ proposal }) => {
  const [recommendation, setRecommendation] = React.useState<string | null>(null);
  const [loadingAi, setLoadingAi] = React.useState(false);

  const fetchAiAdvice = async () => {
    setLoadingAi(true);
    const advice = await getAiRecommendation(proposal);
    setRecommendation(advice || "No advice available.");
    setLoadingAi(false);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
      <div className="bg-emerald-600 p-4 text-white">
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs font-bold uppercase tracking-wider opacity-80">Opportunity</span>
          <span className="bg-white/20 px-2 py-0.5 rounded text-[10px] font-bold">Score: {proposal.score.toFixed(1)}</span>
        </div>
        <h3 className="text-xl font-bold">
          {format(parseISO(proposal.startDate), 'MMM d')} — {format(parseISO(proposal.endDate), 'MMM d')}
        </h3>
        <p className="text-sm opacity-90 mt-1">{proposal.totalDays} Consecutive Days Off</p>
      </div>
      
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
            <span className="text-slate-600">Leave needed:</span>
          </div>
          <span className="font-bold text-slate-800">{proposal.leaveDaysRequired} Day{proposal.leaveDaysRequired === 1 ? '' : 's'}</span>
        </div>

        <div className="space-y-2">
          <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Included Holidays</h4>
          <div className="flex flex-wrap gap-2">
            {proposal.breakdown.publicHolidays.map((h, i) => (
              <span key={i} className="text-xs px-2 py-1 bg-rose-50 text-rose-600 border border-rose-100 rounded-md font-medium">
                {h.name}
              </span>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100">
          {recommendation ? (
            <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded-lg prose max-w-none prose-emerald">
              <h5 className="font-bold mb-2 text-emerald-700 flex items-center gap-1 italic">
                ✨ AI Recommendations
              </h5>
              <div dangerouslySetInnerHTML={{ __html: recommendation.replace(/\n/g, '<br/>') }} />
            </div>
          ) : (
            <button 
              onClick={fetchAiAdvice}
              disabled={loadingAi}
              className="w-full py-2 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-600 font-bold rounded-lg text-sm transition-colors flex items-center justify-center gap-2"
            >
              {loadingAi ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-emerald-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Thinking...
                </>
              ) : (
                <>✨ Get Trip Ideas</>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProposalCard;

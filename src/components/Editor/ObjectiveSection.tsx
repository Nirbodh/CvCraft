import React from 'react';
import { Target, Sparkles, Lightbulb } from 'lucide-react';

interface ObjectiveSectionProps {
  objective: string;
  onChange: (objective: string) => void;
}

const OBJECTIVE_SUGGESTIONS = [
  'Results-driven professional seeking a challenging role where I can leverage my technical problem-solving skills, collaborate with cross-functional teams, and contribute to high-impact product engineering.',
  'Ambitious computer science graduate eager to apply strong fundamentals in data structures, web technologies, and distributed systems within a fast-paced software development environment.',
  'Experienced team lead transitioning into strategic product architecture, aiming to drive scalable systems design and foster engineering excellence.',
];

export const ObjectiveSection: React.FC<ObjectiveSectionProps> = ({ objective, onChange }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <Target className="w-4 h-4 text-blue-600" />
            <span>Career Objective</span>
          </h3>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Ideal for entry-level candidates, students, and career changers defining their career goals.
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <textarea
          rows={4}
          value={objective || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder="State your immediate career goal, key value proposition, and how you aim to contribute to the employer's mission..."
          className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600 text-slate-900 placeholder:text-slate-400"
        />
        <div className="flex justify-between items-center text-[11px] text-slate-400">
          <span>Recommended length: 2 to 4 concise sentences</span>
          <span>{objective ? objective.trim().split(/\s+/).filter(Boolean).length : 0} words</span>
        </div>
      </div>

      {/* Suggested Inspiration Presets */}
      <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
          <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
          <span>Click to Insert Quick Example:</span>
        </div>
        <div className="space-y-1.5">
          {OBJECTIVE_SUGGESTIONS.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => onChange(preset)}
              className="w-full text-left p-2 rounded-lg bg-white border border-slate-200 hover:border-blue-400 text-[11px] text-slate-700 hover:text-blue-900 transition-colors cursor-pointer"
            >
              "{preset}"
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

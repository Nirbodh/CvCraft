import React from 'react';
import { CV } from '../../types/cv.ts';

interface JapaneseShokumuTemplateProps {
  cv: CV;
}

export const JapaneseShokumuTemplate: React.FC<JapaneseShokumuTemplateProps> = ({ cv }) => {
  const { data } = cv;
  const p = data.personalInfo;
  const today = new Date();
  const dateStr = `${today.getFullYear()}年${today.getMonth() + 1}月${today.getDate()}日`;

  return (
    <div className="japanese-shokumu-wrapper w-full bg-white text-slate-900 font-sans text-xs selection:bg-slate-200">
      {/* Header */}
      <div className="flex justify-between items-baseline mb-4 border-b border-slate-900 pb-2">
        <h1 className="text-xl font-bold tracking-[0.4em] text-slate-950">
          職 務 経 歴 書
        </h1>
        <div className="text-right text-[11px] text-slate-700">
          <div>{dateStr} 現在</div>
          <div className="font-bold text-slate-950 text-sm mt-0.5">{p.fullName}</div>
        </div>
      </div>

      {/* 1. 職務要約 (Career Summary) */}
      <div className="mb-4">
        <h2 className="text-xs font-bold bg-slate-100 border-l-4 border-slate-900 px-2 py-1 mb-2 text-slate-900 tracking-wider">
          【職務要約】
        </h2>
        <p className="text-[11px] leading-relaxed text-slate-800 px-1 whitespace-pre-line">
          {data.summary ||
            '大学卒業後、Webアプリケーション開発および分散システム基盤の設計・開発に従事。フロントエンドからバックエンド、クラウドインフラ構築まで一貫した開発経験を有しています。チームリーダーとして要件定義からデプロイ自動化まで主導した実績があります。'}
        </p>
      </div>

      {/* 2. 活かせる経験・知識・スキル (Core Skills & Technical Knowledge) */}
      <div className="mb-4">
        <h2 className="text-xs font-bold bg-slate-100 border-l-4 border-slate-900 px-2 py-1 mb-2 text-slate-900 tracking-wider">
          【活かせる経験・知識・技術】
        </h2>
        <div className="border border-slate-400 p-2 text-[11px] space-y-1.5">
          {data.skills && data.skills.length > 0 ? (
            data.skills.map((cat, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <span className="font-semibold text-slate-900 w-36 shrink-0">■ {cat.category}:</span>
                <span className="text-slate-700">{cat.items.join('、 ')}</span>
              </div>
            ))
          ) : (
            <div className="text-slate-500 italic">スキル情報未入力</div>
          )}
        </div>
      </div>

      {/* 3. 職務経歴詳細 (Detailed Project & Work Experience) */}
      <div className="mb-4">
        <h2 className="text-xs font-bold bg-slate-100 border-l-4 border-slate-900 px-2 py-1 mb-2 text-slate-900 tracking-wider">
          【職務経歴詳細】
        </h2>

        {data.experience && data.experience.length > 0 ? (
          <div className="space-y-4">
            {data.experience.map((exp, idx) => (
              <div key={idx} className="border border-slate-900">
                <div className="bg-slate-100 border-b border-slate-900 p-2 flex justify-between items-center text-[11px]">
                  <span className="font-bold text-slate-950">
                    {exp.company} （{exp.role}）
                  </span>
                  <span className="font-mono text-slate-700">
                    {exp.startDate} 〜 {exp.current ? '現在' : exp.endDate}
                  </span>
                </div>
                <div className="p-2 space-y-2 text-[11px]">
                  <div>
                    <span className="font-semibold text-slate-900">【業務内容・プロジェクト】</span>
                    <p className="mt-1 text-slate-800 leading-relaxed">{exp.description}</p>
                  </div>

                  {exp.highlights && exp.highlights.length > 0 && (
                    <div>
                      <span className="font-semibold text-slate-900">【主な実績・成果】</span>
                      <ul className="list-disc list-inside mt-0.5 space-y-0.5 text-slate-700">
                        {exp.highlights.map((h, hIdx) => (
                          <li key={hIdx}>{h}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-slate-400 italic text-[11px] p-2 border border-slate-300">
            職歴データがありません
          </div>
        )}
      </div>

      {/* 4. 自己PR (Self PR) */}
      <div>
        <h2 className="text-xs font-bold bg-slate-100 border-l-4 border-slate-900 px-2 py-1 mb-2 text-slate-900 tracking-wider">
          【自己PR】
        </h2>
        <div className="p-2 text-[11px] leading-relaxed text-slate-800 border border-slate-300 whitespace-pre-line">
          {p.selfPr ||
            p.reasonForApplying ||
            '課題発見から解決策の立案・実装まで、迅速かつ主体的にやり抜く姿勢を強みとしています。技術的知見を組織へ積極的に還元し、チーム全体の開発生産性向上にも貢献してまいります。'}
        </div>
      </div>
    </div>
  );
};

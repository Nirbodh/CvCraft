import React from 'react';
import { CV } from '../../types/cv.ts';

interface JapaneseRirekishoTemplateProps {
  cv: CV;
}

// Helper to extract year and month from diverse date formats (e.g. "2019", "2019-04", "04/2019", "Apr 2019")
function parseYearMonth(dateStr?: string): { year: string; month: string } {
  if (!dateStr || dateStr.toLowerCase() === 'present') return { year: '', month: '' };
  
  // Try YYYY-MM or YYYY/MM
  const matchYm = dateStr.match(/(\d{4})[-/.](\d{1,2})/);
  if (matchYm) {
    return { year: matchYm[1], month: matchYm[2] };
  }

  // Try MM/YYYY
  const matchMy = dateStr.match(/(\d{1,2})[-/.](\d{4})/);
  if (matchMy) {
    return { year: matchMy[2], month: matchMy[1] };
  }

  // Try plain 4-digit year
  const matchY = dateStr.match(/\b(19\d\d|20\d\d)\b/);
  if (matchY) {
    return { year: matchY[1], month: '4' }; // Standard Japanese academic/fiscal year start
  }

  return { year: '', month: '' };
}

// Calculate age from date of birth (e.g. "1995-06-12" or "1995")
function calculateAge(dob?: string): string {
  if (!dob) return '';
  const birthDate = new Date(dob);
  if (isNaN(birthDate.getTime())) return '';
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age > 0 ? String(age) : '';
}

export const JapaneseRirekishoTemplate: React.FC<JapaneseRirekishoTemplateProps> = ({ cv }) => {
  const { data } = cv;
  const p = data.personalInfo;

  const today = new Date();
  const todayJapaneseFormatted = `${today.getFullYear()}年 ${today.getMonth() + 1}月 ${today.getDate()}日 現在`;
  const age = calculateAge(p.dateOfBirth);

  return (
    <div className="japanese-rirekisho-wrapper w-full bg-white text-slate-900 font-sans text-xs selection:bg-slate-200">
      {/* Rirekisho Header: Title and Date */}
      <div className="flex justify-between items-baseline mb-2 border-b-2 border-slate-900 pb-1">
        <h1 className="text-xl font-bold tracking-[0.6em] text-slate-950 pl-2">
          履 歴 書
        </h1>
        <div className="text-[11px] text-slate-700 tracking-wide">
          {todayJapaneseFormatted}
        </div>
      </div>

      {/* Top Personal Info Grid (Standard JIS Layout) */}
      <div className="grid grid-cols-12 border-2 border-slate-900 mb-4 divide-slate-900">
        {/* Left Column: Name & Details */}
        <div className="col-span-9 divide-y border-r border-slate-900 divide-slate-900 flex flex-col justify-between">
          {/* Furigana & Full Name */}
          <div className="p-2 min-h-[72px] flex flex-col justify-center bg-slate-50/50">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-[9px] text-slate-500 uppercase tracking-widest">ふりがな</span>
              <span className="text-[11px] font-medium text-slate-700">
                {p.furiganaName || p.fullName}
              </span>
            </div>
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-[9px] text-slate-500 mr-2 uppercase tracking-widest">氏名</span>
                <span className="text-lg font-bold tracking-wider text-slate-950">
                  {p.fullName || '氏名未入力'}
                </span>
              </div>
              {p.gender && (
                <div className="text-[11px] text-slate-600 px-2 py-0.5 border border-slate-300 rounded-xs">
                  性別: {p.gender}
                </div>
              )}
            </div>
          </div>

          {/* Date of Birth & Age */}
          <div className="p-2 flex items-center justify-between text-[11px] bg-white">
            <div className="flex items-center gap-2">
              <span className="text-[9px] text-slate-500 tracking-widest">生年月日</span>
              <span className="font-medium">
                {p.dateOfBirth ? `${p.dateOfBirth} 生` : '年 月 日 生'}
              </span>
            </div>
            <div className="text-[11px] font-semibold text-slate-800">
              （ 満 {age || '—'} 歳 ）
            </div>
          </div>

          {/* Furigana & Current Address */}
          <div className="p-2 min-h-[58px] bg-slate-50/50">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-[9px] text-slate-500 uppercase tracking-widest">ふりがな</span>
              <span className="text-[10px] text-slate-600">
                {p.furiganaAddress || p.location}
              </span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-[9px] text-slate-500 uppercase tracking-widest shrink-0 mt-0.5">現住所</span>
              <div className="font-medium text-[11px] text-slate-900">
                {p.location || '住所未入力'}
              </div>
            </div>
          </div>

          {/* Phone & Email */}
          <div className="grid grid-cols-2 divide-x divide-slate-900 bg-white">
            <div className="p-2">
              <span className="text-[9px] text-slate-500 block uppercase tracking-widest">電話番号</span>
              <span className="font-mono text-[11px] font-medium text-slate-900">
                {p.phone || '未入力'}
              </span>
            </div>
            <div className="p-2">
              <span className="text-[9px] text-slate-500 block uppercase tracking-widest">E-mail</span>
              <span className="font-mono text-[11px] text-slate-900 truncate block">
                {p.email || '未入力'}
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: 30mm x 40mm Photo Frame */}
        <div className="col-span-3 flex flex-col items-center justify-center p-2 bg-slate-50/30">
          <div
            className="border-2 border-dashed border-slate-400 bg-slate-100 flex flex-col items-center justify-center text-center p-1.5 overflow-hidden shadow-xs relative"
            style={{ width: '30mm', height: '40mm' }}
          >
            {p.showPhoto && p.photo ? (
              <img
                src={p.photo}
                alt={p.fullName}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-[9px] text-slate-500 leading-tight flex flex-col items-center justify-center h-full px-1">
                <span className="font-semibold text-slate-700 mb-1">写 真</span>
                <span className="text-[8px] text-slate-400">
                  縦 40mm <br />
                  横 30mm
                </span>
                <span className="text-[7px] text-slate-400 mt-1">
                  本人単身胸から上<br />
                  裏面に氏名記入
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Table: 学歴・職歴 (Academic and Employment Records) */}
      <div className="mb-4">
        <table className="w-full border-2 border-slate-900 border-collapse text-left">
          <thead>
            <tr className="bg-slate-100 border-b-2 border-slate-900 text-center text-[10px] font-bold">
              <th className="border-r border-slate-900 py-1 px-2 w-[55px]">年</th>
              <th className="border-r border-slate-900 py-1 px-2 w-[40px]">月</th>
              <th className="py-1 px-3 text-center tracking-[0.3em]">学 歴 ・ 職 歴</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-300 text-[11px]">
            {/* Section: 学歴 (Education) */}
            <tr className="bg-slate-50/80 font-bold text-center border-t border-slate-900">
              <td className="border-r border-slate-900 py-0.5"></td>
              <td className="border-r border-slate-900 py-0.5"></td>
              <td className="py-0.5 tracking-[0.4em] text-slate-950 text-[11px]">学 歴</td>
            </tr>

            {data.education && data.education.length > 0 ? (
              data.education.flatMap((edu, idx) => {
                const start = parseYearMonth(edu.startDate);
                const end = parseYearMonth(edu.endDate);
                return [
                  <tr key={`edu-start-${idx}`} className="hover:bg-slate-50/40">
                    <td className="border-r border-slate-900 py-1 text-center font-mono text-[11px]">
                      {start.year}
                    </td>
                    <td className="border-r border-slate-900 py-1 text-center font-mono text-[11px]">
                      {start.month}
                    </td>
                    <td className="py-1 px-3 text-slate-900">
                      {edu.institution} {edu.degree} {edu.field} 入学
                    </td>
                  </tr>,
                  <tr key={`edu-end-${idx}`} className="hover:bg-slate-50/40">
                    <td className="border-r border-slate-900 py-1 text-center font-mono text-[11px]">
                      {end.year}
                    </td>
                    <td className="border-r border-slate-900 py-1 text-center font-mono text-[11px]">
                      {end.month}
                    </td>
                    <td className="py-1 px-3 text-slate-900 font-medium">
                      {edu.institution} {edu.degree} {edu.field} 卒業
                    </td>
                  </tr>,
                ];
              })
            ) : (
              <tr>
                <td className="border-r border-slate-900 py-1 text-center font-mono text-[11px] text-slate-400">—</td>
                <td className="border-r border-slate-900 py-1 text-center font-mono text-[11px] text-slate-400">—</td>
                <td className="py-1 px-3 text-slate-400 italic">学歴データがありません</td>
              </tr>
            )}

            {/* Section: 職歴 (Work Experience) */}
            <tr className="bg-slate-50/80 font-bold text-center border-t-2 border-slate-900">
              <td className="border-r border-slate-900 py-0.5"></td>
              <td className="border-r border-slate-900 py-0.5"></td>
              <td className="py-0.5 tracking-[0.4em] text-slate-950 text-[11px]">職 歴</td>
            </tr>

            {data.experience && data.experience.length > 0 ? (
              data.experience.flatMap((exp, idx) => {
                const start = parseYearMonth(exp.startDate);
                const end = parseYearMonth(exp.endDate);
                return [
                  <tr key={`exp-start-${idx}`} className="hover:bg-slate-50/40">
                    <td className="border-r border-slate-900 py-1 text-center font-mono text-[11px]">
                      {start.year}
                    </td>
                    <td className="border-r border-slate-900 py-1 text-center font-mono text-[11px]">
                      {start.month}
                    </td>
                    <td className="py-1 px-3 text-slate-900">
                      {exp.company} 入社（{exp.role} 担当）
                    </td>
                  </tr>,
                  exp.current ? (
                    <tr key={`exp-cur-${idx}`} className="hover:bg-slate-50/40">
                      <td className="border-r border-slate-900 py-1 text-center font-mono text-[11px]"></td>
                      <td className="border-r border-slate-900 py-1 text-center font-mono text-[11px]"></td>
                      <td className="py-1 px-3 text-slate-700 italic">
                        現在に至る
                      </td>
                    </tr>
                  ) : (
                    <tr key={`exp-end-${idx}`} className="hover:bg-slate-50/40">
                      <td className="border-r border-slate-900 py-1 text-center font-mono text-[11px]">
                        {end.year}
                      </td>
                      <td className="border-r border-slate-900 py-1 text-center font-mono text-[11px]">
                        {end.month}
                      </td>
                      <td className="py-1 px-3 text-slate-700">
                        {exp.company} 一身上の都合により退職
                      </td>
                    </tr>
                  ),
                ];
              })
            ) : (
              <tr>
                <td className="border-r border-slate-900 py-1 text-center font-mono text-[11px] text-slate-400">—</td>
                <td className="border-r border-slate-900 py-1 text-center font-mono text-[11px] text-slate-400">—</td>
                <td className="py-1 px-3 text-slate-400 italic">職歴データがありません（なし）</td>
              </tr>
            )}

            {/* Ending row with 以上 (Right aligned) */}
            <tr className="bg-slate-50/30">
              <td className="border-r border-slate-900 py-1 text-center"></td>
              <td className="border-r border-slate-900 py-1 text-center"></td>
              <td className="py-1 px-6 text-right font-bold text-slate-950 tracking-widest text-[11px]">
                以　上
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Main Table 2: 免許・資格 (Licenses & Certifications) */}
      <div className="mb-4">
        <table className="w-full border-2 border-slate-900 border-collapse text-left">
          <thead>
            <tr className="bg-slate-100 border-b-2 border-slate-900 text-center text-[10px] font-bold">
              <th className="border-r border-slate-900 py-1 px-2 w-[55px]">年</th>
              <th className="border-r border-slate-900 py-1 px-2 w-[40px]">月</th>
              <th className="py-1 px-3 text-center tracking-[0.3em]">免 許 ・ 資 格</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-300 text-[11px]">
            {data.certifications && data.certifications.length > 0 ? (
              data.certifications.map((cert, idx) => {
                const ym = parseYearMonth(cert.issueDate);
                return (
                  <tr key={`cert-${idx}`} className="hover:bg-slate-50/40">
                    <td className="border-r border-slate-900 py-1 text-center font-mono text-[11px]">
                      {ym.year || '2023'}
                    </td>
                    <td className="border-r border-slate-900 py-1 text-center font-mono text-[11px]">
                      {ym.month || '6'}
                    </td>
                    <td className="py-1 px-3 text-slate-900 font-medium">
                      {cert.name} 取得
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td className="border-r border-slate-900 py-1 text-center font-mono text-[11px] text-slate-400">—</td>
                <td className="border-r border-slate-900 py-1 text-center font-mono text-[11px] text-slate-400">—</td>
                <td className="py-1 px-3 text-slate-700">普通自動車第一種運転免許 取得</td>
              </tr>
            )}

            {/* Ending row with 以上 */}
            <tr className="bg-slate-50/30">
              <td className="border-r border-slate-900 py-1 text-center"></td>
              <td className="border-r border-slate-900 py-1 text-center"></td>
              <td className="py-1 px-6 text-right font-bold text-slate-950 tracking-widest text-[11px]">
                以　上
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Bottom Section 1: 志望動機・特技・アピールポイント (Reason for application & Self PR) */}
      <div className="border-2 border-slate-900 mb-4">
        <div className="bg-slate-100 border-b border-slate-900 px-3 py-1 text-[10px] font-bold text-slate-800 tracking-wider">
          志望動機 ・ 特技 ・ 好きな学科 ・ 自己PR
        </div>
        <div className="p-3 text-[11px] leading-relaxed whitespace-pre-line text-slate-800 min-h-[90px]">
          {p.selfPr ||
            p.reasonForApplying ||
            data.summary ||
            '貴社の技術革新および顧客志向のプロダクト展開に強く感銘を受け、これまでのフルスタック開発および分散システム運用の経験を活かして貢献したいと考え、志望いたしました。チーム開発における円滑なコミュニケーションと技術研鑽を常に大切にしています。'}
        </div>
      </div>

      {/* Bottom Section 2: 本人希望記入欄 (Personal Requests / Preferences) */}
      <div className="border-2 border-slate-900">
        <div className="bg-slate-100 border-b border-slate-900 px-3 py-1 flex justify-between items-center text-[10px] font-bold text-slate-800 tracking-wider">
          <span>本人希望記入欄（特に給料・職種・勤務時間・勤務地・その他についての希望などがあれば記入）</span>
          {p.commuteTime && (
            <span className="font-normal text-slate-600">
              通勤時間: {p.commuteTime}
            </span>
          )}
        </div>
        <div className="p-3 text-[11px] text-slate-800 leading-relaxed min-h-[60px] flex flex-col justify-between">
          <div>
            {p.personalPreferences || '貴社の規定に従います。'}
          </div>

          <div className="flex justify-end gap-6 text-[10px] text-slate-600 pt-2 border-t border-slate-200 mt-2">
            <div>扶養家族数（配偶者を除く）: <span className="font-medium text-slate-900">{p.dependentsCount || '0人'}</span></div>
            <div>配偶者: <span className="font-medium text-slate-900">{p.spouse || '無'}</span></div>
            <div>配偶者の扶養義務: <span className="font-medium text-slate-900">{p.spouseSupport || '無'}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
};

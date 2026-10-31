/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * CVCraft Gemini AI Chatbot Route
 * Handles multi-turn chat conversations using the official @google/genai SDK.
 */

import { Router, type Request, type Response } from 'express';
import { GoogleGenAI } from '@google/genai';

const router = Router();

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export type ChatRolePreset = 'career_coach' | 'ats_specialist' | 'executive_writer' | 'regional_expert';
export type GeminiModelId = 'gemini-3.8-flash' | 'gemini-3.1-flash-lite' | 'gemini-4-argon';

const SYSTEM_INSTRUCTIONS: Record<ChatRolePreset, string> = {
  career_coach: `You are CVCraft AI Career Coach — an elite career advisor, executive recruiter, and professional CV strategist.
Your role:
- Guide candidates in structuring an interview-winning CV or resume.
- Help articulate career trajectory, strengths, and leadership impact.
- Ask insightful clarifying questions if the user's background is vague.
- Use the STAR framework (Situation, Task, Action, Result) for all accomplishments.
- Emphasize quantifiable metrics (percentages, dollar amounts, performance multipliers, team scale).
- Keep responses concise, well-structured, and ready to use on a CV.
- When you provide an improved summary or bullet points, format them clearly with bullet points so the user can easily copy or apply them to their CV.`,

  ats_specialist: `You are CVCraft ATS Optimization Specialist — an expert on Applicant Tracking Systems (Workday, Greenhouse, Taleo, Lever, BambooHR).
Your role:
- Analyze job titles, skills, and industry terminology to ensure 100% parser compatibility.
- Identify missing high-priority keywords, technical competencies, and industry certifications.
- Warn against non-standard headings, graphics, tables, or columns that break automated parsers.
- Recommend clean, linear single-column structure and standard industry vocabulary.
- Suggest keyword-dense bullet points tailored to the user's target job title.`,

  executive_writer: `You are CVCraft Executive Resume Writer — a master of persuasive professional prose and action verbs.
Your role:
- Transform weak, passive phrasing (e.g., "was responsible for", "worked on") into commanding executive achievements (e.g., "Spearheaded", "Architected", "Orchestrated", "Accelerated").
- Draft compelling 3-4 sentence professional summaries that hook recruiters in 6 seconds.
- Turn job duties into measurable achievements with business results.
- Keep bullets punchy: under 2 lines per bullet, leading with a bold action verb.`,

  regional_expert: `You are CVCraft Global CV & Recruitment Specialist — an expert on country-wise CV and resume conventions.
Your role:
- Advise on regional standards across USA, UK, Canada, Germany (Lebenslauf), Japan (JIS Rirekisho & Shokumu Keirekisho), UAE/Gulf, and Bangladesh (Corporate Biodata).
- Detail when photos are required vs. strictly forbidden (e.g., standard in Japan and Germany, strictly discouraged in USA/UK due to EEOC/Equality Act).
- Guide Japanese Furigana phonetic readings, chronological grids ending with 以上, and Self-PR etiquette.
- Provide country-accurate terminology and cultural expectations for hiring managers.`,
};

// Fallback rule-based responses if GEMINI_API_KEY is not configured
function getFallbackResponse(message: string, role: ChatRolePreset, cvContext?: any): string {
  const q = message.toLowerCase();
  const title = cvContext?.jobTitle || 'Professional';

  if (q.includes('summary')) {
    return `Here is a strong, results-driven professional summary tailored for a **${title}**:

> "Dynamic and results-driven **${title}** with proven experience architecting scalable solutions and leading cross-functional initiatives. Recognized for driving operational efficiencies, optimizing workflows, and delivering high-impact business outcomes. Committed to technical rigor and team excellence."

*Tip: You can customize the bracketed metrics with your real years of experience and top technical competencies.*`;
  }

  if (q.includes('bullet') || q.includes('achievement') || q.includes('experience')) {
    return `Here are 3 high-impact accomplishment bullets using the STAR method for a **${title}**:

- **Spearheaded** the architectural redesign of core system infrastructure, decreasing response latency by 38% for over 50,000 active users.
- **Orchestrated** automated CI/CD deployment pipelines, cutting sprint release cycle times by 45% while maintaining 99.9% uptime.
- **Collaborated** cross-functionally with product and engineering stakeholders to deliver high-priority roadmap deliverables 2 weeks ahead of schedule.`;
  }

  if (q.includes('ats') || q.includes('keyword')) {
    return `### ATS Optimization Checklist for **${title}**:
1. **Header**: Ensure standard headers like "Work Experience", "Education", and "Skills" rather than creative phrasing.
2. **Metrics**: Every position should have at least 1-2 quantified bullets with numbers ($ saved, % speedup, users served).
3. **Format**: Single-column layout ensures 100% parse rates in Workday and Greenhouse.
4. **Keywords**: Include both acronyms and full terms (e.g. "AWS (Amazon Web Services)", "CI/CD").`;
  }

  if (q.includes('japan') || q.includes('rirekisho')) {
    return `### Japanese Recruitment Standards (JIS Rirekisho & Shokumu):
- **Photo**: Formal 30mm x 40mm studio portrait in dark business attire is strictly expected.
- **Furigana**: Phonetic Hiragana or Katakana must be present above your name and address.
- **Chronological Table**: Academic and work entries must end with a right-aligned **以上** (End).
- **Self-PR (自己PR)**: Focus on concrete problem solving, adaptability, and harmony with corporate culture.`;
  }

  return `I am here to help you craft an outstanding CV for **${title}**!

You can ask me to:
1. **Polish your summary**: Paste your current summary or ask for an executive pitch.
2. **Enhance accomplishment bullets**: Turn daily duties into STAR-method achievements.
3. **Audit ATS compatibility**: Check formatting and keyword presence.
4. **Advise on country standards**: Guidance on USA, UK, Germany, Japan, UAE, or Bangladesh standards.

What section of your CV would you like to work on?`;
}

router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      messages,
      model = 'gemini-3.8-flash',
      rolePreset = 'career_coach',
      cvContext,
    } = req.body;

    if (!Array.isArray(messages) || messages.length === 0) {
      res.status(400).json({
        success: false,
        message: 'Messages array is required and must contain at least one message.',
      });
      return;
    }

    // Determine model to use
    // Allowed models per instruction: gemini-4-argon, gemini-3.8-flash, gemini-3.1-flash-lite
    let selectedModel: string = 'gemini-3.8-flash';
    if (model === 'gemini-4-argon' || model === 'gemini-3.1-flash-lite' || model === 'gemini-3.8-flash') {
      selectedModel = model;
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      // Graceful offline fallback
      const lastUserMsg = [...messages].reverse().find((m) => m.role === 'user')?.text || '';
      const fallbackText = getFallbackResponse(lastUserMsg, rolePreset as ChatRolePreset, cvContext);

      res.json({
        success: true,
        provider: 'CVCraft Career Engine (Offline / Deterministic)',
        model: selectedModel,
        reply: fallbackText,
        notice: 'Tip: Add GEMINI_API_KEY in your environment for live model responses.',
      });
      return;
    }

    // Initialize GoogleGenAI SDK
    const ai = new GoogleGenAI({ apiKey });

    // Build context-aware system instruction
    const baseInstruction = SYSTEM_INSTRUCTIONS[rolePreset as ChatRolePreset] || SYSTEM_INSTRUCTIONS.career_coach;
    let fullSystemInstruction = baseInstruction;

    if (cvContext && typeof cvContext === 'object') {
      fullSystemInstruction += `\n\nCURRENT USER CV CONTEXT:
- Target Job Title: ${cvContext.jobTitle || 'Not specified'}
- Target Country: ${cvContext.targetCountry || 'USA'}
- Current Professional Summary: ${cvContext.summary ? `"${cvContext.summary}"` : 'None yet'}
- Key Skills: ${Array.isArray(cvContext.skills) ? cvContext.skills.join(', ') : 'Not specified'}
- Top Work Positions: ${
        Array.isArray(cvContext.experience)
          ? cvContext.experience.map((e: any) => `${e.role} at ${e.company}`).join('; ')
          : 'None specified'
      }
Use this context to personalize your advice, bullet points, and suggestions.`;
    }

    // Convert messages into multi-turn contents format for GoogleGenAI
    const formattedContents = messages.map((m: { role: string; text: string }) => ({
      role: m.role === 'model' ? 'model' : 'user',
      parts: [{ text: m.text }],
    }));

    // Call Gemini API
    const response = await ai.models.generateContent({
      model: selectedModel,
      contents: formattedContents,
      config: {
        systemInstruction: fullSystemInstruction,
        temperature: selectedModel === 'gemini-4-argon' ? 0.3 : 0.7,
      },
    });

    const replyText = response.text || 'I analyzed your request. Let me know if you would like me to adjust any specific section.';

    res.json({
      success: true,
      provider: 'Google Gemini AI',
      model: selectedModel,
      reply: replyText,
    });
  } catch (err: any) {
    console.error('[Gemini Chat Error]:', err);
    res.status(500).json({
      success: false,
      message: err.message || 'Failed to generate response from Gemini AI.',
      fallbackReply: 'Our AI Career Coach encountered a temporary service hiccup. Please try again or rephrase your question.',
    });
  }
});

export default router;

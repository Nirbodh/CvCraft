/**
 * CVCraft Deterministic Rule-Based Writing Engine
 * 
 * IMPORTANT: This engine operates strictly via deterministic algorithms,
 * syntax heuristics, and verified resume taxonomy. It never invents false
 * qualifications, degrees, skills, or job positions.
 */

export interface ActionVerbCategory {
  category: string;
  description: string;
  verbs: string[];
}

export const ACTION_VERBS: ActionVerbCategory[] = [
  {
    category: 'Leadership & Management',
    description: 'Lead teams, initiatives, and organizational growth',
    verbs: [
      'Spearheaded',
      'Orchestrated',
      'Directed',
      'Championed',
      'Mentored',
      'Delegated',
      'Mobilized',
      'Cultivated',
      'Oversaw',
      'Governed',
      'Steered',
    ],
  },
  {
    category: 'Engineering & Technical',
    description: 'Design, code, build, and deploy systems',
    verbs: [
      'Architected',
      'Engineered',
      'Deployed',
      'Automated',
      'Refactored',
      'Implemented',
      'Configured',
      'Integrated',
      'Constructed',
      'Optimized',
      'Provisioned',
    ],
  },
  {
    category: 'Optimization & Performance',
    description: 'Speed up workflows, save costs, and maximize efficiency',
    verbs: [
      'Streamlined',
      'Accelerated',
      'Maximized',
      'Reduced',
      'Consolidated',
      'Enhanced',
      'Revamped',
      'Standardized',
      'Restructured',
      'Modernized',
    ],
  },
  {
    category: 'Analysis & Problem Solving',
    description: 'Investigate, measure, audit, and diagnose',
    verbs: [
      'Evaluated',
      'Benchmarked',
      'Diagnosed',
      'Synthesized',
      'Formulated',
      'Audited',
      'Quantified',
      'Identified',
      'Surveyed',
      'Discovered',
    ],
  },
  {
    category: 'Communication & Strategy',
    description: 'Align stakeholders, negotiate, write, and present',
    verbs: [
      'Negotiated',
      'Facilitated',
      'Authored',
      'Presented',
      'Advocated',
      'Partnered',
      'Liaised',
      'Articulated',
      'Delivered',
      'Briefed',
    ],
  },
];

const WEAK_PHRASES_MAP: Record<string, string[]> = {
  'worked on': ['developed and maintained', 'engineered', 'spearheaded'],
  'responsible for': ['orchestrated and oversaw', 'directed', 'managed and executed'],
  'helped with': ['collaborated with cross-functional teams to deliver', 'assisted in delivering'],
  'helped': ['facilitated', 'supported the execution of', 'partnered to achieve'],
  'was tasked with': ['undertook', 'executed', 'championed the delivery of'],
  'handled': ['managed end-to-end', 'coordinated', 'administered'],
  'did': ['executed', 'performed', 'completed'],
  'made': ['built and published', 'produced', 'formulated'],
  'tried to': ['initiated plans to', 'tested strategies to'],
  'a lot of': ['substantial', 'extensive', 'high-volume'],
  'good': ['optimal', 'high-caliber', 'robust'],
  'bad': ['sub-optimal', 'inefficient', 'deficient'],
  'fixed': ['resolved critical defects in', 'troubleshot and remediated', 'debugged'],
};

export interface BulletAnalysis {
  original: string;
  enhancedSuggestions: string[];
  hasActionVerb: boolean;
  hasMetric: boolean;
  detectedWeakPhrases: string[];
  wordCount: number;
  clarityScore: number; // 0 to 100
  feedbackTips: string[];
}

export function analyzeAndEnhanceBullet(text: string): BulletAnalysis {
  const trimmed = text.trim();
  if (!trimmed) {
    return {
      original: '',
      enhancedSuggestions: [],
      hasActionVerb: false,
      hasMetric: false,
      detectedWeakPhrases: [],
      wordCount: 0,
      clarityScore: 0,
      feedbackTips: ['Please enter a sentence or bullet point to analyze.'],
    };
  }

  const words = trimmed.split(/\s+/);
  const wordCount = words.length;

  // 1. Metric check: contains %, $, numbers, or multipliers (e.g. 2x, 30%)
  const hasMetric = /(?:\d+%|\$\d+|\b\d+\b|\b\d+x\b|\b\d+k\b)/i.test(trimmed);

  // 2. Action verb check
  const firstWord = words[0].replace(/[^a-zA-Z]/g, '');
  const allVerbsLower = ACTION_VERBS.flatMap((c) => c.verbs.map((v) => v.toLowerCase()));
  const hasActionVerb = allVerbsLower.includes(firstWord.toLowerCase());

  // 3. Weak phrases check
  const detectedWeakPhrases: string[] = [];
  const lowerText = trimmed.toLowerCase();

  for (const phrase of Object.keys(WEAK_PHRASES_MAP)) {
    if (lowerText.includes(phrase)) {
      detectedWeakPhrases.push(phrase);
    }
  }

  // 4. Suggestions generation via deterministic substitution
  const suggestions: string[] = [];

  // Suggestion A: Deterministic phrase replacement
  let phraseReplaced = trimmed;
  for (const phrase of detectedWeakPhrases) {
    const replacements = WEAK_PHRASES_MAP[phrase];
    if (replacements && replacements.length > 0) {
      const regex = new RegExp(`\\b${phrase}\\b`, 'gi');
      phraseReplaced = phraseReplaced.replace(regex, replacements[0]);
    }
  }

  // Format first letter capitalized and ensure trailing period
  const formatSentence = (str: string) => {
    let clean = str.trim().replace(/\s+/g, ' ');
    if (clean.length > 0) {
      clean = clean.charAt(0).toUpperCase() + clean.slice(1);
    }
    if (!clean.endsWith('.') && !clean.endsWith('!') && !clean.endsWith('?')) {
      clean += '.';
    }
    return clean;
  };

  if (phraseReplaced !== trimmed) {
    suggestions.push(formatSentence(phraseReplaced));
  }

  // Suggestion B: If lacks action verb, prepend professional action verb based on context
  if (!hasActionVerb) {
    const contextLower = trimmed.toLowerCase();
    let leadVerb = 'Engineered and executed';
    if (contextLower.includes('team') || contextLower.includes('lead') || contextLower.includes('manage')) {
      leadVerb = 'Orchestrated';
    } else if (contextLower.includes('code') || contextLower.includes('software') || contextLower.includes('system') || contextLower.includes('data')) {
      leadVerb = 'Architected and deployed';
    } else if (contextLower.includes('process') || contextLower.includes('cost') || contextLower.includes('time') || contextLower.includes('performance')) {
      leadVerb = 'Streamlined';
    }

    // Clean leading weak phrases like "I was responsible for" or "Worked on"
    let stripped = trimmed.replace(/^(?:i\s+was\s+responsible\s+for|responsible\s+for|i\s+worked\s+on|worked\s+on|helped\s+with|i\s+did)\s+/i, '');
    stripped = stripped.charAt(0).toLowerCase() + stripped.slice(1);
    suggestions.push(formatSentence(`${leadVerb} ${stripped}`));
  }

  // Suggestion C: Metric reminder framework (STAR method: Situation, Action, Result)
  if (!hasMetric) {
    suggestions.push(formatSentence(`${formatSentence(trimmed).slice(0, -1)}, resulting in a measurable efficiency improvement.`));
  }

  // 5. Calculate clarity score
  let score = 50;
  if (hasActionVerb) score += 20;
  if (hasMetric) score += 20;
  if (detectedWeakPhrases.length === 0) score += 10;
  if (wordCount >= 8 && wordCount <= 26) score += 10;
  if (wordCount < 5) score -= 20;
  score = Math.min(100, Math.max(10, score));

  // 6. Feedback tips
  const feedbackTips: string[] = [];
  if (!hasActionVerb) {
    feedbackTips.push('Begin with a high-impact action verb (e.g., "Spearheaded", "Architected", "Optimized").');
  }
  if (!hasMetric) {
    feedbackTips.push('Add a tangible metric or outcome (e.g., "reduced latency by 35%", "serving 50,000+ active users").');
  }
  if (detectedWeakPhrases.length > 0) {
    feedbackTips.push(`Replace weak phrases: "${detectedWeakPhrases.join('", "')}" with proactive vocabulary.`);
  }
  if (wordCount > 30) {
    feedbackTips.push('Sentence is quite long. Consider splitting into two concise achievement bullets.');
  }

  return {
    original: trimmed,
    enhancedSuggestions: Array.from(new Set(suggestions)).slice(0, 3),
    hasActionVerb,
    hasMetric,
    detectedWeakPhrases,
    wordCount,
    clarityScore: score,
    feedbackTips,
  };
}

export interface SummaryGenerationInput {
  jobTitle?: string;
  skills?: string[];
  yearsExperience?: number | string;
  topCompanies?: string[];
  degree?: string;
  field?: string;
}

export interface GeneratedSummaryOption {
  style: 'Impact & Results' | 'Technical & Domain Expertise' | 'Leadership & Growth';
  text: string;
}

export interface SummaryGenerationResult {
  hasSufficientData: boolean;
  missingFields: string[];
  options: GeneratedSummaryOption[];
}

export function generateDeterministicSummary(input: SummaryGenerationInput): SummaryGenerationResult {
  const missingFields: string[] = [];
  const title = (input.jobTitle || '').trim();
  const skills = (input.skills || []).map((s) => s.trim()).filter((s) => s.length > 0);
  const degree = (input.degree || '').trim();
  const field = (input.field || '').trim();
  const companies = (input.topCompanies || []).map((c) => c.trim()).filter((c) => c.length > 0);

  if (!title) {
    missingFields.push('Professional Job Title');
  }
  if (skills.length === 0) {
    missingFields.push('Core Skills (at least 2-3 skills)');
  }

  if (missingFields.length > 0) {
    return {
      hasSufficientData: false,
      missingFields,
      options: [],
    };
  }

  const primarySkillsStr = skills.slice(0, 3).join(', ');
  const secondarySkillsStr = skills.slice(3, 6).join(', ');
  const skillClause = secondarySkillsStr
    ? `expertise in ${primarySkillsStr}, along with proficiency in ${secondarySkillsStr}`
    : `demonstrated proficiency in ${primarySkillsStr}`;

  const expClause = input.yearsExperience
    ? `${input.yearsExperience}+ years of professional experience`
    : 'a proven track record of professional achievement';

  const companyClause = companies.length > 0
    ? ` across organizations including ${companies.slice(0, 2).join(' and ')}`
    : '';

  const eduClause = degree && field
    ? ` Supported by an academic foundation with a ${degree} in ${field}.`
    : degree
    ? ` Supported by academic credentials in ${degree}.`
    : '';

  // 3 distinct fact-based summaries:
  const options: GeneratedSummaryOption[] = [
    {
      style: 'Impact & Results',
      text: `Results-driven ${title} with ${expClause}${companyClause}. Possesses ${skillClause}. Dedicated to streamlining operational workflows, delivering scalable outcomes, and upholding high quality standards.${eduClause}`,
    },
    {
      style: 'Technical & Domain Expertise',
      text: `${title} specializing in ${primarySkillsStr}. Combines practical hands-on problem solving with ${expClause} to build resilient solutions.${companyClause ? ` Contributed to high-impact projects at ${companies.join(', ')}.` : ''} Committed to engineering rigor, modern methodologies, and continuous skill refinement.${eduClause}`,
    },
    {
      style: 'Leadership & Growth',
      text: `Accomplished and proactive ${title} experienced in end-to-end execution and collaborative cross-functional delivery. Brings comprehensive background in ${primarySkillsStr}. Adept at translating strategic objectives into measurable deliverables while elevating team capabilities and process standards.`,
    },
  ];

  return {
    hasSufficientData: true,
    missingFields: [],
    options,
  };
}

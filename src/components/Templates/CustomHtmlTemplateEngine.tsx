import React, { useMemo } from 'react';
import DOMPurify from 'dompurify';
import { CV } from '../../types/cv.ts';

interface CustomHtmlTemplateEngineProps {
  cv: CV;
  htmlTemplate?: string;
  cssTemplate?: string;
}

export function compileCustomTemplate(templateHtml: string, cv: CV): string {
  if (!templateHtml) return '<div class="p-4 text-slate-500">Empty HTML template.</div>';

  let rendered = templateHtml;
  const { data } = cv;
  const p = data.personalInfo || ({} as any);

  // 1. Theme and styling tokens
  rendered = rendered.replace(/\{\{themeColor\}\}/g, cv.themeColor || '#2563eb');
  rendered = rendered.replace(/\{\{fontFamily\}\}/g, cv.fontFamily || 'sans-serif');
  rendered = rendered.replace(/\{\{fontSize\}\}/g, cv.fontSize || 'normal');

  // 2. Personal info tokens
  rendered = rendered.replace(/\{\{personalInfo\.fullName\}\}/g, p.fullName || '');
  rendered = rendered.replace(/\{\{personalInfo\.jobTitle\}\}/g, p.jobTitle || '');
  rendered = rendered.replace(/\{\{personalInfo\.email\}\}/g, p.email || '');
  rendered = rendered.replace(/\{\{personalInfo\.phone\}\}/g, p.phone || '');
  rendered = rendered.replace(/\{\{personalInfo\.location\}\}/g, p.location || '');
  rendered = rendered.replace(/\{\{personalInfo\.website\}\}/g, p.website || '');
  rendered = rendered.replace(/\{\{personalInfo\.linkedin\}\}/g, p.linkedin || '');
  rendered = rendered.replace(/\{\{personalInfo\.github\}\}/g, p.github || '');
  rendered = rendered.replace(/\{\{personalInfo\.photo\}\}/g, p.photo || '');
  rendered = rendered.replace(/\{\{personalInfo\.furiganaName\}\}/g, p.furiganaName || '');
  rendered = rendered.replace(/\{\{personalInfo\.furiganaAddress\}\}/g, p.furiganaAddress || '');
  rendered = rendered.replace(/\{\{personalInfo\.gender\}\}/g, p.gender || '');
  rendered = rendered.replace(/\{\{personalInfo\.dateOfBirth\}\}/g, p.dateOfBirth || '');
  rendered = rendered.replace(/\{\{personalInfo\.selfPr\}\}/g, p.selfPr || '');
  rendered = rendered.replace(/\{\{personalInfo\.reasonForApplying\}\}/g, p.reasonForApplying || '');
  rendered = rendered.replace(/\{\{personalInfo\.commuteTime\}\}/g, p.commuteTime || '');

  // 3. Summary token
  rendered = rendered.replace(/\{\{summary\}\}/g, data.summary || '');

  // 4. Loop blocks helper
  const replaceBlock = (
    str: string,
    tag: string,
    items: any[],
    formatter: (item: any, template: string) => string
  ) => {
    const regex = new RegExp(`\\{\\{#${tag}\\}\\}([\\s\\S]*?)\\{\\{/${tag}\\}\\}`, 'g');
    return str.replace(regex, (_match, innerTemplate) => {
      if (!Array.isArray(items) || items.length === 0) return '';
      return items.map((item) => formatter(item, innerTemplate)).join('');
    });
  };

  // Experience loop
  rendered = replaceBlock(rendered, 'experience', data.experience || [], (exp, block) => {
    let out = block;
    out = out.replace(/\{\{role\}\}/g, exp.role || '');
    out = out.replace(/\{\{company\}\}/g, exp.company || '');
    out = out.replace(/\{\{location\}\}/g, exp.location || '');
    out = out.replace(/\{\{startDate\}\}/g, exp.startDate || '');
    out = out.replace(/\{\{endDate\}\}/g, exp.current ? 'Present' : exp.endDate || '');
    out = out.replace(/\{\{description\}\}/g, exp.description || '');
    if (exp.highlights && exp.highlights.length > 0) {
      const hlHtml = exp.highlights.map((h: string) => `<li>${h}</li>`).join('');
      out = out.replace(/\{\{highlights\}\}/g, `<ul>${hlHtml}</ul>`);
    } else {
      out = out.replace(/\{\{highlights\}\}/g, '');
    }
    return out;
  });

  // Education loop
  rendered = replaceBlock(rendered, 'education', data.education || [], (edu, block) => {
    let out = block;
    out = out.replace(/\{\{degree\}\}/g, edu.degree || '');
    out = out.replace(/\{\{field\}\}/g, edu.field || '');
    out = out.replace(/\{\{institution\}\}/g, edu.institution || '');
    out = out.replace(/\{\{location\}\}/g, edu.location || '');
    out = out.replace(/\{\{startDate\}\}/g, edu.startDate || '');
    out = out.replace(/\{\{endDate\}\}/g, edu.endDate || '');
    out = out.replace(/\{\{gpa\}\}/g, edu.gpa ? `GPA: ${edu.gpa}` : '');
    out = out.replace(/\{\{description\}\}/g, edu.description || '');
    return out;
  });

  // Skills loop
  rendered = replaceBlock(rendered, 'skills', data.skills || [], (sk, block) => {
    let out = block;
    out = out.replace(/\{\{category\}\}/g, sk.category || '');
    out = out.replace(/\{\{items\}\}/g, Array.isArray(sk.items) ? sk.items.join(', ') : '');
    return out;
  });

  // Certifications loop
  rendered = replaceBlock(rendered, 'certifications', data.certifications || [], (cert, block) => {
    let out = block;
    out = out.replace(/\{\{name\}\}/g, cert.name || '');
    out = out.replace(/\{\{issuer\}\}/g, cert.issuer || '');
    out = out.replace(/\{\{issueDate\}\}/g, cert.issueDate || '');
    return out;
  });

  // Languages loop
  rendered = replaceBlock(rendered, 'languages', data.languages || [], (lang, block) => {
    let out = block;
    out = out.replace(/\{\{language\}\}/g, lang.language || '');
    out = out.replace(/\{\{proficiency\}\}/g, lang.proficiency || '');
    return out;
  });

  // Projects loop
  rendered = replaceBlock(rendered, 'projects', data.projects || [], (proj, block) => {
    let out = block;
    out = out.replace(/\{\{name\}\}/g, proj.name || '');
    out = out.replace(/\{\{description\}\}/g, proj.description || '');
    out = out.replace(/\{\{link\}\}/g, proj.link || '');
    return out;
  });

  // Custom Sections loop
  rendered = replaceBlock(rendered, 'customSections', data.customSections || [], (sec, block) => {
    let out = block;
    out = out.replace(/\{\{title\}\}/g, sec.title || '');
    out = out.replace(/\{\{content\}\}/g, sec.content || '');
    return out;
  });

  return rendered;
}

export const CustomHtmlTemplateEngine: React.FC<CustomHtmlTemplateEngineProps> = ({
  cv,
  htmlTemplate,
  cssTemplate,
}) => {
  const rawHtml = htmlTemplate || cv.customTemplateHtml || '<div class="p-6">No custom template provided.</div>';
  const rawCss = cssTemplate || cv.customTemplateCss || '';

  const sanitizedHtml = useMemo(() => {
    const compiled = compileCustomTemplate(rawHtml, cv);
    return DOMPurify.sanitize(compiled, {
      USE_PROFILES: { html: true },
      ADD_ATTR: ['style', 'class', 'target'],
    });
  }, [rawHtml, cv]);

  return (
    <div className="custom-html-template-root w-full">
      {rawCss && (
        <style
          dangerouslySetInnerHTML={{
            __html: rawCss,
          }}
        />
      )}
      <div
        className="custom-template-content"
        dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
      />
    </div>
  );
};

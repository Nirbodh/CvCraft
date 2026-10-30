/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Template Field Configuration Editor
 * Dedicated Admin UI for configuring template-driven CV fields, section allocations, and photo rules.
 */

import React, { useState } from 'react';
import {
  TemplateFieldConfig,
  TemplateFieldDefinition,
  TemplateSectionTarget,
  TemplateFieldType,
} from '../../types/template.ts';
import { ALL_STANDARD_SECTIONS } from '../../config/templateFieldConfigs.ts';
import {
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Edit2,
  Check,
  X,
  Sliders,
  Camera,
  Layers,
  HelpCircle,
} from 'lucide-react';

interface TemplateFieldConfigEditorProps {
  config: TemplateFieldConfig;
  onChange: (updated: TemplateFieldConfig) => void;
}

export const TemplateFieldConfigEditor: React.FC<TemplateFieldConfigEditorProps> = ({
  config,
  onChange,
}) => {
  const [editingFieldId, setEditingFieldId] = useState<string | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  // Form state for creating or editing a field definition
  const [fieldForm, setFieldForm] = useState<TemplateFieldDefinition>({
    id: '',
    label: '',
    section: 'personalInfo',
    type: 'text',
    placeholder: '',
    helpText: '',
    required: false,
    defaultVisibility: true,
    order: (config.fields?.length || 0) + 1,
  });

  const handleToggleSection = (section: TemplateSectionTarget) => {
    const currentSections = config.sections || [];
    const exists = currentSections.includes(section);
    const updatedSections = exists
      ? currentSections.filter((s) => s !== section)
      : [...currentSections, section];
    onChange({
      ...config,
      sections: updatedSections,
    });
  };

  const handleUpdatePhotoSetting = (key: keyof TemplateFieldConfig, value: any) => {
    onChange({
      ...config,
      [key]: value,
    });
  };

  const startAddNew = () => {
    setFieldForm({
      id: '',
      label: '',
      section: 'personalInfo',
      type: 'text',
      placeholder: '',
      helpText: '',
      required: false,
      defaultVisibility: true,
      order: (config.fields?.length || 0) + 1,
    });
    setEditingFieldId(null);
    setIsAddingNew(true);
  };

  const startEditField = (field: TemplateFieldDefinition) => {
    setFieldForm({ ...field });
    setEditingFieldId(field.id);
    setIsAddingNew(false);
  };

  const saveFieldForm = () => {
    if (!fieldForm.id.trim() || !fieldForm.label.trim()) {
      alert('Field ID and Label are required.');
      return;
    }

    const currentFields = config.fields ? [...config.fields] : [];
    if (isAddingNew) {
      if (currentFields.some((f) => f.id === fieldForm.id)) {
        alert(`A field with ID "${fieldForm.id}" already exists.`);
        return;
      }
      currentFields.push(fieldForm);
    } else {
      const idx = currentFields.findIndex((f) => f.id === editingFieldId);
      if (idx !== -1) {
        currentFields[idx] = fieldForm;
      }
    }

    onChange({
      ...config,
      fields: currentFields,
    });

    setIsAddingNew(false);
    setEditingFieldId(null);
  };

  const deleteField = (id: string) => {
    if (window.confirm(`Delete field "${id}" from this template?`)) {
      onChange({
        ...config,
        fields: (config.fields || []).filter((f) => f.id !== id),
      });
      if (editingFieldId === id) {
        setEditingFieldId(null);
        setIsAddingNew(false);
      }
    }
  };

  const moveField = (index: number, direction: 'up' | 'down') => {
    const fields = [...(config.fields || [])];
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= fields.length) return;

    const temp = fields[index];
    fields[index] = fields[target];
    fields[target] = temp;

    // re-assign orders
    fields.forEach((f, i) => (f.order = i + 1));

    onChange({
      ...config,
      fields,
    });
  };

  return (
    <div className="space-y-6 text-xs text-slate-800">
      {/* 1. Photo and Media Settings */}
      <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
          <Camera className="w-4 h-4 text-blue-600" />
          <h3 className="font-bold text-slate-900 text-xs">Profile Photo Conventions &amp; Sizing</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <label className="flex items-center gap-2 p-2 bg-white border border-slate-200 rounded-lg cursor-pointer">
            <input
              type="checkbox"
              checked={config.photoSupported}
              onChange={(e) => handleUpdatePhotoSetting('photoSupported', e.target.checked)}
              className="rounded text-blue-600 focus:ring-blue-500"
            />
            <span className="font-semibold text-slate-800">Photo Supported</span>
          </label>

          <label className="flex items-center gap-2 p-2 bg-white border border-slate-200 rounded-lg cursor-pointer">
            <input
              type="checkbox"
              checked={Boolean(config.photoRecommended)}
              onChange={(e) => handleUpdatePhotoSetting('photoRecommended', e.target.checked)}
              disabled={!config.photoSupported}
              className="rounded text-blue-600 focus:ring-blue-500"
            />
            <span className="font-semibold text-slate-800">Photo Recommended</span>
          </label>

          <div className="p-2 bg-white border border-slate-200 rounded-lg flex items-center justify-between">
            <span className="font-semibold text-slate-700">Aspect Ratio:</span>
            <select
              value={config.photoAspect || '1:1'}
              onChange={(e) => handleUpdatePhotoSetting('photoAspect', e.target.value)}
              disabled={!config.photoSupported}
              className="px-2 py-1 border border-slate-200 rounded bg-slate-50 text-xs"
            >
              <option value="1:1">1:1 Square (Universal)</option>
              <option value="3:4">3:4 Portrait (EU / JIS)</option>
            </select>
          </div>
        </div>
      </div>

      {/* 2. Active Sections Allocation */}
      <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-purple-600" />
            <h3 className="font-bold text-slate-900 text-xs">Supported CV Sections for this Template</h3>
          </div>
          <span className="text-[10px] text-slate-500">
            {(config.sections || []).length} / {ALL_STANDARD_SECTIONS.length} active
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {ALL_STANDARD_SECTIONS.map((sec) => {
            const isChecked = (config.sections || []).includes(sec);
            return (
              <label
                key={sec}
                className={`p-2 rounded border text-xs flex items-center gap-2 cursor-pointer transition-colors ${
                  isChecked
                    ? 'bg-purple-50/70 border-purple-300 text-purple-950 font-semibold'
                    : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
                }`}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => handleToggleSection(sec)}
                  className="rounded text-purple-600 focus:ring-purple-500"
                />
                <span className="truncate capitalize">{sec.replace(/([A-Z])/g, ' $1')}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* 3. Configurable Custom Fields Management */}
      <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-blue-600" />
              <h3 className="font-bold text-slate-900 text-xs">Template-Driven Dynamic Fields</h3>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              These fields automatically appear in user CV editors when this template is selected.
            </p>
          </div>

          {!isAddingNew && !editingFieldId && (
            <button
              type="button"
              onClick={startAddNew}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Field</span>
            </button>
          )}
        </div>

        {/* Add/Edit Modal/Form */}
        {(isAddingNew || editingFieldId) && (
          <div className="p-4 bg-slate-50 border-2 border-blue-400 rounded-xl space-y-3 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <span className="font-bold text-slate-900 text-xs">
                {isAddingNew ? 'Add New Template Field' : `Edit Field: ${fieldForm.id}`}
              </span>
              <button
                type="button"
                onClick={() => {
                  setIsAddingNew(false);
                  setEditingFieldId(null);
                }}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-700 font-semibold mb-1 text-[11px]">Field ID (Unique Key)</label>
                <input
                  type="text"
                  value={fieldForm.id}
                  onChange={(e) => setFieldForm({ ...fieldForm, id: e.target.value.trim() })}
                  disabled={!isAddingNew}
                  placeholder="e.g. furiganaName, commuteTime"
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded bg-white text-slate-900 font-mono text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1 text-[11px]">Field Label</label>
                <input
                  type="text"
                  value={fieldForm.label}
                  onChange={(e) => setFieldForm({ ...fieldForm, label: e.target.value })}
                  placeholder="e.g. ふりがな (氏名) Furigana Name"
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded bg-white text-slate-900 text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1 text-[11px]">Target Section</label>
                <select
                  value={fieldForm.section}
                  onChange={(e) => setFieldForm({ ...fieldForm, section: e.target.value as TemplateSectionTarget })}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded bg-white text-slate-900 text-xs cursor-pointer"
                >
                  {ALL_STANDARD_SECTIONS.map((sec) => (
                    <option key={sec} value={sec}>
                      {sec}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1 text-[11px]">Field Input Type</label>
                <select
                  value={fieldForm.type}
                  onChange={(e) => setFieldForm({ ...fieldForm, type: e.target.value as TemplateFieldType })}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded bg-white text-slate-900 text-xs cursor-pointer"
                >
                  <option value="text">Text Input</option>
                  <option value="textarea">Textarea (Multi-line)</option>
                  <option value="date">Date Picker</option>
                  <option value="number">Number</option>
                  <option value="select">Dropdown Select</option>
                  <option value="boolean">Checkbox / Toggle</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1 text-[11px]">Placeholder</label>
                <input
                  type="text"
                  value={fieldForm.placeholder || ''}
                  onChange={(e) => setFieldForm({ ...fieldForm, placeholder: e.target.value })}
                  placeholder="Input placeholder hint"
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded bg-white text-slate-900 text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1 text-[11px]">Help / Guidance Text</label>
                <input
                  type="text"
                  value={fieldForm.helpText || ''}
                  onChange={(e) => setFieldForm({ ...fieldForm, helpText: e.target.value })}
                  placeholder="Explains purpose to user"
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded bg-white text-slate-900 text-xs"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean(fieldForm.required)}
                    onChange={(e) => setFieldForm({ ...fieldForm, required: e.target.checked })}
                    className="rounded text-blue-600"
                  />
                  <span className="font-semibold text-slate-800">Mandatory / Required Field</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={fieldForm.defaultVisibility !== false}
                    onChange={(e) => setFieldForm({ ...fieldForm, defaultVisibility: e.target.checked })}
                    className="rounded text-blue-600"
                  />
                  <span className="font-semibold text-slate-800">Visible by Default</span>
                </label>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddingNew(false);
                    setEditingFieldId(null);
                  }}
                  className="px-3 py-1 bg-white border border-slate-200 text-slate-700 rounded-md hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={saveFieldForm}
                  className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-bold cursor-pointer"
                >
                  {isAddingNew ? 'Add to Template' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Fields List Table */}
        {(!config.fields || config.fields.length === 0) ? (
          <div className="text-center py-6 border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
            <p className="text-slate-500 text-xs">No dynamic fields configured for this template.</p>
            <p className="text-[11px] text-slate-400 mt-1">
              Standard CV sections will render without additional custom template fields.
            </p>
          </div>
        ) : (
          <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-200">
            {config.fields.map((field, idx) => (
              <div
                key={field.id}
                className="p-3 bg-white hover:bg-slate-50 flex items-center justify-between gap-3 transition-colors"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="flex flex-col gap-0.5">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => moveField(idx, 'up')}
                      className="p-0.5 text-slate-400 hover:text-slate-700 disabled:opacity-30 cursor-pointer"
                    >
                      <ArrowUp className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === (config.fields?.length || 0) - 1}
                      onClick={() => moveField(idx, 'down')}
                      className="p-0.5 text-slate-400 hover:text-slate-700 disabled:opacity-30 cursor-pointer"
                    >
                      <ArrowDown className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-xs truncate">{field.label}</span>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-slate-100 text-slate-600 border border-slate-200">
                        {field.id}
                      </span>
                      {field.required && (
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                          REQUIRED
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-0.5">
                      <span>Section: <b className="text-slate-700">{field.section}</b></span>
                      <span>Type: <b className="text-slate-700">{field.type}</b></span>
                      {field.placeholder && (
                        <span className="truncate max-w-[200px]">Hint: {field.placeholder}</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => startEditField(field)}
                    className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors cursor-pointer"
                    title="Edit Field Configuration"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteField(field.id)}
                    className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors cursor-pointer"
                    title="Delete Field"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

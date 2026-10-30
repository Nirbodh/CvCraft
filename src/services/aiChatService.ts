/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * CVCraft Gemini AI Chat Service
 * Communicates with /api/chat server-side proxy route.
 */

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
  model?: string;
  rolePreset?: string;
}

export type GeminiModelId = 'gemini-3.8-flash' | 'gemini-3.1-flash-lite' | 'gemini-4-argon';
export type ChatRolePreset = 'career_coach' | 'ats_specialist' | 'executive_writer' | 'regional_expert';

export interface SendMessagePayload {
  messages: Array<{ role: 'user' | 'model'; text: string }>;
  model: GeminiModelId;
  rolePreset: ChatRolePreset;
  cvContext?: {
    jobTitle?: string;
    targetCountry?: string;
    summary?: string;
    skills?: string[];
    experience?: Array<{ role: string; company: string; highlights?: string[] }>;
  };
}

export interface ChatResponse {
  success: boolean;
  provider: string;
  model: string;
  reply: string;
  notice?: string;
  error?: string;
}

const CHAT_HISTORY_STORAGE_KEY = 'cvcraft_gemini_chat_history_v1';

export const aiChatService = {
  /**
   * Load stored conversation history from localStorage
   */
  getStoredHistory(): ChatMessage[] {
    try {
      const stored = localStorage.getItem(CHAT_HISTORY_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.warn('[aiChatService] Failed to read stored chat history:', e);
    }
    return [];
  },

  /**
   * Save conversation history to localStorage
   */
  saveHistory(messages: ChatMessage[]): void {
    try {
      localStorage.setItem(CHAT_HISTORY_STORAGE_KEY, JSON.stringify(messages.slice(-50)));
    } catch (e) {
      console.warn('[aiChatService] Failed to persist chat history:', e);
    }
  },

  /**
   * Clear conversation history
   */
  clearHistory(): void {
    try {
      localStorage.removeItem(CHAT_HISTORY_STORAGE_KEY);
    } catch (e) {
      console.warn('[aiChatService] Failed to clear history:', e);
    }
  },

  /**
   * Send chat message payload to server-side Gemini API proxy route (/api/chat)
   */
  async sendMessage(payload: SendMessagePayload): Promise<ChatResponse> {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data?.message || `Server returned HTTP ${response.status}`);
    }

    return data as ChatResponse;
  },
};

export default aiChatService;

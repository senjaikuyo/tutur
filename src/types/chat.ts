import type {IntentResult} from './intent';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  isVoice?: boolean;
  attachedIntent?: IntentResult | null;
}

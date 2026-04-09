import { useState } from 'react';
import { http } from '@/lib/api';

export interface ProfileInput {
  query: string;
}

export interface Suggestion {
  nome: string;
  justificativa: string;
  preco: string;
  imagem?: string;
  slug?: string;
  id?: string;
}

export interface RecommendationResult {
  sugestoes: Suggestion[];
}

export interface MessageRequest {
  ocasiao: string;
  relacionamento: string;
  produto: string;
  tom?: string;
  contexto?: string;
}

export interface MessageResponse {
  mensagem: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatRequest {
  messages: ChatMessage[];
}

export interface ChatResponse {
  message: string;
  suggestions?: string[];
}

export function useRecommendations() {
  const [loading, setLoading] = useState(false);
  const [msgLoading, setMsgLoading] = useState(false);
  const [chatLoading, setChatLoading] = useState(false);
  const [result, setResult] = useState<RecommendationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const getRecommendations = async (input: ProfileInput): Promise<RecommendationResult | null> => {
    setLoading(true);
    setError(null);
    try {
      localStorage.setItem('regalaya_last_query', input.query);
      const response = await http.post<RecommendationResult>('/ai/recommendations', input);
      const data = response.data || response;
      setResult(data);
      return data;
    } catch (err: unknown) {
      let errorMsg = 'Erro ao buscar recomendações. Tente novamente.';
      if (typeof err === 'object' && err !== null) {
        const errObj = err as Record<string, unknown>;
        errorMsg = typeof errObj.message === 'string' ? errObj.message : errorMsg;
      }
      setError(errorMsg);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const generateMessage = async (input: MessageRequest): Promise<string> => {
    setMsgLoading(true);
    try {
      const response = await http.post<MessageResponse>('/ai/generate-message', input);
      const message = response.data?.mensagem || (response as Record<string, unknown>)?.mensagem as string || '';
      
      if (!message) {
        console.warn('API retornou mensagem vazia');
        return 'Parabéns por essa data tão especial! Que este presente traga muita alegria e momentos inesquecíveis.';
      }
      
      return message;
    } catch (err: unknown) {
      let errorMessage = 'Erro desconhecido';
      let errorStatus = 0;
      
      if (typeof err === 'object' && err !== null) {
        const errObj = err as Record<string, unknown>;
        errorMessage = typeof errObj.message === 'string' ? errObj.message : 'Erro desconhecido';
        errorStatus = typeof errObj.status === 'number' ? errObj.status : 0;
      }
      
      console.error(`Erro na geração de mensagem [${errorStatus}]:`, errorMessage);
      return 'Parabéns por essa data tão especial! Que este presente traga muita alegria e momentos inesquecíveis.';
    } finally {
      setMsgLoading(false);
    }
  };

  const chat = async (messages: ChatMessage[]): Promise<ChatResponse> => {
    setChatLoading(true);
    try {
      const response = await http.post<ChatResponse>('/ai/chat', { messages });
      return response.data || response;
    } catch (err) {
      console.error('Erro no chat:', err);
      return { 
        message: 'Desculpe, não consegui processar sua mensagem agora. Tente novamente em alguns instantes.',
        suggestions: ['Tentar novamente', 'Ver produtos']
      };
    } finally {
      setChatLoading(false);
    }
  };

  const submitFeedback = async (suggestionNome: string, gostou: boolean) => {
    console.log('Feedback:', suggestionNome, gostou);
  };

  return { getRecommendations, generateMessage, chat, submitFeedback, result, loading, msgLoading, chatLoading, error };
}

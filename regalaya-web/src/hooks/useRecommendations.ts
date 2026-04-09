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
}

export interface MessageResponse {
  mensagem: string;
}

export function useRecommendations() {
  const [loading, setLoading] = useState(false);
  const [msgLoading, setMsgLoading] = useState(false);
  const [result, setResult] = useState<RecommendationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const getRecommendations = async (input: ProfileInput) => {
    setLoading(true);
    setError(null);
    try {
      const response = await http.post<RecommendationResult>('/ai/recommendations', input);
      setResult(response.data || response);
    } catch (err: unknown) {
      // Tratamento seguro do erro
      let errorMsg = 'Erro ao buscar recomendações. Tente novamente.';
      if (typeof err === 'object' && err !== null) {
        const errObj = err as Record<string, unknown>;
        errorMsg = typeof errObj.message === 'string' ? errObj.message : errorMsg;
      }
      setError(errorMsg);
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
      // Extrair informação de erro de forma segura
      let errorMessage = 'Erro desconhecido';
      let errorStatus = 0;
      
      if (typeof err === 'object' && err !== null) {
        const errObj = err as Record<string, unknown>;
        errorMessage = typeof errObj.message === 'string' ? errObj.message : 'Erro desconhecido';
        errorStatus = typeof errObj.status === 'number' ? errObj.status : 0;
      }
      
      console.error(`Erro na geração de mensagem [${errorStatus}]:`, errorMessage);
      
      // Fallback message quando API falha
      return 'Parabéns por essa data tão especial! Que este presente traga muita alegria e momentos inesquecíveis.';
    } finally {
      setMsgLoading(false);
    }
  };

  const submitFeedback = async (suggestionNome: string, gostou: boolean) => {
    console.log('Feedback:', suggestionNome, gostou);
  };

  return { getRecommendations, generateMessage, submitFeedback, result, loading, msgLoading, error };
}

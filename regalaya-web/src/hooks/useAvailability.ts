'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

interface AvailabilityState {
  isAvailable: boolean | null;
  isLoading: boolean;
  error: string | null;
  isValidated: boolean;
}

/**
 * Hook para validar disponibilidade de username com debounce.
 * @param username - Username para validar
 * @param debounceMs - Tempo de debounce em ms (padrão: 500ms)
 */
export function useUsernameAvailability(username: string, debounceMs: number = 500) {
  const [state, setState] = useState<AvailabilityState>({
    isAvailable: null,
    isLoading: false,
    error: null,
    isValidated: false,
  });

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const checkAvailability = useCallback(async (usernameToCheck: string) => {
    // Cancela requisição anterior
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Cria novo abort controller
    abortControllerRef.current = new AbortController();

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await fetch(
        `/api/v1/auth/validate-username?username=${encodeURIComponent(usernameToCheck)}`,
        {
          method: 'GET',
          signal: abortControllerRef.current.signal,
        }
      );

      if (response.ok) {
        const data = await response.json();
        setState({
          isAvailable: data.available,
          isLoading: false,
          error: data.available ? null : 'Username já está em uso',
          isValidated: true,
        });
      } else if (response.status === 409) {
        const data = await response.json();
        setState({
          isAvailable: false,
          isLoading: false,
          error: data.error || 'Username já está em uso',
          isValidated: true,
        });
      } else {
        throw new Error('Erro ao validar username');
      }
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        // Requisição cancelada, não atualiza estado
        return;
      }

      setState(prev => ({
        ...prev,
        isLoading: false,
        error: err instanceof Error ? err.message : 'Erro ao validar username',
        isValidated: false,
      }));
    }
  }, []);

  useEffect(() => {
    // Limpa timeout anterior
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Validação básica do username
    if (!username || username.length < 3) {
      setState({
        isAvailable: null,
        isLoading: false,
        error: null,
        isValidated: false,
      });
      return;
    }

    // Valida formato do username
    const usernameRegex = /^[a-zA-Z0-9_]+$/;
    if (!usernameRegex.test(username)) {
      setState({
        isAvailable: false,
        isLoading: false,
        error: 'Username deve conter apenas letras, números e underscore',
        isValidated: false,
      });
      return;
    }

    // Aplica debounce
    timeoutRef.current = setTimeout(() => {
      checkAvailability(username);
    }, debounceMs);

    // Cleanup
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [username, debounceMs, checkAvailability]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return state;
}

/**
 * Hook para validar disponibilidade de email com debounce.
 * @param email - Email para validar
 * @param debounceMs - Tempo de debounce em ms (padrão: 500ms)
 */
export function useEmailAvailability(email: string, debounceMs: number = 500) {
  const [state, setState] = useState<AvailabilityState>({
    isAvailable: null,
    isLoading: false,
    error: null,
    isValidated: false,
  });

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const checkAvailability = useCallback(async (emailToCheck: string) => {
    // Cancela requisição anterior
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Cria novo abort controller
    abortControllerRef.current = new AbortController();

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await fetch(
        `/api/v1/auth/validate-email?email=${encodeURIComponent(emailToCheck)}`,
        {
          method: 'GET',
          signal: abortControllerRef.current.signal,
        }
      );

      if (response.ok) {
        const data = await response.json();
        setState({
          isAvailable: data.available,
          isLoading: false,
          error: data.available ? null : 'Email já está cadastrado',
          isValidated: true,
        });
      } else if (response.status === 409) {
        const data = await response.json();
        setState({
          isAvailable: false,
          isLoading: false,
          error: data.error || 'Email já está cadastrado',
          isValidated: true,
        });
      } else {
        throw new Error('Erro ao validar email');
      }
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        // Requisição cancelada, não atualiza estado
        return;
      }

      setState(prev => ({
        ...prev,
        isLoading: false,
        error: err instanceof Error ? err.message : 'Erro ao validar email',
        isValidated: false,
      }));
    }
  }, []);

  useEffect(() => {
    // Limpa timeout anterior
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Validação básica do email
    if (!email || email.length < 5) {
      setState({
        isAvailable: null,
        isLoading: false,
        error: null,
        isValidated: false,
      });
      return;
    }

    // Valida formato do email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setState({
        isAvailable: false,
        isLoading: false,
        error: 'Email inválido',
        isValidated: false,
      });
      return;
    }

    // Aplica debounce
    timeoutRef.current = setTimeout(() => {
      checkAvailability(email);
    }, debounceMs);

    // Cleanup
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [email, debounceMs, checkAvailability]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return state;
}

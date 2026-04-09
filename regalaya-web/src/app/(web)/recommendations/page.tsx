"use client";

import React, { useState } from 'react';
import { useRecommendations, ProfileInput } from '@/hooks/useRecommendations';
import { ThumbsUp, ThumbsDown, Sparkles, Loader2, Gift, ShoppingCart, MessageCircle, History, Copy } from 'lucide-react';
import Link from 'next/link';
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/hooks/useCart";

export default function RecommendationsPage() {
  const { toast } = useToast();
  const { addItem } = useCart();
  const { getRecommendations, generateMessage, submitFeedback, result, loading, msgLoading, error } = useRecommendations();
  const [formData, setFormData] = useState<ProfileInput>({ query: '' });
  const [generatedMessages, setGeneratedMessages] = useState<Record<number, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if(formData.query.trim() !== '') {
      getRecommendations(formData);
    }
  };

  const handleGenerateMessage = async (idx: number, produto: string) => {
    // Tenta extrair informações da query
    const ocasiao = formData.query.toLowerCase().includes('aniversário') ? 'Aniversário' : 
                   formData.query.toLowerCase().includes('natal') ? 'Natal' : 'Ocasião Especial';
    const relacionamento = formData.query.toLowerCase().includes('amigo') ? 'Amigo' : 
                           formData.query.toLowerCase().includes('namorada') ? 'Namorada' : 'Pessoa Querida';

    const msg = await generateMessage({
      ocasiao,
      relacionamento,
      produto,
      tom: 'sentimental',
      contexto: formData.query // Passar o contexto original para personalização profunda
    });
    setGeneratedMessages(prev => ({ ...prev, [idx]: msg }));
  };

  const handleAddToCart = async (sugestao: any) => {
    try {
      // Remover formatação de preço para pegar o número
      const priceValue = parseFloat(sugestao.preco.replace('R$ ', '').replace(',', '.'));
      
      await addItem({
        productId: sugestao.id,
        name: sugestao.nome,
        price: priceValue,
        quantity: 1,
        image: sugestao.imagem
      });
      
      toast({
        title: "Adicionado ao carrinho!",
        description: `${sugestao.nome} foi adicionado com sucesso.`,
      });
    } catch (err) {
      toast({
        title: "Erro ao adicionar",
        description: "Não foi possível adicionar o produto ao carrinho.",
        variant: "destructive"
      });
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Mensagem copiada!",
      description: "A sugestão foi copiada para sua área de transferência.",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-10">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center p-3 bg-pink-100 rounded-full mb-2">
            <Sparkles className="w-8 h-8 text-pink-600" />
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Buscar Presente Mágico ✨</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Descreva quem você vai presentear e nós encontraremos as melhores opções disponíveis no nosso estoque agora.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden md:flex flex-col">
          {/* Formulário Único */}
          <div className="bg-pink-50/50 p-8 border-b border-gray-100">
            <form onSubmit={handleSubmit} className="relative">
              <textarea
                required
                rows={2}
                className="w-full text-lg rounded-2xl border-2 border-pink-200 shadow-sm focus:border-pink-500 focus:ring-pink-500 bg-white px-6 py-4 pr-36 resize-none transition-all"
                value={formData.query}
                onChange={(e) => setFormData({query: e.target.value})}
                placeholder="Ex: Minha namorada arquiteta de 26 anos que adora vinhos e viajar..."
              />
              <button
                type="submit"
                disabled={loading}
                className="absolute right-3 bottom-3 md:top-3 md:bottom-auto mb-auto mt-auto flex items-center justify-center py-3 px-6 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 disabled:opacity-70 transition-all h-[calc(100%-1.5rem)]"
              >
                {loading ? (
                  <Loader2 className="animate-spin h-5 w-5" />
                ) : (
                  <>Buscar <Sparkles className="ml-2 h-4 w-4" /></>
                )}
              </button>
            </form>
          </div>

          {/* Resultados */}
          <div className="p-8 bg-white min-h-[400px]">
            {error && (
              <div className="bg-red-50 text-red-700 p-4 rounded-lg flex items-start mb-6">
                <span className="text-sm font-medium">{error}</span>
              </div>
            )}

            {!result && !loading && !error && (
              <div className="h-full flex flex-col items-center justify-center text-center text-gray-400 space-y-4 py-12 opacity-60">
                <Gift className="w-16 h-16" />
                <p>Nenhuma mágica iniciada. Digite na barra acima.</p>
              </div>
            )}

            {loading && (
              <div className="h-full flex flex-col items-center justify-center text-center text-pink-500 space-y-4 py-12">
                <Loader2 className="w-12 h-12 animate-spin mb-4" />
                <p className="text-gray-500 font-medium animate-pulse">Cruzando o seu desejo com nosso estoque real...</p>
              </div>
            )}

            {result && !loading && (
              <div className="space-y-6">
                <div className="flex justify-between items-center border-b pb-4">
                  <h2 className="text-2xl font-bold text-gray-800">Achamos estas opções reais no estoque:</h2>
                  {/* HU-10.3 Indicator */}
                  <div className="flex items-center text-xs font-bold text-pink-500 bg-pink-50 px-3 py-1 rounded-full border border-pink-100">
                    <History className="w-3 h-3 mr-1" /> Baseado no seu histórico
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  {result.sugestoes.map((sugestao, idx) => (
                    <div key={idx} className="group flex flex-col bg-white border-2 border-gray-100 rounded-2xl shadow-sm hover:border-pink-300 hover:shadow-lg transition-all p-0 overflow-hidden">
                      {sugestao.imagem && (
                        <div className="w-full h-48 relative bg-gray-100 border-b border-gray-100">
                          <img src={sugestao.imagem} alt={sugestao.nome} className="w-full h-full object-cover" />
                        </div>
                      )}
                      
                      <div className="p-5 flex flex-col flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-lg font-bold text-gray-900 line-clamp-2">
                            {sugestao.nome}
                          </h3>
                        </div>
                        <span className="text-xl font-black text-pink-600 mb-3 block">
                          {sugestao.preco}
                        </span>
                        <p className="text-gray-600 italic text-sm mb-6 leading-relaxed flex-1">
                          "{sugestao.justificativa}"
                        </p>

                        {/* HU-10.2 Message Generation Display */}
                        {generatedMessages[idx] && (
                          <div className="mb-4 p-3 bg-blue-50 rounded-xl border border-blue-100 text-sm text-blue-800 relative group/msg">
                            <p className="font-medium mb-1 flex items-center">
                              <MessageCircle className="w-3 h-3 mr-1" /> Sugestão de mensagem:
                            </p>
                            <p className="italic">"{generatedMessages[idx]}"</p>
                            <button 
                              onClick={() => copyToClipboard(generatedMessages[idx])}
                              className="absolute top-2 right-2 p-1 text-blue-400 hover:text-blue-600 rounded-md transition-colors"
                              title="Copiar mensagem"
                            >
                              <Copy className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                        
                        <div className="mt-auto flex flex-col space-y-2">
                          <div className="grid grid-cols-5 gap-2 items-center">
                            <div className="col-span-3">
                              <button 
                                onClick={() => handleAddToCart(sugestao)}
                                className="w-full bg-gray-900 text-white font-bold py-2.5 px-4 rounded-xl hover:bg-gray-800 transition-colors flex items-center justify-center"
                              >
                                <ShoppingCart className="w-4 h-4 mr-2" /> Adicionar
                              </button>
                            </div>
                            
                            <div className="col-span-2 flex justify-end space-x-1">
                              <button 
                                type="button" 
                                onClick={() => submitFeedback(sugestao.nome, true)}
                                className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-xl transition-colors focus:outline-none"
                                title="Gostei"
                              >
                                <ThumbsUp className="w-5 h-5" />
                              </button>
                              <button 
                                type="button" 
                                onClick={() => submitFeedback(sugestao.nome, false)}
                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors focus:outline-none"
                                title="Não Gostei"
                              >
                                <ThumbsDown className="w-5 h-5" />
                              </button>
                            </div>
                          </div>

                          {/* HU-10.2 Generate Button */}
                          <button 
                            onClick={() => handleGenerateMessage(idx, sugestao.nome)}
                            disabled={msgLoading}
                            className="w-full border-2 border-pink-100 text-pink-600 font-bold py-2 px-4 rounded-xl hover:bg-pink-50 hover:border-pink-200 transition-all flex items-center justify-center text-sm"
                          >
                            {msgLoading ? (
                              <Loader2 className="w-4 h-4 animate-spin mr-2" />
                            ) : (
                              <MessageCircle className="w-4 h-4 mr-2" />
                            )}
                            Gerar Mensagem Personalizada
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

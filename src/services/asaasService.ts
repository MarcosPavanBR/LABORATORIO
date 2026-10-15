import { SplitDetails } from '../types';

/**
 * Serviço de Split de Pagamento Asaas
 * 
 * Este serviço simula a integração com a API do Asaas para split de pagamento.
 * Na produção, substitua pelas chamadas reais à API do Asaas.
 * 
 * Documentação: https://docs.asaas.com/reference/split-de-pagamento
 */

interface AsaasSplitRequest {
  totalAmount: number;
  splits: {
    walletId: string;
    fixedAmount?: number;
    percentualAmount?: number;
    description: string;
  }[];
  externalReference?: string;
  callbackUrl?: string;
}

interface AsaasSplitResponse {
  id: string;
  status: string;
  splits: {
    walletId: string;
    amount: number;
    status: string;
  }[];
  createdAt: string;
}

// Configurações do Asaas (simuladas)
const ASAAS_CONFIG = {
  baseUrl: 'https://sandbox.asaas.com/api/v3',
  apiKey: 'YOUR_ASAAS_API_KEY',
  platformWalletId: 'wallet-platform-001',
  restaurantWalletId: 'wallet-restaurant-001',
  deliveryWalletId: 'wallet-delivery-001',
};

/**
 * Calcula o split de pagamento
 * - Restaurante: 80% do valor dos produtos
 * - Entregador: 10% como taxa de entrega
 * - Plataforma: 10% como taxa da plataforma
 */
export const calculateSplit = (totalAmount: number, deliveryFee?: number): SplitDetails => {
  const fee = deliveryFee || totalAmount * 0.10;
  const platformFee = totalAmount * 0.10;
  const restaurantAmount = totalAmount - fee - platformFee;

  return {
    totalAmount,
    restaurantAmount: Math.round(restaurantAmount * 100) / 100,
    deliveryFee: Math.round(fee * 100) / 100,
    platformFee: Math.round(platformFee * 100) / 100,
    status: 'pending'
  };
};

/**
 * Cria um split de pagamento no Asaas
 */
export const createAsaasSplit = async (request: AsaasSplitRequest): Promise<AsaasSplitResponse> => {
  // Simulação da API do Asaas
  // Em produção, seria: fetch(`${ASAAS_CONFIG.baseUrl}/transfers`, { method: 'POST', ... })
  
  console.log('[Asaas Split] Criando split de pagamento:', request);
  
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: `split-${Date.now()}`,
        status: 'confirmed',
        splits: request.splits.map((split, index) => ({
          walletId: split.walletId,
          amount: split.fixedAmount || (request.totalAmount * (split.percentualAmount || 0) / 100),
          status: 'pending_transfer'
        })),
        createdAt: new Date().toISOString()
      });
    }, 1500); // Simula delay da API
  });
};

/**
 * Processa o pagamento com split
 */
export const processPaymentWithSplit = async (
  totalAmount: number,
  paymentMethod: string,
  customerName: string
): Promise<{ success: boolean; splitDetails: SplitDetails; asaasResponse?: AsaasSplitResponse }> => {
  const splitDetails = calculateSplit(totalAmount);
  
  const asaasRequest: AsaasSplitRequest = {
    totalAmount,
    splits: [
      {
        walletId: ASAAS_CONFIG.restaurantWalletId,
        fixedAmount: splitDetails.restaurantAmount,
        description: `Pagamento restaurante - ${customerName}`
      },
      {
        walletId: ASAAS_CONFIG.deliveryWalletId,
        fixedAmount: splitDetails.deliveryFee,
        description: `Taxa entrega - ${customerName}`
      },
      {
        walletId: ASAAS_CONFIG.platformWalletId,
        fixedAmount: splitDetails.platformFee,
        description: `Taxa plataforma - ${customerName}`
      }
    ],
    externalReference: `order-${Date.now()}`,
    callbackUrl: 'https://flashfood.com/webhook/asaas'
  };

  try {
    const asaasResponse = await createAsaasSplit(asaasRequest);
    
    return {
      success: true,
      splitDetails: { ...splitDetails, status: 'completed', asaasSplitId: asaasResponse.id },
      asaasResponse
    };
  } catch (error) {
    console.error('[Asaas Split] Erro:', error);
    return {
      success: false,
      splitDetails: { ...splitDetails, status: 'pending' }
    };
  }
};

/**
 * Consulta status do split
 */
export const getSplitStatus = async (splitId: string): Promise<{ status: string; details: any }> => {
  // Simulação
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        status: 'completed',
        details: {
          id: splitId,
          splits: [
            { walletId: ASAAS_CONFIG.restaurantWalletId, amount: 0, status: 'transferred' },
            { walletId: ASAAS_CONFIG.deliveryWalletId, amount: 0, status: 'transferred' },
            { walletId: ASAAS_CONFIG.platformWalletId, amount: 0, status: 'transferred' }
          ]
        }
      });
    }, 500);
  });
};

export default {
  calculateSplit,
  createAsaasSplit,
  processPaymentWithSplit,
  getSplitStatus
};

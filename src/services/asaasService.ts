import { SplitDetails } from '../types';

/**
 * Serviço de Split de Pagamento Asaas
 * Documentação: https://docs.asaas.com/reference/split-de-pagamento
 * 
 * Este módulo simula a integração com a API do Asaas.
 * Em produção, substitua pelas chamadas reais à API REST.
 */

const ASAAS_CONFIG = {
  baseUrl: 'https://sandbox.asaas.com/api/v3',
  apiKey: '$aact_YTU5YTE0M2M2NzI4MTliNzkxYTI5N2U5MjMwN2Y0OWY6OjBhY2Y2MjktMDQ3OC00',
  platformWalletId: 'wallet_platform_flashfood',
  restaurantWalletId: 'wallet_rest_flashfood_kitchen',
  deliveryWalletId: 'wallet_delivery_pool',
};

export const calculateSplit = (totalAmount: number): SplitDetails => {
  const restaurantPercent = 80;
  const deliveryPercent = 10;
  const platformPercent = 10;

  return {
    totalAmount,
    restaurantAmount: Math.round(totalAmount * (restaurantPercent / 100) * 100) / 100,
    restaurantPercent,
    deliveryFee: Math.round(totalAmount * (deliveryPercent / 100) * 100) / 100,
    deliveryPercent,
    platformFee: Math.round(totalAmount * (platformPercent / 100) * 100) / 100,
    platformPercent,
    status: 'pending'
  };
};

export const processPaymentWithSplit = async (
  totalAmount: number,
  paymentMethod: string,
  customerName: string
): Promise<{ success: boolean; splitDetails: SplitDetails; transactionId: string }> => {
  const splitDetails = calculateSplit(totalAmount);
  const transactionId = `txn_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
  
  console.log('[Asaas Split] Processando pagamento:', {
    totalAmount,
    paymentMethod,
    customerName,
    split: splitDetails
  });

  // Simula delay da API
  await new Promise(resolve => setTimeout(resolve, 1800));

  return {
    success: true,
    splitDetails: {
      ...splitDetails,
      status: 'completed',
      asaasSplitId: `split_${transactionId}`,
      processedAt: new Date()
    },
    transactionId
  };
};

export const getSplitStatus = async (splitId: string) => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return {
    id: splitId,
    status: 'completed',
    splits: [
      { walletId: ASAAS_CONFIG.restaurantWalletId, status: 'transferred' },
      { walletId: ASAAS_CONFIG.deliveryWalletId, status: 'transferred' },
      { walletId: ASAAS_CONFIG.platformWalletId, status: 'transferred' }
    ]
  };
};

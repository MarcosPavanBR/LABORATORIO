# 11 — Aplicativo do entregador, mobilidade e direitos operacionais

## Jornada
Onboarding e verificação proporcional; estado online/offline, disponibilidade, aceite, rota até coleta, autenticação de retirada, navegação, entrega, comprovante, ganhos, suporte, pausa, seguro/segurança quando aplicável. Modo de transporte influencia ETA/remuneração/área, com localização autorizada por finalidade. Separar localização para tarefa ativa da vigilância em segundo plano.

## Experiência em baixa conectividade
Permissões de localização, restrições Android/iOS a background location, baixa bateria, kill da app, mudanças de rede e fuso devem ser testados em dispositivos reais. Notificações podem falhar. Um aceite precisa de confirmação do servidor, com idempotência e versão. Guardar dados offline minimizados e criptografados; sincronizar com conflito explícito, nunca sobrescrever estado mais recente.

## Remuneração e segurança
Exibir antes do aceite as condições comerciais necessárias, estimativa e regras de ajustes/cancelamentos. Não cobrar entregador por decisão ilegítima de sistema. Tratamento de denúncias e revisões antifraude com contestação; manual de incidentes humanos. GPS irregular não equivale automaticamente a fraude.

## Testes
Dois dispositivos logados; roubo da sessão; aceite simultâneo; troca de aparelho; simulação de localização; pedido atribuído mas loja fechou; código de entrega incorreto; endereço errado; tarefa cancelada em rota; localização não autorizada; falta de conexão por 20min; map API down; suporte entra no pedido.

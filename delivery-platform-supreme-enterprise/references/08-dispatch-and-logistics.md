# 08 — Despacho, oferta de entrega, alocação e geolocalização

## Modelo de despacho
`DeliveryTask`, `CourierEligibility`, `Offer` com deadline, `Assignment`, `PickupProof`, `DropoffProof`, `ReassignmentReason`, `CourierPayout`. Entregas podem ser feitas por loja, parceiro logístico ou plataforma. Contratos devem distinguir essas alternativas. Estabelecer geofence, limites de segurança, carga/volume, veículos, turnos e disponibilidade, sem inferir autorização de vigilância contínua.

## Algoritmo base antes de IA
Calcular candidatos elegíveis e distância/ETA (fonte confiável e falhas). Score determinístico configurável por distância, tempo de espera, equidade, tipo de veículo, remuneração e taxa de aceitação. Evitar penalização opaca e discriminação indevida; auditar critérios. Oferta tem lease curto, lock/versão; duas aceitações simultâneas só permitem assignment válido único. Fluxo reserva → oferta → aceitação → despacho confirmado; não mandar dois couriers ao mesmo pedido sem modelagem de multi-stop.

## Geoespacial em escala (Grid Hashing)
Queries radiais (`ST_DWithin`) em bancos relacionais para milhares de couriers e pedidos simultâneos causam locks e CPU spikes.
**Padrão obrigatório para escala:**
1. Dividir a área de operação em grids hexagonais (H3) ou quadrados (S2).
2. Couriers atualizam sua célula de grid (leve, indexed).
3. O motor de despacho busca apenas couriers na célula do pedido + células vizinhas (ring 1 e 2).
4. A math geodésica pesada (Haversine/PostGIS) só é executada nos 10-20 candidatos pré-filtrados pelo grid, nunca na base inteira.

## ETA e mapas
Separar: localização reportada, idade da amostra, precisão horizontal, localização validada, rota planejada, ETA estimado e atraso real. `GPS 30m ± 25m` não autoriza geofence de 5m sem segunda evidência. Detectar saltos implausíveis sem banimento automático. Offline: cache de tarefa, sincronização eventual, reconciliação por versões, código de retirada/entrega e fallback de suporte. Não divulgar endereço completo até necessidade operacional; expirar permissão ao terminar.

## Testes obrigatórios
- 100 ofertas simultâneas para uma tarefa: um courier atribuído; restante falha de modo seguro.
- Courier responde quando prazo expirou; loja cancelou ao mesmo tempo; nenhuma tarefa fantasma.
- Courier offline, GPS spoofing, sem permissão GPS, bateria baixa, sinal intermitente.
- Distância muito longa, endereço ambíguo, geocode falho, chuva/pico hipotético.
- Entregador se machuca ou cancela; operador reassina com trilha e comunicação.
- Batch/multi-stop apenas com algoritmo e compensação auditados; não antecipar complexidade sem valor.

## Segurança de pessoas
Remuneração, pausas, áreas de risco, risco noturno, suporte de emergência e critérios de aceite são decisões de negócio e jurídicas prioritárias. Otimização não deve incentivar condução perigosa nem divulgar localização em tempo real desnecessariamente.

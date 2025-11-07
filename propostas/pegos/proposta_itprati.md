# Proposta Técnica e Comercial – Migração para Cloud

**PROPOSTA:** 2025/11/IT001
**CLIENTE:** PEGOS

## 1. Objetivo da Proposta

A iTpraTi - Internet e Tecnologias tem o prazer de apresentar esta proposta técnica e comercial à **PEGOS**, com o objetivo de modernizar a sua infraestrutura de TI através de uma migração estratégica para a Cloud. A nossa solução visa proporcionar um ambiente tecnológico de alta performance, seguro, escalável e com elevada disponibilidade, preparado para suportar o crescimento e as exigências do seu negócio.

O projeto foca-se na implementação de uma infraestrutura de servidores dedicados, alojados em datacenters de referência, que garantirão a estabilidade e o desempenho necessários para o **ERP Cegid Primavera**, a centralização do **Active Directory** e a partilha segura de ficheiros entre todas as clínicas e farmácias da PEGOS.

## 2. Diagnóstico da Situação Atual

Após uma análise detalhada, identificamos que a infraestrutura atual da PEGOS se encontra distribuída por várias unidades (Luanda, Soyo, Cabinda e farmácias), o que resulta em desafios operacionais significativos. O ambiente atual carece de:

- **Centralização de Utilizadores e Autenticações:** A ausência de um Active Directory centralizado dificulta a gestão de identidades e acessos.
- **Gestão Unificada de Acessos:** A falta de uma política de permissões unificada compromete a segurança e a eficiência.
- **Partilha de Ficheiros Corporativos Segura:** A partilha de ficheiros não está otimizada para garantir segurança e acessibilidade.
- **Performance e Disponibilidade do ERP:** O desempenho do ERP Primavera está limitado pela infraestrutura local, afetando a produtividade.

## 3. Solução Proposta: Infraestrutura Cloud de Alta Performance

Para responder aos desafios identificados, propomos uma solução robusta e flexível, dividida em duas opções, para que a PEGOS possa escolher a que melhor se adapta às suas necessidades e orçamento.

### Opção 1: Arquitetura com Dois Servidores

Esta opção oferece uma arquitetura balanceada, com a separação de serviços para garantir o máximo desempenho e segurança.

#### Servidor 1 – ERP Cegid Primavera

- **Modelo:** iTpraTi Cloud-Pro-2
- **Processador:** AMD EPYC 4345P (8c/16t – 3.8GHz/5.5GHz)
- **Memória:** 64GB DDR5 ECC On-Die 5600MHz
- **Armazenamento:** 4× 960GB SSD NVMe (Soft RAID)
- **Largura de Banda:** 3 Gbit/s garantidos, tráfego ilimitado
- **Função:** Hospedagem do ERP Primavera e base de dados principal
- **Licenciamentos:** Windows Server 2019/2022/2025 - 8 Cores

#### Servidor 2 – Active Directory e Partilha de Ficheiros

- **Modelo:** iTpraTi Cloud-Pro-1
- **Processador:** AMD EPYC 4245P (6c/12t – 3.9GHz/5.4GHz)
- **Memória:** 32GB DDR5 ECC On-Die 5600MHz
- **Armazenamento:** 2× 960GB SSD NVMe + 2× 1.92TB SSD NVMe (Soft RAID)
- **Largura de Banda:** 3 Gbit/s garantidos, tráfego ilimitado
- **Função:** Controlador de domínio, gestão de utilizadores e partilha de ficheiros
- **Licenciamentos:** Windows Server 2019/2022/2025 - 8 Cores

### Opção 2: Solução Unificada de Alta Performance

Esta opção consolida todos os serviços num único servidor de alta performance, ideal para uma gestão simplificada e um custo otimizado.

#### Servidor 3 – Solução Unificada

- **Modelo:** iTpraTi Cloud-Pro-3
- **Processador:** AMD EPYC 4465P - 12c/24t - 3.4GHz/5.4GHz 2026
- **Memória:** 128GB DDR5 ECC On-Die 5600MHz
- **Armazenamento:** 4× 1.92TB SSD NVMe Soft RAID
- **Largura de Banda:** 3 Gbit/s garantidos, tráfego ilimitado
- **Função:** Controlador de domínio, gestão de utilizadores, partilha de ficheiros e ERP Primavera
- **Licenciamentos:** Windows Server 2019/2022/2025 - 12 Cores

## 4. Infraestrutura, Segurança e Conectividade

A nossa solução inclui um conjunto de serviços de segurança e conectividade para garantir a integridade e a acessibilidade dos seus dados.

- **Active Directory Centralizado:** Todos os utilizadores serão autenticados no domínio corporativo **Pegos.Cloud**, garantindo uma gestão de identidades centralizada e segura.
- **Rede Segura via VPN:** Implementaremos uma ligação segura entre todas as clínicas e farmácias através de um túnel VPN criptografado, garantindo a confidencialidade dos dados em trânsito.
- **Backups Automáticos:** A nossa política de backups inclui cópias diárias (incrementais) e semanais (completas), com armazenamento em datacenters distintos para garantir a recuperação em caso de desastre.
- **Firewall e Monitorização:** A infraestrutura será protegida por uma firewall avançada e monitorizada 24/7 pela nossa equipa de especialistas para garantir a máxima disponibilidade e segurança.

### Opções de Conectividade VPN

1.  **WireGuard (Recomendado):** Uma solução moderna, rápida e segura, que pode ser instalada no servidor de Active Directory, permitindo que cada clínica e farmácia se conecte automaticamente através de um túnel seguro.
2.  **OpenVPN Access Server:** Uma alternativa com uma interface de gestão mais visual, ideal para permitir acessos remotos individuais para administração, manutenção ou técnicos.
3.  **VPN Site-to-Site (Alternativa Premium):** Para uma conectividade totalmente transparente, podemos implementar uma VPN site-to-site com routers compatíveis (Mikrotik, FortiGate, Ubiquiti), permitindo que toda a rede local de cada clínica tenha acesso direto à Cloud, sem necessidade de login manual na VPN.

## 5. Benefícios da Solução iTpraTi

A migração para a nossa infraestrutura Cloud trará benefícios imediatos e a longo prazo para a PEGOS:

- **Centralização e Controlo:** Gestão centralizada de toda a infraestrutura de TI, com controlo total sobre utilizadores, acessos e permissões.
- **Acesso Remoto Seguro e Eficiente:** Colaboradores poderão aceder aos sistemas e ficheiros de forma segura a partir de qualquer localização.
- **Redução de Custos:** Eliminação de custos com manutenção de hardware local, energia e espaço físico.
- **Performance Superior:** Melhoria significativa no desempenho e disponibilidade do ERP Primavera, resultando em maior produtividade.
- **Escalabilidade e Flexibilidade:** Ambiente preparado para crescer com o seu negócio, permitindo adicionar novos utilizadores e serviços de forma rápida e fácil.
- **Segurança de Nível Empresarial:** Proteção robusta contra ameaças cibernéticas, com backups e monitorização contínua.

## 6. Investimento

Apresentamos uma estrutura de investimento transparente e flexível, com duas opções para que a PEGOS possa escolher a que melhor se alinha com as suas prioridades.

### Opção 1: Arquitetura com Dois Servidores

| Descrição | Custo Mensal | Custo de Instalação (Pagamento Único) |
| :--- | :--- | :--- |
| Servidor 1 + Licenciamento | 350.200,00 Kz | 244.800,00 Kz (Datacenter) |
| Servidor 2 + Licenciamento | 338.626,00 Kz | 204.000,00 Kz (Datacenter) |
| Gestão e Suporte iTpraTi | 425.000,00 Kz | 750.000,00 Kz (Implementação) |
| **Total** | **1.113.826,00 Kz** | **1.198.800,00 Kz** |

### Opção 2: Solução Unificada

| Descrição | Custo Mensal | Custo de Instalação (Pagamento Único) |
| :--- | :--- | :--- |
| Servidor 3 + Licenciamento | 672.520,00 Kz | 326.400,00 Kz (Datacenter) |
| Gestão e Suporte iTpraTi | 325.000,00 Kz | 750.000,00 Kz (Implementação) |
| **Total** | **997.520,00 Kz** | **1.076.400,00 Kz** |

### Custos Adicionais

- **Backups:** 36.720,00 Kz (4.080,00 Kz por TB)
- **VPN:** O custo de implementação da VPN dependerá da solução escolhida (WireGuard, OpenVPN ou VPN Site-to-Site) e será orçamentado em separado após uma análise detalhada da sua infraestrutura de rede.

## 7. Prazos e Implementação

O nosso processo de migração é rápido e eficiente, minimizando o impacto nas suas operações.

- **Fase 1 – Planeamento e Provisionamento:** 3 dias úteis
- **Fase 2 – Configuração e Testes:** 10 dias úteis
- **Fase 3 – Migração de Dados e Ativação:** 2 dias úteis

**Prazo total estimado:** 15 dias úteis após a adjudicação.

## 8. Condições Comerciais

- **Pagamento:** Mensal, via transferência bancária.
- **Contrato:** Acordo mínimo de 12 meses, com suporte técnico incluído.
- **Serviços Incluídos:** Gestão completa dos servidores, backups, monitorização e suporte técnico especializado.

## 9. Próximos Passos

Após a validação desta proposta, enviaremos o contrato de prestação de serviços para formalização da parceria. De seguida, a nossa equipa técnica apresentará um plano de migração detalhado, com todos os passos e timings definidos.

Estamos à sua disposição para agendar uma reunião e esclarecer qualquer dúvida sobre esta proposta.

**Feito em Luanda, aos 07 de Novembro de 2025**

**PEL’A iTpraTi - Internet e Tecnologias**

**[Seu Nome]**

**Diretor de TI**

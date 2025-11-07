# Proposta Técnica e Comercial – Migração para Cloud

**PROPOSTA:** 2025/11/IT001 (Exemplo)
**CLIENTE:** PEGOS

## 1. Objetivo da Proposta

Esta proposta tem como objetivo apresentar uma solução completa para a migração da infraestrutura atual da Pegos para a Cloud, com foco em melhor desempenho, segurança, disponibilidade e escalabilidade.

O projeto contempla a implementação de dois servidores dedicados alojado num dos nossos parceiros, garantindo a estabilidade e o desempenho necessários para suportar o ERP Cegid Primavera, o Active Directory e a partilha de ficheiros empresariais entre todas as clínicas e farmácias.

## 2. Diagnóstico da Situação Atual

Atualmente, a Pegos possui infraestrutura local distribuída entre várias unidades (Luanda, Soyo, Cabinda e farmácias em diferentes localizações).

O ambiente carece de:

- Centralização de utilizadores e autenticações (Active Directory);
- Gestão unificada de acessos e permissões;
- Partilha de ficheiros corporativos segura;
- Performance e disponibilidade elevadas no ERP Primavera.

## 3. Solução Proposta

### Servidor 1 – ERP Cegid Primavera

- **Modelo:** iTpraTi Cloud-Pro-2
- **Processador:** AMD EPYC 4345P (8c/16t – 3.8GHz/5.5GHz)
- **Memória:** 64GB DDR5 ECC On-Die 5600MHz
- **Armazenamento:** 4× 960GB SSD NVMe (Soft RAID)
- **Largura de Banda:** 3 Gbit/s garantidos, tráfego ilimitado
- **Função:** Hospedagem do ERP Primavera e base de dados principal
- **Licenciamentos:** Windows Server 2019/2022/2025 - 8 Cores
- **Custo:** 293.080,00Kz mês Servidor + 244.800,00Kz de instalação (Paga apenas uma vez) + 57.120.00Kz mês Licenciamento

### Servidor 2 – Active Directory e Partilha de Ficheiros

- **Modelo:** iTpraTi Cloud-Pro-1
- **Processador:** AMD EPYC 4245P (6c/12t – 3.9GHz/5.4GHz)
- **Memória:** 32GB DDR5 ECC On-Die 5600MHz
- **Armazenamento:** 2× 960GB SSD NVMe + 2× 1.92TB SSD NVMe (Soft RAID)
- **Largura de Banda:** 3 Gbit/s garantidos, tráfego ilimitado
- **Função:** Controlador de domínio, gestão de utilizadores e partilha de ficheiros
- **Licenciamentos:** Windows Server 2019/2022/2025 - 8 Cores
- **Custo:** 281.506,00Kz mês Servidor + 204.000,00Kz de instalação (Paga apenas uma vez) + 57.120.00Kz mês Licenciamento

## 4. Infraestrutura e Segurança

- **Active Directory Centralizado:** Todos os utilizadores autenticam-se no domínio corporativo Pegos.Cloud.
- **Rede Segura via VPN:** Ligação segura entre todas as clínicas e farmácias, com tunelamento criptografado.
- **Backups Automáticos:**
    - Diários (incrementais) e semanais (completos);
    - Retenção em dias/espaço;
    - Armazenamento em datacenter distinto (Cloud Storage).
- **Firewall e Monitorização:** Configuração de firewall avançada e monitorização 24/7 de disponibilidade e segurança.

### Opções práticas:

1.  **WireGuard (recomendado)**
    - Leve, rápido e seguro.
    - Pode ser instalado no Servidor 2 (AD + Ficheiros).
    - Cada clínica/farmácia teria um túnel seguro que autentica automaticamente.
2.  **OpenVPN Access Server**
    - Interface mais visual e fácil para gestão de utilizadores.
    - Ideal se quiseres permitir acessos remotos individuais (ex: administração, manutenção, técnicos).
3.  **Alternativa Premium (mas simples)**
    - Criar uma VPN site-to-site com routers compatíveis (ex: Mikrotik, FortiGate ou Ubiquiti).
    - Assim, cada clínica liga-se automaticamente à Cloud, e toda a rede local já tem acesso ao domínio e partilhas — sem necessidade de login VPN manual.

## 5. Benefícios da Solução

- Centralização total da infraestrutura de TI.
- Acesso remoto seguro e eficiente.
- Redução de custos de manutenção local.
- Melhoria no desempenho e disponibilidade do ERP Primavera.
- Ambiente escalável para futuras expansões.
- Segurança empresarial com controlo total de utilizadores e permissões.

## 6. Investimento Mensal Estimado / Custos Fixos

| Descrição | Custo Mensal | Custo de Instalação |
| :--- | :--- | :--- |
| Servidor – 1 + Licenciamento | 350.200,00Kz | 244.800,00Kz (Datacenter) |
| Servidor – 2 + Licenciamento | 338.626,00Kz | 204.000,00Kz (Datacenter) |
| Gestão dos Servidores na Cloud | 425.000,00Kz | 750.000,00Kz (Implement) |
| **Total** | **1.113.826,00Kz (mês)** | **448.800,00Kz (único)** |

### Outros Custos / Variáveis

1.  **Backups:** 36.720,00Kz (4.080,00Kz por TB)
2.  **VPN:** Aquisição de Material, Implementação e configuração (está variação dependerá de duas variantes, ligação ao Active Directory e o Primavera pelos Computadores das Clínicas e Farmácias com a solução WireGuard ou OpenVPN e as ligações entre si Clínicas e Farmácias que aqui recomendaríamos o uso de uma VPN site-to-site com routers compatíveis (ex: Mikrotik, FortiGate ou Ubiquiti) com o WireGuard / OpenVPN.

## 7. Prazos e Implementação

- **Fase 1 – Planeamento e provisionamento:** 3 dias úteis
- **Fase 2 – Configuração e testes:** 10 dias úteis
- **Fase 3 – Migração de dados e ativação:** 2 dias úteis

**Prazo total estimado:** 15 dias úteis após adjudicação (2 semanas).

## 8. Condições Comerciais

- Pagamento mensal via transferência bancária.
- Acordo mínimo de 12 meses com suporte incluído.
- Na proposta inclui gestão completa dos servidores, backups e monitorização.

## 9. Próximos Passos

Após validação da proposta, será enviado o contrato de prestação de serviços de infraestrutura Cloud, seguido do plano técnico detalhado de migração.

## Opção 2 – Solução Unificada

### Servidor 3 – Active Directory. Partilha de Ficheiros e Primavera

- **Modelo:** iTpraTi Cloud-Pro-3
- **Processador:** AMD EPYC 4465P - 12c/24t - 3.4GHz/5.4GHz 2026
- **Memória:** 128GB DDR5 ECC On-Die 5600MHz
- **Armazenamento:** 4× 1.92TB SSD NVMe Soft RAID
- **Largura de Banda:** 3 Gbit/s garantidos, tráfego ilimitado
- **Função:** Controlador de domínio, gestão de utilizadores e partilha de ficheiros
- **Licenciamentos:** Windows Server 2019/2022/2025 - 12 Cores
- **Custo:** 586.840,00Kz mês Servidor + 326.400,00Kz de instalação (Paga apenas uma vez) + 85.680.00Kz mês Licenciamento

| Descrição | Custo Mensal | Custo de Instalação |
| :--- | :--- | :--- |
| Servidor - 3 + Licenciamento | 672.520,00Kz | 326.400,00Kz (Datacenter) |
| Gestão dos Servidores na Cloud | 325.000,00Kz | 750.000,00Kz (Implement) |
| **Total** | **937.520,00Kz (mês)** | **326.400,00Kz (único)** |

**NOTAS:**

1.  A presente proposta tem um prazo de validade de 30 dias, contados a partir da data em que foi disponibilizada pela iTpraTi. Esta proposta poderá ser alterada por erro de digitação nos valores ou descrição apresentada.
2.  A iTpraTi oferece a Implementação e migração se aprovada a proposta.

Feito em Luanda, aos 07 de Novembro de 2025

PEL’A iTpraTi - Internet e Tecnologias

DIRETOR DE TI

___________________________________

[Seu Nome]

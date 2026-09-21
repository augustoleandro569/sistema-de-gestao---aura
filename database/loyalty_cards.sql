-- ==============================================================================
-- TABELA DE CARTÕES DE FIDELIDADE (LOYALTY CARDS) & TRIGGER DE SELOS
-- Sistema Sublime Estética & Bem-Estar (PostgreSQL / Supabase)
-- ==============================================================================

CREATE TABLE IF NOT EXISTS loyalty_cards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  stamps_count INTEGER DEFAULT 0 CHECK (stamps_count >= 0 AND stamps_count <= 10), -- De 0 a 10
  reward_available BOOLEAN DEFAULT FALSE,
  last_stamp_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(client_id, organization_id)
);

-- ==============================================================================
-- ÍNDICES DE PERFORMANCE
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_loyalty_cards_client_id ON loyalty_cards(client_id);
CREATE INDEX IF NOT EXISTS idx_loyalty_cards_org_id ON loyalty_cards(organization_id);
CREATE INDEX IF NOT EXISTS idx_loyalty_cards_reward_available ON loyalty_cards(reward_available);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) & POLÍTICAS DE SEGURANÇA
-- ==============================================================================
ALTER TABLE loyalty_cards ENABLE ROW LEVEL SECURITY;

-- 1. Usuários autenticados da clínica acessam cartões de sua organização
CREATE POLICY "Profissionais e admin acessam cartões de sua organizacao"
ON loyalty_cards FOR ALL
USING (
  organization_id = (SELECT organization_id FROM profiles WHERE id = auth.uid())
);

-- 2. Clientes acessam apenas o seu próprio cartão fidelidade
CREATE POLICY "Clientes visualizam apenas o seu proprio cartao de fidelidade"
ON loyalty_cards FOR SELECT
USING (
  client_id = auth.uid()
);

-- ==============================================================================
-- TRIGGER FUNCTION: ADICIONAR SELO QUANDO O ATENDIMENTO FOR 'FINALIZADO' E 'PAGO'
-- Regra de negócio: Somente se o atendimento for pago e concluído
-- ==============================================================================

CREATE OR REPLACE FUNCTION handle_appointment_loyalty_stamp()
RETURNS TRIGGER AS $$
DECLARE
  v_current_stamps INTEGER;
  v_new_stamps INTEGER;
  v_reward_ready BOOLEAN;
BEGIN
  -- Regra: Disparar apenas quando o status for 'finalizado' e o pagamento estiver 'pago'
  -- Evita disparar novamente se o atendimento já estava finalizado e pago antes do update
  IF (NEW.status = 'finalizado' AND NEW.payment_status = 'pago') AND
     (TG_OP = 'INSERT' OR (OLD.status IS DISTINCT FROM 'finalizado' OR OLD.payment_status IS DISTINCT FROM 'pago')) THEN

    -- Localiza ou inicializa o cartão fidelidade do cliente na organização
    INSERT INTO loyalty_cards (
      client_id,
      organization_id,
      stamps_count,
      reward_available,
      last_stamp_at,
      created_at,
      updated_at
    )
    VALUES (
      NEW.client_id,
      NEW.organization_id,
      1,
      FALSE,
      NOW(),
      NOW(),
      NOW()
    )
    ON CONFLICT (client_id, organization_id)
    DO UPDATE SET
      -- Incrementa o selo até o teto de 10
      stamps_count = CASE
        WHEN loyalty_cards.stamps_count >= 10 THEN 10
        ELSE loyalty_cards.stamps_count + 1
      END,
      -- Se atingiu 10 selos, libera o benefício/recompensa
      reward_available = CASE
        WHEN loyalty_cards.stamps_count + 1 >= 10 THEN TRUE
        ELSE loyalty_cards.reward_available
      END,
      last_stamp_at = NOW(),
      updated_at = NOW();

  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger aplicado na tabela appointments
DROP TRIGGER IF EXISTS trigger_appointment_loyalty_stamp ON appointments;

CREATE TRIGGER trigger_appointment_loyalty_stamp
AFTER INSERT OR UPDATE OF status, payment_status ON appointments
FOR EACH ROW
EXECUTE FUNCTION handle_appointment_loyalty_stamp();

-- ==============================================================================
-- FUNÇÃO AUXILIAR: RESGATE DA RECOMPENSA (REDEEM REWARD)
-- Ao resgatar a recompensa (10 selos completos), zera os selos para um novo ciclo
-- ==============================================================================
CREATE OR REPLACE FUNCTION redeem_loyalty_reward(
  p_client_id UUID,
  p_organization_id UUID
)
RETURNS JSONB AS $$
DECLARE
  v_card RECORD;
BEGIN
  SELECT * INTO v_card
  FROM loyalty_cards
  WHERE client_id = p_client_id AND organization_id = p_organization_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'message', 'Cartão fidelidade não encontrado.');
  END IF;

  IF NOT v_card.reward_available THEN
    RETURN jsonb_build_object('success', false, 'message', 'O cliente ainda não acumulou 10 selos para resgate.');
  END IF;

  -- Resgata o prêmio e reinicia o ciclo de selos (de 0 a 10)
  UPDATE loyalty_cards
  SET
    stamps_count = 0,
    reward_available = FALSE,
    updated_at = NOW()
  WHERE id = v_card.id;

  RETURN jsonb_build_object(
    'success', true,
    'message', 'Recompensa resgatada com sucesso! O cartão foi reiniciado para o próximo ciclo.',
    'client_id', p_client_id
  );
END;
$$ LANGUAGE plpgsql;

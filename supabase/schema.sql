-- =============================================
-- Schéma de la table des commandes
-- À exécuter dans Supabase SQL Editor
-- =============================================

-- Supprimer la table si elle existe déjà (utile pour les resets)
DROP TABLE IF EXISTS orders;

-- Créer la table des commandes
CREATE TABLE orders (
  id            TEXT PRIMARY KEY,         -- ID unique RetailCRM
  number        TEXT NOT NULL,            -- Numéro de commande (ex: "ORD-001")
  status        TEXT NOT NULL,            -- Statut : "new", "confirmed", "shipped", "delivered"
  total_sum     NUMERIC(12, 2) NOT NULL,  -- Montant total en KZT
  customer_name TEXT,                     -- Nom du client
  customer_email TEXT,                    -- Email du client
  customer_phone TEXT,                    -- Téléphone du client
  created_at    TIMESTAMPTZ NOT NULL,     -- Date de création de la commande
  synced_at     TIMESTAMPTZ DEFAULT NOW() -- Date de dernière synchronisation
);

-- Index pour accélérer les requêtes par date
CREATE INDEX idx_orders_created_at ON orders (created_at);

-- Index pour accélérer les requêtes par statut
CREATE INDEX idx_orders_status ON orders (status);

-- Commentaires pour documentation
COMMENT ON TABLE orders IS 'Commandes synchronisées depuis RetailCRM';
COMMENT ON COLUMN orders.id IS 'Identifiant unique venant de RetailCRM';
COMMENT ON COLUMN orders.total_sum IS 'Montant en Tenge kazakhstanais (KZT)';

CREATE TABLE IF NOT EXISTS company_data (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  slogan VARCHAR(255),
  address VARCHAR(500),
  phone VARCHAR(50),
  phone_raw VARCHAR(50),
  whatsapp_message TEXT,
  rating DECIMAL(2,1),
  review_count INT,
  maps_embed TEXT,
  maps_link TEXT
);

CREATE TABLE IF NOT EXISTS schedule (
  id INT PRIMARY KEY AUTO_INCREMENT,
  day VARCHAR(50) NOT NULL,
  hours VARCHAR(50),
  is_open BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS reviews (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  text TEXT,
  stars INT DEFAULT 5
);

CREATE TABLE IF NOT EXISTS products (
  id INT PRIMARY KEY AUTO_INCREMENT,
  emoji VARCHAR(10),
  name VARCHAR(255) NOT NULL,
  description TEXT
);

CREATE TABLE IF NOT EXISTS about_features (
  id INT PRIMARY KEY AUTO_INCREMENT,
  emoji VARCHAR(10),
  title VARCHAR(255) NOT NULL,
  description TEXT
);

CREATE TABLE IF NOT EXISTS analytics_visits (
  id INT PRIMARY KEY AUTO_INCREMENT,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  page VARCHAR(255),
  referrer TEXT,
  user_agent TEXT
);

CREATE TABLE IF NOT EXISTS analytics_whatsapp (
  id INT PRIMARY KEY AUTO_INCREMENT,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  page VARCHAR(255)
);

-- Dados iniciais
INSERT INTO company_data (name, slogan, address, phone, phone_raw, whatsapp_message, rating, review_count, maps_embed, maps_link) VALUES
('Agrocomercial Carvalho', 'Sua parceira no campo desde sempre', 'R. Ernesto Wild, 250 – Industrial, Vera Cruz – RS, 96880-000', '(51) 99731-3009', '5551997313009', 'Olá, Quero saber mais de como funciona !', 4.7, 92, 'https://maps.google.com/maps?q=R.+Ernesto+Wild,+250,+Vera+Cruz+RS&output=embed', 'https://www.google.com/maps/search/R.+Ernesto+Wild,+250,+Vera+Cruz+RS');

INSERT INTO schedule (day, hours, is_open) VALUES
('Segunda-feira', '08:00 – 19:00', TRUE),
('Terça-feira', '08:00 – 19:00', TRUE),
('Quarta-feira', '08:00 – 19:00', TRUE),
('Quinta-feira', '08:00 – 19:00', TRUE),
('Sexta-feira', '08:00 – 19:00', TRUE),
('Sábado', '08:00 – 17:00', TRUE),
('Domingo', 'Fechado', FALSE);

INSERT INTO reviews (name, text, stars) VALUES
('Maria S.', 'Ótimo atendimento, boa recepção aos clientes, produtos de boa qualidade.', 5),
('João P.', 'Atendimento bom, horário flexível, não fecha às 12:00 (meio dia).', 5),
('Ana L.', 'Atendimento muito legal e produtos de qualidade.', 5);

INSERT INTO products (emoji, name, description) VALUES
('🌱', 'Sementes', 'Sementes de alta qualidade para diversas culturas e pastagens.'),
('🧪', 'Fertilizantes', 'Fertilizantes e adubos para maximizar a produtividade do solo.'),
('🛡️', 'Defensivos', 'Defensivos agrícolas para proteção eficaz das suas lavouras.'),
('🐄', 'Rações', 'Rações balanceadas para bovinos, equinos, aves e suínos.'),
('🦺', 'EPIs', 'Equipamentos de proteção individual para segurança no campo.'),
('🔧', 'Ferramentas', 'Ferramentas agrícolas resistentes para o dia a dia rural.'),
('👟', 'Calçados', 'Botas e calçados rurais com conforto e durabilidade.'),
('👕', 'Vestuário Rural', 'Roupas e acessórios ideais para o trabalho no campo.');

INSERT INTO about_features (emoji, title, description) VALUES
('🌾', 'Qualidade', 'Produtos selecionados das melhores marcas do agronegócio.'),
('🤝', 'Atendimento', 'Equipe dedicada e pronta para te ajudar com o que precisar.'),
('📦', 'Variedade', 'Tudo que você precisa para o campo em um só lugar.'),
('✅', 'Confiança', 'Avaliação 4.7 no Google com mais de 92 clientes satisfeitos.');

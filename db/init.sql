-- db/init.sql  (solo se ejecuta si el volumen está vacío)
CREATE TABLE IF NOT EXISTS reservas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  actividad VARCHAR(150) NOT NULL,
  creada_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
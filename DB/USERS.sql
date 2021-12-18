CREATE USER 'digiUser'@localhost IDENTIFIED BY 'digitienda';

GRANT ALL PRIVILEGES ON Digitienda.* TO 'digiUser'@localhost;

FLUSH PRIVILEGES;
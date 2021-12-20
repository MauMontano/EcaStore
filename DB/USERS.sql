CREATE USER 'ecaUser'@localhost IDENTIFIED BY 'ecaStore';

GRANT ALL PRIVILEGES ON EcaStore.* TO 'ecaUser'@localhost;

FLUSH PRIVILEGES;
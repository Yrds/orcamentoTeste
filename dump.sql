create table ingrediente ( id integer  primary key autoincrement , nome text, preco_por_unidade double );
INSERT INTO ingrediente VALUES(1,'teste_ingrediente',12.33);
create table prato ( id integer  primary key autoincrement, nome text );
create table prato_ingrediente ( id integer  primary key autoincrement, id_prato integer references prato(id), id_ingrediente integer references ingrediente(id), quantidade double);

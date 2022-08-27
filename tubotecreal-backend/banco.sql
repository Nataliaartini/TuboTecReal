-- drop table produtos cascade;
-- drop table tipo_origem_produto cascade;
-- drop table funcionarios cascade;
-- drop table transacoes cascade;
-- drop table categoria_produto cascade;
-- drop table tipo_pagamento cascade ;

create table categoria_produto
(
    id serial primary key,
    descricao varchar(50) not null
);

-- auto-generated definition
create table tipo_pagamento
(
    id serial primary key,
    descricao varchar(30) not null
);

create table tipo_origem_produto
(
    id serial primary key,
    descricao varchar(50) not null
);

create table produtos
(
    id serial primary key,
    descricao varchar(50) not null,
    preco double precision,
    categoria_id integer references categoria_produto,
    quantidade_estoque integer
);


-- auto-generated definition
create table funcionarios
(
    cpf varchar(14) not null primary key,
    nome varchar(80) not null,
    observacao varchar(300),
    telefone varchar(14),
    salario double precision,
    data_inicio  timestamp not null,
    data_desligamento timestamp
);

create table transacoes
(
    id serial primary key,
    descricao varchar(80) not null,
    data_transacao timestamp not null,
    quantidade_produto integer not null,
    pago bool,
    tipo_pagamento_id integer references tipo_pagamento,
    origem_id integer references tipo_origem_produto,
    produto_id integer references produtos
);

insert into categoria_produto values (nextval('categoria_produto_id_seq'), 'Matéria Prima');
insert into categoria_produto values (nextval('categoria_produto_id_seq'), 'Limpeza');
insert into categoria_produto values (nextval('categoria_produto_id_seq'), 'Escritório');
insert into categoria_produto values (nextval('categoria_produto_id_seq'), 'Produto para revenda');


insert into tipo_origem_produto values (nextval('tipo_origem_produto_id_seq'), 'Compra');
insert into tipo_origem_produto values (nextval('tipo_origem_produto_id_seq'), 'Venda');
insert into tipo_origem_produto values (nextval('tipo_origem_produto_id_seq'), 'Fabricação');


insert into tipo_pagamento values (nextval('tipo_pagamento_id_seq'), 'Depósito em conta');
insert into tipo_pagamento values (nextval('tipo_pagamento_id_seq'), 'Cheque');
insert into tipo_pagamento values (nextval('tipo_pagamento_id_seq'), 'Dinheiro');
insert into tipo_pagamento values (nextval('tipo_pagamento_id_seq'), 'Boleto');
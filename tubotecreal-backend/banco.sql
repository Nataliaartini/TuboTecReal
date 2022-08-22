drop table produtos cascade;
drop table tipo_origem_produto cascade;
drop table funcionarios cascade;
drop table transacoes cascade;
drop table categoria_produto cascade;
drop table moedas cascade ;
create table categoria_produto
(
    id        serial
        primary key,
    descricao varchar(50) not null
);

-- auto-generated definition
create table moedas
(
    id        serial
        primary key,
    descricao varchar(30) not null,
    simbolo   varchar(5)  not null
);

create table tipo_origem_produto
(
    id        serial
        primary key,
    descricao varchar(50) not null
);

create table produtos
(
    id                 serial
        primary key,
    descricao          varchar(50) not null,
    preco              double precision,
    categoria_id       integer
        references categoria_produto,
    quantidade_estoque integer
);


-- auto-generated definition
create table funcionarios
(
    cpf               varchar(14) not null
        primary key,
    nome              varchar(80) not null,
    observacao        varchar(300),
    telefone          varchar(14),
    salario           double precision,
    data_inicio       timestamp   not null,
    data_desligamento timestamp
);

create table transacoes
(
    id                 serial
        primary key,
    descricao          varchar(80) not null,
    data_transacao     timestamp   not null,
    quantidade_produto integer     not null,
    moeda_id           integer
        references moedas,
    origem_id          integer
        references tipo_origem_produto,
    produto_id         integer
        references produtos
);

insert into categoria_produto values (nextval('categoria_produto_id_seq'), 'Matrial de Construção');
insert into categoria_produto values (nextval('categoria_produto_id_seq'), 'Limpeza');
insert into categoria_produto values (nextval('categoria_produto_id_seq'), 'Escritório Limpeza');


insert into tipo_origem_produto values (nextval('tipo_origem_produto_id_seq'), 'Compra');
insert into tipo_origem_produto values (nextval('tipo_origem_produto_id_seq'), 'Venda');
insert into tipo_origem_produto values (nextval('tipo_origem_produto_id_seq'), 'Fabricação');

insert into moedas values (nextval('moedas_id_seq'), 'Real', 'R$');
insert into moedas values (nextval('moedas_id_seq'), 'Dólar', '$');
insert into moedas values (nextval('moedas_id_seq'), 'Euro', 'EUR');
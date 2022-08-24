import React from "react";
import {
    Box,
    Button,
    Divider,
    Grid,
    IconButton,
    MenuItem,
    Paper,
    Select,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import ResultMessage from "./ResultMessage";
import { DesktopDatePicker, LocalizationProvider } from "@mui/x-date-pickers/";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import dateFormat from "dateformat";
import ptBR from "date-fns/esm/locale/pt-BR/index.js";

import { AgGridColumn, AgGridReact } from "ag-grid-react";
import "ag-grid-community";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-material.css";

import UseWindowDimensions from "../hooks/UseWindowDimensions";

export default function Financeiro() {
    const gridRef = React.useRef();

    const { height } = UseWindowDimensions();
    const [gridColumnApi, setGridColumnApi] = React.useState(null);
    const [gridApi, setGridApi] = React.useState(null);

    const transacaoInicial = {
        descricao: "",
        data_transacao: dateFormat(new Date(), "yyyy-mm-dd"),
        quantidade_produto: 0,
        pago: false,
        tipo_pagamento_id: "",
        origem_id: "",
        produto_id: "",
    };
    const [transacao, setTransacao] = React.useState(transacaoInicial);

    const [listaMoedas, setListaMoedas] = React.useState([]);
    const [listaOrigens, setListaOrigens] = React.useState([]);
    const [listaTransacoes, setListaTransacoes] = React.useState([]);
    const [listaProdutos, setListaProdutos] = React.useState([]);

    const [messageText, setMessageText] = React.useState("");
    const [messageSeverity, setMessageSeverity] = React.useState("success");
    const [openMessage, setOpenMessage] = React.useState(false);
    const [update, setUpdate] = React.useState(false);

    const [desc, setDesc] = React.useState(transacao.descricao);
    const [dataTransacao, setDataTransacao] = React.useState(
        transacao.data_transacao
    );
    const [quantidade, setQuantidade] = React.useState(
        transacao.quantidade_produto
    );
    const [pago, setPago] = React.useState(transacao.pago);
    const [tipoPagamento, setTipoPagamento] = React.useState(
        transacao.tipo_pagamento_id
    );
    const [origem, setOrigem] = React.useState(transacao.origem_id);
    const [produto, setProduto] = React.useState(transacao.produto_id);
    const [totalTransacoes, setTotalTransacoes] = React.useState(0.0);
    const [totalTransacoesEntrada, setTotalTransacoesEntrada] =
        React.useState(0.0);
    const [totalTransacoesSaida, setTotalTransacoesSaida] = React.useState(0.0);

    React.useEffect(() => {
        const moedasRequest = axios.get("/pagamentos/all/");
        moedasRequest.then((res) => {
            setListaMoedas(res.data);
        });
        const origensRequest = axios.get("/origens/all/");
        origensRequest.then((res) => {
            setListaOrigens(res.data);
        });
        const produtosRequest = axios.get("/produtos/all/");
        produtosRequest.then((res) => {
            setListaProdutos(res.data);
        });
        const transacaoesRequest = axios.get("/transacoes/all/");
        transacaoesRequest.then((res) => {
            setListaTransacoes(res.data);
            let total = 0.0;
            let totalEntrada = 0.0;
            let totalSaida = 0.0;
            for (let transacao of res.data) {
                total =
                    total +
                    transacao.quantidade_produto * transacao.produto.preco;
                if (transacao.origem.id === 2) {
                    totalEntrada =
                        totalEntrada +
                        transacao.quantidade_produto * transacao.produto.preco;
                } else {
                    if (transacao.origem.id === 1) {
                        totalSaida =
                            totalSaida +
                            transacao.quantidade_produto *
                                transacao.produto.preco;
                    }
                }
            }
            setTotalTransacoes(total);
            setTotalTransacoesEntrada(totalEntrada);
            setTotalTransacoesSaida(totalSaida);
        });
        setDesc(transacao.descricao);
        setDataTransacao(transacao.data_transacao);
        setQuantidade(transacao.quantidade_produto);
        setPago(transacao.pago);
        setTipoPagamento(transacao.tipo_pagamento_id);
        setOrigem(transacao.origem_id);
        setProduto(transacao.produto_id);
    }, [transacao]);

    const onSelectionChanged = React.useCallback(() => {
        const selectedRow = gridRef.current.api.getSelectedRows();
        processLineSelection(selectedRow[0]);
        setUpdate(true);
    }, []);

    function onGridReady(params) {
        setGridColumnApi(params.columnApi);
        setGridApi(params.api);
    }

    function processLineSelection(selectedTrans) {
        // setProduto(selectedProd);
        setTransacao({
            id: selectedTrans.id,
            descricao: selectedTrans.descricao,
            data_transacao: selectedTrans.data_transacao,
            quantidade_produto: selectedTrans.quantidade_produto,
            pago: selectedTrans.pago,
            tipo_pagamento_id: selectedTrans.tipo_pagamento_id,
            origem_id: selectedTrans.origem_id,
            produto_id: selectedTrans.produto_id,
        });
    }

    function handleSendClick() {
        const _transacao = {
            descricao: desc,
            data_transacao: dataTransacao,
            quantidade_produto: quantidade,
            pago: pago,
            tipo_pagamento_id: tipoPagamento,
            origem_id: origem,
            produto_id: produto,
        };
        let request;
        console.log(_transacao);

        if (update === false) {
            request = axios.post("/transacoes/", _transacao);
        } else {
            const updatedTrans = _transacao;
            updatedTrans.id = transacao.id;
            request = axios.put("/transacoes/", updatedTrans);
        }

        request
            .then((res) => {
                setMessageText("Enviado com sucesso!");
                setMessageSeverity("success");
                resetForm();
            })
            .catch((error) => {
                setMessageText(
                    "Erro ao enviar dados da Transação para o servidor."
                );
                setMessageSeverity("error");
                console.log(error);
            })
            .finally(() => {
                setOpenMessage(true);
            });
    }

    function resetForm() {
        setDesc("");
        setDataTransacao(dateFormat(new Date(), "yyyy-mm-dd"));
        setQuantidade(0);
        setPago(false);
        setTipoPagamento("");
        setOrigem("");
        setProduto("");
        setTransacao(transacaoInicial);
        setUpdate(false);
    }

    function handleCancelClick() {
        resetForm();
        setOpenMessage(true);
        setMessageText("Cadastrado cancelado!");
        setMessageSeverity("warning");
    }

    function handleDeleteClick() {
        axios
            .delete(`/transacoes/${transacao.id}`)
            .then((res) => {
                setMessageText("Transação removida com sucesso!");
                setMessageSeverity("success");
                resetForm();
            })
            .catch((error) => {
                setMessageText(
                    "Erro ao remover dados da Transação no servidor."
                );
                setMessageSeverity("error");
                console.log(error);
            })
            .finally(() => {
                setOpenMessage(true);
            });
    }

    function columnDateFormatter(params) {
        if (params.value === null) return "";
        return dateFormat(params.value, "dd/mm/yyyy");
    }

    function columnPagoFormatter(params) {
        if (params.value === false) return "Não";
        return "Sim";
    }

    return (
        <main style={{ padding: "1rem 0" }}>
            <h2>Financeiro</h2>
            <Box sx={{ width: "100%" }}>
                <Stack spacing={2}>
                    <main style={{ padding: "1rem 0" }}>
                        <Box component="form">
                            <Paper
                                style={{
                                    display: "grid",
                                    gridRowGap: "20px",
                                    padding: "20px",
                                    margin: "10px 300px",
                                }}
                            >
                                <TextField
                                    required
                                    id="desc-input"
                                    label="Descrição"
                                    size="small"
                                    onChange={(e) => setDesc(e.target.value)}
                                    value={desc}
                                />
                                <LocalizationProvider
                                    dateAdapter={AdapterDateFns}
                                    locale={ptBR}
                                >
                                    <DesktopDatePicker
                                        label="Data"
                                        value={dataTransacao}
                                        onChange={(e) => setDataTransacao(e)}
                                        renderInput={(params) => (
                                            <TextField {...params} />
                                        )}
                                    />
                                </LocalizationProvider>

                                <TextField
                                    required
                                    id="quantidade-input"
                                    label="Quantidade"
                                    size="small"
                                    onChange={(e) =>
                                        setQuantidade(e.target.value)
                                    }
                                    value={quantidade}
                                />

                                <Select
                                    id="select-moeda"
                                    label="Tipo de Pagamento"
                                    size="small"
                                    value={tipoPagamento}
                                    onChange={(e) =>
                                        setTipoPagamento(e.target.value)
                                    }
                                >
                                    {listaMoedas.map((_symbol) => (
                                        <MenuItem
                                            value={_symbol.id}
                                            key={_symbol.id}
                                        >
                                            {_symbol.descricao}
                                        </MenuItem>
                                    ))}
                                </Select>
                                <Select
                                    id="select-origem"
                                    label="Origem"
                                    size="small"
                                    value={origem}
                                    inputProps={{ readOnly: update }}
                                    onChange={(e) => setOrigem(e.target.value)}
                                >
                                    {listaOrigens.map((_symbol) => (
                                        <MenuItem
                                            value={_symbol.id}
                                            key={_symbol.id}
                                        >
                                            {_symbol.descricao}
                                        </MenuItem>
                                    ))}
                                </Select>
                                <Select
                                    id="select-produto"
                                    label="Produto"
                                    size="small"
                                    value={produto}
                                    onChange={(e) => setProduto(e.target.value)}
                                >
                                    {listaProdutos.map((_symbol) => (
                                        <MenuItem
                                            value={_symbol.id}
                                            key={_symbol.id}
                                        >
                                            {_symbol.descricao} - Estoque:{" "}
                                            {_symbol.quantidade_estoque}
                                        </MenuItem>
                                    ))}
                                </Select>
                                <Grid container spacing={2}>
                                    <Grid
                                        xs
                                        item
                                        display="flex"
                                        justifyContent="center"
                                        alignItems="center"
                                    >
                                        <Button
                                            variant="contained"
                                            style={{
                                                maxWidth: "80px",
                                                minWidth: "80px",
                                            }}
                                            onClick={handleSendClick}
                                            color="success"
                                            // type="submit"
                                        >
                                            Enviar
                                        </Button>
                                    </Grid>
                                    <Grid
                                        xs
                                        item
                                        display="flex"
                                        justifyContent="center"
                                        alignItems="center"
                                    >
                                        <Button
                                            variant="outlined"
                                            style={{
                                                maxWidth: "80px",
                                                minWidth: "80px",
                                            }}
                                            onClick={handleCancelClick}
                                            color="success"
                                        >
                                            Cancel
                                        </Button>
                                        {update && (
                                            <IconButton
                                                aria-label="delete"
                                                onClick={handleDeleteClick}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        )}
                                    </Grid>
                                </Grid>
                            </Paper>
                        </Box>

                        <ResultMessage
                            open={openMessage}
                            message={messageText}
                            severity={messageSeverity}
                            onClose={(e, r) => {
                                setOpenMessage(false);
                            }}
                        />
                    </main>
                    <div style={{ width: "90%" }}>
                        <Typography variant="body1">
                            Total de transações em R$: {totalTransacoes}
                        </Typography>
                        <Typography variant="body2">
                            Total de entradas em R$: {totalTransacoesEntrada} |
                            Total de saídas em R$: {totalTransacoesSaida}
                        </Typography>
                    </div>
                    <div style={{ height: height * 0.75, width: "90%" }}>
                        <AgGridReact
                            ref={gridRef}
                            rowData={listaTransacoes}
                            defaultColDef={{
                                flex: 1,
                                minWidth: 20,
                                editable: false,
                                resizable: false,
                            }}
                            enableCellChangeFlash={true}
                            onGridReady={onGridReady}
                            className="ag-theme-material"
                            rowSelection={"single"}
                            onSelectionChanged={onSelectionChanged}
                        >
                            <AgGridColumn
                                field="id"
                                headerName="Id Transação"
                            />
                            <AgGridColumn
                                field="descricao"
                                headerName="Descrição"
                                cellStyle={{ textAlign: "left" }}
                            />
                            <AgGridColumn
                                field="quantidade_produto"
                                headerName="Quantidade"
                            />
                            <AgGridColumn
                                field="data_transacao"
                                headerName="Data Transação"
                                valueFormatter={columnDateFormatter}
                            />
                            <AgGridColumn
                                field="pago"
                                headerName="Pago"
                                valueFormatter={columnPagoFormatter}
                            />
                            <AgGridColumn
                                field="pagamento.descricao"
                                headerName="Moeda"
                            />
                            <AgGridColumn
                                field="origem.descricao"
                                headerName="Origem"
                            />
                            <AgGridColumn
                                field="produto.descricao"
                                headerName="Produto"
                            />
                        </AgGridReact>
                    </div>
                </Stack>
            </Box>
        </main>
    );
}

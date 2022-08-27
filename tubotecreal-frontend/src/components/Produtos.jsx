import React from "react";
import {Box, Button, Grid, IconButton, MenuItem, Paper, Select, Stack, TextField,} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import NumberFormat from "react-number-format";
import ResultMessage from "./ResultMessage";

import {AgGridColumn, AgGridReact} from "ag-grid-react";
import "ag-grid-community";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-material.css";

import UseWindowDimensions from "../hooks/UseWindowDimensions";

const NumberFormatCustom = React.forwardRef(function NumberFormatCustom(
    props,
    ref
) {
    const {onChange, ...other} = props;

    return (
        <NumberFormat
            {...other}
            getInputRef={ref}
            onValueChange={(values) => {
                onChange({
                    target: {
                        name: props.name,
                        value: values.value,
                    },
                });
            }}
            thousandSeparator
            isNumericString
            prefix="R$ "
        />
    );
});

export default function Produtos() {
    const gridRef = React.useRef();

    const {height} = UseWindowDimensions();
    const [gridColumnApi, setGridColumnApi] = React.useState(null);
    const [gridApi, setGridApi] = React.useState(null);

    const produtoInicial = {
        descricao: "",
        preco: 0,
        categoria_id: "",
        quantidade_estoque: 0,
    };
    const [produto, setProduto] = React.useState(produtoInicial);

    const [categoriaList, setCategoriaList] = React.useState([]);

    const [messageText, setMessageText] = React.useState("");
    const [messageSeverity, setMessageSeverity] = React.useState("success");
    const [openMessage, setOpenMessage] = React.useState(false);
    const [update, setUpdate] = React.useState(false);

    const [desc, setDesc] = React.useState(produto.descricao);
    const [preco, setPreco] = React.useState(produto.preco);
    const [estoque, setEstoque] = React.useState(produto.quantidade_estoque);
    const [categoria, setCategoria] = React.useState(produto.categoria_id);

    const [listaProdutos, setListaProdutos] = React.useState(null);

    React.useEffect(() => {
        const origensRequest = axios.get("/categorias/all/");
        origensRequest.then((res) => {
            setCategoriaList(res.data);
        });
        const produtosRequest = axios.get("/produtos/all/");
        produtosRequest.then((res) => {
            setListaProdutos(res.data);
        });
        setDesc(produto.descricao);
        setPreco(produto.preco);
        setEstoque(produto.quantidade_estoque);
        setCategoria(produto.categoria_id);
    }, [produto]);

    const onSelectionChanged = React.useCallback(() => {
        const selectedRow = gridRef.current.api.getSelectedRows();
        processLineSelection(selectedRow[0]);
        setUpdate(true);
    }, []);

    function onGridReady(params) {
        setGridColumnApi(params.columnApi);
        setGridApi(params.api);
    }

    function processLineSelection(selectedProd) {
        // setProduto(selectedProd);
        setProduto({
            id: selectedProd.id,
            descricao: selectedProd.descricao,
            preco: selectedProd.preco,
            categoria_id: selectedProd.categoria_id,
            quantidade_estoque: selectedProd.quantidade_estoque,
        });
    }

    function handleSendClick() {
        const _produto = {
            descricao: desc,
            preco: preco,
            categoria_id: categoria,
            quantidade_estoque: estoque,
        };
        let request;

        if (update === false) {
            request = axios.post("/produtos/", _produto);
        } else {
            const updatedProd = _produto;
            updatedProd.id = produto.id;
            request = axios.put("/produtos/", updatedProd);
        }

        request
            .then((res) => {
                setMessageText("Enviado com sucesso!");
                setMessageSeverity("success");
                resetForm();
            })
            .catch((error) => {
                setMessageText(
                    "Erro ao enviar dados do Produto para o servidor."
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
        setPreco(0);
        setCategoria(1);
        setEstoque(0);
        setUpdate(false);
        setProduto(produtoInicial);
    }

    function handleCancelClick() {
        resetForm();
        setOpenMessage(true);
        setMessageText("Cadastrado cancelado!");
        setMessageSeverity("warning");
    }

    function handleDeleteClick() {
        const _produto = {
            id: produto.id,
            descricao: desc,
            preco: preco,
            categoria_id: categoria,
            quantidade_estoque: estoque,
        };
        console.log(_produto);

        axios
            .delete(`/produtos/${produto.id}`)
            .then((res) => {
                setMessageText("Produto removido com sucesso!");
                setMessageSeverity("success");
                resetForm();
            })
            .catch((error) => {
                setMessageText("Erro ao remover dados do Produto no servidor.");
                setMessageSeverity("error");
                console.log(error);
            })
            .finally(() => {
                setOpenMessage(true);
            });
    }

    return (
        <main style={{padding: "1rem 0"}}>
            <h2>Produtos</h2>
            <Box sx={{width: "100%"}}>
                <Stack spacing={2}>
                    <main style={{padding: "1rem 0"}}>
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
                                    id="nome-input"
                                    label="Descrição"
                                    size="small"
                                    onChange={(e) => setDesc(e.target.value)}
                                    value={desc}
                                />
                                <TextField
                                    required
                                    id="preco-input"
                                    label="Preço"
                                    size="small"
                                    onChange={(e) => setPreco(e.target.value)}
                                    InputProps={{
                                        inputComponent: NumberFormatCustom,
                                    }}
                                    value={preco}
                                />
                                <TextField
                                    required
                                    id="qtd-input"
                                    label="Quantidade Estoque"
                                    size="small"
                                    onChange={(e) => setEstoque(e.target.value)}
                                    value={estoque}
                                />
                                <Select
                                    id="select-origem"
                                    label="Origem"
                                    size="small"
                                    value={categoria}
                                    onChange={(e) =>
                                        setCategoria(e.target.value)
                                    }
                                >
                                    {categoriaList.map((_symbol) => (
                                        <MenuItem
                                            value={_symbol.id}
                                            key={_symbol.id}
                                        >
                                            {_symbol.descricao}
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
                                            color="success"
                                            style={{
                                                maxWidth: "80px",
                                                minWidth: "80px",
                                            }}
                                            onClick={handleCancelClick}
                                        >
                                            Cancel
                                        </Button>
                                        {update && (
                                            <IconButton
                                                aria-label="delete"
                                                onClick={handleDeleteClick}
                                            >
                                                <DeleteIcon/>
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
                    <div style={{height: height * 0.75, width: "90%"}}>
                        <AgGridReact
                            ref={gridRef}
                            rowData={listaProdutos}
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
                                headerName="Cód. Produto"
                            />
                            <AgGridColumn
                                field="descricao"
                                headerName="Descrição"
                                cellStyle={{textAlign: "left"}}
                            />
                            <AgGridColumn field="preco" headerName="Preço"/>
                            <AgGridColumn
                                field="categoria.descricao"
                                headerName="Categoria"
                            />
                            <AgGridColumn
                                field="quantidade_estoque"
                                headerName="Estoque"
                            />
                        </AgGridReact>
                    </div>
                </Stack>
            </Box>
        </main>
    );
}

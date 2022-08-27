import React from "react";
import {Box, Button, Grid, IconButton, Paper, Stack, TextField,} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import {DesktopDatePicker, LocalizationProvider} from "@mui/x-date-pickers/";
import {AdapterMoment} from '@mui/x-date-pickers/AdapterMoment';

import axios from "axios";
import NumberFormat from "react-number-format";
import {IMaskInput} from "react-imask";
import ResultMessage from "./ResultMessage";
import PropTypes from "prop-types";
import dateFormat from "dateformat";

import {AgGridColumn, AgGridReact} from "ag-grid-react";
import "ag-grid-community";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-material.css";

import 'moment/locale/pt-br';
import UseWindowDimensions from "../hooks/UseWindowDimensions";


const locale = 'pt-BR';

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

const CpfMaskCustom = React.forwardRef(function CpfMaskCustom(props, ref) {
    const {onChange, ...other} = props;
    return (
        <IMaskInput
            {...other}
            mask="000.000.000-00"
            placeholder="000.000.000-00"
            definitions={{
                "#": /[1-9]/,
            }}
            inputRef={ref}
            onAccept={(value) =>
                onChange({target: {name: props.name, value}})
            }
            overwrite
        />
    );
});

CpfMaskCustom.propTypes = {
    name: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
};

const TelMaskCustom = React.forwardRef(function TelMaskCustom(props, ref) {
    const {onChange, ...other} = props;
    return (
        <IMaskInput
            {...other}
            mask="(00)00000-0000"
            placeholder="(00)00000-0000"
            definitions={{
                "#": /[1-9]/,
            }}
            inputRef={ref}
            onAccept={(value) =>
                onChange({target: {name: props.name, value}})
            }
            overwrite
        />
    );
});

TelMaskCustom.propTypes = {
    name: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
};

export default function Funcionarios() {
    const gridRef = React.useRef();

    const {height} = UseWindowDimensions();
    const [gridColumnApi, setGridColumnApi] = React.useState(null);
    const [gridApi, setGridApi] = React.useState(null);

    const funcionarioInicial = {
        cpf: "",
        nome: "",
        observacao: "",
        telefone: "",
        salario: "",
        data_inicio: dateFormat(new Date(), "yyyy-mm-dd", -3),
        data_desligamento: null,
    };
    const [funcionario, setFuncionario] = React.useState(funcionarioInicial);

    const [messageText, setMessageText] = React.useState("");
    const [messageSeverity, setMessageSeverity] = React.useState("success");
    const [openMessage, setOpenMessage] = React.useState(false);
    const [update, setUpdate] = React.useState(false);

    const [cpf, setCpf] = React.useState(funcionario.cpf);
    const [nome, setNome] = React.useState(funcionario.nome);
    const [observacao, setObservacao] = React.useState(funcionario.observacao);
    const [telefone, setTelefone] = React.useState(funcionario.telefone);
    const [salario, setSalario] = React.useState(funcionario.salario);
    const [dataInicio, setDataInicio] = React.useState(funcionario.data_inicio);
    const [dataDesligamento, setDataDesligamento] = React.useState(
        funcionario.data_desligamento
    );

    const [listaFuncionarios, setListaFuncionarios] = React.useState(null);

    React.useEffect(() => {
        const getRequest = axios.get("/funcionarios/all/");
        getRequest.then((res) => {
            setListaFuncionarios(res.data);
        });
        setCpf(funcionario.cpf);
        setNome(funcionario.nome);
        setObservacao(funcionario.observacao);
        setTelefone(funcionario.telefone);
        setSalario(funcionario.salario);
        setDataInicio(funcionario.data_inicio);
        setDataDesligamento(funcionario.data_desligamento);
    }, [funcionario]);

    const onSelectionChanged = React.useCallback(() => {
        const selectedRow = gridRef.current.api.getSelectedRows();
        processLineSelection(selectedRow[0]);
        setUpdate(true);
    }, []);

    function onGridReady(params) {
        setGridColumnApi(params.columnApi);
        setGridApi(params.api);
    }

    function processLineSelection(selectedFunc) {
        setFuncionario(selectedFunc);
        console.log(selectedFunc);
    }

    function handleSendClick() {
        let dataDes;
        if (dataDesligamento === null) {
            dataDes = null;
        } else {
            dataDes = dateFormat(dataDesligamento, "yyyy-mm-dd", -3);
        }

        const _funcionario = {
            cpf: cpf,
            nome: nome,
            observacao: observacao,
            telefone: telefone,
            salario: salario,
            data_inicio: dateFormat(dataInicio, "yyyy-mm-dd", -3),
            data_desligamento: dataDes,
        };
        let request;
        console.log(_funcionario);

        if (update === false) {
            request = axios.post("/funcionarios/", _funcionario);
        } else {
            request = axios.put("/funcionarios/", _funcionario);
        }

        request
            .then((res) => {
                setMessageText("Enviado com sucesso!");
                setMessageSeverity("success");
                resetForm();
            })
            .catch((error) => {
                setMessageText(
                    "Erro ao enviar dados do Funcionário para o servidor."
                );
                setMessageSeverity("error");
                console.log(error);
            })
            .finally(() => {
                setOpenMessage(true);
            });
    }

    function resetForm() {
        setCpf(funcionarioInicial.cpf);
        setNome(funcionarioInicial.nome);
        setObservacao(funcionarioInicial.observacao);
        setTelefone(funcionarioInicial.telefone);
        setSalario(funcionarioInicial.salario);
        setDataInicio(funcionarioInicial.data_inicio);
        setDataDesligamento(funcionarioInicial.data_desligamento);
        setFuncionario(funcionarioInicial);
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
            .delete(`/funcionarios/${funcionario.cpf}`)
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

    function columnDateFormatter(params) {
        if (params.value === null) return "";
        // console.log(params.value);
        return dateFormat(params.value, "dd/mm/yyyy", -3);
    }

    function currencyFormatter(params) {
        return "R$ " + formatNumber(params.value);
    }

    function formatNumber(number) {
        return Math.floor(number)
            .toString()
            .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
    }

    return (
        <main style={{padding: "1rem 0"}}>
            <h2>Funcionários</h2>
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
                                    id="cpf-input"
                                    label="CPF"
                                    size="small"
                                    value={cpf}
                                    name="cpf-mask"
                                    onChange={(e) => setCpf(e.target.value)}
                                    InputProps={{
                                        inputComponent: CpfMaskCustom,
                                    }}
                                />
                                <TextField
                                    required
                                    id="nome-input"
                                    label="Nome"
                                    size="small"
                                    onChange={(e) => setNome(e.target.value)}
                                    value={nome}
                                />
                                <TextField
                                    required
                                    id="observacao-input"
                                    label="Observações"
                                    size="small"
                                    onChange={(e) =>
                                        setObservacao(e.target.value)
                                    }
                                    value={observacao}
                                />
                                <TextField
                                    required
                                    id="telefone-input"
                                    label="Telefone"
                                    name="telefone-mask"
                                    size="small"
                                    onChange={(e) =>
                                        setTelefone(e.target.value)
                                    }
                                    value={telefone}
                                    InputProps={{
                                        inputComponent: TelMaskCustom,
                                    }}
                                />
                                <TextField
                                    required
                                    id="salario-input"
                                    label="Salario"
                                    size="small"
                                    onChange={(e) => setSalario(e.target.value)}
                                    InputProps={{
                                        inputComponent: NumberFormatCustom,
                                    }}
                                    value={salario}
                                />
                                <LocalizationProvider
                                    dateAdapter={AdapterMoment}
                                    locale={locale}
                                >
                                    <DesktopDatePicker
                                        label="Data de Início"
                                        value={dataInicio}
                                        onChange={(e) => setDataInicio(e)}
                                        renderInput={(params) => (
                                            <TextField {...params} />
                                        )}
                                    />
                                </LocalizationProvider>
                                <LocalizationProvider
                                    dateAdapter={AdapterMoment}
                                    locale={locale}
                                >
                                    <DesktopDatePicker
                                        label="Data de Desligamento"
                                        value={dataDesligamento}
                                        onChange={(e) => setDataDesligamento(e)}
                                        renderInput={(params) => (
                                            <TextField {...params} />
                                        )}
                                    />
                                </LocalizationProvider>
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
                                            color="success"
                                            onClick={handleSendClick}
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
                            rowData={listaFuncionarios}
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
                            <AgGridColumn field="cpf" headerName="CPF"/>
                            <AgGridColumn
                                field="nome"
                                headerName="Nome"
                                cellStyle={{textAlign: "left"}}
                            />
                            <AgGridColumn
                                field="observacao"
                                headerName="Observações"
                            />
                            <AgGridColumn
                                field="telefone"
                                headerName="Contato"
                            />
                            <AgGridColumn
                                field="salario"
                                headerName="Salário"
                                valueFormatter={currencyFormatter}
                            />
                            <AgGridColumn
                                field="data_inicio"
                                headerName="Data Início"
                                valueFormatter={columnDateFormatter}
                            />
                            <AgGridColumn
                                field="data_desligamento"
                                headerName="Data Desligamento"
                                valueFormatter={columnDateFormatter}
                            />
                        </AgGridReact>
                    </div>
                </Stack>
            </Box>
        </main>
    );
}

import * as React from "react";
import {
    Box,
    Button,
    Grid,
    IconButton,
    Paper,
    Stack, TextField,
} from "@mui/material";
import {DropzoneArea} from 'material-ui-dropzone';
import axios from "axios";
import ResultMessage from "./ResultMessage";
import {AgGridColumn, AgGridReact} from "ag-grid-react";
import UseWindowDimensions from "../hooks/UseWindowDimensions";
import DeleteIcon from "@mui/icons-material/Delete";
import DownloadBtn from "./DownloadBtn";


export default function Arquivos() {
    const dropzoneRef = React.useRef();
    const gridRef = React.useRef();

    const {height} = UseWindowDimensions();
    const [gridColumnApi, setGridColumnApi] = React.useState(null);
    const [gridApi, setGridApi] = React.useState(null);

    const arquivoInicial = {
        descricao: "",
        localizacao: ""
    }

    const [arquivo, setArquivo] = React.useState(arquivoInicial);

    const [messageText, setMessageText] = React.useState("");
    const [messageSeverity, setMessageSeverity] = React.useState("success");
    const [openMessage, setOpenMessage] = React.useState(false);
    const [update, setUpdate] = React.useState(false);

    const [listaArquivos, setListaArquivos] = React.useState("");
    const dropzoneLabelInicial = "Arraste o arquivo aqui ou clique para selecionar";
    const [dropzoneLabel, setDropzoneLabel] = React.useState(dropzoneLabelInicial);
    const [fileUpload, setFileUpload] = React.useState([]);
    const [resetDropZone, setResetDropZone] = React.useState(false);
    const [desc, setDesc] = React.useState("");

    React.useEffect(() => {
        const arquivosRequest = axios.get("/arquivos/all/");
        arquivosRequest.then((res) => {
            setListaArquivos(res.data);
        });
        setDesc(arquivo.descricao);
    }, [arquivo]);

    const onSelectionChanged = React.useCallback(() => {
        const selectedRow = gridRef.current.api.getSelectedRows();
        processLineSelection(selectedRow[0]);
        setUpdate(true);
    }, []);

    function onGridReady(params) {
        setGridColumnApi(params.columnApi);
        setGridApi(params.api);
    }

    function processLineSelection(selectedArquivo) {
        // setProduto(selectedProd);
        setArquivo({
            id: selectedArquivo.id,
            descricao: selectedArquivo.descricao,
        });
        setDropzoneLabel("Upload de arquivo desabilitado para edição.");
    }

    function handleSendClick() {
        const form = new FormData();
        form.append('upload', fileUpload[0]);

        let request;
        if (update === true) {
            console.log(arquivo);
            request = axios.put("/arquivos/", {
                id: arquivo.id,
                descricao: desc
            });
        } else {
            request = axios.post(
                '/arquivos/',
                form,
                {
                    params: {
                        'descricao': desc,
                    },
                    headers: {

                        'Content-Type': 'multipart/form-data'
                    }
                }
            );
        }

        request
            .then((res) => {
                setMessageText("Enviado com sucesso!");
                setMessageSeverity("success");
                resetForm();
            })
            .catch((error) => {
                setMessageText(
                    "Erro ao enviar dados do Arquivo para o servidor."
                );
                setMessageSeverity("error");
                console.log(error);
            })
            .finally(() => {
                setOpenMessage(true);
            });

    }

    function handleCancelClick() {
        resetForm();
        setOpenMessage(true);
        setMessageText("Cadastrado de arquivo cancelado!");
        setMessageSeverity("warning");
    }

    function resetForm() {
        setDesc("");
        setUpdate(false);
        setArquivo(arquivoInicial);
        setDropzoneLabel(dropzoneLabelInicial);
        setFileUpload([]);
        setResetDropZone(!resetDropZone);
    }


    function handleDeleteClick() {
        axios
            .delete(`/arquivos/${arquivo.id}`)
            .then((res) => {
                setMessageText("Arquivo removido com sucesso!");
                setMessageSeverity("success");
                resetForm();
            })
            .catch((error) => {
                setMessageText("Erro ao remover dados do Arquivo no servidor.");
                setMessageSeverity("error");
                console.log(error);
            })
            .finally(() => {
                setOpenMessage(true);
            });
    }

    return (
        <main style={{padding: "1rem 0"}}>
            <h2>Arquivos</h2>
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

                                <DropzoneArea
                                    ref={dropzoneRef}
                                    key={resetDropZone}
                                    onChange={(files) => setFileUpload(files)}
                                    filesLimit={1}
                                    dropzoneProps={{disabled: update}}
                                    showFileNames
                                    dropzoneText={dropzoneLabel}
                                />

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
                    <div style={{
                        height: height * 0.75, width: "60%", display: "block",
                        marginLeft: "auto",
                        marginRight: "auto"
                    }}>
                        <AgGridReact
                            ref={gridRef}
                            rowData={listaArquivos}
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
                                headerName="ID"
                            />
                            <AgGridColumn
                                field="descricao"
                                headerName="Descrição"
                                cellStyle={{textAlign: "left"}}
                            />
                            <AgGridColumn
                                field="tipo_midia"
                                headerName="Tipo"
                                cellStyle={{textAlign: "left"}}
                            />
                            <AgGridColumn
                                field=""
                                headerName="Download"
                                cellRenderer={DownloadBtn}
                                cellRendererParams={{
                                    openMessage: setOpenMessage,
                                    messageText: setMessageText,
                                    messageSeverity: setMessageSeverity
                                }}
                                openMessage={setOpenMessage}
                                messageText={setMessageText}
                                messageSeverity={setMessageSeverity}
                            />

                        </AgGridReact>
                    </div>

                </Stack>
            </Box>
        </main>
    );
}

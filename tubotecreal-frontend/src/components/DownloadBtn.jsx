import React from 'react';
import {IconButton} from "@mui/material";
import DownloadIcon from '@mui/icons-material/Download';

import axios from "axios";
import fileDownload from 'js-file-download';

export default function DownloadBtn(props) {

    function downloadArquivo() {
        console.log(props);
        axios
            .get(`/arquivos/id/${props.data.id}`, {
                responseType: 'blob',
            })
            .then((res) => {
                fileDownload(res.data, props.data.nome);
                props.messageText("Download em andamento!");
                props.messageSeverity("success");
            }).catch((error) => {
                props.messageText(
                    "Erro ao realizar download do Arquivo."
                );
                props.messageSeverity("error");
                console.log(error);
            })
            .finally(() => {
                props.openMessage(true);
            });

    }

    return (

        <IconButton color="success" component="button" onClick={downloadArquivo}>
            <DownloadIcon/>
        </IconButton>
    );
}
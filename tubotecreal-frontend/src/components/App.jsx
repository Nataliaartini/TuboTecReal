import '../css/App.css';
import MenuLateral from './MenuLateral';
import {Box, CssBaseline} from '@mui/material';

import {Route, Routes,} from "react-router-dom";

import Produtos from './Produtos';
import Funcionarios from './Funcionarios';
import Financeiro from './Financeiro';
import Arquivos from './Arquivos';

import {DrawerHeader} from './DrawerHeader';

import axios from "axios";

axios.defaults.baseURL = process.env.REACT_APP_API_URL;
axios.defaults.headers.common["Content-Type"] =
    "application/json;charset=utf-8";


export default function App() {


    return (
        <div className="App">

            <Box sx={{display: 'flex'}}>
                <CssBaseline/>

                <MenuLateral/>

                <Box component="main" sx={{flexGrow: 1, p: 3}}>
                    <DrawerHeader/>
                    <Routes>
                        <Route path="/" element={<Financeiro/>}/>
                        <Route path="funcionarios" element={<Funcionarios/>}/>
                        <Route path="produtos" element={<Produtos/>}/>
                        <Route path="arquivos" element={<Arquivos/>}/>
                    </Routes>
                </Box>
            </Box>


        </div>
    );
}


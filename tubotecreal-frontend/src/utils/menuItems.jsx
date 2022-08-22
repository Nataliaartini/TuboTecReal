import React from 'react';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import PeopleIcon from '@mui/icons-material/People';
import BarChartIcon from '@mui/icons-material/BarChart';
import LayersIcon from '@mui/icons-material/Layers';

import {Link} from "react-router-dom";

export const mainListItems = (
  <div>
    <ListItem button component={Link} to="/">
      <ListItemIcon>
        <BarChartIcon />
      </ListItemIcon>
      <ListItemText primary="Financeiro" />
    </ListItem>
    <ListItem button component={Link} to="/funcionarios">
      <ListItemIcon>
        <PeopleIcon />
      </ListItemIcon>
      <ListItemText primary="Funcionários" />
    </ListItem>
    <ListItem button component={Link} to="/produtos">
        <ListItemIcon>
          <LayersIcon />
        </ListItemIcon>
        <ListItemText primary="Produtos" >
        </ListItemText>
    </ListItem>

  </div>
);
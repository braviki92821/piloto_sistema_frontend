import React from "react";
import DialogContent from '@material-ui/core/DialogContent';
import Dialog from '@material-ui/core/Dialog';
import { makeStyles } from "@material-ui/core/styles";
import { withStyles } from '@material-ui/core/styles';
import { useDispatch, useSelector} from 'react-redux';
import Checkbox from '@material-ui/core/Checkbox';
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import {
    Table,
    TableBody,
    TableContainer,
    TableRow,
    TableCell,
    TablePagination,
    TableFooter,
    Button,
    TableHead,
    Grid,
    IconButton,
    Typography,
    Snackbar,
    Divider,
    Tooltip,
    Toolbar,
    useTheme, DialogProps
} from "@material-ui/core";
import { Form } from "react-final-form";
import Paper from '@material-ui/core/Paper';
import { HeaderMain } from "./headermain";
import { FooterMain } from "./footermain";
import { TextField } from 'mui-rff';
import { S2Actions } from "../../_actions/s2.action";
import TablePaginationActions from '../Common/TablePaginationActionsProps';
import {alertActions} from "../../_actions/alert.actions";
import CloseIcon from '@material-ui/icons/Close';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Nota from '../Common/Nota';

interface FormDataEsquemaS2 {
  fechaCaptura?: string,
  ejercicioFiscal?: String,
  ramo?: { clave?: number, valor?: string },
  nombres?: String,
  primerApellido?: String,
  segundoApellido?: String,
  genero?: {
      clave: String,
      valor: String
  },
  institucionDependencia?: {
      nombre: String,
      clave: String,
      siglas: String
  },
  puesto?: {
      nombre: String,
      nivel: String
  },
  tipoArea?: [{ clave: string, valor: string }],
  tipoProcedimiento?: [{ clave: string, valor: string }],
  nivelResponsabilidad?: [{ clave: string, valor: string }],
  superiorInmediato?: {
      nombres: String,
      primerApellido: String,
      segundoApellido: String,
      puesto: {
          nombre: String,
          nivel: String
      }
  },
  observaciones?: String
}

export const spic = ({}) => {

  interface FormFiltersEsquemaS2 {
    nombres?: string,
    primerApellido?: string,
    segundoApellido?: string,
    idnombre?: string,
}

const {S2List, alerta, paginationSuper, providerUser} = useSelector(state => ({
  S2List: state.S2,
  alerta: state.alert,
  paginationSuper: state.pagination,
  providerUser: state.providerUser
}));

function resetForm(form) {
  form.reset();
  setQuery({});
  dispatch(S2Actions.requestListS2({page: paginationSuper.page, pageSize: paginationSuper.pageSize}));
}

  const dispatch = useDispatch();
  const [open, setOpen] = React.useState(false);
  const [RegistroId, setRegistroId] = React.useState("");
  const [nombreUsuario, setNombreUsuario] = React.useState("");
  const [selectedCheckBox, setSelectedCheckBox] = React.useState([]);
  const [query, setQuery] = React.useState({});
  const [openModalUserInfo, setOpenModalUserInfo] = React.useState(false);
  const [selectedRegistro, setSelectedRegistro] = React.useState<FormDataEsquemaS2>({});
  const [maxWidth, setMaxWidth] = React.useState<DialogProps['maxWidth']>('md');
  var optionsDate = {year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric'};

  const style = makeStyles((theme) => ({
    gridContainer: {
      paddingRight: ".9375rem",
      paddingLeft: ".9375rem",
      maxWidth: "62.5rem",
      marginLeft: "auto",
      marginRight: "auto",
    },
    displayTop: {
      marginTop: "1rem !important",
    },
    gridX: {
      display: "flex",
      WebkitBoxOrient: "horizontal",
      WebkitBoxDirection: "normal",
      WebkitFlexFlow: "row wrap",
      MsFlexFlow: "row wrap",
      flexFlow: "row wrap",
    },
    fieldset: {
      margin: "1.125rem 0",
      padding: "1.25rem",
      border: "1px solid #cacaca",
    },
    gridMarginx: {
      marginLeft: "-.9375rem",
      marginRight: "-.9375rem",
    },
    buttonColor:{
        backgroundColor: '#B22222',    
        display: 'block',
        width: '100%',
        marginRight: '0',
        marginLeft: '0',
        color:'#FFFAF0'
    },
    indeterminate: {
        color: '#666666'
    },
    tool: {
        color: 'white',
        backgroundColor: '#7f7e7e'
    },
    spacer: {
        flex: "1 1 100%"
    },
    actions: {
        color: theme.palette.text.secondary
    },
    title: {
        flex: "0 0 auto"
    },
    titleDialogDetail: {
        flex: 1,
        color: "#ffff",
    },
    fontblack: {
        color: '#666666'
    },
    titleModal: {
        "padding-top": "13px",
        color: '#585858',
        "font-size": '17px'
    },
    divider: {
        width: '100%',
        backgroundColor: '##b7a426',
        color: '#b7a426',
        margin: '10px'
    },
    boton: {
        marginTop: '16px',
        marginLeft: '16px',
        marginRight: '16px',
        marginBottom: '0px',
        backgroundColor: '#ffe01b',
        color: '#666666'
    },
    boton2: {
        marginTop: '16px',
        marginLeft: '16px',
        marginRight: '-10px',
        marginBottom: '0px',
        backgroundColor: '#ffe01b',
        color: '#666666'
    },
    filterContainer: {
        'padding': '10px 10px 20px 10px',
    },
    gridpadding: {
        'padding-top': '10px',
    },
    gridpaddingBottom: {
        'padding-bottom': '10px',
        'padding-left': '10px'
    },
    titlegridModal: {
        color: '#666666'
    },
    body2: {
        color: '#666666'
    },
    marginright: {
        marginRight: '30px',
        marginTop: '15px',
        backgroundColor: '#ffe01b',
        color: '#666666',
        marginBottom: '30px'
    },
    paper: {
        'text-align': 'center',
        margin: 0,
        marginTop: '-10px',
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[5],

    },
    modal: {
        position: 'absolute',
        top: '10%',
        left: '10%',
        padding: theme.spacing(2, 4, 3),
        overflow: 'scroll',
        height: '100%',
        display: 'block',
        backgroundColor: theme.palette.background.paper
    },
    tableHead: {
        backgroundColor: '#B22222'
    },
    tableHeaderColumn: {
        color: '#ffff'
    },
    whiteStyle: {
        color: '#ffff'
    },
    titulo: {
        fontSize: 15,
        fontWeight: "bold",
        marginBottom: 10,
        textDecoration: "underline",
        textDecorationColor: '#34b3eb',
        color: '#34b3eb',
    },
    toolBarModal: {
        backgroundColor: "#34b3eb"
    },
    subtitulo: {
        fontSize: 15,
        fontWeight: "bold",
        textDecoration: "underline",
        textDecorationColor: '#585858',
        color: '#585858',
        paddingTop: '10px'
    },
    containerDivider: {
        paddingLeft: '15px',
        paddingRight: '15px'
    }
  }));

  const StyledTableCell = withStyles({
    root: {
        color: 'black'
    } })(TableCell);

    function diacriticSensitiveRegex(string = '') {
      string = string.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      return string.replace(/a/g, '[a,á,à,ä]')
          .replace(/e/g, '[e,é,ë]')
          .replace(/i/g, '[i,í,ï]')
          .replace(/o/g, '[o,ó,ö,ò]')
          .replace(/u/g, '[u,ü,ú,ù]')
          .replace(/A/g, '[a,á,à,ä]')
          .replace(/E/g, '[e,é,ë]')
          .replace(/I/g, '[i,í,ï]')
          .replace(/O/g, '[o,ó,ö,ò]')
          .replace(/U/g, '[u,ü,ú,ù]')
  }

    const handleOpenModalUserInfo = (user) => {
    setOpenModalUserInfo(true);
    setSelectedRegistro(user);
    };

const handleCloseModalUserInfo = () => {
    setOpenModalUserInfo(false);
};

const handleClickOpen = (id, nameReg) => {
    setOpen(true);
    setRegistroId(id);
    // setNombreUsuario(name+ " "+ primerApellido+ " "+ segundoApellido);
};

const handleClose = () => {
    setOpen(false);
};

const handleCloseSnackbar = () => {
    dispatch(alertActions.clear());
};

const handleChangePage = (event, newPage) => {
    dispatch(S2Actions.requestListS2({query: query, page: newPage + 1, pageSize: paginationSuper.pageSize}));
};

const handleChangeRowsPerPage = (event) => {
    let newSize = parseInt(event.target.value, 10);
    if (paginationSuper.page * newSize > paginationSuper.totalRows) {
        dispatch(S2Actions.requestListS2({query: query, page: 1, pageSize: parseInt(event.target.value, 10)}));
    } else {
        dispatch(S2Actions.requestListS2({query: query, page: 1, pageSize: parseInt(event.target.value, 10)}));
    }
};


const handleCheckboxClick = (event, id) => {
  event.stopPropagation();
  //console.log("checkbox select");
  // @ts-ignore
  const selectedIndex = selectedCheckBox.indexOf(id);
  let newSelected = [];

  if (selectedIndex === -1) {
      newSelected = newSelected.concat(selectedCheckBox, id);
  } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selectedCheckBox.slice(1));
  } else if (selectedIndex === selectedCheckBox.length - 1) {
      newSelected = newSelected.concat(selectedCheckBox.slice(0, -1));
  } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
          selectedCheckBox.slice(0, selectedIndex),
          selectedCheckBox.slice(selectedIndex + 1)
      );
  }

  setSelectedCheckBox(newSelected);

};

  async function onSubmit(values: FormFiltersEsquemaS2) {
    let newQuery = {};
    for (let [key, value] of Object.entries(values)) {
        if (key === "puestoNombre" && value !== null && value !== '') {
            newQuery["puesto.nombre"] = {$regex: diacriticSensitiveRegex(value), $options: 'i'};
        } else if (key === "idnombre" && value !== null && value !== '') {
            newQuery["institucionDependencia.nombre"] = {$regex: diacriticSensitiveRegex(value), $options: 'i'};
        }  else if (value !== null && value !== '') {
            newQuery[key] = {$regex: diacriticSensitiveRegex(value), $options: 'i'};
        }
    }
    setQuery(newQuery);
    dispatch(S2Actions.requestPublicList({query: newQuery, page: 1, pageSize: paginationSuper.pageSize}));
}

  const classes = style();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <><link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.3.1/dist/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossOrigin="anonymous">
    </link>
      <HeaderMain />
      <div className="container">
        <div className={classes.gridX}>
          <div className={classes.displayTop}>
            <h1>Plataforma Digital Estatal</h1>
            <h2>Sistema II</h2>
            <h4>
              "Servidores públicos que intervengan en procedimientos de
              contrataciones Públicas."
            </h4>
            <Form onSubmit={onSubmit}
            render={({handleSubmit, form, values, submitting}) =>(
               <form onSubmit={handleSubmit}   data-abide="4vfepm-abide"  >
              <fieldset className={classes.fieldset}>
                <legend>Busca un servidor público</legend>
                 <div className="form-row">
                   <div className="form-group col-md-6">
                     <label htmlFor="inputCity">Nombres</label>
                     <TextField type="text" className="form-control" name="nombres" />
                   </div>
                   <div className="form-group col-md-4">
                     <label htmlFor="inputState">Primer apellido</label>
                     <TextField type="text" className="form-control" name="primerApellido" />
                   </div>
                   <div className="form-group col-md-4">
                     <label htmlFor="inputState">Segundo apellido</label>
                     <TextField type="text" className="form-control" name="segundoApellido" />
                   </div>
                   <div className="form-group col-md-4">
                     <label htmlFor="inputZip">Dependencia</label>
                     <TextField type="text" className="form-control" name="idnombre" />
                   </div>
                 </div>
                 <div className="row">
                      <div className="col">
                         <button className={"font-weight-bold "+classes.buttonColor} type="submit" disabled={submitting}>Filtar</button>
                      </div>
                      <div className="col">
                         <button className={"font-weight-bold "+classes.buttonColor} onClick={() => {resetForm(form)}}>Reiniciar</button>
                      </div>
                 </div>
                </fieldset>
               </form>)}
             />   
                         <Dialog fullWidth={true} maxWidth={maxWidth} fullScreen={fullScreen} onClose={handleCloseModalUserInfo}
                    aria-labelledby="customized-dialog-title" open={openModalUserInfo}>
                <Toolbar className={classes.toolBarModal}>
                    <Typography variant="h6" className={classes.titleDialogDetail}>
                        <b>Detalle del registro</b>
                        <Typography className={classes.whiteStyle}>
                            *(DNC) = Dato No Capturado
                        </Typography>
                    </Typography>
                    <IconButton edge="end" color="inherit" onClick={handleCloseModalUserInfo} aria-label="close">
                        <CloseIcon className={classes.whiteStyle}/>
                    </IconButton>
                </Toolbar>
                <DialogContent dividers>
                    <Grid container item md={12} spacing={1}>
                        <Grid item xs={12}>
                            <Typography className={classes.titulo} align={"center"}>
                                Datos generales
                            </Typography>
                        </Grid>
                        <Grid className={classes.gridpadding} item md={3} sm={12}>
                            <Typography className={classes.titlegridModal} align="left" variant="subtitle2">
                                <b>Ejercicio Fiscal</b>
                            </Typography>
                            <Typography className={classes.body2} align="left" variant="body2">
                                {selectedRegistro.ejercicioFiscal ? selectedRegistro.ejercicioFiscal : <Nota/>}
                            </Typography>
                        </Grid>
                        <Grid className={classes.gridpadding} item md={3} sm={12}>
                            <Typography className={classes.titlegridModal} align="left" variant="subtitle2">
                                <b>Fecha última actualización</b>
                            </Typography>
                            <Typography className={classes.body2} align="left" variant="body2">
                                {//@ts-ignore
                                    new Date(selectedRegistro.fechaCaptura).toLocaleDateString("es-ES", optionsDate)}
                            </Typography>
                        </Grid>

                        <Grid className={classes.gridpadding} item md={3} sm={12}>
                            <Typography className={classes.titlegridModal} align="left" variant="subtitle2">
                                <b>Nombre(s)</b>
                            </Typography>
                            <Typography className={classes.body2} align="left" variant="body2">
                                {selectedRegistro.nombres}
                            </Typography>

                        </Grid>
                        <Grid className={classes.gridpadding} item md={3} sm={12}>
                            <Typography className={classes.titlegridModal} align="left" variant="subtitle2">
                                <b>Primer apellido</b>
                            </Typography>
                            <Typography className={classes.body2} align="left" variant="body2">
                                {selectedRegistro.primerApellido}
                            </Typography>

                        </Grid>
                        <Grid className={classes.gridpadding} item md={3} sm={12}>
                            <Typography className={classes.titlegridModal} align="left" variant="subtitle2">
                                <b>Segundo apellido</b>
                            </Typography>
                            <Typography className={classes.body2} align="left" variant="body2">
                                {selectedRegistro.segundoApellido ? selectedRegistro.segundoApellido : <Nota/>}
                            </Typography>
                        </Grid>

                        <Grid className={classes.gridpadding} item md={3} sm={12}>
                            <Typography className={classes.titlegridModal} align="left" variant="subtitle2">
                                <b>Género</b>
                            </Typography>
                            <Typography className={classes.body2} align="left" variant="body2">
                                {selectedRegistro.genero ? selectedRegistro.genero.valor : <Nota/>}
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography className={classes.subtitulo} align={"left"}>
                                Institución / Dependencia
                            </Typography>
                        </Grid>
                        <Grid className={classes.gridpadding} item md={3} sm={12}>
                            <Typography className={classes.titlegridModal} align="left" variant="subtitle2">
                                <b>Clave</b>
                            </Typography>
                            <Typography className={classes.body2} align="left" variant="body2">
                                {selectedRegistro.institucionDependencia?.clave ? selectedRegistro.institucionDependencia.clave :
                                    <Nota/>}
                            </Typography>
                        </Grid>
                        <Grid className={classes.gridpadding} item md={3} sm={12}>
                            <Typography className={classes.titlegridModal} align="left" variant="subtitle2">
                                <b>Siglas</b>
                            </Typography>
                            <Typography className={classes.body2} align="left" variant="body2">
                                {selectedRegistro.institucionDependencia?.siglas ? selectedRegistro.institucionDependencia.siglas :
                                    <Nota/>}
                            </Typography>
                        </Grid>
                        <Grid className={classes.gridpadding} item md={6} sm={12}>
                            <Typography className={classes.titlegridModal} align="left" variant="subtitle2">
                                <b>Nombre</b>
                            </Typography>
                            <Typography className={classes.body2} align="left" variant="body2">
                                {selectedRegistro.institucionDependencia?.nombre}
                            </Typography>
                        </Grid>
                        <Grid item xs={12} className={classes.containerDivider}>
                            <Divider orientation="horizontal" className={classes.divider} variant={'inset'}
                                     light={true}/>
                        </Grid>
                        <Grid className={classes.gridpadding} item md={6} sm={12}>
                            <Typography className={classes.titlegridModal} align="left" variant="subtitle2">
                                <b>Puesto</b>
                            </Typography>
                            <Typography className={classes.body2} align="left" variant="body2">
                                {selectedRegistro.puesto?.nombre ? selectedRegistro.puesto.nombre : <Nota/>}
                            </Typography>
                        </Grid>
                        <Grid className={classes.gridpadding} item md={3} sm={12}>
                            <Typography className={classes.titlegridModal} align="left" variant="subtitle2">
                                <b>Nivel</b>
                            </Typography>
                            <Typography className={classes.body2} align="left" variant="body2">
                                {selectedRegistro.puesto?.nivel ? selectedRegistro.puesto.nivel : <Nota/>}
                            </Typography>
                        </Grid>
                        <Grid item xs={12} className={classes.containerDivider}>
                            <Divider orientation="horizontal" className={classes.divider} variant={'inset'}
                                     light={true}/>
                        </Grid>
                        <Grid className={classes.gridpadding} item md={12} sm={12}>
                            <Typography className={classes.titlegridModal} align="left" variant="subtitle2">
                                <b>Observaciones</b>
                            </Typography>
                            <Typography className={classes.body2} align="left" variant="body2">
                                {selectedRegistro.observaciones? selectedRegistro.observaciones: <Nota/>}
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography className={classes.titulo} align={"center"}>
                                Procedimientos
                            </Typography>
                        </Grid>
                        <Grid item md={6} sm={12}>
                            <Typography className={classes.titlegridModal} variant="subtitle2" align="left">
                                <b>Tipo de área</b>
                            </Typography>
                            <Typography className={classes.body2} align="left" variant="body2">
                                {selectedRegistro.tipoArea ? selectedRegistro.tipoArea.map(e => (
                                    <li>{e.valor}</li>
                                )) : <Nota/>}
                            </Typography>
                        </Grid>
                        <Grid item md={6} sm={12}>
                            <Typography className={classes.titlegridModal} variant="subtitle2" align="left">
                                <b>Tipo de procedimiento</b>
                            </Typography>
                            <Typography className={classes.body2} align="left" variant="body2">
                                {selectedRegistro.tipoProcedimiento ? selectedRegistro.tipoProcedimiento.map(e => (
                                    <li>{e.valor}</li>
                                )) : <Nota/>}
                            </Typography>
                        </Grid>


                        <Grid item md={6} sm={12}>
                            <Typography className={classes.titlegridModal} variant="subtitle2" align="left">
                                <b>Nivel de responsabilidad</b>
                            </Typography>
                            <Typography className={classes.body2} align="left" variant="body2">
                                {selectedRegistro.nivelResponsabilidad ? selectedRegistro.nivelResponsabilidad.map(e => (
                                    <li>{e.valor}</li>
                                )) : <Nota/>}
                            </Typography>
                        </Grid>
                        <Grid className={classes.gridpadding} item md={6} sm={12}>
                            <Typography className={classes.titlegridModal} align="left" variant="subtitle2">
                                <b>Ramo</b>
                            </Typography>
                            <Typography className={classes.body2} align="left" variant="body2">
                                {selectedRegistro.ramo ? selectedRegistro.ramo.valor + '(' + selectedRegistro.ramo.clave + ')' :
                                    <Nota/>}
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography className={classes.titulo} align={"center"}>
                                Superior inmediato
                            </Typography>
                        </Grid>
                        <Grid className={classes.gridpadding} item md={3} sm={12}>
                            <Typography className={classes.titlegridModal} align="left" variant="subtitle2">
                                <b>Nombre(s)</b>
                            </Typography>
                            <Typography className={classes.body2} align="left" variant="body2">
                                {selectedRegistro.superiorInmediato?.nombres ? selectedRegistro.superiorInmediato.nombres :
                                    <Nota/>}
                            </Typography>
                        </Grid>

                        <Grid className={classes.gridpadding} item md={3} sm={12}>
                            <Typography className={classes.titlegridModal} align="left" variant="subtitle2">
                                <b>Primer Apellido</b>
                            </Typography>
                            <Typography className={classes.body2} align="left" variant="body2">
                                {selectedRegistro.superiorInmediato?.primerApellido ? selectedRegistro.superiorInmediato.primerApellido :
                                    <Nota/>}
                            </Typography>
                        </Grid>
                        <Grid className={classes.gridpadding} item md={3} sm={12}>
                            <Typography className={classes.titlegridModal} align="left" variant="subtitle2">
                                <b>Segundo apellido</b>
                            </Typography>
                            <Typography className={classes.body2} align="left" variant="body2">
                                {selectedRegistro.superiorInmediato?.segundoApellido ? selectedRegistro.superiorInmediato.segundoApellido :
                                    <Nota/>}
                            </Typography>
                        </Grid>

                        <Grid className={classes.gridpadding} item md={3} sm={12}>
                            <Typography className={classes.titlegridModal} align="left" variant="subtitle2">
                                <b>Puesto</b>
                            </Typography>
                            <Typography className={classes.body2} align="left" variant="body2">
                                {selectedRegistro.superiorInmediato?.puesto?.nombre ? selectedRegistro.superiorInmediato.puesto.nombre  :
                                    <Nota/>}
                            </Typography>
                        </Grid>
                        <Grid className={classes.gridpadding} item md={3} sm={12}>
                            <Typography className={classes.titlegridModal} align="left" variant="subtitle2">
                                <b>Nivel</b>
                            </Typography>
                            <Typography className={classes.body2} align="left" variant="body2">
                                {selectedRegistro.superiorInmediato?.puesto?.nivel ? selectedRegistro.superiorInmediato.puesto.nivel :
                                    <Nota/>}
                            </Typography>
                        </Grid>
                    </Grid>
                </DialogContent>
            </Dialog>
            <h2>Resultados de busqueda</h2>
            <TableContainer component={Paper}>
                    <Table aria-label="custom pagination table" id='Tablexd' >
                        <TableHead className={classes.tableHead}>
                            <TableRow>
                                <StyledTableCell align="center" className={classes.tableHeaderColumn}><b>Ejercicio
                                    fiscal</b></StyledTableCell>
                                <StyledTableCell align="center" className={classes.tableHeaderColumn}><b>Servidor
                                    público</b></StyledTableCell>
                                <StyledTableCell align="center" className={classes.tableHeaderColumn}><b>Institución</b></StyledTableCell>
                                <StyledTableCell align="center"
                                                 className={classes.tableHeaderColumn}><b>Puesto</b></StyledTableCell>
                                <StyledTableCell align="center"
                                                 className={classes.tableHeaderColumn}><b>Acciones</b></StyledTableCell>
                            </TableRow>
                        </TableHead>
                        {S2List.map((schema) => (

                            <TableBody >

                                <TableRow key={schema._id}>
                                    <StyledTableCell style={{width: 140}} align="center">
                                        {schema.ejercicioFiscal}
                                    </StyledTableCell>
                                    <StyledTableCell style={{width: 160}} align="center">
                                        {schema.nombres && schema.nombres + " "}
                                        {schema.primerApellido && schema.primerApellido + " "}
                                        {schema.segundoApellido && schema.segundoApellido}
                                    </StyledTableCell>
                                    {schema.institucionDependencia &&
                                    <StyledTableCell style={{width: 160}} align="center">
                                        {schema.institucionDependencia.nombre}
                                    </StyledTableCell>
                                    }
                                    {schema.puesto &&
                                    <StyledTableCell style={{width: 160}} align="center">
                                        {schema.puesto.nombre}
                                    </StyledTableCell>
                                    }

                                    <StyledTableCell style={{width: 260}} align="center">
                                        <Tooltip title="Más información" placement="left">
                                            <Button style={{padding: '0px'}}
                                                    onClick={() => handleOpenModalUserInfo(schema)}>
                                                <IconButton style={{color: "#34b3eb"}} aria-label="expand row"
                                                            size="small">
                                                    <KeyboardArrowDownIcon/>
                                                </IconButton>

                                            </Button>
                                        </Tooltip>
                                    </StyledTableCell>
                                </TableRow>

                            </TableBody>
                        ))}

                        <TableFooter>
                            <TableRow>
                                {paginationSuper.pageSize != undefined && paginationSuper.page != undefined &&
                                <TablePagination
                                    rowsPerPageOptions={[3, 5, 10, 25, {
                                        label: 'Todos',
                                        value: paginationSuper.totalRows
                                    }]}
                                    colSpan={6}
                                    count={paginationSuper.totalRows}
                                    rowsPerPage={paginationSuper.pageSize}
                                    page={paginationSuper.page - 1}
                                    SelectProps={{
                                        inputProps: {'aria-label': 'Registros por página'},
                                        native: true,
                                    }}
                                    onChangePage={handleChangePage}
                                    onChangeRowsPerPage={handleChangeRowsPerPage}
                                    ActionsComponent={TablePaginationActions}
                                />}
                            </TableRow>
                        </TableFooter>
                    </Table>
            </TableContainer>
          </div>
        </div>
      </div>
      <FooterMain />
    </>
  );
};

export const Spic = spic;

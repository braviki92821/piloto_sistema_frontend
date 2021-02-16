import React from 'react';
import Paper from '@material-ui/core/Paper';
import { useDispatch, useSelector} from 'react-redux';
import {
    Table,
    TableBody,
    TableContainer,
    TableRow,
    TableCell,
    TablePagination,
    TableFooter,
    makeStyles, Button, TableHead, ButtonGroup, Grid, IconButton, Modal, Typography, Snackbar, Divider, Tooltip
} from "@material-ui/core";
import { Checkboxes ,TextField,  makeValidate,makeRequired, Select, Switches} from 'mui-rff';
import TablePaginationActions from "@material-ui/core/TablePagination/TablePaginationActions";
import PropTypes from "prop-types";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import AddBoxIcon from '@material-ui/icons/AddBox';
import {Alert} from "@material-ui/lab";
import {createStyles, Theme, withStyles} from '@material-ui/core/styles';
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import {alertActions} from "../../_actions/alert.actions";
import {history} from "../../store/history";
import {S2Actions} from "../../_actions/s2.action";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import DeleteOutlineOutlinedIcon from "@material-ui/icons/DeleteOutlineOutlined";
import {Form} from "react-final-form";
import * as Yup from 'yup';

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
    tipoArea?: [{clave : string, valor : string}],
    tipoProcedimiento?: [{clave : string, valor : string}],
    nivelResponsabilidad?: [{clave : string, valor : string}],
    superiorInmediato?: {
        nombres: String,
        primerApellido: String,
        segundoApellido: String,
        curp: String,
        rfc: String,
        puesto: {
            nombre: String,
            nivel: String
        }
    }
}

export const ListS2Schema = () => {
    const {S2List,alerta,paginationSuper} = useSelector(state => ({
        S2List : state.S2,
        alerta : state.alert,
        paginationSuper: state.pagination
    }));

    const dispatch = useDispatch();
    const [open, setOpen] = React.useState(false);
    const [RegistroId, setRegistroId] = React.useState("");
    const [nombreUsuario, setNombreUsuario] =  React.useState("");
    const [query, setQuery] =  React.useState({});
    const [openModalUserInfo, setOpenModalUserInfo] = React.useState(false);
    const [selectedRegistro, setSelectedRegistro] = React.useState<FormDataEsquemaS2>({});
    const sistemas = {S2: "Sistema de Servidores Públicos que Intervienen en Procedimientos de Contratación", S3S : "Sistema de los Servidores Públicos Sancionados", S3P : "Sistema de los Particulares Sancionados"}

    const handleOpenModalUserInfo = (user) => {
        setOpenModalUserInfo(true);
        setSelectedRegistro(user);
    };

    const handleCloseModalUserInfo = () => {
        setOpenModalUserInfo(false);
    };

    const handleClickOpen = (id ,nameReg) => {
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
        dispatch(S2Actions.requestListS2({query: query, page : newPage +1  ,pageSize: paginationSuper.pageSize}));
    };

    const handleChangeRowsPerPage = (event) => {
        let newSize= parseInt(event.target.value, 10);
        if(paginationSuper.page * newSize > paginationSuper.totalRows){
            dispatch(S2Actions.requestListS2({query: query, page: 1 , pageSize: parseInt(event.target.value, 10) }));
        }else{
            dispatch(S2Actions.requestListS2({query: query, page:  paginationSuper.page , pageSize: parseInt(event.target.value, 10) }));
        }
    };

    const confirmAction = (id) => {
        dispatch(S2Actions.deleteRecordRequest(id));
        paginationSuper.totalRows= paginationSuper.totalRows-1;

        if(S2List.length <= 1 ){
            if(paginationSuper.page -1 > 0 ){
                dispatch(S2Actions.requestListS2({query: query, page:  paginationSuper.page -1 , pageSize: paginationSuper.pageSize}));
            }else{
                dispatch(S2Actions.requestListS2({query: query, page: 1 , pageSize: paginationSuper.pageSize }));
            }

        }
        handleClose();
    }


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

    interface FormFiltersEsquemaS2 {
        ejercicioFiscal: string,
        nombres?: string,
        primerApellido?: string,
        segundoApellido?: string,
        idnombre?: string,
        puestoNombre?: string,
    }

    const schema = Yup.object().shape({
        ejercicioFiscal: Yup.string().matches(new RegExp('^[0-9]{4}$'),'Debe tener 4 dígitos'),
        nombres : Yup.string().matches(new RegExp("^['A-zÀ-ú-\. ]{1,25}$"),'no se permiten números, ni cadenas vacias ' ).trim(),
        primerApellido : Yup.string().matches(new RegExp("^['A-zÀ-ú-\. ]{1,25}$"),'no se permiten números, ni cadenas vacias ' ).trim(),
        segundoApellido :Yup.string().matches(new RegExp("^['A-zÀ-ú-\. ]{1,25}$"),'no se permiten números, ni cadenas vacias ' ).trim(),
        idnombre:Yup.string().matches(new RegExp('^[A-zÀ-ú-0-9_\.\' ]{1,50}$'),'no se permiten cadenas vacias , max 50 caracteres ').trim(),
        puestoNombre: Yup.string().matches(new RegExp("^['A-zÀ-ú-\. ]{1,25}$"),'no se permiten números, ni cadenas vacias ' ).trim()
    });

    const validate = makeValidate(schema);
    const required = makeRequired(schema);

    // yes, this can even be async!
    async function onSubmit(values: FormFiltersEsquemaS2) {
        let newQuery = {};
        for (let [key, value] of Object.entries(values)) {
            if(key === "puestoNombre" && value !== null && value !== ''){
                newQuery["puesto.nombre"] = { $regex : diacriticSensitiveRegex(value),  $options : 'i'};
            }else if(key === "idnombre" && value !== null && value !== ''){
                newQuery["institucionDependencia.nombre"] = { $regex : diacriticSensitiveRegex(value),  $options : 'i'};
            }else if ( value !== null && value !== ''){
                newQuery[key]= { $regex : diacriticSensitiveRegex(value),  $options : 'i'};
            }
        }
        setQuery(newQuery);
        dispatch(S2Actions.requestListS2({query : newQuery, page: 1 , pageSize: paginationSuper.pageSize }));
    }

    function resetForm (form){
        form.reset();
        setQuery({});
        dispatch(S2Actions.requestListS2({page: paginationSuper.page , pageSize: paginationSuper.pageSize }));
    }

    const StyledTableCell = withStyles({
        root: {
            color: '#666666'
        }
    })(TableCell);

    const redirectToRoute = (path) =>{
        history.push(path);
    }

    TablePaginationActions.propTypes = {
        count: PropTypes.number.isRequired,
        onChangePage: PropTypes.func.isRequired,
        page: PropTypes.number.isRequired,
        rowsPerPage: PropTypes.number.isRequired
    };

    const useStyles = makeStyles((theme: Theme) =>
        createStyles({
            fontblack:{
                color: '#666666'
            },
            titleModal:{
                "padding-top": "13px",
                color: '#585858',
                "font-size" : '17px'
            },
            divider: {
                width: '100%',
                backgroundColor:'#ffe01b',
                color: '#666666'
            },
            boton:{
                backgroundColor:'#ffe01b',
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
                color: '#585858'
            },
            body2:{
                color: '#666666'
            },
            marginright:{
                marginRight: '30px',
                marginTop: '15px',
                backgroundColor:'#ffe01b',
                color: '#666666',
                marginBottom: '30px'
            },
            paper: {
                'text-align': 'center',
                margin: 0,
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                backgroundColor: theme.palette.background.paper,
                boxShadow: theme.shadows[5],
                padding: theme.spacing(2, 4, 3),
            },
        }),
    );

    const classes = useStyles();

    return (

        <div >
            <Snackbar anchorOrigin={ { vertical: 'top', horizontal: 'center' }}  open={alerta.status} autoHideDuration={3000} onClose={handleCloseSnackbar}>
                <Alert onClose={handleCloseSnackbar} severity={alerta.type}>
                    {alerta.message}
                </Alert>
            </Snackbar>


            <Modal
                open={openModalUserInfo}
                onClose={handleCloseModalUserInfo}
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
            >
                <Grid container item md={8} className={classes.paper}>
                    <Grid container>
                        <Grid className={classes.gridpadding} item md={3} sm={12}>
                            <Typography className={classes.titlegridModal} align="left" variant="subtitle2">
                                Fecha Captura
                             </Typography>
                            <Typography className={classes.body2} align="left" variant="body2">
                                {selectedRegistro.fechaCaptura}
                            </Typography>

                        </Grid>
                        <Grid className={classes.gridpadding} item md={3} sm={12}>
                            <Typography  className={classes.titlegridModal} align="left" variant="subtitle2">
                               Nombres
                            </Typography>
                            <Typography className={classes.body2} align="left" variant="body2">
                                {selectedRegistro.nombres}
                            </Typography>

                        </Grid>
                        <Grid className={classes.gridpadding} item md={3} sm={12}>
                            <Typography  className={classes.titlegridModal} align="left" variant="subtitle2">
                                Primer apellido
                            </Typography>
                            <Typography className={classes.body2} align="left" variant="body2">
                                {selectedRegistro.primerApellido}
                            </Typography>

                        </Grid>
                        <Grid className={classes.gridpadding} item md={3} sm={12}>
                            <Typography  className={classes.titlegridModal} align="left" variant="subtitle2">
                                Segundo apellido
                            </Typography>
                            <Typography className={classes.body2} align="left" variant="body2">
                                {selectedRegistro.segundoApellido}
                            </Typography>
                        </Grid>
                        <Grid className={classes.gridpadding} item md={3} sm={12}>
                            <Typography  className={classes.titlegridModal} align="left" variant="subtitle2">
                                Ejercicio Fiscal
                            </Typography>
                            <Typography className={classes.body2} align="left" variant="body2">
                                {selectedRegistro.ejercicioFiscal}
                            </Typography>
                        </Grid>
                        <Grid className={classes.gridpadding} item md={3} sm={12}>
                            <Typography  className={classes.titlegridModal} align="left" variant="subtitle2">
                               Género
                            </Typography>
                            <Typography className={classes.body2}  align="left" variant="body2">
                                {selectedRegistro.genero?.valor}
                            </Typography>
                        </Grid>
                    </Grid>

                    <Grid container justify={"center"} item md={12}>
                        <Typography className={classes.titleModal} variant="h6"  align="center">
                            Tipo de área
                        </Typography>
                        <Divider orientation="horizontal"  className={classes.divider} />
                    </Grid>
                    {selectedRegistro.tipoArea?.map((area) => (
                        <Grid container>
                            <Grid className={classes.gridpadding} item md={3} sm={12}>
                                <Typography  className={classes.titlegridModal} align="left" variant="subtitle2">
                                    Clave
                                </Typography>
                                <Typography className={classes.body2} align="left" variant="body2">
                                    {area?.clave}
                                </Typography>
                            </Grid>
                            <Grid className={classes.gridpadding} item md={3} sm={12}>
                                <Typography  className={classes.titlegridModal} align="left" variant="subtitle2">
                                    Valor
                                </Typography>
                                <Typography className={classes.body2} align="left" variant="body2">
                                    {area?.valor}
                                </Typography>
                            </Grid>
                        </Grid>
                    ))}

                    <Grid container justify={"center"} item md={12}>
                        <Typography  className={classes.titleModal} variant="h6"  align="center">
                            Tipo de procedimiento
                        </Typography>
                        <Divider orientation="horizontal"  className={classes.divider} />
                    </Grid>
                    {selectedRegistro.tipoProcedimiento?.map((area) => (
                        <Grid container>
                            <Grid className={classes.gridpadding} item md={3} sm={12}>
                                <Typography  className={classes.titlegridModal} align="left" variant="subtitle2">
                                    Clave
                                </Typography>
                                <Typography className={classes.body2} align="left" variant="body2">
                                    {area?.clave}
                                </Typography>
                            </Grid>
                            <Grid className={classes.gridpadding} item md={3} sm={12}>
                                <Typography  className={classes.titlegridModal} align="left" variant="subtitle2">
                                    Valor
                                </Typography>
                                <Typography className={classes.body2} align="left" variant="body2">
                                    {area?.valor}
                                </Typography>
                            </Grid>
                        </Grid>
                    ))}

                    <Grid container justify={"center"} item md={12}>
                        <Typography  className={classes.titleModal} variant="h6"  align="center">
                            Nivel de responsabilidad
                        </Typography>
                        <Divider orientation="horizontal"  className={classes.divider} />
                    </Grid>
                    {selectedRegistro.nivelResponsabilidad?.map((area) => (
                        <Grid container>
                            <Grid className={classes.gridpadding} item md={3} sm={12}>
                                <Typography  className={classes.titlegridModal} align="left" variant="subtitle2">
                                    Clave
                                </Typography>
                                <Typography className={classes.body2} align="left" variant="body2">
                                    {area?.clave}
                                </Typography>
                            </Grid>
                            <Grid className={classes.gridpadding} item md={3} sm={12}>
                                <Typography  className={classes.titlegridModal} align="left" variant="subtitle2">
                                    Valor
                                </Typography>
                                <Typography className={classes.body2} align="left" variant="body2">
                                    {area?.valor}
                                </Typography>
                            </Grid>
                        </Grid>
                    ))}

                    <Grid container justify={"center"} item md={12}>
                        <Typography  className={classes.titleModal} variant="h6"  align="center">
                            Ramo
                        </Typography>
                        <Divider orientation="horizontal"  className={classes.divider} />
                    </Grid>
                    <Grid container>
                        <Grid className={classes.gridpadding} item md={3} sm={12}>
                            <Typography  className={classes.titlegridModal} align="left" variant="subtitle2">
                                Clave
                            </Typography>
                            <Typography className={classes.body2} align="left" variant="body2">
                                {selectedRegistro.ramo?.clave}
                            </Typography>
                        </Grid>
                        <Grid className={classes.gridpadding} item md={3} sm={12}>
                            <Typography  className={classes.titlegridModal} align="left" variant="subtitle2">
                                Valor
                            </Typography>
                            <Typography className={classes.body2} align="left" variant="body2">
                                {selectedRegistro.ramo?.valor}
                            </Typography>

                        </Grid>
                    </Grid>

                    <Grid container justify={"center"} item md={12}>
                        <Typography  className={classes.titleModal} variant="h6"  align="center">
                            Institución dependencia
                        </Typography>
                        <Divider orientation="horizontal"  className={classes.divider} />
                    </Grid>
                    {selectedRegistro.institucionDependencia &&
                    <Grid container>
                        <Grid className={classes.gridpadding} item md={3} sm={12}>
                            <Typography  className={classes.titlegridModal} align="left" variant="subtitle2">
                                Nombre
                            </Typography>
                            <Typography className={classes.body2} align="left" variant="body2">
                                {selectedRegistro.institucionDependencia?.nombre}
                            </Typography>
                        </Grid>
                        <Grid className={classes.gridpadding} item md={3} sm={12}>
                            <Typography  className={classes.titlegridModal} align="left" variant="subtitle2">
                                Clave
                            </Typography>
                            <Typography className={classes.body2} align="left" variant="body2">
                                {selectedRegistro.institucionDependencia?.clave}
                            </Typography>
                        </Grid>
                        <Grid className={classes.gridpadding} item md={3} sm={12}>
                            <Typography  className={classes.titlegridModal} align="left" variant="subtitle2">
                                Siglas
                            </Typography>
                            <Typography className={classes.body2} align="left" variant="body2">
                                {selectedRegistro.institucionDependencia?.siglas}
                            </Typography>
                        </Grid>
                    </Grid>
                    }

                    <Grid container justify={"center"} item md={12}>
                        <Typography  className={classes.titleModal} variant="h6"  align="center">
                            Puesto
                        </Typography>
                        <Divider orientation="horizontal"  className={classes.divider} />
                    </Grid>
                    <Grid container>
                        <Grid className={classes.gridpadding} item md={3} sm={12}>
                            <Typography  className={classes.titlegridModal} align="left" variant="subtitle2">
                                Nombre
                            </Typography>
                            <Typography className={classes.body2} align="left" variant="body2">
                                {selectedRegistro.puesto?.nombre}
                            </Typography>
                        </Grid>
                        <Grid className={classes.gridpadding} item md={3} sm={12}>
                            <Typography  className={classes.titlegridModal} align="left" variant="subtitle2">
                                Nivel
                            </Typography>
                            <Typography className={classes.body2} align="left" variant="body2">
                                {selectedRegistro.puesto?.nivel}
                            </Typography>
                        </Grid>
                    </Grid>

                    <Grid container justify={"center"} item md={12}>
                        <Typography   className={classes.titleModal} variant="h6"  align="center">
                            Superior inmediato
                        </Typography>
                        <Divider orientation="horizontal"  className={classes.divider} />
                    </Grid>
                    <Grid container>
                        <Grid className={classes.gridpadding} item md={3} sm={12}>
                            <Typography  className={classes.titlegridModal} align="left" variant="subtitle2">
                                Nombres
                            </Typography>
                            {selectedRegistro.superiorInmediato?.nombres &&
                            <Typography className={classes.body2} align="left" variant="body2">
                                {selectedRegistro.superiorInmediato?.nombres}
                            </Typography>}

                        </Grid>

                        <Grid className={classes.gridpadding} item md={3} sm={12}>
                            <Typography  className={classes.titlegridModal} align="left" variant="subtitle2">
                                Primer Apellido
                            </Typography>
                            {selectedRegistro.superiorInmediato?.primerApellido &&
                            <Typography className={classes.body2} align="left" variant="body2">
                                {selectedRegistro.superiorInmediato?.primerApellido}
                            </Typography>
                            }
                        </Grid>
                        <Grid className={classes.gridpadding} item md={3} sm={12}>
                            <Typography  className={classes.titlegridModal} align="left" variant="subtitle2">
                                Segundo apellido
                            </Typography>
                            {selectedRegistro.superiorInmediato?.segundoApellido &&
                            <Typography className={classes.body2} align="left" variant="body2">
                                {selectedRegistro.superiorInmediato?.segundoApellido}
                            </Typography>
                            }
                        </Grid>

                        <Grid className={classes.gridpadding} item md={3} sm={12}>
                            <Typography  className={classes.titlegridModal} align="left" variant="subtitle2">
                                Puesto nombre
                            </Typography>
                            {selectedRegistro.superiorInmediato?.puesto && selectedRegistro.superiorInmediato?.puesto.nombre &&
                            <Typography className={classes.body2} align="left" variant="body2">
                                {selectedRegistro.superiorInmediato?.puesto.nombre}
                            </Typography>
                            }
                        </Grid>
                         <Grid className={classes.gridpadding} item md={3} sm={12}>
                            <Typography  className={classes.titlegridModal} align="left" variant="subtitle2">
                            Puesto nivel
                            </Typography>
                        {selectedRegistro.superiorInmediato?.puesto && selectedRegistro.superiorInmediato?.puesto.nivel &&
                            <Typography className={classes.body2} align="left" variant="body2">
                        {selectedRegistro.superiorInmediato?.puesto.nivel}
                            </Typography>
                        }
                        </Grid>

                    </Grid>
                </Grid>
            </Modal>

            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"¿Seguro que desea eliminar el Registro "+ nombreUsuario+"?"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Los cambios no seran reversibles
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancelar
                    </Button>
                    <Button onClick={()=> {confirmAction(RegistroId)}} color="primary" autoFocus>
                        Aceptar
                    </Button>
                </DialogActions>
            </Dialog>

            <Grid container>
                <Grid container justify={"center"}>
                    <Typography  variant="h6" className={classes.fontblack}>
                        Sistema de Servidores Públicos que Intervienen en Procedimientos de Contratación
                    </Typography>
                </Grid>
                <Grid container className={classes.filterContainer} >
                    <Form
                        onSubmit={onSubmit}
                        validate={validate}
                        render={({handleSubmit, form,  values, submitting}) => (
                            <form onSubmit={handleSubmit} noValidate>
                                {alerta.status === undefined &&
                                <div>
                                    <Grid className= {classes.gridpadding} container justify={"flex-start"}>
                                        <Typography  variant="h6" className={classes.fontblack}>
                                            Búsqueda
                                        </Typography>
                                    </Grid>

                                    <Grid className= {classes.gridpadding} spacing={3} container >
                                        <Grid item xs={12} md={3}>
                                            <TextField label="Nombres" name="nombres"  />
                                        </Grid>
                                        <Grid item xs={12} md={3}>
                                            <TextField label="Primer apellido" name="primerApellido"  />
                                        </Grid>
                                        <Grid item xs={12} md={3}>
                                            <TextField label="Segundo apellido" name="segundoApellido" />
                                        </Grid>
                                        <Grid item xs={12} md={3}>
                                            <TextField label="Institución dependencia" name="idnombre" />
                                        </Grid>
                                        <Grid item xs={12} md={3}>
                                            <TextField label="Puesto" name="puestoNombre" />
                                        </Grid>
                                        <Grid item xs={12} md={3}>
                                            <TextField label="Ejercicio fiscal"  name="ejercicioFiscal"  />
                                        </Grid>
                                    </Grid>
                                    <Grid container justify={"flex-end"}>
                                        <Button style={{margin: "0px 8px 0px 0px"}} className={classes.boton}  variant="contained"
                                                 onClick={()=> {resetForm(form)}}> LIMPIAR </Button>
                                        <Button  className={classes.boton}  variant="contained"
                                                 type="submit"
                                                 disabled={submitting}> BUSCAR </Button>
                                    </Grid>


                                </div>
                                }
                            </form>
                        )}
                    />
                </Grid>

                <Grid className= {`${classes.gridpadding} ${classes.gridpaddingBottom} `} container justify={"flex-start"}>
                    <Typography  variant="h6" className={classes.fontblack}>
                        Resultados
                    </Typography>
                </Grid>
                <TableContainer  component={Paper}>
                    <Table aria-label="custom pagination table">
                        <TableHead >
                            <TableRow>
                                <StyledTableCell align="center" >Ejercicio fiscal</StyledTableCell>
                                <StyledTableCell align="center" >Nombres</StyledTableCell>
                                <StyledTableCell align="center">Primer apellido</StyledTableCell>
                                <StyledTableCell align="center">Segundo apellido</StyledTableCell>
                                <StyledTableCell align="center">Institución</StyledTableCell>
                                <StyledTableCell align="center">Puesto</StyledTableCell>
                                <StyledTableCell align="center">Acciones</StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody key="usuarios">
                            {S2List.map((schema)  => (
                                <TableRow key={schema._id}>
                                    <StyledTableCell style={{ width: 140 }}  align="center">
                                        {schema.ejercicioFiscal}
                                    </StyledTableCell>
                                    <StyledTableCell style={{ width: 160 }}  align="center">
                                        {schema.nombres}
                                    </StyledTableCell>
                                    <StyledTableCell style={{ width: 160 }} align="center">
                                        {schema.primerApellido}
                                    </StyledTableCell>
                                    <StyledTableCell style={{ width: 160 }} align="center">
                                        {schema.segundoApellido}
                                    </StyledTableCell>
                                    {schema.institucionDependencia &&
                                    <StyledTableCell style={{ width: 160 }} align="center">
                                        {schema.institucionDependencia.nombre}
                                    </StyledTableCell>
                                    }
                                    {schema.puesto &&
                                    <StyledTableCell style={{ width: 160 }} align="center">
                                        {schema.puesto.nombre}
                                    </StyledTableCell>
                                    }

                                    <StyledTableCell style={{ width: 230 }} align="center">
                                        <Button  style= {{padding: '0px' }}  onClick={() => handleOpenModalUserInfo(schema)}>
                                            <Tooltip title="Más información" placement="left">
                                                <IconButton aria-label="expand row" size="small" >
                                                    <KeyboardArrowDownIcon />
                                                </IconButton>
                                            </Tooltip>
                                        </Button>
                                        <Button  style= {{padding: '0px' }} onClick={ () => redirectToRoute(`/editar/S2/${schema._id}`)} >
                                            <Tooltip title="Editar registro" placement="top">
                                                <Button   style={{ color: 'gray'}} ><EditOutlinedIcon/></Button>
                                            </Tooltip>
                                        </Button>
                                        <Tooltip title="Eliminar registro" placement="right">
                                            <Button style={{ color: 'gray', padding: '0px' }}
                                                    onClick= {()=> {handleClickOpen(schema._id, "nomre")}} >
                                                <DeleteOutlineOutlinedIcon/>
                                            </Button>
                                        </Tooltip>


                                    </StyledTableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                        <TableFooter>
                            <TableRow>
                                { paginationSuper.pageSize != undefined  && paginationSuper.page != undefined  && <TablePagination
                                    rowsPerPageOptions={[3,5, 10, 25, { label: 'All', value: -1 }]}
                                    colSpan={6}
                                    count={paginationSuper.totalRows}
                                    rowsPerPage={paginationSuper.pageSize}
                                    page={paginationSuper.page-1}
                                    SelectProps={{
                                        inputProps: { 'aria-label': 'rows per page' },
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
            </Grid>

        </div>
    );
}



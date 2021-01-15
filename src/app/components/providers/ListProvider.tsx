import React from 'react';
import Paper from '@material-ui/core/Paper';
import {connect, useDispatch, useSelector} from 'react-redux';
import {
    Table,
    TableBody,
    TableContainer,
    TableRow,
    TableCell,
    TablePagination,
    TableFooter,
    makeStyles, Button, TableHead, ButtonGroup, Grid, IconButton, Modal, Typography
} from "@material-ui/core";
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import DeleteOutlineOutlinedIcon from '@material-ui/icons/DeleteOutlineOutlined';
import {providerActions} from "../../_actions/provider.action";
import TablePaginationActions from "@material-ui/core/TablePagination/TablePaginationActions";
import PropTypes from "prop-types";
import { Link } from 'react-router-dom';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import AddBoxIcon from '@material-ui/icons/AddBox';
import {Alert} from "@material-ui/lab";
import {history} from "../../store/history";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import {withStyles} from "@material-ui/core/styles";
import {userActions} from "../../_actions/user.action";


export const ListProvider = () => {

    const {providers,alerta,providerSelect} = useSelector(state => ({
        providers: state.providers,
        alerta : state.alert,
        providerSelect : state.providerSelect
    }));
    const dispatch = useDispatch();
    const [open, setOpen] = React.useState(false);
    const [providerId, setProviderId] = React.useState("");
    const [nombreDependencia, setnombreDependencia] =  React.useState("");
    const [pagination, setPagination] =  React.useState({page : 0 , pageSize : 10 });
    const [openModalProviderInfo, setOpenModalProviderInfo] = React.useState(false);
    const [selectedProvider, setSelectedProvider] = React.useState({_id : "",fechaAlta : "", fechaActualizacion:"" });

    const handleOpenModalProviderInfo = (provider) => {
        setOpenModalProviderInfo(true);
        setSelectedProvider(provider);
    };

    const handleCloseModalProviderInfo = () => {
        setOpenModalProviderInfo(false);
    };

    const handleClickOpen = (id, dependencia) => {
        setOpen(true);
        setProviderId(id);
        setnombreDependencia(dependencia);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleChangePage = (event, newPage) => {
        setPagination({page : newPage , pageSize : pagination.pageSize });
        //dispatch(userActions.requestPerPage({page : newPage ,pageSize: pagination.pageSize}));
    };

    const handleChangeRowsPerPage = (event) => {
        setPagination({page : pagination.page , pageSize : parseInt(event.target.value, 10) });
        //dispatch(userActions.requestPerPage({pageSize: parseInt(event.target.value, 10) }));
    };

    const confirmAction = (id) => {
        dispatch(providerActions.deleteProvider(id));
        let initialRange=pagination.page * pagination.pageSize;
        let endRange= pagination.page * pagination.pageSize + pagination.pageSize;
        let totalProviders= providers.length -1 ;
        console.log("initialRange "+ initialRange + " end range "+ endRange+ " totalproviders "+ totalProviders);
        if(totalProviders <= initialRange ){
            setPagination({page : pagination.page -1 , pageSize : pagination.pageSize });
        }

        handleClose();
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

    const useStyles = makeStyles((theme) => ({
        fontblack:{
            color: '#666666'
        },
        boton:{
            backgroundColor:'#ffe01b',
            color: '#666666'
        },
        gridpadding: {
            padding: '30px',
        },
        marginright:{
            marginRight: '30px',
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
    }));

    const classes = useStyles();

        return (
            <div>
                {alerta.status == true && <Alert severity={alerta.type}>{alerta.message}</Alert>}
                <Modal
                    open={openModalProviderInfo}
                    onClose={handleCloseModalProviderInfo}
                    aria-labelledby="simple-modal-title"
                    aria-describedby="simple-modal-description"
                >
                    <Grid container item md={8} className={classes.paper}>
                        <TableContainer component={Paper}>
                            <TableHead>
                                <TableRow>
                                    <StyledTableCell align="center" >Fecha de alta</StyledTableCell>
                                    <StyledTableCell align="center" >Fecha de Actualización</StyledTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody key="InfoPlusProvider">
                                <TableRow key={selectedProvider._id + "InfoPlusProvider"}>

                                    <StyledTableCell style={{width: 160}} align="center">
                                        {selectedProvider.fechaAlta}
                                    </StyledTableCell>
                                    <StyledTableCell style={{width: 160}} align="center">
                                        {selectedProvider.fechaActualizacion}
                                    </StyledTableCell>

                                </TableRow>
                            </TableBody>
                        </TableContainer>
                    </Grid>
                </Modal>

                <Dialog
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">{"¿Seguro que desea eliminar el proveedor: "+nombreDependencia+"?"}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            Los cambios no seran reversibles
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} color="primary">
                            Cancelar
                        </Button>
                        <Button onClick={()=> {confirmAction(providerId)}} color="primary" autoFocus>
                            Aceptar
                        </Button>
                    </DialogActions>
                </Dialog>
                <Grid className= {classes.gridpadding} spacing={3} container >
                        <TableContainer component={Paper} >
                            {providers.length > 0  && <Table aria-label="custom pagination table">
                                <TableHead >
                                    <TableRow >
                                        <TableCell className={classes.fontblack} style={{ width: 'auto' }} align="center"></TableCell>
                                        <TableCell className={classes.fontblack} style={{ width: 'auto' }} align="center">Proveedor</TableCell>
                                        <TableCell className={classes.fontblack} style={{ width: 'auto' }} align="center">Estatus</TableCell>
                                        <TableCell className={classes.fontblack} align="center">Sistema</TableCell>
                                        <TableCell className={classes.fontblack} align="center">Acciones</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody key="providers">
                                    {providers.slice(pagination.page * pagination.pageSize, pagination.page * pagination.pageSize + pagination.pageSize).map((provider)  => (
                                        <TableRow key={provider._id}>
                                            <TableCell style={{ width: 40 }} align="center">
                                                <IconButton aria-label="expand row" size="small" onClick={() => handleOpenModalProviderInfo(provider)}>
                                                    <KeyboardArrowDownIcon />
                                                </IconButton>
                                            </TableCell>
                                            <TableCell className={classes.fontblack} component="th" scope="row" style={{ width: 'auto'}} align="left">
                                                {provider.dependencia}
                                            </TableCell>
                                            <TableCell className={classes.fontblack} style={{ width: 'auto' }} align="center">
                                                {provider.estatus? 'Vigente' : 'No vigente'}
                                            </TableCell>
                                            <TableCell className={classes.fontblack} style={{ width: 'auto' }} align="center">
                                                {(provider.sistemas).map((sistema)=>
                                                    <div>
                                                        {sistema=='S2' ? <li>Sistema de Servidores Públicos que Intervienen en Procedimientos de Contratación</li> :
                                                        sistema=='S3S' ? <li>Sistema de los Servidores Públicos Sancionados</li> :
                                                        sistema=='S3P' ? <li>Sistema de los Particulares Sancionados</li> : ''}
                                                    </div>

                                                )}
                                            </TableCell>
                                            <TableCell style={{ width: 'auto' }} align="center">
                                                    <Button  onClick={ () => redirectToRoute(`/proveedor/editar/${provider._id}`)}  style={{ color: 'gray' }} ><EditOutlinedIcon/></Button>
                                                    <Button>
                                                    <DeleteOutlineOutlinedIcon style={{ color: 'gray' }} onClick= {()=> {handleClickOpen(provider._id, provider.dependencia)}} />
                                                    </Button>

                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                                <TableFooter>
                                    <TableRow>
                                        { pagination.pageSize != undefined  && pagination.page != undefined  && <TablePagination
                                            rowsPerPageOptions={[3,5, 10, 25, { label: 'All', value: -1 }]}
                                            colSpan={6}
                                            count={providers.length}
                                            rowsPerPage={pagination.pageSize}
                                            page={pagination.page}
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
                            </Table>}
                         </TableContainer>
                </Grid>
                <Grid  spacing={3} justify="flex-end"
                       alignItems="flex-end"
                       container
                       item
                       xs={12}
                       md={12}>
                        <Button  onClick={ () => redirectToRoute("/proveedor/crear")}
                                 variant="contained"
                            className={classes.marginright}
                            endIcon={<AddBoxIcon>Agregar proveedor</AddBoxIcon>}
                        >
                            Agregar proveedor
                        </Button>
                </Grid>
            </div>
        );
}




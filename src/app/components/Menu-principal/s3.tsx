import React from "react";
import { HeaderMain } from "./headermain";
import { FooterMain } from "./footermain";
import { makeStyles } from "@material-ui/core/styles";
import {TextField, makeValidate, makeRequired, Select, DatePicker} from 'mui-rff';
import { withStyles } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import {useDispatch, useSelector} from 'react-redux';
import {alertActions} from "../../_actions/alert.actions";
import {S3SActions} from "../../_actions/s3s.action";
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
    useTheme,
    DialogProps,
  } from "@material-ui/core";
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import {Form} from "react-final-form";
import * as Yup from 'yup';
import NumberFormat from 'react-number-format';
import CloseIcon from "@material-ui/icons/Close";
import Nota from '../Common/Nota';
import Paper from '@material-ui/core/Paper';
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import TablePaginationActions from '../Common/TablePaginationActionsProps';
import DocumentTable from '../CargaDatos/documentTable';
import { history } from "../../store/history";

  interface FormDataEsquemaS3S {
    fechaCaptura?: String,
    expediente?: String,
    institucionDependencia?: {
        nombre: String,
        clave: String,
        siglas: String
    },
    servidorPublicoSancionado?: {
        nombres: String,
        primerApellido: String,
        segundoApellido: String,
        genero: {
            clave: String,
            valor: String
        },
        puesto: String,
        nivel: String
    },
    autoridadSancionadora?: String,
    tipoFalta?: {
        clave: String,
        valor: String,
        descripcion: String
    },
    tipoSancion?: [{ clave: string, valor: string, descripcion: string }],
    causaMotivoHechos?: String,
    resolucion?: {
        url: String,
        fechaResolucion: String
    },
    multa?: {
        monto: Number,
        moneda: {
            clave: String,
            valor: String
        }
    },
    inhabilitacion?: {
        plazo: String,
        fechaInicial: String,
        fechaFinal: String
    },
    documentos?: [{ id: string, tipo: string, titulo: string, descripcion: string, url: string, fecha: string }],
    observaciones?: String
}

export const s3s = ({}) =>{

    const {S3SList, alerta, paginationSuper, catalogos, providerUser} = useSelector(state => ({
        S3SList: state.S3S,
        alerta: state.alert,
        paginationSuper: state.pagination,
        catalogos: state.catalogs,
        providerUser: state.providerUser
    }));

    const dispatch = useDispatch();
    const [open, setOpen] = React.useState(false);
    const [RegistroId, setRegistroId] = React.useState("");
    const [query, setQuery] = React.useState({});
    const [openModalUserInfo, setOpenModalUserInfo] = React.useState(false);
    const [selectedRegistro, setSelectedRegistro] = React.useState<FormDataEsquemaS3S>({});
    const [maxWidth, setMaxWidth] = React.useState<DialogProps['maxWidth']>('md');
    var optionsDate = {year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric'};
    var optionsOnlyDate = {year: 'numeric', month: 'long', day: 'numeric'};

    const handleOpenModalUserInfo = (user) => {
        setOpenModalUserInfo(true);
        setSelectedRegistro(user);
    };

    const handleCloseModalUserInfo = () => {
        setOpenModalUserInfo(false);
    };

    const handleChangePage = (event, newPage) => {
        dispatch(S3SActions.requestPublicListS3S({query: query, page: newPage + 1, pageSize: paginationSuper.pageSize}));
    };

    const schema = Yup.object().shape({
        expediente: Yup.string().matches(new RegExp('^[A-zÀ-ú-0-9\/ ]{1,25}$'), 'No se permiten cadenas vacías, máximo 25 caracteres').trim(),
        idnombre: Yup.string().matches(new RegExp('^[A-zÀ-ú-0-9_\.\' ]{1,50}$'), 'No se permiten cadenas vacías, máximo 50 caracteres').trim(),
        SPSnombres: Yup.string().matches(new RegExp("^['A-zÀ-ú-\. ]{1,25}$"), 'No se permiten números, ni cadenas vacías máximo 25 caracteres').trim(),
        SPSprimerApellido: Yup.string().matches(new RegExp("^['A-zÀ-ú-\. ]{1,25}$"), 'No se permiten números, ni cadenas vacías máximo 25 caracteres').trim(),
        SPSsegundoApellido: Yup.string().matches(new RegExp("^['A-zÀ-ú-\. ]{1,25}$"), 'No se permiten números, ni cadenas vacías máximo 25 caracteres').trim(),
        inhabilitacionFechaFinal: Yup.string().nullable(true),
        fechaCaptura: Yup.string().nullable(true),
    });

    const validate = makeValidate(schema);

    const handleChangeRowsPerPage = (event) => {
        let newSize = parseInt(event.target.value, 10);
        if (paginationSuper.page * newSize > paginationSuper.totalRows) {
            dispatch(S3SActions.requestPublicListS3S({query: query, page: 1, pageSize: parseInt(event.target.value, 10)}));
        } else {
            dispatch(S3SActions.requestPublicListS3S({query: query, page: 1, pageSize: parseInt(event.target.value, 10)}));
        }
    };

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

    async function onSubmit(values: FormDataEsquemaS3S) {
        let newQuery = {};
        for (let [key, value] of Object.entries(values)) {
            if (key === "idnombre" && value !== null && value !== '') {
                newQuery["institucionDependencia.nombre"] = {$regex: diacriticSensitiveRegex(value), $options: 'i'};
            } else if (key === "SPSnombres" && value !== null && value !== '') {
                newQuery["servidorPublicoSancionado.nombres"] = {$regex: diacriticSensitiveRegex(value), $options: 'i'};
            } else if (key === "SPSprimerApellido" && value !== null && value !== '') {
                newQuery["servidorPublicoSancionado.primerApellido"] = {
                    $regex: diacriticSensitiveRegex(value),
                    $options: 'i'
                };
            } else if (key === "SPSsegundoApellido" && value !== null && value !== '') {
                newQuery["servidorPublicoSancionado.segundoApellido"] = {
                    $regex: diacriticSensitiveRegex(value),
                    $options: 'i'
                };
            } 
        }
        setQuery(newQuery);
        dispatch(S3SActions.requestPublicListS3S({query: newQuery, page: 1, pageSize: paginationSuper.pageSize}));
    }

    function resetForm(form) {
        form.reset();
        dispatch(S3SActions.requestPublicListS3S({
            query: { nombres: "sasadadd" },
            page: 1,
            pageSize: paginationSuper.pageSize,
          }));
    }

  const style = makeStyles((theme) => ({
    heroContainer: {
        background: 'url('+require("../assets/SAEV.jpg").default+') 50%/cover no-repeat',
        height: '28vh',
        width: '100%',
        display:'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        boxShadow:'inset 0 0 0 1000px rgba(0,0,0,.2)',
        objectFit: 'contain',
    },
    nav:{
        backgroundColor:'#737373'
    },
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
      titleDialogDetail: {
          flex: 1,
          color: "#ffff",
      },
      actions: {
          color: theme.palette.text.secondary
      },
      title: {
          flex: "0 0 auto"
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
          color: '#585858'
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
      overSelect: {
          'max-height': '19px',
          "white-space": "normal !important"
      },
      paper: {
          'text-align': 'center',
          margin: 0,
          marginTop: '75px',
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: theme.palette.background.paper,
          boxShadow: theme.shadows[5],
          padding: theme.spacing(2, 4, 3),
      },
      modal: {
          overflowY: 'auto'
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
      },
      fieldset: {
        margin: "1.125rem 0",
        padding: "1.25rem",
        border: "1px solid #cacaca",
      },
      buttonColor: {
        backgroundColor: "#750000",
        display: "block",
        width: "100%",
        marginRight: "0",
        marginLeft: "0",
        color: "#FFFAF0",
      },

    }));

  const StyledTableCell = withStyles({
        root: {
          color: "black",
        },
    })(TableCell);


  const classes = style();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

   return(<><link
              rel="stylesheet"
              href="https://cdn.jsdelivr.net/npm/bootstrap@4.3.1/dist/css/bootstrap.min.css"
              integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T"
              crossOrigin="anonymous"></link>
           <HeaderMain/>
           <div className={classes.heroContainer}></div>
           <nav className={'nav nav-pills nav-fill '}>
             <a className={"nav-item nav-link text-light border border-dark active "+ classes.nav} >Servidores públicos sancionados</a>
             <a className={"nav-item nav-link text-light border border-dark "+ classes.nav} href="#">Estadísticas de servidores públicos</a>
             <a className={"nav-item nav-link text-light border border-dark "+ classes.nav} onClick={() => redirectToRoute("/s3p")}>Particulares sancionados</a>
             <a className={"nav-item nav-link text-light border border-dark "+ classes.nav} href="#">Estadísticas de particulares</a>
          </nav>
          <div className="container">
            <div className={classes.gridX}>
                <div className={classes.displayTop}>
                <h1>Plataforma Digital Estatal</h1>
                <h2>Sistema III</h2>
                <h4>
                 "Servidores públicos y particulares sancionados"
                </h4>
                <Form
                onSubmit={onSubmit}
              render={({ handleSubmit, form, values, submitting }) => (
                <form onSubmit={handleSubmit} data-abide="4vfepm-abide">
                    {
                  <fieldset className={classes.fieldset}>
                    <legend>Busca un servidor público</legend>
                    <div className="form-row">
                      <div className="form-group col-md-4">
                        <label htmlFor="inputCity">Nombres</label>
                        <TextField
                          type="text"
                          className="form-control"
                          name="SPSnombres"
                        />
                      </div>
                      <div className="form-group col-md-4">
                        <label htmlFor="inputState">Primer apellido</label>
                        <TextField
                          type="text"
                          className="form-control"
                          name="SPSprimerApellido"
                        />
                      </div>
                      <div className="form-group col-md-4">
                        <label htmlFor="inputState">Segundo apellido</label>
                        <TextField
                          type="text"
                          className="form-control"
                          name="SPSsegundoApellido"
                        />
                      </div>
                      <div className="form-group col-md-4">
                        <label htmlFor="inputZip">Dependencia</label>
                        <TextField
                          type="text"
                          className="form-control"
                          name="idnombre"
                        />
                      </div>
                    </div>
                    <div className="row">
                      <div className="col">
                        <button
                          className={"font-weight-bold " + classes.buttonColor}
                          type="submit"
                          disabled={submitting}
                        >
                          Filtar
                        </button>
                      </div>
                      <div className="col">
                        <button
                          className={"font-weight-bold " + classes.buttonColor}
                          onClick={() => {
                            resetForm(form);
                          }}
                        >
                          Reiniciar
                        </button>
                      </div>
                    </div>
                  </fieldset>
              }
                </form>
                )}
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
                    <Grid container item md={12}>
                        <Grid container>
                            <Grid item xs={12}>
                                <Typography className={classes.titulo} align={"center"}>
                                    Datos generales
                                </Typography>
                            </Grid>
                            <Grid className={classes.gridpadding} item md={3} sm={12}>
                                <Typography className={classes.titlegridModal} align="left" variant="subtitle2">
                                    <b>Expediente</b>
                                </Typography>
                                <Typography className={classes.body2} align="left" variant="body2">
                                    {selectedRegistro.expediente ? selectedRegistro.expediente : <Nota/>}
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
                                    <b>Nombres</b>
                                </Typography>
                                <Typography className={classes.body2} align="left" variant="body2">
                                    {selectedRegistro.servidorPublicoSancionado?.nombres}
                                </Typography>

                            </Grid>
                            <Grid className={classes.gridpadding} item md={3} sm={12}>
                                <Typography className={classes.titlegridModal} align="left" variant="subtitle2">
                                    <b>Primer apellido</b>
                                </Typography>
                                <Typography className={classes.body2} align="left" variant="body2">
                                    {selectedRegistro.servidorPublicoSancionado?.primerApellido}
                                </Typography>

                            </Grid>
                            <Grid className={classes.gridpadding} item md={3} sm={12}>
                                <Typography className={classes.titlegridModal} align="left" variant="subtitle2">
                                    <b>Segundo apellido</b>
                                </Typography>
                                <Typography className={classes.body2} align="left" variant="body2">
                                    {selectedRegistro.servidorPublicoSancionado?.segundoApellido ? selectedRegistro.servidorPublicoSancionado.segundoApellido :
                                        <Nota/>}
                                </Typography>
                            </Grid>
                            <Grid className={classes.gridpadding} item md={3} sm={12}>
                                <Typography className={classes.titlegridModal} align="left" variant="subtitle2">
                                    <b>Género</b>
                                </Typography>
                                <Typography className={classes.body2} align="left" variant="body2">
                                    {selectedRegistro.servidorPublicoSancionado?.genero ? selectedRegistro.servidorPublicoSancionado.genero.valor :
                                        <Nota/>}
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
                                    {selectedRegistro.institucionDependencia?.nombre ? selectedRegistro.institucionDependencia.nombre :
                                        <Nota/>}
                                </Typography>
                            </Grid>
                            <Grid item xs={12} className={classes.containerDivider}>
                                <Divider orientation="horizontal" className={classes.divider} variant={'inset'}
                                         light={true}/>
                            </Grid>
                            <Grid className={classes.gridpadding} item md={3} sm={12}>
                                <Typography className={classes.titlegridModal} align="left" variant="subtitle2">
                                    <b>Puesto</b>
                                </Typography>
                                <Typography className={classes.body2} align="left" variant="body2">
                                    {selectedRegistro.servidorPublicoSancionado?.puesto ? selectedRegistro.servidorPublicoSancionado.puesto :
                                        <Nota/>}
                                </Typography>
                            </Grid>
                            <Grid className={classes.gridpadding} item md={3} sm={12}>
                                <Typography className={classes.titlegridModal} align="left" variant="subtitle2">
                                    <b>Nivel</b>
                                </Typography>
                                <Typography className={classes.body2} align="left" variant="body2">
                                    {selectedRegistro.servidorPublicoSancionado?.nivel ? selectedRegistro.servidorPublicoSancionado.nivel :
                                        <Nota/>}
                                </Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography className={classes.titulo} align={"center"}>
                                    Datos de la sanción
                                </Typography>
                            </Grid>

                            <Grid item xs={12}>
                                <Typography className={classes.subtitulo} align={"left"}>
                                    Resolución
                                </Typography>
                            </Grid>
                            <Grid className={classes.gridpadding} item md={3} sm={12}>
                                <Typography className={classes.titlegridModal} align="left" variant="subtitle2">
                                    <b>Autoridad sancionadora</b>
                                </Typography>
                                <Typography className={classes.body2} align="left" variant="body2">
                                    {selectedRegistro.autoridadSancionadora ? selectedRegistro.autoridadSancionadora :
                                        <Nota/>}
                                </Typography>
                            </Grid>
                            <Grid className={classes.gridpadding} item md={3} sm={12}>
                                <Typography className={classes.titlegridModal} align="left" variant="subtitle2">
                                    <b>Fecha</b>
                                </Typography>
                                <Typography className={classes.body2} align="left" variant="body2">
                                    {//@ts-ignore
                                        selectedRegistro.fechaResolucion ? new Date(selectedRegistro.resolucion?.fechaResolucion + "T00:00:00.000").toLocaleDateString("es-ES", optionsOnlyDate) :
                                            <Nota/>}
                                </Typography>
                            </Grid>
                            <Grid className={classes.gridpadding} item md={3} sm={12}>
                                <Typography className={classes.titlegridModal} align="left" variant="subtitle2">
                                    <b>URL</b>
                                </Typography>
                                <Typography className={classes.body2} align="left" variant="body2">
                                    {selectedRegistro.resolucion ? selectedRegistro.resolucion.url : <Nota/>}
                                </Typography>
                            </Grid>
                            <Grid item xs={12} className={classes.containerDivider}>
                                <Divider orientation="horizontal" className={classes.divider} variant={'inset'}
                                         light={true}/>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography className={classes.subtitulo} align={"left"}>
                                    Inhabilitación / Multa
                                </Typography>
                            </Grid>

                            <Grid className={classes.gridpadding} item md={3} sm={12}>
                                <Typography className={classes.titlegridModal} align="left" variant="subtitle2">
                                    <b>Plazo</b>
                                </Typography>
                                <Typography className={classes.body2} align="left" variant="body2">
                                    {selectedRegistro.inhabilitacion?.plazo ? selectedRegistro.inhabilitacion.plazo :
                                        <Nota/>}
                                </Typography>
                            </Grid>
                            <Grid className={classes.gridpadding} item md={3} sm={12}>
                                <Typography className={classes.titlegridModal} align="left" variant="subtitle2">
                                    <b>Fecha inicial</b>
                                </Typography>

                                <Typography className={classes.body2} align="left" variant="body2">
                                    {//@ts-ignore
                                        selectedRegistro.inhabilitacion?.fechaInicial ? new Date(selectedRegistro.inhabilitacion.fechaInicial + "T00:00:00.000").toLocaleDateString("es-ES", optionsOnlyDate) :
                                            <Nota/>
                                    }

                                </Typography>

                            </Grid>
                            <Grid className={classes.gridpadding} item md={3} sm={12}>
                                <Typography className={classes.titlegridModal} align="left" variant="subtitle2">
                                    <b>Fecha final</b>
                                </Typography>
                                <Typography className={classes.body2} align="left" variant="body2">
                                    {//@ts-ignore
                                        selectedRegistro.inhabilitacion?.fechaFinal ? new Date(selectedRegistro.inhabilitacion.fechaFinal + "T00:00:00.000").toLocaleDateString("es-ES", optionsOnlyDate) :
                                            <Nota/>
                                    }
                                </Typography>
                            </Grid>
                            <Grid className={classes.gridpadding} item md={3} sm={12}>
                                <Typography className={classes.titlegridModal} align="left" variant="subtitle2">
                                    <b>Multa</b>
                                </Typography>
                                <Typography className={classes.body2} align="left" variant="body2">
                                    {selectedRegistro.multa ?
                                        (<NumberFormat value={String(selectedRegistro.multa?.monto)}
                                                       displayType={'text'}
                                                       thousandSeparator={true} prefix={'$'}/>)
                                        : <Nota/>}
                                    {selectedRegistro.multa?.moneda ? selectedRegistro.multa.moneda.clave : ''}

                                </Typography>
                            </Grid>
                            <Grid item xs={12} className={classes.containerDivider}>
                                <Divider orientation="horizontal" className={classes.divider} variant={'inset'}
                                         light={true}/>
                            </Grid>
                            <Grid className={classes.gridpadding} item md={6} sm={12}>
                                <Typography className={classes.titlegridModal} align="left" variant="subtitle2">
                                    <b>Tipo sanción</b>
                                </Typography>
                                <Typography className={classes.body2} align="left" variant="body2">
                                    {selectedRegistro.tipoSancion ? selectedRegistro.tipoSancion.map(e => (
                                        <li>{e.valor} {e.descripcion ? ' - DESCRIPCIÓN: ' + e.descripcion : ''}</li>
                                    )) : <Nota/>}
                                </Typography>
                            </Grid>
                            <Grid className={classes.gridpadding} item md={6} sm={12}>
                                <Typography className={classes.titlegridModal} align="left" variant="subtitle2">
                                    <b>Tipo de falta</b>
                                </Typography>
                                <Typography className={classes.body2} align="left" variant="body2">
                                    {selectedRegistro.tipoFalta?.valor ? (selectedRegistro.tipoFalta.valor + ' ' + (selectedRegistro.tipoFalta.descripcion ? ' - DESCRIPCIÓN: ' + selectedRegistro.tipoFalta.descripcion : '')) :
                                        <Nota/>}
                                </Typography>
                            </Grid>
                            <Grid className={classes.gridpadding} item md={12} sm={12}>
                                <Typography className={classes.titlegridModal} align="left" variant="subtitle2">
                                    <b>Causa o Motivo de hechos</b>
                                </Typography>
                                <Typography className={classes.body2} align="left" variant="body2">
                                    {selectedRegistro.causaMotivoHechos}
                                </Typography>
                            </Grid>
                            <Grid className={classes.gridpadding} item md={12} sm={12}>
                                <Typography className={classes.titlegridModal} align="left" variant="subtitle2">
                                    <b>Observaciones</b>
                                </Typography>
                                <Typography className={classes.body2} align="left" variant="body2">
                                    {selectedRegistro.observaciones ? selectedRegistro.observaciones : <Nota/>}
                                </Typography>
                            </Grid>

                            <Grid item xs={12}>
                                <Typography className={classes.titulo} align={"center"}>
                                    Documentos
                                </Typography>
                            </Grid>
                            {!selectedRegistro.documentos || selectedRegistro.documentos.length < 1 ?
                                <Typography className={classes.body2} align="left" variant="body2"><b>*No se
                                    proporcionaron
                                    documentos</b></Typography> : ''}
                            {selectedRegistro.documentos && selectedRegistro.documentos.length > 0 &&
                            <DocumentTable documents={selectedRegistro.documentos}/>
                            }

                        </Grid>
                    </Grid>
                </DialogContent>
            </Dialog>

            <TableContainer component={Paper}>
                    <Table aria-label="custom pagination table">
                        <TableHead className={classes.tableHead}>
                            <TableRow>
                                <StyledTableCell align="center"
                                                 className={classes.tableHeaderColumn}><b>Expediente</b></StyledTableCell>
                                <StyledTableCell align="center"
                                                 className={classes.tableHeaderColumn}><b>Institución</b></StyledTableCell>
                                <StyledTableCell align="center" className={classes.tableHeaderColumn}><b>Servidor
                                    público</b></StyledTableCell>
                                <StyledTableCell align="center" className={classes.tableHeaderColumn}><b>Tipo
                                    sanción</b></StyledTableCell>
                                <StyledTableCell align="center"
                                                 className={classes.tableHeaderColumn}><b>Acciones</b></StyledTableCell>
                            </TableRow>
                        </TableHead>
                        {S3SList.map((schema) => (
                            <TableBody>

                                <TableRow key={schema._id}>
                                    <StyledTableCell style={{width: 100}} align="center">
                                        {schema.expediente}
                                    </StyledTableCell>
                                    {schema.institucionDependencia &&
                                    <StyledTableCell style={{width: 160}} align="center">
                                        {schema.institucionDependencia.nombre}
                                    </StyledTableCell>
                                    }
                                    {schema.servidorPublicoSancionado &&
                                    <StyledTableCell style={{width: 160}} align="center">
                                        {schema.servidorPublicoSancionado.nombres && schema.servidorPublicoSancionado.nombres + " "}
                                        {schema.servidorPublicoSancionado.primerApellido && schema.servidorPublicoSancionado.primerApellido + " "}
                                        {schema.servidorPublicoSancionado.segundoApellido && schema.servidorPublicoSancionado.segundoApellido}
                                    </StyledTableCell>
                                    }

                                    {schema.tipoSancion && <StyledTableCell style={{width: 230}} align="left">
                                        {schema.tipoSancion?.map((sancion) => (
                                            <li>{sancion.valor + " "}</li>
                                        ))}
                                    </StyledTableCell>
                                    }


                                    <StyledTableCell style={{width: 180}} align="center">

                                        <Button style={{padding: '0px'}}
                                                onClick={() => handleOpenModalUserInfo(schema)}>
                                            <Tooltip title="Más información" placement="left">
                                                <IconButton style={{color: "#34b3eb"}} aria-label="expand row"
                                                            size="small">
                                                    <KeyboardArrowDownIcon/>
                                                </IconButton>
                                            </Tooltip>
                                        </Button>

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
          </>)

}

const redirectToRoute = (path) =>{
    history.push(path);
}

export const S3S = s3s;
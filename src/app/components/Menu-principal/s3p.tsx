import React from "react";
import { HeaderMain } from "./headermain";
import { FooterMain } from "./footermain";
import { makeStyles } from "@material-ui/core/styles";
import {
  TextField,
  makeValidate,
  makeRequired,
  Select,
  DatePicker,
} from "mui-rff";
import { withStyles } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useDispatch, useSelector } from "react-redux";
import { alertActions } from "../../_actions/alert.actions";
import { S3PActions } from "../../_actions/s3p.action";
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
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import { Form } from "react-final-form";
import * as Yup from "yup";
import NumberFormat from "react-number-format";
import CloseIcon from "@material-ui/icons/Close";
import Nota from "../Common/Nota";
import Paper from "@material-ui/core/Paper";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import TablePaginationActions from "../Common/TablePaginationActionsProps";
import DocumentTable from "../CargaDatos/documentTable";
import { history } from "../../store/history";

interface FormDataEsquemaS3P {
  particularSancionado?: {
    domicilioMexico: {
      pais: {
        valor: String;
        clave: String;
      };
      entidadFederativa: {
        valor: String;
        clave: String;
      };
      municipio: {
        valor: String;
        clave: String;
      };
      localidad: {
        valor: String;
        clave: String;
      };
      vialidad: {
        valor: String;
        clave: String;
      };
      codigoPostal: String;
      numeroExterior: String;
      numeroInterior: String;
    };
    domicilioExtranjero: {
      pais: {
        valor: String;
        clave: String;
      };
      calle: String;
      ciudadLocalidad: String;
      estadoProvincia: String;
      codigoPostal: String;
      numeroExterior: String;
      numeroInterior: String;
    };
    nombreRazonSocial: String;
    objetoSocial: String;
    tipoPersona: String;
    telefono: String;
    directorGeneral?: {
      nombres: String;
      primerApellido: String;
      segundoApellido: String;
    };
    apoderadoLegal?: {
      nombres: String;
      primerApellido: String;
      segundoApellido: String;
    };
  };
  multa?: {
    monto: Number;
    moneda: {
      clave: String;
      valor: String;
    };
  };
  fechaCaptura?: String;
  expediente?: String;
  institucionDependencia?: {
    nombre: String;
    clave: String;
    siglas: String;
  };
  objetoContrato?: String;
  autoridadSancionadora?: String;
  tipoFalta?: String;
  tipoSancion?: [{ clave: String; valor: String; descripcion: String }];
  causaMotivoHechos?: String;
  acto?: String;
  responsableSancion?: {
    nombres: String;
    primerApellido: String;
    segundoApellido: String;
  };
  resolucion?: {
    sentido: String;
    url: String;
    fechaNotificacion: String;
  };
  inhabilitacion?: {
    plazo: String;
    fechaInicial: String;
    fechaFinal: String;
  };
  documentos?: [
    {
      id: String;
      tipo: String;
      titulo: String;
      descripcion: String;
      url: String;
      fecha: String;
    }
  ];
  observaciones?: String;
}

export const s3p = ({}) => {
  const { S3PList, alerta, paginationSuper, catalogos, permisos, providerUser,} = useSelector((state) => ({
    S3PList: state.S3P,
    alerta: state.alert,
    paginationSuper: state.pagination,
    catalogos: state.catalogs,
    permisos: state.permisos,
    providerUser: state.providerUser,
  }));

  const dispatch = useDispatch();
  const [open, setOpen] = React.useState(false);
  const [RegistroId, setRegistroId] = React.useState("");
  const [nombreUsuario, setNombreUsuario] = React.useState("");
  const [selectedCheckBox, setSelectedCheckBox] = React.useState([]);
  const [query, setQuery] = React.useState({});
  const [openModalUserInfo, setOpenModalUserInfo] = React.useState(false);
  const [selectedRegistro, setSelectedRegistro] =
    React.useState<FormDataEsquemaS3P>({});
  const [match, setMatch] = React.useState({ params: { id: "" } });
  const [maxWidth, setMaxWidth] = React.useState<DialogProps["maxWidth"]>("md");
  var optionsDate = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  };
  var optionsOnlyDate = { year: "numeric", month: "long", day: "numeric" };

  const handleOpenModalUserInfo = (user) => {
    setOpenModalUserInfo(true);
    setSelectedRegistro(user);
  };

  const handleCloseModalUserInfo = () => {
    setOpenModalUserInfo(false);
  };

  const handleChangePage = (event, newPage) => {
    dispatch(
      S3PActions.requestPublicListS3P({
        query: query,
        page: newPage + 1,
        pageSize: paginationSuper.pageSize,
      })
    );
  };

  const handleChangeRowsPerPage = (event) => {
    let newSize = parseInt(event.target.value, 10);
    if (paginationSuper.page * newSize > paginationSuper.totalRows) {
      dispatch(
        S3PActions.requestPublicListS3P({
          query: query,
          page: 1,
          pageSize: parseInt(event.target.value, 10),
        })
      );
    } else {
      dispatch(
        S3PActions.requestPublicListS3P({
          query: query,
          page: 1,
          pageSize: parseInt(event.target.value, 10),
        })
      );
    }
  };

  function diacriticSensitiveRegex(string = "") {
    string = string.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    return string
      .replace(/a/g, "[a,á,à,ä]")
      .replace(/e/g, "[e,é,ë]")
      .replace(/i/g, "[i,í,ï]")
      .replace(/o/g, "[o,ó,ö,ò]")
      .replace(/u/g, "[u,ü,ú,ù]")
      .replace(/A/g, "[a,á,à,ä]")
      .replace(/E/g, "[e,é,ë]")
      .replace(/I/g, "[i,í,ï]")
      .replace(/O/g, "[o,ó,ö,ò]")
      .replace(/U/g, "[u,ü,ú,ù]");
  }

  interface FormFiltersEsquemaS3P {
    nombres?: string;
    primerApellido?: string;
    segundoApellido?: string;
    idnombre?: string;
    razonSocial?: string;
  }

  const schema = Yup.object().shape({
    expediente: Yup.string()
      .matches(
        new RegExp("^[A-zÀ-ú-0-9/ ]{1,25}$"),
        "No se permiten cadenas vacías, máximo 25 caracteres"
      )
      .trim(),
    idnombre: Yup.string()
      .matches(
        new RegExp("^[A-zÀ-ú-0-9_.' ]{1,50}$"),
        "No se permiten cadenas vacías, máximo 50 caracteres"
      )
      .trim(),
    SP3nombres: Yup.string()
      .matches(
        new RegExp("^['A-zÀ-ú-. ]{1,25}$"),
        "No se permiten números, ni cadenas vacías máximo 25 caracteres"
      )
      .trim(),
    SP3primerApellido: Yup.string()
      .matches(
        new RegExp("^['A-zÀ-ú-. ]{1,25}$"),
        "No se permiten números, ni cadenas vacías máximo 25 caracteres"
      )
      .trim(),
    SP3segundoApellido: Yup.string()
      .matches(
        new RegExp("^['A-zÀ-ú-. ]{1,25}$"),
        "No se permiten números, ni cadenas vacías máximo 25 caracteres"
      )
      .trim(),
    fechaCaptura: Yup.string().nullable(true),
  });

  const validate = makeValidate(schema);
  const required = makeRequired(schema);

  async function onSubmit(values: FormDataEsquemaS3P) {
    let newQuery = {};
    for (let [key, value] of Object.entries(values)) {
      if (key === "idnombre" && value !== null && value !== "") {
        newQuery["institucionDependencia.nombre"] = {
          $regex: diacriticSensitiveRegex(value),
          $options: "i",
        };
      } else if (key === "SP3nombres" && value !== null && value !== "") {
        newQuery["particularSancionado.nombreRazonSocial"] = {
          $regex: diacriticSensitiveRegex(value),
          $options: "i",
        };
      } else if (value !== null && value !== "") {
        newQuery[key] = {
          $regex: diacriticSensitiveRegex(value),
          $options: "i",
        };
      }
    }
    setQuery(newQuery);
    dispatch(
      S3PActions.requestPublicListS3P({
        query: newQuery,
        page: 1,
        pageSize: paginationSuper.pageSize,
      })
    );
  }

  function resetForm(form) {
    form.reset();
    setQuery({});
    dispatch(
      S3PActions.requestPublicListS3P({
        page: paginationSuper.page,
        pageSize: paginationSuper.pageSize,
      })
    );
  }

  const style = makeStyles((theme) => ({
    heroContainer: {
      background:
        "url(" +
        require("../assets/SAEV.jpg").default +
        ") 50%/cover no-repeat",
      height: "28vh",
      width: "100%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      boxShadow: "inset 0 0 0 1000px rgba(0,0,0,.2)",
      objectFit: "contain",
    },
    nav: {
      backgroundColor: "#737373",
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
      color: "#666666",
    },
    tool: {
      color: "white",
      backgroundColor: "#7f7e7e",
    },
    spacer: {
      flex: "1 1 100%",
    },
    titleDialogDetail: {
      flex: 1,
      color: "#ffff",
    },
    actions: {
      color: theme.palette.text.secondary,
    },
    title: {
      flex: "0 0 auto",
    },
    fontblack: {
      color: "#666666",
    },
    titleModal: {
      "padding-top": "13px",
      color: "#585858",
      "font-size": "17px",
    },
    divider: {
      width: "100%",
      backgroundColor: "##b7a426",
      color: "#b7a426",
      margin: "10px",
    },
    boton: {
      marginTop: "16px",
      marginLeft: "16px",
      marginRight: "16px",
      marginBottom: "0px",
      backgroundColor: "#ffe01b",
      color: "#666666",
    },
    boton2: {
      marginTop: "16px",
      marginLeft: "16px",
      marginRight: "-10px",
      marginBottom: "0px",
      backgroundColor: "#ffe01b",
      color: "#666666",
    },
    filterContainer: {
      padding: "10px 10px 20px 10px",
    },
    gridpadding: {
      "padding-top": "10px",
    },
    gridpaddingBottom: {
      "padding-bottom": "10px",
      "padding-left": "10px",
    },
    titlegridModal: {
      color: "#585858",
    },
    body2: {
      color: "#666666",
    },
    marginright: {
      marginRight: "30px",
      marginTop: "15px",
      backgroundColor: "#ffe01b",
      color: "#666666",
      marginBottom: "30px",
    },
    overSelect: {
      "max-height": "19px",
      "white-space": "normal !important",
    },
    paper: {
      "text-align": "center",
      margin: 0,
      marginTop: "75px",
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      backgroundColor: theme.palette.background.paper,
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
    },
    modal: {
      overflowY: "auto",
    },
    tableHead: {
      backgroundColor: "#B22222",
    },
    tableHeaderColumn: {
      color: "#ffff",
    },
    whiteStyle: {
      color: "#ffff",
    },
    titulo: {
      fontSize: 15,
      fontWeight: "bold",
      marginBottom: 10,
      textDecoration: "underline",
      textDecorationColor: "#34b3eb",
      color: "#34b3eb",
    },
    toolBarModal: {
      backgroundColor: "#34b3eb",
    },
    subtitulo: {
      fontSize: 15,
      fontWeight: "bold",
      textDecoration: "underline",
      textDecorationColor: "#585858",
      color: "#585858",
      paddingTop: "10px",
    },
    containerDivider: {
      paddingLeft: "15px",
      paddingRight: "15px",
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

  return (
    <>
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/bootstrap@4.3.1/dist/css/bootstrap.min.css"
        integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T"
        crossOrigin="anonymous"
      ></link>
      <HeaderMain />
      <div className={classes.heroContainer}></div>
      <nav className={"nav nav-pills nav-fill "}>
        <a
          className={
            "nav-item nav-link text-light border border-dark " + classes.nav
          }
          onClick={() => redirectToRoute("/s3s")}
        >
          Servidores públicos sancionados
        </a>
        <a
          className={
            "nav-item nav-link text-light border border-dark " + classes.nav
          }
          href="#"
        >
          Estadísticas de servidores públicos
        </a>
        <a
          className={
            "nav-item nav-link text-light border border-dark active " +
            classes.nav
          }
        >
          Particulares sancionados
        </a>
        <a
          className={
            "nav-item nav-link text-light border border-dark " + classes.nav
          }
          href="#"
        >
          Estadísticas de particulares
        </a>
      </nav>
      <div className="container">
        <div className={classes.gridX}>
          <div className={classes.displayTop}>
            <h1>Plataforma Digital Estatal</h1>
            <h2>Sistema III</h2>
            <h4>"Servidores públicos y particulares sancionados"</h4>
            <Form
              onSubmit={onSubmit}
              render={({ handleSubmit, form, values, submitting }) => (
                <form onSubmit={handleSubmit} data-abide="4vfepm-abide">
                  {
                    <fieldset className={classes.fieldset}>
                      <legend>Busca un servidor particular</legend>
                      <div className="form-row">
                        <div className="form-group col-md-10">
                          <label htmlFor="inputCity">Razón Social</label>
                          <TextField
                            type="text"
                            className="form-control "
                            name="SP3nombres"
                            placeholder="ej. empresa x SA de CV"
                          />
                        </div>
                        <div className="form-group col-md-10">
                          <label htmlFor="inputZip">Dependencia</label>
                          <TextField
                            type="text"
                            className="form-control "
                            name="idnombre"
                          />
                        </div>
                      </div>
                      <div className="row">
                        <div className="col">
                          <button
                            className={
                              "font-weight-bold " + classes.buttonColor
                            }
                            type="submit"
                            disabled={submitting}
                          >
                            Filtar
                          </button>
                        </div>
                        <div className="col">
                          <button
                            className={
                              "font-weight-bold " + classes.buttonColor
                            }
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
            <Dialog
              fullWidth={true}
              maxWidth={maxWidth}
              fullScreen={fullScreen}
              onClose={handleCloseModalUserInfo}
              aria-labelledby="customized-dialog-title"
              open={openModalUserInfo}
            >
              <Toolbar className={classes.toolBarModal}>
                <Typography variant="h6" className={classes.titleDialogDetail}>
                  <b>Detalle del registro</b>
                  <Typography className={classes.whiteStyle}>
                    *(DNC) = Dato No Capturado
                  </Typography>
                </Typography>
                <IconButton
                  edge="end"
                  color="inherit"
                  onClick={handleCloseModalUserInfo}
                  aria-label="close"
                >
                  <CloseIcon className={classes.whiteStyle} />
                </IconButton>
              </Toolbar>
              <DialogContent dividers>
                <Grid container>
                  <Grid item xs={12}>
                    <Typography className={classes.titulo} align={"center"}>
                      Datos generales
                    </Typography>
                  </Grid>
                  <Grid className={classes.gridpadding} item md={3} sm={12}>
                    <Typography
                      className={classes.titlegridModal}
                      align="left"
                      variant="subtitle2"
                    >
                      <b>Expediente</b>
                    </Typography>
                    <Typography
                      className={classes.body2}
                      align="left"
                      variant="body2"
                    >
                      {selectedRegistro.expediente ? (
                        selectedRegistro.expediente
                      ) : (
                        <Nota />
                      )}
                    </Typography>
                  </Grid>
                  <Grid className={classes.gridpadding} item md={3} sm={12}>
                    <Typography
                      className={classes.titlegridModal}
                      align="left"
                      variant="subtitle2"
                    >
                      <b>Fecha última actualización</b>
                    </Typography>
                    <Typography
                      className={classes.body2}
                      align="left"
                      variant="body2"
                    >
                      {
                        //@ts-ignore
                        new Date(selectedRegistro.fechaCaptura).toLocaleDateString("es-ES", optionsDate)
                      }
                    </Typography>
                  </Grid>
                  <Grid className={classes.gridpadding} item md={3} sm={12}>
                    <Typography
                      className={classes.titlegridModal}
                      align="left"
                      variant="subtitle2"
                    >
                      <b>Nombre / Razón social</b>
                    </Typography>
                    <Typography
                      className={classes.body2}
                      align="left"
                      variant="body2"
                      noWrap={true}
                    >
                      {selectedRegistro.particularSancionado?.nombreRazonSocial}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography className={classes.subtitulo} align={"left"}>
                      Institución / Dependencia
                    </Typography>
                  </Grid>
                  <Grid className={classes.gridpadding} item md={3} sm={12}>
                    <Typography
                      className={classes.titlegridModal}
                      align="left"
                      variant="subtitle2"
                    >
                      <b>Clave</b>
                    </Typography>
                    <Typography
                      className={classes.body2}
                      align="left"
                      variant="body2"
                    >
                      {selectedRegistro.institucionDependencia?.clave ? (
                        selectedRegistro.institucionDependencia.clave
                      ) : (
                        <Nota />
                      )}
                    </Typography>
                  </Grid>
                  <Grid className={classes.gridpadding} item md={3} sm={12}>
                    <Typography
                      className={classes.titlegridModal}
                      align="left"
                      variant="subtitle2"
                    >
                      <b>Siglas</b>
                    </Typography>
                    <Typography
                      className={classes.body2}
                      align="left"
                      variant="body2"
                    >
                      {selectedRegistro.institucionDependencia?.siglas ? (
                        selectedRegistro.institucionDependencia.siglas
                      ) : (
                        <Nota />
                      )}
                    </Typography>
                  </Grid>
                  <Grid className={classes.gridpadding} item md={6} sm={12}>
                    <Typography
                      className={classes.titlegridModal}
                      align="left"
                      variant="subtitle2"
                    >
                      <b>Nombre</b>
                    </Typography>
                    <Typography
                      className={classes.body2}
                      align="left"
                      variant="body2"
                    >
                      {selectedRegistro.institucionDependencia?.nombre ? (
                        selectedRegistro.institucionDependencia.nombre
                      ) : (
                        <Nota />
                      )}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} className={classes.containerDivider}>
                    <Divider
                      orientation="horizontal"
                      className={classes.divider}
                      variant={"inset"}
                      light={true}
                    />
                  </Grid>
                  <Grid className={classes.gridpadding} item md={12} sm={12}>
                    <Typography
                      className={classes.titlegridModal}
                      align="left"
                      variant="subtitle2"
                    >
                      <b>Observaciones</b>
                    </Typography>
                    <Typography
                      className={classes.body2}
                      align="left"
                      variant="body2"
                    >
                      {selectedRegistro.observaciones ? (
                        selectedRegistro.observaciones
                      ) : (
                        <Nota />
                      )}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography className={classes.titulo} align={"center"}>
                      Datos de la sanción
                    </Typography>
                  </Grid>
                  <Grid className={classes.gridpadding} item md={6} sm={12}>
                    <Typography
                      className={classes.titlegridModal}
                      align="left"
                      variant="subtitle2"
                    >
                      <b>Tipo sanción</b>
                    </Typography>
                    <Typography
                      className={classes.body2}
                      align="left"
                      variant="body2"
                    >
                      {selectedRegistro.tipoSancion ? (
                        selectedRegistro.tipoSancion.map((e) => (
                          <li>
                            {e.valor}{" "}
                            {e.descripcion
                              ? " - DESCRIPCIÓN:" + e.descripcion
                              : ""}
                          </li>
                        ))
                      ) : (
                        <Nota />
                      )}
                    </Typography>
                  </Grid>
                  <Grid className={classes.gridpadding} item md={6} sm={12}>
                    <Typography
                      className={classes.titlegridModal}
                      align="left"
                      variant="subtitle2"
                    >
                      <b>Tipo falta</b>
                    </Typography>
                    <Typography
                      className={classes.body2}
                      align="left"
                      variant="body2"
                    >
                      {selectedRegistro.tipoFalta ? (
                        selectedRegistro.tipoFalta
                      ) : (
                        <Nota />
                      )}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography className={classes.subtitulo} align={"left"}>
                      Resolución
                    </Typography>
                  </Grid>
                  <Grid className={classes.gridpadding} item md={3} sm={12}>
                    <Typography
                      className={classes.titlegridModal}
                      align="left"
                      variant="subtitle2"
                    >
                      <b>Autoridad sancionadora</b>
                    </Typography>
                    <Typography
                      className={classes.body2}
                      align="left"
                      variant="body2"
                      noWrap={true}
                    >
                      {selectedRegistro.autoridadSancionadora}
                    </Typography>
                  </Grid>
                  <Grid className={classes.gridpadding} item md={3} sm={12}>
                    <Typography
                      className={classes.titlegridModal}
                      align="left"
                      variant="subtitle2"
                    >
                      <b>Fecha</b>
                    </Typography>
                    <Typography
                      className={classes.body2}
                      align="left"
                      variant="body2"
                    >
                      {
                        //@ts-ignore
                        selectedRegistro.resolucion?.fechaNotificacion ? (
                          new Date(selectedRegistro.resolucion.fechaNotificacion + "T00:00:00.000").toLocaleDateString("es-ES", optionsOnlyDate)
                        ) : (
                          <Nota />
                        )
                      }
                    </Typography>
                  </Grid>
                  <Grid className={classes.gridpadding} item md={3} sm={12}>
                    <Typography
                      className={classes.titlegridModal}
                      align="left"
                      variant="subtitle2"
                    >
                      <b>URL</b>
                    </Typography>
                    <Typography
                      className={classes.body2}
                      align="left"
                      variant="body2"
                      noWrap={true}
                    >
                      {selectedRegistro.resolucion ? (
                        selectedRegistro.resolucion.url
                      ) : (
                        <Nota />
                      )}
                    </Typography>
                  </Grid>
                  <Grid className={classes.gridpadding} item md={3} sm={12}>
                    <Typography
                      className={classes.titlegridModal}
                      align="left"
                      variant="subtitle2"
                    >
                      <b>Sentido</b>
                    </Typography>
                    <Typography
                      className={classes.body2}
                      align="left"
                      variant="body2"
                    >
                      {selectedRegistro.resolucion?.sentido ? (
                        selectedRegistro.resolucion.sentido
                      ) : (
                        <Nota />
                      )}
                    </Typography>
                  </Grid>

                  <Grid item xs={12} className={classes.containerDivider}>
                    <Divider
                      orientation="horizontal"
                      className={classes.divider}
                      variant={"inset"}
                      light={true}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Typography className={classes.subtitulo} align={"left"}>
                      Inhabilitación / Multa
                    </Typography>
                  </Grid>
                  <Grid className={classes.gridpadding} item md={3} sm={12}>
                    <Typography
                      className={classes.titlegridModal}
                      align="left"
                      variant="subtitle2"
                    >
                      <b>Plazo</b>
                    </Typography>
                    <Typography
                      className={classes.body2}
                      align="left"
                      variant="body2"
                    >
                      {selectedRegistro.inhabilitacion?.plazo ? (
                        selectedRegistro.inhabilitacion.plazo
                      ) : (
                        <Nota />
                      )}
                    </Typography>
                  </Grid>
                  <Grid className={classes.gridpadding} item md={3} sm={12}>
                    <Typography
                      className={classes.titlegridModal}
                      align="left"
                      variant="subtitle2"
                    >
                      <b>Fecha inicial</b>
                    </Typography>
                    <Typography
                      className={classes.body2}
                      align="left"
                      variant="body2"
                    >
                      {
                        //@ts-ignore
                        selectedRegistro.inhabilitacion?.fechaInicial ? (
                          new Date(selectedRegistro.inhabilitacion.fechaInicial + "T00:00:00.000").toLocaleDateString("es-ES", optionsOnlyDate)) : (
                          <Nota />
                        )
                      }
                    </Typography>
                  </Grid>
                  <Grid className={classes.gridpadding} item md={3} sm={12}>
                    <Typography
                      className={classes.titlegridModal}
                      align="left"
                      variant="subtitle2"
                    >
                      <b>Fecha final</b>
                    </Typography>
                    <Typography
                      className={classes.body2}
                      align="left"
                      variant="body2"
                    >
                      {
                        //@ts-ignore
                        selectedRegistro.inhabilitacion?.fechaFinal ? (
                          new Date(
                            selectedRegistro.inhabilitacion.fechaFinal +
                              "T00:00:00.000"
                          ).toLocaleDateString("es-ES", optionsOnlyDate)
                        ) : (
                          <Nota />
                        )
                      }
                    </Typography>
                  </Grid>
                  <Grid className={classes.gridpadding} item md={3} sm={12}>
                    <Typography
                      className={classes.titlegridModal}
                      align="left"
                      variant="subtitle2"
                    >
                      <b>Multa</b>
                    </Typography>
                    <Typography
                      className={classes.body2}
                      align="left"
                      variant="body2"
                    >
                      {selectedRegistro.multa ? (
                        <NumberFormat
                          value={String(selectedRegistro.multa?.monto)}
                          displayType={"text"}
                          thousandSeparator={true}
                          prefix={"$"}
                        />
                      ) : (
                        <Nota />
                      )}
                      {selectedRegistro.multa?.moneda
                        ? selectedRegistro.multa.moneda.clave
                        : ""}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} className={classes.containerDivider}>
                    <Divider
                      orientation="horizontal"
                      className={classes.divider}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography className={classes.subtitulo} align={"left"}>
                      Responsable de la sanción
                    </Typography>
                  </Grid>
                  <Grid className={classes.gridpadding} item md={3} sm={12}>
                    <Typography
                      className={classes.titlegridModal}
                      align="left"
                      variant="subtitle2"
                    >
                      <b>Nombre</b>
                    </Typography>
                    <Typography
                      className={classes.body2}
                      align="left"
                      variant="body2"
                    >
                      {selectedRegistro.responsableSancion?.nombres ? (
                        selectedRegistro.responsableSancion.nombres
                      ) : (
                        <Nota />
                      )}
                    </Typography>
                  </Grid>
                  <Grid className={classes.gridpadding} item md={3} sm={12}>
                    <Typography
                      className={classes.titlegridModal}
                      align="left"
                      variant="subtitle2"
                    >
                      <b>Apellido uno</b>
                    </Typography>
                    <Typography
                      className={classes.body2}
                      align="left"
                      variant="body2"
                    >
                      {selectedRegistro.responsableSancion?.primerApellido ? (
                        selectedRegistro.responsableSancion.primerApellido
                      ) : (
                        <Nota />
                      )}
                    </Typography>
                  </Grid>
                  <Grid className={classes.gridpadding} item md={3} sm={12}>
                    <Typography
                      className={classes.titlegridModal}
                      align="left"
                      variant="subtitle2"
                    >
                      <b>Apellido dos</b>
                    </Typography>
                    <Typography
                      className={classes.body2}
                      align="left"
                      variant="body2"
                    >
                      {selectedRegistro.responsableSancion?.segundoApellido ? (
                        selectedRegistro.responsableSancion.segundoApellido
                      ) : (
                        <Nota />
                      )}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} className={classes.containerDivider}>
                    <Divider
                      orientation="horizontal"
                      className={classes.divider}
                      variant={"inset"}
                      light={true}
                    />
                  </Grid>
                  <Grid className={classes.gridpadding} item md={6} sm={12}>
                    <Typography
                      className={classes.titlegridModal}
                      align="left"
                      variant="subtitle2"
                    >
                      <b>Causa, motivo o hechos</b>
                    </Typography>
                    <Typography
                      className={classes.body2}
                      align="left"
                      variant="body2"
                    >
                      {selectedRegistro.causaMotivoHechos}
                    </Typography>
                  </Grid>

                  <Grid className={classes.gridpadding} item md={6} sm={12}>
                    <Typography
                      className={classes.titlegridModal}
                      align="left"
                      variant="subtitle2"
                    >
                      <b>Acto</b>
                    </Typography>
                    <Typography
                      className={classes.body2}
                      align="left"
                      variant="body2"
                    >
                      {selectedRegistro.acto ? selectedRegistro.acto : <Nota />}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography className={classes.titulo} align={"center"}>
                      Datos del particular sancionado
                    </Typography>
                  </Grid>
                  <Grid className={classes.gridpadding} item md={3} sm={12}>
                    <Typography
                      className={classes.titlegridModal}
                      align="left"
                      variant="subtitle2"
                    >
                      <b>Tipo persona</b>
                    </Typography>
                    <Typography
                      className={classes.body2}
                      align="left"
                      variant="body2"
                    >
                      {selectedRegistro.particularSancionado?.tipoPersona ? (
                        selectedRegistro.particularSancionado.tipoPersona ===
                        "M" ? (
                          "Moral"
                        ) : (
                          "Física"
                        )
                      ) : (
                        <Nota />
                      )}
                    </Typography>
                  </Grid>

                  <Grid className={classes.gridpadding} item md={3} sm={12}>
                    <Typography
                      className={classes.titlegridModal}
                      align="left"
                      variant="subtitle2"
                    >
                      <b>Teléfono</b>
                    </Typography>
                    <Typography
                      className={classes.body2}
                      align="left"
                      variant="body2"
                    >
                      {selectedRegistro.particularSancionado?.telefono ? (
                        selectedRegistro.particularSancionado.telefono
                      ) : (
                        <Nota />
                      )}
                    </Typography>
                  </Grid>
                  <Grid className={classes.gridpadding} item md={6} sm={12}>
                    <Typography
                      className={classes.titlegridModal}
                      align="left"
                      variant="subtitle2"
                    >
                      <b>Objeto social</b>
                    </Typography>
                    <Typography
                      className={classes.body2}
                      align="left"
                      variant="body2"
                    >
                      {selectedRegistro.particularSancionado?.objetoSocial ? (
                        selectedRegistro.particularSancionado.objetoSocial
                      ) : (
                        <Nota />
                      )}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography className={classes.subtitulo} align={"left"}>
                      Director general
                    </Typography>
                  </Grid>
                  <Grid className={classes.gridpadding} item md={3} sm={12}>
                    <Typography
                      className={classes.titlegridModal}
                      align="left"
                      variant="subtitle2"
                    >
                      <b>Nombre</b>
                    </Typography>
                    <Typography
                      className={classes.body2}
                      align="left"
                      variant="body2"
                    >
                      {selectedRegistro.particularSancionado?.directorGeneral
                        ?.nombres ? (
                        selectedRegistro.particularSancionado.directorGeneral
                          .nombres
                      ) : (
                        <Nota />
                      )}
                    </Typography>
                  </Grid>
                  <Grid className={classes.gridpadding} item md={3} sm={12}>
                    <Typography
                      className={classes.titlegridModal}
                      align="left"
                      variant="subtitle2"
                    >
                      <b>Apellido Paterno</b>
                    </Typography>
                    <Typography
                      className={classes.body2}
                      align="left"
                      variant="body2"
                    >
                      {selectedRegistro.particularSancionado?.directorGeneral
                        ?.primerApellido ? (
                        selectedRegistro.particularSancionado.directorGeneral
                          .primerApellido
                      ) : (
                        <Nota />
                      )}
                    </Typography>
                  </Grid>
                  <Grid className={classes.gridpadding} item md={3} sm={12}>
                    <Typography
                      className={classes.titlegridModal}
                      align="left"
                      variant="subtitle2"
                    >
                      <b>Apellido Materno</b>
                    </Typography>
                    <Typography
                      className={classes.body2}
                      align="left"
                      variant="body2"
                    >
                      {selectedRegistro.particularSancionado?.directorGeneral
                        ?.segundoApellido ? (
                        selectedRegistro.particularSancionado.directorGeneral
                          .segundoApellido
                      ) : (
                        <Nota />
                      )}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} className={classes.containerDivider}>
                    <Divider
                      orientation="horizontal"
                      className={classes.divider}
                      variant={"inset"}
                      light={true}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography className={classes.subtitulo} align={"left"}>
                      Apoderado legal
                    </Typography>
                  </Grid>
                  <Grid className={classes.gridpadding} item md={3} sm={12}>
                    <Typography
                      className={classes.titlegridModal}
                      align="left"
                      variant="subtitle2"
                    >
                      <b>Nombre</b>
                    </Typography>
                    <Typography
                      className={classes.body2}
                      align="left"
                      variant="body2"
                    >
                      {selectedRegistro.particularSancionado?.apoderadoLegal
                        ?.nombres ? (
                        selectedRegistro.particularSancionado.apoderadoLegal
                          .nombres
                      ) : (
                        <Nota />
                      )}
                    </Typography>
                  </Grid>
                  <Grid className={classes.gridpadding} item md={3} sm={12}>
                    <Typography
                      className={classes.titlegridModal}
                      align="left"
                      variant="subtitle2"
                    >
                      <b>Apellido Paterno</b>
                    </Typography>
                    <Typography
                      className={classes.body2}
                      align="left"
                      variant="body2"
                    >
                      {selectedRegistro.particularSancionado?.apoderadoLegal
                        ?.primerApellido ? (
                        selectedRegistro.particularSancionado.apoderadoLegal
                          .primerApellido
                      ) : (
                        <Nota />
                      )}
                    </Typography>
                  </Grid>
                  <Grid className={classes.gridpadding} item md={3} sm={12}>
                    <Typography
                      className={classes.titlegridModal}
                      align="left"
                      variant="subtitle2"
                    >
                      <b>Apellido Materno</b>
                    </Typography>
                    <Typography
                      className={classes.body2}
                      align="left"
                      variant="body2"
                    >
                      {selectedRegistro.particularSancionado?.apoderadoLegal
                        ?.segundoApellido ? (
                        selectedRegistro.particularSancionado.apoderadoLegal
                          .segundoApellido
                      ) : (
                        <Nota />
                      )}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} className={classes.containerDivider}>
                    <Divider
                      orientation="horizontal"
                      className={classes.divider}
                      variant={"inset"}
                      light={true}
                    />
                  </Grid>
                  {selectedRegistro.particularSancionado?.domicilioMexico && (
                    <Grid item xs={12}>
                      <Grid container>
                        <Grid item xs={12}>
                          <Typography
                            className={classes.titulo}
                            align={"center"}
                          >
                            Domicilio México
                          </Typography>
                        </Grid>
                        <Grid
                          className={classes.gridpadding}
                          item
                          md={3}
                          sm={12}
                        >
                          <Typography
                            className={classes.titlegridModal}
                            align="left"
                            variant="subtitle2"
                          >
                            <b>País</b>
                          </Typography>
                          <Typography
                            className={classes.body2}
                            align="left"
                            variant="body2"
                          >
                            {selectedRegistro.particularSancionado
                              ?.domicilioMexico?.pais?.valor ? (
                              selectedRegistro.particularSancionado
                                .domicilioMexico.pais.valor
                            ) : (
                              <Nota />
                            )}
                          </Typography>
                        </Grid>
                        <Grid
                          className={classes.gridpadding}
                          item
                          md={3}
                          sm={12}
                        >
                          <Typography
                            className={classes.titlegridModal}
                            align="left"
                            variant="subtitle2"
                          >
                            <b>Entidad federativa</b>
                          </Typography>
                          <Typography
                            className={classes.body2}
                            align="left"
                            variant="body2"
                          >
                            {selectedRegistro.particularSancionado
                              ?.domicilioMexico?.entidadFederativa?.valor ? (
                              selectedRegistro.particularSancionado
                                .domicilioMexico.entidadFederativa.valor
                            ) : (
                              <Nota />
                            )}
                          </Typography>
                        </Grid>
                        <Grid
                          className={classes.gridpadding}
                          item
                          md={3}
                          sm={12}
                        >
                          <Typography
                            className={classes.titlegridModal}
                            align="left"
                            variant="subtitle2"
                          >
                            <b>Municipio</b>
                          </Typography>
                          <Typography
                            className={classes.body2}
                            align="left"
                            variant="body2"
                          >
                            {selectedRegistro.particularSancionado
                              ?.domicilioMexico?.municipio?.valor ? (
                              selectedRegistro.particularSancionado
                                .domicilioMexico.municipio.valor
                            ) : (
                              <Nota />
                            )}
                          </Typography>
                        </Grid>
                        <Grid
                          className={classes.gridpadding}
                          item
                          md={3}
                          sm={12}
                        >
                          <Typography
                            className={classes.titlegridModal}
                            align="left"
                            variant="subtitle2"
                          >
                            <b>Localidad</b>
                          </Typography>
                          <Typography
                            className={classes.body2}
                            align="left"
                            variant="body2"
                          >
                            {selectedRegistro.particularSancionado
                              ?.domicilioMexico?.localidad?.valor ? (
                              selectedRegistro.particularSancionado
                                .domicilioMexico.localidad.valor
                            ) : (
                              <Nota />
                            )}
                          </Typography>
                        </Grid>
                        <Grid
                          className={classes.gridpadding}
                          item
                          md={3}
                          sm={12}
                        >
                          <Typography
                            className={classes.titlegridModal}
                            align="left"
                            variant="subtitle2"
                          >
                            <b>Vialidad</b>
                          </Typography>
                          <Typography
                            className={classes.body2}
                            align="left"
                            variant="body2"
                          >
                            {selectedRegistro.particularSancionado
                              ?.domicilioMexico?.vialidad?.valor ? (
                              selectedRegistro.particularSancionado
                                .domicilioMexico.vialidad.valor
                            ) : (
                              <Nota />
                            )}
                          </Typography>
                        </Grid>
                        <Grid
                          className={classes.gridpadding}
                          item
                          md={3}
                          sm={12}
                        >
                          <Typography
                            className={classes.titlegridModal}
                            align="left"
                            variant="subtitle2"
                          >
                            <b>Código postal</b>
                          </Typography>
                          <Typography
                            className={classes.body2}
                            align="left"
                            variant="body2"
                          >
                            {selectedRegistro.particularSancionado
                              ?.domicilioMexico?.codigoPostal ? (
                              selectedRegistro.particularSancionado
                                .domicilioMexico.codigoPostal
                            ) : (
                              <Nota />
                            )}
                          </Typography>
                        </Grid>
                        <Grid
                          className={classes.gridpadding}
                          item
                          md={3}
                          sm={12}
                        >
                          <Typography
                            className={classes.titlegridModal}
                            align="left"
                            variant="subtitle2"
                          >
                            <b>Número exterior</b>
                          </Typography>
                          <Typography
                            className={classes.body2}
                            align="left"
                            variant="body2"
                          >
                            {selectedRegistro.particularSancionado
                              ?.domicilioMexico?.numeroExterior ? (
                              selectedRegistro.particularSancionado
                                .domicilioMexico.numeroExterior
                            ) : (
                              <Nota />
                            )}
                          </Typography>
                        </Grid>
                        <Grid
                          className={classes.gridpadding}
                          item
                          md={3}
                          sm={12}
                        >
                          <Typography
                            className={classes.titlegridModal}
                            align="left"
                            variant="subtitle2"
                          >
                            <b>Número interior</b>
                          </Typography>
                          <Typography
                            className={classes.body2}
                            align="left"
                            variant="body2"
                          >
                            {selectedRegistro.particularSancionado
                              ?.domicilioMexico?.numeroInterior ? (
                              selectedRegistro.particularSancionado
                                .domicilioMexico.numeroInterior
                            ) : (
                              <Nota />
                            )}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Grid>
                  )}

                  {selectedRegistro.particularSancionado
                    ?.domicilioExtranjero && (
                    <Grid item xs={12}>
                      <Grid item xs={12}>
                        <Typography className={classes.titulo} align={"center"}>
                          Domicilio extranjero
                        </Typography>
                      </Grid>
                      <Grid container>
                        <Grid
                          className={classes.gridpadding}
                          item
                          md={3}
                          sm={12}
                        >
                          <Typography
                            className={classes.titlegridModal}
                            align="left"
                            variant="subtitle2"
                          >
                            <b>País</b>
                          </Typography>
                          <Typography
                            className={classes.body2}
                            align="left"
                            variant="body2"
                          >
                            {selectedRegistro.particularSancionado
                              ?.domicilioExtranjero?.pais?.valor ? (
                              selectedRegistro.particularSancionado
                                .domicilioExtranjero.pais.valor
                            ) : (
                              <Nota />
                            )}
                          </Typography>
                        </Grid>
                        <Grid
                          className={classes.gridpadding}
                          item
                          md={3}
                          sm={12}
                        >
                          <Typography
                            className={classes.titlegridModal}
                            align="left"
                            variant="subtitle2"
                          >
                            <b>Calle</b>
                          </Typography>
                          <Typography
                            className={classes.body2}
                            align="left"
                            variant="body2"
                          >
                            {selectedRegistro.particularSancionado
                              ?.domicilioExtranjero?.calle ? (
                              selectedRegistro.particularSancionado
                                .domicilioExtranjero.calle
                            ) : (
                              <Nota />
                            )}
                          </Typography>
                        </Grid>
                        <Grid
                          className={classes.gridpadding}
                          item
                          md={3}
                          sm={12}
                        >
                          <Typography
                            className={classes.titlegridModal}
                            align="left"
                            variant="subtitle2"
                          >
                            <b>Ciudad / Localidad</b>
                          </Typography>
                          <Typography
                            className={classes.body2}
                            align="left"
                            variant="body2"
                          >
                            {selectedRegistro.particularSancionado
                              ?.domicilioExtranjero?.ciudadLocalidad ? (
                              selectedRegistro.particularSancionado
                                .domicilioExtranjero.ciudadLocalidad
                            ) : (
                              <Nota />
                            )}
                          </Typography>
                        </Grid>
                        <Grid
                          className={classes.gridpadding}
                          item
                          md={3}
                          sm={12}
                        >
                          <Typography
                            className={classes.titlegridModal}
                            align="left"
                            variant="subtitle2"
                          >
                            <b>Estado / Provincia</b>
                          </Typography>
                          <Typography
                            className={classes.body2}
                            align="left"
                            variant="body2"
                          >
                            {selectedRegistro.particularSancionado
                              ?.domicilioExtranjero?.estadoProvincia ? (
                              selectedRegistro.particularSancionado
                                .domicilioExtranjero.estadoProvincia
                            ) : (
                              <Nota />
                            )}
                          </Typography>
                        </Grid>
                        <Grid
                          className={classes.gridpadding}
                          item
                          md={3}
                          sm={12}
                        >
                          <Typography
                            className={classes.titlegridModal}
                            align="left"
                            variant="subtitle2"
                          >
                            <b>Código postal</b>
                          </Typography>
                          <Typography
                            className={classes.body2}
                            align="left"
                            variant="body2"
                          >
                            {selectedRegistro.particularSancionado
                              ?.domicilioExtranjero?.codigoPostal ? (
                              selectedRegistro.particularSancionado
                                .domicilioExtranjero.codigoPostal
                            ) : (
                              <Nota />
                            )}
                          </Typography>
                        </Grid>
                        <Grid
                          className={classes.gridpadding}
                          item
                          md={3}
                          sm={12}
                        >
                          <Typography
                            className={classes.titlegridModal}
                            align="left"
                            variant="subtitle2"
                          >
                            <b>Número exterior</b>
                          </Typography>
                          <Typography
                            className={classes.body2}
                            align="left"
                            variant="body2"
                          >
                            {selectedRegistro.particularSancionado
                              ?.domicilioExtranjero?.numeroExterior ? (
                              selectedRegistro.particularSancionado
                                .domicilioExtranjero.numeroExterior
                            ) : (
                              <Nota />
                            )}
                          </Typography>
                        </Grid>
                        <Grid
                          className={classes.gridpadding}
                          item
                          md={3}
                          sm={12}
                        >
                          <Typography
                            className={classes.titlegridModal}
                            align="left"
                            variant="subtitle2"
                          >
                            <b>Número interior</b>
                          </Typography>
                          <Typography
                            className={classes.body2}
                            align="left"
                            variant="body2"
                          >
                            {selectedRegistro.particularSancionado
                              ?.domicilioExtranjero?.numeroInterior ? (
                              selectedRegistro.particularSancionado
                                .domicilioExtranjero.numeroInterior
                            ) : (
                              <Nota />
                            )}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Grid>
                  )}
                  <Grid item xs={12}>
                    <Typography className={classes.titulo} align={"center"}>
                      Documentos
                    </Typography>
                  </Grid>
                  {!selectedRegistro.documentos ||
                  selectedRegistro.documentos.length < 1 ? (
                    <Typography
                      className={classes.body2}
                      align="left"
                      variant="body2"
                    >
                      <b>*No se proporcionaron documentos</b>
                    </Typography>
                  ) : (
                    ""
                  )}
                  {selectedRegistro.documentos &&
                    selectedRegistro.documentos.length > 0 && (
                      <DocumentTable documents={selectedRegistro.documentos} />
                    )}
                </Grid>
              </DialogContent>
            </Dialog>

            <TableContainer component={Paper}>
                    <Table aria-label="custom pagination table">
                        <TableHead className={classes.tableHead}>
                            <TableRow>
                                <StyledTableCell align="center" className={classes.tableHeaderColumn}><b>Expediente</b></StyledTableCell>
                                <StyledTableCell align="center"
                                                 className={classes.tableHeaderColumn}><b>Institución/Dependencia</b></StyledTableCell>
                                <StyledTableCell align="center" className={classes.tableHeaderColumn}><b>Nombre/Razón
                                    Social</b></StyledTableCell>
                                <StyledTableCell align="center" className={classes.tableHeaderColumn}><b>Tipo
                                    persona</b></StyledTableCell>
                                <StyledTableCell align="center" className={classes.tableHeaderColumn}><b>Tipo
                                    sanción</b></StyledTableCell>
                                <StyledTableCell align="center"
                                                 className={classes.tableHeaderColumn}><b>Acciones</b></StyledTableCell>
                            </TableRow>
                        </TableHead>
                        {S3PList.map((schema) => (
                            <TableBody key="usuarios">
                                <TableRow key={schema._id}>
                                    <StyledTableCell style={{width: 140}} align="center">
                                        {schema.expediente}
                                    </StyledTableCell>
                                    <StyledTableCell style={{width: 160}} align="center">
                                        {schema.institucionDependencia.nombre}
                                    </StyledTableCell>
                                    <StyledTableCell style={{width: 160}} align="center">
                                        {schema.particularSancionado.nombreRazonSocial}
                                    </StyledTableCell>
                                    <StyledTableCell style={{width: 160}} align="center">
                                        {(schema.particularSancionado.tipoPersona == "F") ? "Física" : "Moral"}
                                    </StyledTableCell>
                                    <StyledTableCell style={{width: 160}} align="left">
                                        {schema.tipoSancion?.map((sancion) => (
                                            <li>{sancion.valor + " "}</li>
                                        ))}
                                    </StyledTableCell>

                                    <StyledTableCell style={{width: 260}} align="center">
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
                                    colSpan={7}
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
    </>
  );
};

const redirectToRoute = (path) => {
  history.push(path);
};

export const S3P = s3p;

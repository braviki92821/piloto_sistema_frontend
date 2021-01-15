import { take, put, select } from 'redux-saga/effects';
import uuid from 'uuid';
import axios from 'axios';
import * as mutations from './mutations';
import path from "path";
import moment from 'moment'
import {alertActions} from "../_actions/alert.actions";
import {history} from "./history";
import {userConstants} from "../_constants/user.constants";
import {userActions} from "../_actions/user.action";
import {providerConstants} from "../_constants/provider.constants";
import {providerActions} from "../_actions/provider.action";
import {REQUEST_TOKEN_AUTH, requestTokenAuth} from "./mutations";
import {catalogConstants} from "../_constants/catalogs.constants";
import {catalogActions} from "../_actions/catalog.action";
const qs = require('querystring')
const jwt = require('jsonwebtoken');

const host = process.env.URLAPI;
const urOauth2 = host+process.env.PORTOAUTH
const ur= host+process.env.PORTAPI;
const clientId = process.env.CLIENTID;
const clientSecret = process.env.CLIENTSECRET;


export function* validationErrors(){
    while (true) {
        const {schema,systemId} = yield take (mutations.REQUEST_VALIDATION_ERRORS);
        const token = localStorage.token;
        if(token){
            if(systemId === "S2"){
                let SCHEMA = JSON.parse(schema);
                const respuestaArray = yield axios.post(ur + `/validateSchemaS2`,SCHEMA, { headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                        'Authorization': `Bearer ${token}`
                    }});
                yield put(mutations.setErrorsValidation(respuestaArray.data));
                console.info("got response",respuestaArray);
            }
        }
    }
}

export function* requestUserPerPage(){
    while (true) {
        const {objPaginationReq} = yield take(userConstants.USERS_PAGINATION_REQUEST);
        const token = localStorage.token;
        const respuestaArray = yield axios.post(ur + `/getUsersFull`,objPaginationReq,{ headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'Authorization': `Bearer ${token}`
            }});
        yield put(userActions.setPerPageSucces(respuestaArray.data.results));

    }
}


export function* requestProviderPerPage(){
    while (true) {
        const {objPaginationReq} = yield take(providerConstants.PROVIDERS_PAGINATION_REQUEST);
        const token = localStorage.token;
        const respuestaArray = yield axios.post(ur + `/getProvidersFull`,objPaginationReq, {headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'Authorization': `Bearer ${token}`
            }});
        yield put(providerActions.setPerPageSucces(respuestaArray.data.results));
        
    }
}

export function* fillTemporalUser(){
    while (true) {
        const {id} = yield take(userConstants.USER_TEMPORAL_REQUEST);
        const token = localStorage.token;
        if(token){
            let query = {"query" : {"_id" : id}};
            const respuestaArray = yield axios.post(ur + `/getUsers`, query, { headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'Authorization': `Bearer ${token}`
                }});
            yield put(userActions.setPerPageSucces(respuestaArray.data.results));
        }
    }
}

export function* fillTemporalProvider(){
    while (true) {
        const {id} = yield take(providerConstants.PROVIDER_TEMPORAL_REQUEST);
        const token = localStorage.token;
        if(token){
            let query = {"query" : {"_id" : id}};
            const respuestaArray = yield axios.post(ur + `/getProviders`, query,{ headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'Authorization': `Bearer ${token}`
                }});
            yield put(providerActions.setPerPageSucces(respuestaArray.data.results));
        }
    }
}

export function* fillAllProviders(){
    while (true){
        yield take(providerConstants.PROVIDERS_GETALL);
        const token = localStorage.token;
            const respuestaArray = yield axios.post(ur + `/getProvidersFull`,{},{ headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'Authorization': `Bearer ${token}`
                }});
            yield put(providerActions.setProvidersAll(respuestaArray.data.results));
    }
}
export function* deleteUser(){
    while (true) {
        const {id} = yield take (userConstants.DELETE_REQUEST);
        const token = localStorage.token;
        if(token){
            let request = {"_id": id};
            try{
                const {status} = yield axios.delete(ur + `/deleteUser`, { data : {request} , headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                        'Authorization': `Bearer ${token}`
                    } , validateStatus: () => true});
                if(status === 200){
                    yield put(userActions.deleteUserDo(id));
                    yield put(alertActions.success("Se elimino el usuario con exito"));
                }else{
                    //error in response
                    yield put(alertActions.error("El usuario NO fue eliminado"));
                }
            }catch (e) {
                yield put(alertActions.error("El usuario NO fue eliminado"));
            }
        }


    }
}

export function* deleteProvider(){
    while (true) {
        const {id} = yield take (providerConstants.DELETE_REQUEST);
        let request = {"_id": id};
        const token = localStorage.token;
        const {status} = yield axios.delete(ur + `/deleteProvider`, { data : {request} ,headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'Authorization': `Bearer ${token}`
            },validateStatus: () => true});
        if(status === 200){
            yield put(providerActions.deleteProviderDo(id));
            yield put(alertActions.success("Proveedor eliminado con exito"));
        }else{
            //error in response
        }
    }
}

export function* loginUser(){
    while (true){
        const {credentialUser} = yield take (mutations.REQUEST_TOKEN_AUTH);
        let userName = credentialUser.username;
        let password = credentialUser.password;

        const requestBody = {
            client_id: clientId,
            grant_type: 'password',
            username: userName,
            password: password,
            client_secret: clientSecret
        }

        try{
            const token = yield axios.post(urOauth2 + `/oauth/token`, qs.stringify(requestBody), { headers: {validateStatus: () => true ,'Content-Type': 'application/x-www-form-urlencoded' } });
            localStorage.setItem("token", token.data.access_token);
            history.push('/usuarios');
        }catch (err) {
if(err.response){
    yield put(alertActions.error(err.response.data.message));
}else{
    yield put(alertActions.error(err.toString()));
}


        }
    }
}

export function* verifyTokenGetUser(){
    while(true){
        const {token} = yield take (userConstants.USER_REQUEST_SESSION_SET);
        let payload = jwt.decode(token);
        yield put (userActions.setUserInSession(payload.idUser))
        console.log(payload.idUser);
    }
}

export function* closeSession(){
    while (true){
        yield take (userConstants.USER_SESSION_REMOVE);
        localStorage.removeItem("token");
        history.push('/login');
    }
}

export function* creationUser(){
    while (true) {
        const {usuarioJson} = yield take (mutations.REQUEST_CREATION_USER);
        let fechaActual = moment();
        usuarioJson["fechaAlta"]= fechaActual.format();
        usuarioJson["vigenciaContrasena"] = fechaActual.add(3 , 'months').format().toString();
        const token = localStorage.token;
        const {status} = yield axios.post(ur + `/create/user`,usuarioJson, {headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'Authorization': `Bearer ${token}`
            } , validateStatus: () => true});
        if(status === 200){
            //all OK
            yield put(alertActions.success("Usuario creado con exito"));
            history.push('/usuarios');
            yield put(alertActions.clear());
        }else{
            //error in response
        }
    }
}



export function* editUser(){
    while (true) {
        const {usuarioJson} = yield take (mutations.REQUEST_EDIT_USER);
        let fechaActual = moment();
        usuarioJson["fechaAlta"]= fechaActual.format();
        usuarioJson["vigenciaContrasena"] = fechaActual.add(3 , 'months').format().toString();
        const token = localStorage.token;
        const {status} = yield axios.put(ur + `/edit/user`,usuarioJson, {headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'Authorization': `Bearer ${token}`
            } , validateStatus: () => true});
        if(status === 200){
            //all OK
            yield put(alertActions.success("Usuario creado con exito"));
            history.push('/usuarios');
            yield put(alertActions.clear());
        }else{
            //error in response
        }
    }
}


export function* creationProvider(){
    while(true){
        const {usuarioJson} = yield take (mutations.REQUEST_CREATION_PROVIDER);
        let fechaActual =moment();
        if(usuarioJson["estatus"]==undefined || usuarioJson["estatus"]==null){
            usuarioJson["estatus"]=true;
            usuarioJson["fechaAlta"]=fechaActual.format();
        }else{
            /*if(usuarioJson["estatus"]==true){
                usuarioJson["estatus"]=true;
            }else{
                usuarioJson["estatus"]=false;
            }*/
            usuarioJson["fechaActualizacion"]=fechaActual.format();
        }
        const token = localStorage.token;
        const {status}  =yield axios.post(ur + `/create/provider`, usuarioJson, {headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'Authorization': `Bearer ${token}`
            } ,validateStatus: () => true});
        if(status === 200){
            //all OK
            yield put(alertActions.success("Proovedor creado con exito"));
            history.push('/proveedores');
            yield put(alertActions.clear());
        }else{
            //error in response
        }

    }
}


export function* editProvider(){
    while(true){
        const {usuarioJson} = yield take (mutations.REQUEST_EDIT_PROVIDER);
        let fechaActual =moment();
        if(usuarioJson["estatus"]==undefined || usuarioJson["estatus"]==null){
            usuarioJson["estatus"]=true;
            usuarioJson["fechaAlta"]=fechaActual.format();
        }else{
            /*if(usuarioJson["estatus"]==true){
                usuarioJson["estatus"]=true;
            }else{
                usuarioJson["estatus"]=false;
            }*/
            usuarioJson["fechaActualizacion"]=fechaActual.format();
        }
        const token = localStorage.token;
        const {status}  =yield axios.put(ur + `/edit/provider`, usuarioJson, {headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'Authorization': `Bearer ${token}`
            } ,validateStatus: () => true});
        if(status === 200){
            //all OK
            yield put(alertActions.success("Proovedor creado con exito"));
            history.push('/proveedores');
            yield put(alertActions.clear());
        }else{
            //error in response
        }

    }
}

export function* getCatalogGenero(){
    while(true){
        yield take (catalogConstants.GENERO_REQUEST);
        const token = localStorage.token;
        const respuestaArray = yield axios.post(ur + `/getCatalogs`,{docType: "genero"},{ headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'Authorization': `Bearer ${token}`
            }});
        yield put (catalogActions.setGeneroSucces(catalogs))
    }
}

import { S3SConstants } from '../_constants/s3s.constants';

export const S3SActions = {
    requestCreationS3S,
    setpaginationS3S,
    requestListS3S,
    setListS3S,
    deleteRecordRequest,
    deleteRecordDo,
    fillRegEdit,
    requestEditDo

};

function requestEditDo(values){
    return { type: S3SConstants.UPDATE_REG_S3S, values };
}

function fillRegEdit(id){
    return {type: S3SConstants.FILL_REG_S3S_EDIT, id }
}
function deleteRecordRequest(id){
    return {type: S3SConstants.DELETE_REQUEST, id }
}

function deleteRecordDo(id){
    return {type: S3SConstants.DELETE_OPERATION, id }
}

function requestListS3S(filters) {
    return { type: S3SConstants.REQUEST_LIST_S3S, filters };
}

function setListS3S(list) {
    return { type: S3SConstants.SET_LIST_S3S, list };
}

function requestCreationS3S(values) {
    return { type: S3SConstants.REQUEST_CREATION_S3S, values };
}

function setpaginationS3S(pagination) {
    return { type: S3SConstants.PAGINATION_SET_SCHEMA3S, pagination };
}

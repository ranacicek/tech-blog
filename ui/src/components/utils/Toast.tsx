import swal, { SweetAlertIcon } from 'sweetalert2';

const showAlert = (title: string, text: string, icon :SweetAlertIcon = 'error'): void => {
    swal.fire({
        title: title,
        text: text,
        icon: icon,
        confirmButtonText: 'okey',
    });
};

const showInfo = async (title: string, text: string) => {
    return await swal.fire({
        title: title,
        text: text,
        icon: 'info',
        confirmButtonText: 'OK',
    });
}; 

const showError = async (title: string, text: string) => {
    return await swal.fire({
        title: title,
        text: text,
        icon: 'error',
        confirmButtonText: 'OK',
    });
};

const showConfirm = async (title: string, text: string) => {
    return await swal.fire({
        title: title,
        text: text,
        icon: 'info',
        confirmButtonText: 'Yes',
        showCancelButton: true,
        cancelButtonText: "Cancel"
    });
}; 

export {showAlert, showInfo, showError, showConfirm};


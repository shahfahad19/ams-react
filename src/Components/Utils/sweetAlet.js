import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

export const showAlert = (type, title, text, showButton) => {
    MySwal.fire({
        title: title,
        text: text,
        icon: type,
        showConfirmButton: showButton,
        timer: showButton ? 999999 : 2500,
    });
};

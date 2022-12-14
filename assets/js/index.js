let login

//sweet alert

async function iniciar() {
    const {
        value: formValues
    } = await Swal.fire({
        title: 'Iniciar sesión, usuario y contraseña recomendado: admin, 1234',
        html: '<input id="swal-input1" class="swal2-input" placeholder="Usuario">' +
            '<input id="swal-input2" class="swal2-input" type="password" placeholder="Password">',
        focusConfirm: false,
        preConfirm: () => {
            return [
                document.getElementById('swal-input1').value,
                document.getElementById('swal-input2').value
            ]
        }
    })
    login = new inicioSesion (formValues[0], formValues[1])

}

// clases
class transaccion {
    constructor(nombre, cvu, monto, mensaje) {
        this.nombre = nombre;
        this.cvu = cvu;
        this.monto = monto;
        this.mensaje = mensaje;
    }
}
class inicioSesion {
    constructor(usuario, password) {
        this.usuario = usuario
        this.password = password
    }
}


//Traer usuarios del json

async function fetchUsuarios(){
    let llenarUsuarios = await fetch('./assets/js/data.json')
    return await llenarUsuarios.json()
}

let usuarios = []

fetchUsuarios().then(usuariosn => {
    usuarios = usuariosn
}) 

function inicializar() {
    transferencia();
    dolares();
    plazoFijo();
    prestamo();
}


//inicio de sesion


verificacion = 3

let password

async function iniciarSesion() {
    while (verificacion > 0) {
        let usuarioLogueado = localStorage.getItem("usuario");

        if (usuarioLogueado) {
            verificacion -= 3;
            let bienvenido = document.querySelector("#saludo");
            usuarioLogueado = JSON.parse(usuarioLogueado);
            login = usuarioLogueado;
            bienvenido.innerHTML = `Bienvenido ${usuarioLogueado.usuario} !!!`;

        } else {
            await iniciar();
            usuarios.forEach((usuario) => {
                if (
                    usuario.usuario === login.usuario &&
                    usuario.password === login.password
                ) {
                    verificacion -= 3;
                    const usuarioParseado = JSON.stringify(login);
                    localStorage.setItem("usuario", usuarioParseado);

                    let {
                        usuario
                    } = login;
                    Swal.fire({
                        icon: 'success',
                        title: 'Bienvenido!!!',
                        text: 'Su cuenta ha sido iniciada con exito, Bienvenido!!!',
                    });
                    let bienvenido = document.querySelector("#saludo");
                    bienvenido.innerHTML = `Bienvenido ${usuario} !!!`;
                }
            });

            if (verificacion > 0)
                await Swal.fire({
                    icon: 'error',
                    title: 'oops...',
                    text: 'Lo siento, el usuario o la contraseña son incorrectas, vuelve a intentarlo',
                });
        }
    }
    inicializar();
}

iniciarSesion()

//transferencias

function transferencia() {

    let {
        password
    } = login

    let inputNombre = document.querySelector("#nombre")

    let inputCvu = document.querySelector("#cvu")

    let inputDineroEnviar = document.querySelector("#dineroEnviar")

    let inputMensaje = document.querySelector("#mensaje")

    let enviarTransaccion = document.querySelector("#enviarTransaccion")

    let passwordTransferencia = document.querySelector("#passwordTransferencia")

    enviarTransaccion.addEventListener('click', () => {

        let receptor = new transaccion(

            inputNombre.value,

            inputCvu.value,

            inputDineroEnviar.value,

            inputMensaje.value)

        passwordTransferencia.value == password ?
            Swal.fire({
                icon: 'success',
                title: 'Transferecnia',
                text: `Gracias por confiar en nosotros! se ha realizado una transferencia a ${receptor.nombre} de un monto de $${receptor.monto}`,
            }) :
            Swal.fire({
                icon: 'error',
                title: 'oops...',
                text: `Contraseña incorrecta, vuelve a intantarlo!`,
            })
    })

}

//comprar dolares

function dolares() {

    const inputDolares = document.querySelector('#dolar')
    const inputPesos = document.querySelector('#peso')
    const inputImpuesto = document.querySelector('#impuestos')
    const passwordDolar = document.querySelector('#passwordDolar')
    let {
        password
    } = login

    function convertirAPesos() {
        return parseInt(inputDolares.value) * 240
    }

    function convertirADolares() {
        return parseInt(inputPesos.value) / 240
    }

    function convertirAImpuestos() {
        return parseInt(inputPesos.value) + (parseInt(inputPesos.value) * (75 / 100))
    }

    inputDolares.addEventListener('keyup', () => {

        inputPesos.value = convertirAPesos()

        inputImpuesto.value = convertirAImpuestos()

    })

    inputPesos.addEventListener('keyup', () => {

        inputDolares.value = convertirADolares()

        inputImpuesto.value = convertirAImpuestos()

    })
    let inputComprarDolares = document.querySelector("#inputComprarDolares")

    inputComprarDolares.addEventListener('click', () => {
        passwordDolar.value === password ? Swal.fire({
                icon: 'success',
                title: 'Comprar dolares',
                text: `Gracias por hacer su compra! usted compro una cantidad de ${inputDolares.value}$USD a un costo total de $${convertirAImpuestos()}`,
            }) :
            Swal.fire({
                icon: 'error',
                title: 'oops...',
                text: `La contraseña no es correcta, por favor vuelve a intentarlo!`,
            })
    })
}

//plazos fijos

function plazoFijo() {
    const inputDinero = document.querySelector("#dinero")
    const inputMeses = document.querySelector("#meses")
    const inputTotal = document.querySelector("#total")
    const passwordPlazo = document.querySelector('#passwordPlazo')
    let {
        password
    } = login

    const finalizarMeses = () => {
        return parseInt(inputDinero.value * (65.9 / 100))
    }

    const dineroTotal = () => {
        return parseInt(inputDinero.value) + (parseInt(inputDinero.value) * (65.9 / 100))
    }


    inputDinero.addEventListener('keyup', () => {

        inputMeses.value = Math.round(finalizarMeses())

        inputTotal.value = Math.round(dineroTotal())

    })

    const pedirPlazo = document.querySelector("#plazo")
    pedirPlazo.addEventListener('click', () => {
        passwordPlazo.value == password ?
            Swal.fire({
                icon: 'success',
                title: 'Plazo fijo',
                text: `Usted ha hecho un plazo fijo con exito!! usted a depositado $${inputDinero.value} y al finalizar 12 meses usted recibira $${inputMeses.value}. En total usted podra retirar al finalizar los meses una cantidad de $${inputTotal.value}`,
            }) :
            Swal.fire({
                icon: 'error',
                title: 'oops...',
                text: `La contraseña no es correcta, por favor vuelve a intentarlo`,
            })
    })
}

//prestamos


function prestamo() {
    let {
        password
    } = login
    const inputPedir = document.querySelector("#dineroPedir")
    const inputInteres = document.querySelector("#dineroInteres")
    const inputDineroFinal = document.querySelector("#dineroFinal")
    const passwordPrestamo = document.querySelector("#passwordPrestamo")
    const dineroInteres = () => {
        return parseInt(inputPedir.value) * (86 / 100)
    }
    const dineroFinal = () => {

        return parseInt(inputPedir.value) + (parseInt(inputPedir.value) * (86 / 100))

    }
    inputPedir.addEventListener('keyup', () => {
        inputInteres.value = dineroInteres()
    })
    inputPedir.addEventListener('keyup', () => {
        inputDineroFinal.value = dineroFinal()
    })

    let btnPrestamo = document.querySelector("#btnPrestamo")
    btnPrestamo.addEventListener('click', () => {
        passwordPrestamo.value == password ?
            Swal.fire({
                icon: 'success',
                title: 'Prestamo',
                text: `Usted ha pedido un prestamo de $${inputPedir.value} con un interes de $${inputInteres.value} y un plazo final a pagar de $${inputDineroFinal.value} en 12 meses`,
            }) :
            Swal.fire({
                icon: 'error',
                title: 'oops...',
                text: `La contraseña no es correcta, por favor vuelve a intentarlo`,
            })
    })
}
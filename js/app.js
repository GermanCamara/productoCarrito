//Traer productos de productos.json
const pedirDatos = async () => {
    const respuesta = await fetch("js/productos.json");
    const productos = await respuesta.json();
    const contenedorProductos = document.getElementById('contenedorProductos');
    productos.forEach(prod => {
        const div = document.createElement('div')
        div.classList.add("itemProducto")
        div.innerHTML = `
            <div class="col d-flex justifi-content-center mb-4">
            <div class="card shadow mb-1 bg-dark rounded" style="width: 20rem;">
                <h5 class="card-title pt-2 text-center text-primary">${prod.nombre}</h5>
                <span><button name="delete" class="deleteProducto btn-primary">x</button></span>
                <img src="img/${prod.imagen}" class="card-img-top" alt="...">
                <div class="card-body">
                    <p class="card-text text-white-50 description">${prod.descripcion}</p>
                    <h5 class="text-primary">Precio: <span class="precio">$ ${prod.precio}</span></h5>
                    <div class="d-grid gap-2">
                        <button class="btn btn-primary button">Añadir a Carrito</button>
                    </div>
                </div>
            </div>
        </div>
            `;
        contenedorProductos.append(div);
    })
    //Para añadir producto traido de json al carrito
    const clickButton = document.querySelectorAll('.button')
    clickButton.forEach(btn => {
        btn.addEventListener('click', addToCarritoItem)
    })
}
pedirDatos();
//----------------------------------------------------------------------------------------------------
//Productos creados por el usuario desde pestaña Añadir productos.
let productosLista = [];
//Class de producto
class Producto {
    constructor(nombre, precio, descripcion, imagen) {
        this.nombre = nombre;
        this.precio = precio;
        this.descripcion = descripcion;
        this.imagen = imagen;
    }
}
//Class de metodos para la interfaz
class UI {
    agregarProducto(producto) {
        const contenedorProductos = document.getElementById('contenedorProductos');
        const elementoNuevoCard = document.createElement('div');
        elementoNuevoCard.classList.add("itemProducto")
        elementoNuevoCard.innerHTML = `
        <div class="col d-flex justifi-content-center mb-4">
            <div class="card shadow mb-1 bg-dark rounded" style="width: 20rem;">
                <h5 class="card-title pt-2 text-center text-primary">${producto.nombre}</h5>
                <span><button name="delete" class="deleteProducto btn-primary">x</button></span>
                <img src="img/${producto.imagen}" class="card-img-top" alt="...">
                <div class="card-body">
                    <p class="card-text text-white-50 description">${producto.descripcion}</p>
                    <h5 class="text-primary">Precio: <span class="precio">$ ${producto.precio}</span></h5>
                    <div class="d-grid gap-2">
                        <button class="btn btn-primary button">Añadir a Carrito</button>
                    </div>
                </div>
            </div>
        </div>
        `
        contenedorProductos.appendChild(elementoNuevoCard)
        const clickButton = document.querySelectorAll('.button')
        console.log(clickButton);
        clickButton.forEach(btn => {
            btn.addEventListener('click', addToCarritoItem)
        })
    }
    añadirProductoLocalStorage() {
        localStorage.setItem('productosLista', JSON.stringify(productosLista))
    }
    resetearForm() {
        document.getElementById('formulario').reset();
    }
    eliminarProducto(elementoNuevoCard) {
        if (elementoNuevoCard.name === 'delete') {
            const btnDelete = elementoNuevoCard;
            const div = btnDelete.closest(".itemProducto");
            const title = div.querySelector(".card-title").textContent;
            console.log(title);
            for (let i = 0; i < productosLista.length; i++) {
                productosLista[i]["nombre"] === title && productosLista.splice(i, 1)     
                console.log(productosLista)  
            };
            elementoNuevoCard.parentElement.parentElement.parentElement.parentElement.remove();
            //Alert de producto eliminado
            Swal.fire({
                position: 'center',
                icon: 'error',
                title: 'Producto eliminado',
                showConfirmButton: false,
                timer: 1500
            })
        }
    }
}
//Dom eventos
//cuando el usuario suba imagen del formulario
const imagen = document.getElementById('imagen');
imagen.addEventListener('change', (e) => {
    const file = e.target.files[0];
});
//Cuando el usuario haga submit en el formulario
document.getElementById('formulario')
    .addEventListener("submit", function (e) {
        //Guarda en variables todos los valores del formulario
        const nombre = document.getElementById('nombre').value;
        const precio = document.getElementById('precio').value;
        const descripcion = document.getElementById('descripcion').value;
        const imagen = document.getElementById('imagen').value;
        //Creo el producto con el constructor pasandole los valores del formulario
        const producto = new Producto(nombre, precio, descripcion, imagen);
        productosLista.push(producto)
        //Traigo mediante una variable los metodos creados para la interfaz
        const ui = new UI();
        ui.agregarProducto(producto);
        ui.añadirProductoLocalStorage(); 
        ui.resetearForm();
        //Mensaje de alerta de producto agregado
        Swal.fire(
            'Agregado',
            'En lista de Productos.',
            'success'
        )
        e.preventDefault();
    })
//Cuando el usuario haga click en delete de los productos
document.getElementById('contenedorProductos')
    .addEventListener('click', function (e) {
        const ui = new UI();
        ui.eliminarProducto(e.target);  
        ui.añadirProductoLocalStorage();    
    })
//----------------------------------------------------------------------------------------------------
//Cuando los productos se añaden al carrito
//Selecciono todos los botones Añadir al Carrito
const clickButton = document.querySelectorAll('.button')
//Selecciona etiqueta en donde se van a añadir los productos renderisados
const tbody = document.querySelector('.tbody')
//Lista de productos que van al carrito
let carrito = []
//Recorro todos los botones con un escuchador de eventos para ejecutar funcion de añadir al carrito
clickButton.forEach(btn => {
    btn.addEventListener('click', addToCarritoItem)
})
//Funcion añadir al carrito
function addToCarritoItem(e) {
    //Guarda en variable button estructura del boton al que se le hizo click
    const button = e.target
    //Atributo Closest selecciona el elemento mas cercano con la clase card en este caso contenedor padre del producto
    const item = button.closest('.card')
    //Selecciona cada propiedad del producto con .textContent y .src
    const itemTitle = item.querySelector('.card-title').textContent;
    const itemPrecio = item.querySelector('.precio').textContent;
    const itemImg = item.querySelector('.card-img-top').src;
    //Para crear objeto de producto
    const newItem = {
        title: itemTitle,
        precio: itemPrecio,
        img: itemImg,
        cantidad: 1,
    }
    //Funcion para añadir producto a carrito.
    addItemCarrito(newItem)
}
//Funcion para añadir producto a carrito.
function addItemCarrito(newItem) {
    //Funcion para mostrar alert cada vez que se agregue producto a carrito
    const alert = document.querySelector('.alert')
    setTimeout(function () {
        alert.classList.add('hide')
    }, 1000)
    alert.classList.remove('hide')
    //Selecciona variable de cantidad
    const inputElemento = tbody.getElementsByClassName('input__elemento')
    //For para recorrer longitud del carrito
    for (let i = 0; i < carrito.length; i++) {
        if (carrito[i].title === newItem.title) {
            //Si la condicion se cumple se le suma al i del carrito 1 cantidad
            carrito[i].cantidad++;
            //Se suma cantidad
            const inputValue = inputElemento[i]
            inputValue.value++;
            //Suma del carrito
            carritoTotal()
            //Si se ejecuta el return null no se va a ejecutar push del newitem al carrito.
            return null;
        }
    }
    carrito.push(newItem)
    //Funcion para que lo que esta en la variable carrito se renderice
    renderCarrito()
}
function renderCarrito() {
    //Cada vez que se ejecute esta accion el tbody este vacio
    tbody.innerHTML = ''
    //Mapear producto de carrito
    carrito.map(item => {
        //creo variable que cree etiqueta tr y a esa etiqueta le agregue class itemCarrito
        const tr = document.createElement('tr')
        tr.classList.add("itemCarrito")
        //Creamos contenido que va a ir dentro de tr
        const content = ` 
    <th scope="row">1</th>
    <td class="table__productos">
    <img src=${item.img} alt="">
        <h6 class="title">${item.title}</h6>
    </td>
    <td class="table__precio">
        <p>${item.precio}</p>
    </td>
    <td class="table__cantidad"><input type="number" min="1" value=${item.cantidad} class="input__elemento">
        <button class="delete btn btn-primary">x</button>
    </td>
    `
        //Dentro del tr que se agrege content
        tr.innerHTML = content;
        //Que tr se agregue adentro de tbody
        tbody.append(tr)
        //Seleccionamos boton delete y le agregamos un escuchador para con una funcion removerlo
        tr.querySelector(".delete").addEventListener('click', removeItemCarrito)
        //Seleccionamos boton de cantidad y le ponemos evento change para sumar cantidad
        tr.querySelector(".input__elemento").addEventListener("change", sumaCantidad)
    })
    carritoTotal()
}
//Suma del carrito
function carritoTotal() {
    let total = 0;
    //Seleccionamos el elemento adonde va a ir el valor
    const itemCartTotal = document.querySelector('.itemCartTotal')
    carrito.forEach((item) => {
        //Tomamos el valor con el replace le quitamos el signo dolar para que solo tome el numero
        const precio = Number(item.precio.replace("$", ''))
        total = total + precio * item.cantidad
    })
    //Valor que se va a imprimir en el html
    itemCartTotal.innerHTML = `Total $${total}`
    addLocalStorage()
}
function removeItemCarrito(e) {
    const buttonDelete = e.target
    //Seleccionamos el componente padre del boton delete
    const tr = buttonDelete.closest(".itemCarrito")
    //Seleccionamos el elemento desde el title para removerlo del carrito usando for
    const title = tr.querySelector('.title').textContent;
    for (let i = 0; i < carrito.length; i++) {
        carrito[i].title.trim() === title.trim() && carrito.splice(i, 1)
    }
    //Muestra por alert producto removido
    const alert = document.querySelector('.remove')
    setTimeout(function () {
        alert.classList.add('remove')
    }, 1000)
    alert.classList.remove('remove')
    tr.remove()
    //Suma del carrito
    carritoTotal()
}
function sumaCantidad(e) {
    const sumaInput = e.target
    //Seleccionamos elemento padre de sumaInput
    const tr = sumaInput.closest(".itemCarrito")
    //Seleccionamos el title del elemento para modificarlo en carrito 
    const title = tr.querySelector('.title').textContent;
    carrito.forEach((item) => {
        if (item.title.trim() === title) {
            sumaInput.value < 1 ? (sumaInput.value = 1) : sumaInput.value;
            item.cantidad = sumaInput.value;
            carritoTotal()
        }
    })
}
//LOCAL STORAGE
function addLocalStorage() {
    localStorage.setItem('carrito', JSON.stringify(carrito))
}
window.onload = function () {
    const storage = JSON.parse(localStorage.getItem('carrito'));
    if (storage) {
        carrito = storage;
        renderCarrito()
    }
    const storage1 = JSON.parse(localStorage.getItem('productosLista'));
    if (storage1) {
        productosLista = storage1
        const contenedorProductos = document.getElementById('contenedorProductos');
        //Cada vez que se ejecute esta accion el tbody este vacio
        contenedorProductos.innerHTML = ''
        //Mapear producto de carrito
        productosLista.map(producto => {
            const elementoNuevoCard = document.createElement('div');
            elementoNuevoCard.classList.add("itemProducto")
            elementoNuevoCard.innerHTML = `
            <div class="col d-flex justifi-content-center mb-4">
            <div class="card shadow mb-1 bg-dark rounded" style="width: 20rem;">
                <h5 class="card-title pt-2 text-center text-primary">${producto.nombre}</h5>
                <span><button name="delete" class="deleteProducto btn-primary">x</button></span>
                <img src="img/${producto.imagen}" class="card-img-top" alt="...">
                <div class="card-body">
                    <p class="card-text text-white-50 description">${producto.descripcion}</p>
                    <h5 class="text-primary">Precio: <span class="precio">$ ${producto.precio}</span></h5>
                    <div class="d-grid gap-2">
                        <button class="btn btn-primary button">Añadir a Carrito</button>
                    </div>
                </div>
            </div>
        </div>
            `
            contenedorProductos.appendChild(elementoNuevoCard)
            // Para agregar añ carrito nuevo producto creado por el usuario.
            const clickButton = document.querySelectorAll('.button')
            clickButton.forEach(btn => {
                btn.addEventListener('click', addToCarritoItem)
            });
        });
}
}
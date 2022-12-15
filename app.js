
let productos = []

const pedirUsuarios = async() =>{
    const res = await fetch("/data.json")
    const data = await res.json()

    return data
}

const armarDatos = async() =>{
    productos = await pedirUsuarios()
    
    productos.forEach((product) => {
        let content = document.createElement("div");
        content.className = "card";
        content.innerHTML = `
            <img src="${product.img}">
            <h3>${product.nombre}</h3>
            <p class="price">${product.precio}$</p>
        `
        shopContent.append(content)
        
        let comprar = document.createElement("button")
        comprar.innerText = "Comprar"
        comprar.className = "comprar"

        content.append(comprar);

        comprar.addEventListener("click", () => {
        
            Toastify({
                text: "Agregado al carrito",
                duration: 3000,
                newWindow: true,
                close: true,
                gravity: "top", 
                position: "left", 
                stopOnFocus: true, 
                style: {
                background: "linear-gradient(to right, rgb(41, 78, 10), #96c93d)",
                },
                onClick: function(){}
            }).showToast();

        const repeat = carrito.some((repeatProduct) => repeatProduct.id === product.id);

        if(repeat){
            carrito.map((prod) => {
                if(prod.id === product.id){
                    prod.cantidad++;
                }
            })
        }else{
            carrito.push({
                id: product.id,
                img: product.img,
                nombre: product.nombre,
                precio: product.precio,
                cantidad: product.cantidad,
            });
        }
            console.log(carrito);
            console.log(carrito.length);
            carritoCounter();
            saveLocal();
        });
    });
}

armarDatos()

/* pedirUsuarios()
.then(
    (respuesta)=>{
        datos = respuesta
    }
)
.catch(
    (error)=>{
        console.log(error)
    }
)
.finally(
    ()=>{
        console.log(datos)
    }
) */

const shopContent = document.getElementById("shopContent")
const verCarrito = document.getElementById("verCarrito")
const modalContainer = document.getElementById("modal-container")
const cantidadCarrito = document.getElementById("cantidadCarrito")


let carrito = JSON.parse(localStorage.getItem("carrito")) || [];


/*carrito*/

const pintarCarrito= () => {
    modalContainer.innerHTML ="";
    modalContainer.style.display = "flex";
    const modalHeader = document.createElement("div");
    modalHeader.className = "modal-header"
    modalHeader.innerHTML = `
        <h1 class ="modal-header-title">Carrito</h1>
    `;
    modalContainer.append(modalHeader);

    const modalbutton = document.createElement("h1");
    modalbutton.innerText = "x";
    modalbutton.className = "modal-header-button";


    modalbutton.addEventListener("click", () =>{
        modalContainer.style.display = "none";
    })
    modalHeader.append(modalbutton)

    /*llamamos al carrito y lo recorremos*/

    carrito.forEach((product) =>{

        /*buscamos lo que hay en el carrito y se lo agregamos a div padre*/
        
        let carritoContent = document.createElement("div")
        carritoContent.className = "modal-content"
        carritoContent.innerHTML = `
            <img src="${product.img}">
            <h3>${product.nombre}</h3>
            <p>${product.precio} $</p>
            <span class = "restar">  -  </span>
            <p>Cantidad: ${product.cantidad}</p>
            <span class = "sumar">  +  </span>
            <p>Total: ${product.cantidad * product.precio} $</p>
            <span class = "delete-product"> ❌ </span>
        `;

        modalContainer.append(carritoContent)

        let restar = carritoContent.querySelector(".restar")

        restar.addEventListener("click", () => {
            if(product.cantidad !== 1){
            product.cantidad--;
            }
            saveLocal();
            pintarCarrito();
        })

        let sumar = carritoContent.querySelector(".sumar")

        sumar.addEventListener("click", () =>{
            product.cantidad++;
            saveLocal();
            pintarCarrito();
        })

        let eliminar = carritoContent.querySelector(".delete-product");

        eliminar.addEventListener("click", () => {
            eliminarProducto(product.id);
        })

    });

    const total = carrito.reduce((acc, el) => acc + el.precio * el.cantidad, 0 );

    const totalBuying = document.createElement("div")
    totalBuying.className = "total-content"
    totalBuying.innerHTML = `total a pagar: ${total} $`
    modalContainer.append(totalBuying);
};

verCarrito.addEventListener("click", pintarCarrito);


/**funcion eliminar producto */

const eliminarProducto = (id) => {
    const foundId = carrito.find((element) => element.id === id);

    carrito = carrito.filter((carritoId) => {
        return carritoId !== foundId;
    });
    carritoCounter();
    saveLocal();
    pintarCarrito();
}

/**pintar numero carrito */

const carritoCounter = () => {
    cantidadCarrito.style.display = "block";

    const carritoLength = carrito.length;

    localStorage.setItem("carritoLength", JSON.stringify(carritoLength));

    cantidadCarrito.innerText = JSON.parse(localStorage.getItem("carritoLength"));
}

carritoCounter();


/**local storage */

const saveLocal = () => {
    localStorage.setItem("carrito", JSON.stringify(carrito));
}


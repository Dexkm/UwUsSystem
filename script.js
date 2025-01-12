const productos = {
    "lay": ["Combo LayLay", 120, "3 Cafés del día + 3 Galletas"],
    "cat": ["Combo Cat", 120, "3 té matcha + 3 Tiramisú"],
    "spicy": ["Combo Spicy", 240, "3 ramen + 3 limonadas"],
    "kaching": ["Combo Kaching", 1200, "3 Cafés del día + 3 tiramisú + 1 ticket casino"],
    "gds": ["Combo Miau x GDS", 500, "3 té matcha + 3 galletas + 1 kit reparacion"],
    "xxl": ["Combo XXL", 480, "8 bebidas (3, 3 y 2) + 1 Pastel de chocolate"],
    "rasca": ["Rasca y Gana", 250, ""],
    "vodka": ["Supervodka", 75, ""],
    "cigarros": ["Cigarrillos", 80, ""],
    "galleta": ["Galleta", 20, ""],
    "cafe": ["Café", 20, ""],
    "cafe helado": ["Café helado", 20, ""],
    "te matcha": ["Té matcha", 20, ""],
    "tiramsu": ["Tiramisú", 20, ""],
    "pastel": ["Pastel", 320, ""],
};

let pedidos = [];

document.getElementById("btnAgregar").addEventListener("click", agregarPedido);
document.getElementById("btnBorrar").addEventListener("click", borrarPedido);
document.getElementById("btnFinalizar").addEventListener("click", finalizarPedido);
document.getElementById("btnCopiar").addEventListener("click", copiarAlPortapapeles);
document.getElementById("pedidoInput").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        agregarPedido();
    }
});

const btnMenu = document.createElement("button");
btnMenu.textContent = "?";
btnMenu.style.position = "absolute";
btnMenu.style.top = "10px";
btnMenu.style.right = "10px";
btnMenu.style.padding = "10px";
btnMenu.style.borderRadius = "50%";
btnMenu.style.backgroundColor = "#F9CADA";
btnMenu.style.color = "white";
btnMenu.style.border = "none";
btnMenu.style.cursor = "pointer";
btnMenu.addEventListener("click", mostrarMenu);
document.body.appendChild(btnMenu);

function mostrarMenu() {
    const menuDescripcion = document.createElement("div");
    menuDescripcion.style.position = "fixed";
    menuDescripcion.style.top = "50%";
    menuDescripcion.style.left = "50%";
    menuDescripcion.style.transform = "translate(-50%, -50%)";
    menuDescripcion.style.padding = "20px";
    menuDescripcion.style.backgroundColor = "white";
    menuDescripcion.style.border = "2px solid #F9CADA";
    menuDescripcion.style.borderRadius = "10px";
    menuDescripcion.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.1)";
    menuDescripcion.style.textAlign = "left";
    menuDescripcion.style.zIndex = "1000";
    menuDescripcion.innerHTML = `
        <h2>Descripción de Comandos</h2>
        <p><strong>lay:</strong> Combo LayLay - 3 Cafés del día + 3 Galletas</p>
        <p><strong>cat:</strong> Combo Cat - 3 té matcha + 3 Tiramisú</p>
        <p><strong>spicy:</strong> Combo Spicy - 3 ramen + 3 limonadas</p>
        <p><strong>kaching:</strong> Combo Kaching - 3 Cafés del día + 3 tiramisú + 1 ticket casino</p>
        <p><strong>gds:</strong> Combo Miau x GDS - 3 té matcha + 3 galletas + 1 kit reparacion</p>
        <p><strong>xxl:</strong> Combo XXL - 8 bebidas (3, 3 y 2) + 1 Pastel de chocolate</p>
        <h3>Comandos Individuales</h3>
        <p><strong>rasca:</strong> Rasca y Gana</p>
        <p><strong>vodka:</strong> Supervodka</p>
        <p><strong>cigarros:</strong> Cigarrillos</p>
        <p><strong>galleta:</strong> Galleta</p>
        <p><strong>cafe:</strong> Café</p>
        <p><strong>cafe helado:</strong> Café helado</p>
        <p><strong>te matcha:</strong> Té matcha</p>
        <p><strong>tiramsu:</strong> Tiramisú</p>
        <p><strong>pastel:</strong> Pastel</p>
        <button id="cerrarMenu">Cerrar</button>
    `;
    document.body.appendChild(menuDescripcion);

    document.getElementById("cerrarMenu").addEventListener("click", () => {
        menuDescripcion.remove();
    });
}

function agregarPedido() {
    const input = document.getElementById("pedidoInput").value.trim();
    if (!input) return;

    const elementos = input.split("+").map(e => e.trim());
    let totalCombinado = 0;
    let detalles = [];

    elementos.forEach(elemento => {
        let [productoKey, cantidad = "1"] = elemento.split(" x").map(e => e.trim());
        cantidad = parseInt(cantidad);

        if (productos[productoKey]) {
            const [nombre, precio, receta] = productos[productoKey];
            const precioTotal = precio * cantidad;
            detalles.push(`${nombre} x${cantidad}`);
            totalCombinado += precioTotal;
            pedidos.push([productoKey, `${nombre} x${cantidad}`, precioTotal, receta]);
        }
    });

    if (detalles.length) {
        const item = document.createElement("li");
        item.textContent = `${detalles.join(" + ")} = $${totalCombinado}`;
        item.addEventListener("click", mostrarOcultarReceta);
        document.getElementById("listaPedidos").appendChild(item);
        actualizarTotal();
    }
}

function borrarPedido() {
    if (pedidos.length) {
        pedidos.pop();
        document.getElementById("listaPedidos").lastChild.remove();
        actualizarTotal();
    }
}

function finalizarPedido() {
    const total = pedidos.reduce((sum, p) => sum + p[2], 0);
    const resumen = pedidos.map(p => `${p[1]} = $${p[2]}`).join("\n") + `\n\nTotal a pagar: $${total}`;

    document.getElementById("listaPedidos").innerHTML = "<li>❤️ Resumen de tu Pedido ❤️</li>";
    resumen.split("\n").forEach(line => {
        const item = document.createElement("li");
        item.textContent = line;
        document.getElementById("listaPedidos").appendChild(item);
    });

    document.getElementById("totalLabel").textContent = "Total: $0";
    document.getElementById("btnCopiar").style.display = "block";
}

function mostrarOcultarReceta(event) {
    const texto = event.target.textContent;
    const nombreCombo = texto.split(" =")[0];
    const recetaElement = event.target.querySelector(".receta");

    if (!recetaElement) {
        for (const pedido of pedidos) {
            if (pedido[1].includes(nombreCombo) && pedido[3]) {
                const recetaDiv = document.createElement("div");
                recetaDiv.className = "receta";
                recetaDiv.style.fontSize = "14px";
                recetaDiv.style.color = "#555";
                recetaDiv.style.marginTop = "5px";
                recetaDiv.textContent = `Receta: ${pedido[3]}`;
                event.target.appendChild(recetaDiv);
                break;
            }
        }
    } else {
        recetaElement.remove();
    }
}

function copiarAlPortapapeles() {
    const total = pedidos.reduce((sum, p) => sum + p[2], 0);
    const resumen = pedidos.map(p => `${p[1]} = $${p[2]}`).join("\n") + `\n\nTotal a pagar: $${total}`;
    navigator.clipboard.writeText(resumen).then(() => {
        alert("Resumen copiado al portapapeles.");
    });
}

function actualizarTotal() {
    const total = pedidos.reduce((sum, p) => sum + p[2], 0);
    document.getElementById("totalLabel").textContent = `Total: $${total}`;
}

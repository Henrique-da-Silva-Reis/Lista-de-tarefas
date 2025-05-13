function salvarRegistro(event) {
    event.preventDefault();

    const conteudo = document.getElementById("conteudo").value;
    const tipo = document.getElementById("tipo").value;
    const subtipo = document.getElementById("subtipo").value;
    const dia = document.getElementById("dia").value;

    const novoRegistro = { conteudo, tipo, subtipo, dia };

    let registros = JSON.parse(localStorage.getItem("registros")) || [];
    registros.push(novoRegistro);
    localStorage.setItem("registros", JSON.stringify(registros));

    document.getElementById("registroForm").reset();
    listarRegistros();
    mostrarAfazeresPorDia();
}

function apagarRegistro(index) {
    let registros = JSON.parse(localStorage.getItem("registros")) || [];
    registros.splice(index, 1);
    localStorage.setItem("registros", JSON.stringify(registros));
    listarRegistros();
    mostrarAfazeresPorDia();
}

function listarRegistros() {
    const lista = document.getElementById("listaRegistros");
    lista.innerHTML = "";

    const filtro = document.getElementById("filtroTipo").value;
    const registros = JSON.parse(localStorage.getItem("registros")) || [];

    registros.forEach((reg, index) => {
        if (filtro === "todos" || reg.tipo === filtro) {
            const li = document.createElement("li");
            const subtipoTexto = reg.subtipo ? ` - ${reg.subtipo}` : "";

            let conteudoExibido;
            if (reg.conteudo.startsWith("http://") || reg.conteudo.startsWith("https://")) {
                conteudoExibido = `<a href="${reg.conteudo}" target="_blank">${reg.conteudo}</a>`;
            } else {
                conteudoExibido = reg.conteudo;
            }

            li.innerHTML = `
                [${reg.dia}] (${reg.tipo}${subtipoTexto}) - ${conteudoExibido}
                <button class="apagar-btn" onclick="apagarRegistro(${index})">X</button>
            `;
            lista.appendChild(li);
        }
    });
}

function mostrarAfazeresPorDia() {
    const registros = JSON.parse(localStorage.getItem("registros")) || [];
    const container = document.getElementById("afazeresPorDia");
    container.innerHTML = "";

    const dias = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];

    dias.forEach(dia => {
        const doDia = registros.filter(reg => reg.dia === dia);
        if (doDia.length > 0) {
            const div = document.createElement("div");
            div.classList.add("afazeres-dia");

            const titulo = document.createElement("h3");
            titulo.textContent = dia;
            div.appendChild(titulo);

            doDia.forEach(reg => {
                const item = document.createElement("p");
                const subtipoTexto = reg.subtipo ? ` - ${reg.subtipo}` : "";
                item.textContent = `(${reg.tipo}${subtipoTexto}) - ${reg.conteudo}`;
                div.appendChild(item);
            });

            container.appendChild(div);
        }
    });
}

function alternarListaRegistros(event) {
    const container = document.getElementById("containerRegistros");
    const botao = event.target;

    if (container.style.display === "none") {
        container.style.display = "block";
        botao.textContent = "Esconder Registros";
        listarRegistros(); // Atualiza a lista assim que o botão é clicado
    } else {
        container.style.display = "none";
        botao.textContent = "Mostrar Registros";
    }
}

document.getElementById("registroForm").addEventListener("submit", salvarRegistro);
document.getElementById("filtroTipo").addEventListener("change", listarRegistros);

window.onload = () => {
    listarRegistros();
    mostrarAfazeresPorDia();
};

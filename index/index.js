// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
var rq = require("electron-require");
const {ipcRenderer} = rq("electron");

const sqlite3 = rq ("sqlite3").verbose()
var db = new sqlite3.Database("./database/pedidos.db")
db.on("error", dbError)


function dbError (error){
    document.getElementById("rowError").classList.remove("none");
    document.getElementById("divError").innerHTML = "Erro ao ir buscar no banco de dados";
    console.error(error);
}

function btnCadastroClientes (){

    document.getElementById("container-index").classList.add("none");
    document.getElementById("container-cadastro-cliente").classList.remove("none");

    //ipcRenderer.send ("hideMainWindow", true);

    //let modal = window.open('../cadastrocliente/cadastrocliente.html', 'CadastroCliente', "minimizable, maximizable, resizable")

}

function btnCadastroMercadorias (){

    document.getElementById("container-index").classList.add("none");
    document.getElementById("container-cadastro-mercadoria").classList.remove("none");
    
    //ipcRenderer.send ("hideMainWindow", true);

    //let modal = window.open('../cadastromercadoria/cadastromercadoria.html', 'CadastroMercadoria', "minimizable, maximizable, resizable")

}
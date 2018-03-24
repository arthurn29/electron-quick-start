function preencheDadosCliente (row) {
    document.getElementById("txtIdCliente").value = row.id;
    document.getElementById("txtCliente").value = row.cliente;
    document.getElementById("txtCidade").value = row.cidade;
    document.getElementById("txtTelefones").value = row.telefone;
    document.getElementById("txtContato").value = row.contato;
    document.getElementById("txtRepresentante").value = row.representante;
}

function atualizaInfosCliente() {
    db.serialize(function (){
        let query = "select count(id) as rownumber from (select id from Clientes where cliente <= "+
        "(select cliente from Clientes where cliente='"+document.getElementById("txtCliente").value+
        "' and cidade='"+document.getElementById("txtCidade").value+
        "' and telefone='"+document.getElementById("txtTelefones").value+
        "' and contato='"+document.getElementById("txtContato").value+
        "' and representante='"+document.getElementById("txtRepresentante").value+
        "' order by cliente limit 1) order by cliente)";
        db.get(query,
        function (err, row) {
            if (row != undefined)
                document.getElementById("txtIndiceCliente").innerHTML = row.rownumber;
        });
        db.get ("select distinct id, count(id) as num from Clientes;",
        function (err, row)  {
            if (row != undefined)
                document.getElementById("txtCountCliente").innerHTML = row.num;
        });
    });
}

function onChargeCliente (){
    db.parallelize(function (){
        db.get("select id, cliente, cidade, telefone, contato, representante "+
        "from Clientes order by cliente limit 1;",
        function (err, row)  {
            if (row != undefined)
                preencheDadosCliente(row);
            else
                document.getElementById("txtIndiceCliente").innerHTML = 0;
        });
        db.get ("select distinct id, count(id) as num from Clientes;",
            function (err, row)  {
                document.getElementById("txtCountCliente").innerHTML = row.num;
            }
        );
    })
}

function onCloseCliente (){
    document.getElementById("container-cadastro-cliente").classList.add("none");
    document.getElementById("container-index").classList.remove("none");
}

function onNewCliente (){
    preencheDadosCliente({id:0, cliente:"", cidade:"", telefone:"", contato:"", representante:""});
    document.getElementById("txtIndiceCliente").innerHTML = "0";
}

function onFirstCliente (){
    db.parallelize(function (){
        db.get("select id, cliente, cidade, telefone, contato, representante "+
        "from Clientes order by cliente limit 1;",
        function (err, row)  {
            if (row != undefined){
                preencheDadosCliente(row);
                document.getElementById("txtIndiceCliente").innerHTML = "1";
            }
        })
    })
}

function onLastCliente (){
    db.parallelize(function (){
        db.get("select id, cliente, cidade, telefone, contato, representante "+
        "from Clientes order by cliente limit 1 offset "+
        (parseInt(document.getElementById("txtCountCliente").innerHTML) - 1) + ";",
        function (err, row)  {
            if (row != undefined){
                preencheDadosCliente(row);
                document.getElementById("txtIndiceCliente").innerHTML = parseInt(document.getElementById("txtCountCliente").innerHTML);
            }
        })
    })
}

function onNextCliente (){
    db.parallelize(function (){

        let pos = parseInt(document.getElementById("txtIndiceCliente").innerHTML);
        let count = parseInt(document.getElementById("txtCountCliente").innerHTML);
        if (pos < count){
            pos++;
            db.get("select id, cliente, cidade, telefone, contato, representante "+
            "from Clientes order by cliente limit 1 offset "+
            (pos - 1) + ";",
            function (err, row)  {
                if (row != undefined){
                    preencheDadosCliente(row);
                    document.getElementById("txtIndiceCliente").innerHTML = pos;
                }
            })
        }
    })
}

function onBackCliente (){
    db.parallelize(function (){

        let pos = parseInt(document.getElementById("txtIndiceCliente").innerHTML);
        let count = parseInt(document.getElementById("txtCountCliente").innerHTML);
        if (pos > 1){
            pos--
            db.get("select id, cliente, cidade, telefone, contato, representante "+
            "from Clientes order by cliente limit 1 offset "+
            (pos - 1) + ";",
            function (err, row)  {
                if (row != undefined){
                    preencheDadosCliente(row);
                    document.getElementById("txtIndiceCliente").innerHTML = pos;
                }
            });
        }
    })
}

function onSaveCliente (){
    db.serialize (function(){
        
        let id = parseInt(document.getElementById("txtIdCliente").value);
        let pos = parseInt(document.getElementById("txtIndiceCliente").innerHTML);

        if (id == 0){
            db.run ("insert into Clientes (cliente, cidade, telefone, contato, representante) values (?,?,?,?,?)",
            document.getElementById("txtCliente").value,
            document.getElementById("txtCidade").value,
            document.getElementById("txtTelefones").value,
            document.getElementById("txtContato").value,
            document.getElementById("txtRepresentante").value,
            function (err, row)  {
                atualizaInfosCliente();
            });
        }else{
            db.run ("update Clientes set (cliente, cidade, telefone, contato, representante) = (?,?,?,?,?) where id=?",
            document.getElementById("txtCliente").value,
            document.getElementById("txtCidade").value,
            document.getElementById("txtTelefones").value,
            document.getElementById("txtContato").value,
            document.getElementById("txtRepresentante").value,
            document.getElementById("txtIdCliente").value,
            function (err, row)  {
                atualizaInfosCliente();
            });
        }
        
    })
}

function onDeleteCliente (){
    db.serialize (function(){
        let id = document.getElementById("txtIdCliente").value;
        let condicao = parseInt(document.getElementById("txtCountCliente").innerHTML) == parseInt(document.getElementById("txtIndiceCliente").innerHTML);
        db.run ("DELETE from Clientes where id = "+id+";",
        function (err, ret)  {
            
            if (parseInt(document.getElementById("txtCountCliente").innerHTML) == 1){
                onNewCliente();
                document.getElementById("txtCountCliente").innerHTML = (parseInt(document.getElementById("txtCountCliente").innerHTML)-1);
            }else{
                if (parseInt(document.getElementById("txtCountCliente").innerHTML) > 1){
                    document.getElementById("txtCountCliente").innerHTML = (parseInt(document.getElementById("txtCountCliente").innerHTML)-1);
                    if (condicao){
                        onBack();
                    }else{

                        let pos = parseInt(document.getElementById("txtIndiceCliente").innerHTML);

                        db.get("select id, cliente, cidade, telefone, contato, representante "+
                        "from Clientes order by cliente limit 1 offset "+
                        (pos - 1) + ";",
                        function (err, row)  {
                            if (row != undefined){
                                preencheDadosCliente(row);
                            }
                        })
                    }
                }
            }
        })

    })
}

function onPesquisaCliente (){

    db.serialize(function (){
        db.get("select id, cliente, cidade, telefone, contato, representante from Clientes where cliente like '%"+
        document.getElementById("txtPesquisaCliente").value+"%' order by cliente limit 1",
        function (err, row){
            if (row != undefined){
                preencheDadosCliente(row);
                atualizaInfosCliente();
            }
        });
    });

}
function validaValorMercadoria(){
    let valor = document.getElementById("txtValor").value;
    let regex = /^[0-9]*[,][0-9]{2}/;
    if (regex.test(valor)){
        document.getElementById("divValidaValorMercadoria").innerHTML = "Sucesso";
        document.getElementById("divValidaValorMercadoria").classList.add("alert-success");
        document.getElementById("divValidaValorMercadoria").classList.remove("alert-danger");
        document.getElementById("divValidaValorMercadoria").classList.remove("none");
    }else{
        document.getElementById("divValidaValorMercadoria").innerHTML = "Valor Errado";
        document.getElementById("divValidaValorMercadoria").classList.add("alert-danger");
        document.getElementById("divValidaValorMercadoria").classList.remove("alert-success");
        document.getElementById("divValidaValorMercadoria").classList.remove("none");
    }
}
function preencheDadosMercadoria(row) {
    document.getElementById("txtIdMercadoria").value = row.id;
    document.getElementById("txtMercadoria").value = row.mercadoria;
    document.getElementById("txtValor").value = row.valor;
}

function atualizaInfosMercadoria() {
    db.serialize(function (){
        let query = "select count(id) as rownumber from (select id from Mercadorias where mercadoria <= "+
        "(select mercadoria from Mercadorias where mercadoria='"+document.getElementById("txtMercadoria").value+
        "' and valor='"+document.getElementById("txtValor").value+
        "' order by mercadoria limit 1) order by mercadoria)";
        db.get(query,
        function (err, row) {
            if (row != undefined)
                document.getElementById("txtIndiceMercadoria").innerHTML = row.rownumber;
        });
        db.get ("select distinct id, count(id) as num from Mercadorias;",
        function (err, row)  {
            if (row != undefined)
                document.getElementById("txtCountMercadoria").innerHTML = row.num;
        });
    });
}

function onChargeMercadoria (){
    db.parallelize(function (){
        db.get("select id, mercadoria, valor "+
        "from Mercadorias order by mercadoria limit 1;",
        function (err, row)  {
            if (row != undefined)
                preencheDadosMercadoria(row);
            else
                document.getElementById("txtIndiceMercadoria").innerHTML = 0;
        });
        db.get ("select distinct id, count(id) as num from Mercadorias;",
            function (err, row)  {
                document.getElementById("txtCountMercadoria").innerHTML = row.num;
            }
        );
    })
}

function onCloseMercadoria (){
    document.getElementById("container-cadastro-mercadoria").classList.add("none");
    document.getElementById("container-index").classList.remove("none");

}

function onNewMercadoria (){
    preencheDadosMercadoria({id:0, mercadoria:"", valor:""});
    document.getElementById("txtIndiceMercadoria").innerHTML = "0";
    document.getElementById ("divValidaValorMercadoria").classList.add("none");
    
}

function onFirstMercadoria (){
    db.parallelize(function (){
        db.get("select id, mercadoria, valor "+
        "from Mercadorias order by mercadoria limit 1;",
        function (err, row)  {
            if (row != undefined){
                preencheDadosMercadoria(row);
                document.getElementById("txtIndiceMercadoria").innerHTML = "1";
            }
        })
    })
}

function onLastMercadoria (){
    db.parallelize(function (){
        db.get("select id, mercadoria, valor "+
        "from Mercadorias order by mercadoria limit 1 offset "+
        (parseInt(document.getElementById("txtCountMercadoria").innerHTML) - 1) + ";",
        function (err, row)  {
            if (row != undefined){
                preencheDadosMercadoria(row);
                document.getElementById("txtIndiceMercadoria").innerHTML = parseInt(document.getElementById("txtCountMercadoria").innerHTML);
            }
        })
    })
}

function onNextMercadoria (){
    db.parallelize(function (){

        let pos = parseInt(document.getElementById("txtIndiceMercadoria").innerHTML);
        let count = parseInt(document.getElementById("txtCountMercadoria").innerHTML);
        if (pos < count){
            pos++;
            db.get("select id, mercadoria, valor "+
            "from Mercadorias order by mercadoria limit 1 offset "+
            (pos - 1) + ";",
            function (err, row)  {
                if (row != undefined){
                    preencheDadosMercadoria(row);
                    document.getElementById("txtIndiceMercadoria").innerHTML = pos;
                }
            })
        }
    })
}

function onBackMercadoria (){
    db.parallelize(function (){

        let pos = parseInt(document.getElementById("txtIndiceMercadoria").innerHTML);
        let count = parseInt(document.getElementById("txtCountMercadoria").innerHTML);
        if (pos > 1){
            pos--
            db.get("select id, mercadoria, valor "+
            "from Mercadorias order by mercadoria limit 1 offset "+
            (pos - 1) + ";",
            function (err, row)  {
                if (row != undefined){
                    preencheDadosMercadoria(row);
                    document.getElementById("txtIndiceMercadoria").innerHTML = pos;
                }
            });
        }
    })
}

function onSaveMercadoria (){
    db.serialize (function(){
        
        let id = parseInt(document.getElementById("txtIdMercadoria").value);
        let pos = parseInt(document.getElementById("txtIndiceMercadoria").innerHTML);

        if (id == 0){
            db.run ("insert into Mercadorias (mercadoria, valor) values (?,?)",
            document.getElementById("txtMercadoria").value,
            document.getElementById("txtValor").value,
            function (err, row)  {
                if (row != undefined)
                    atualizaInfosMercadoria();
            });
        }else{
            db.run ("update Mercadorias set (mercadoria, valor) = (?,?) where id=?",
            document.getElementById("txtMercadoria").value,
            document.getElementById("txtValor").value,
            document.getElementById("txtIdMercadoria").value,
            function (err, row)  {
                if (row != undefined)
                    atualizaInfosMercadoria();
            });
        }
        
    })
}

function onDeleteMercadoria (){
    db.serialize (function(){
        let id = document.getElementById("txtIdMercadoria").value;
        let condicao = parseInt(document.getElementById("txtCountMercadoria").innerHTML) == parseInt(document.getElementById("txtIndiceMercadoria").innerHTML);
        db.run ("DELETE from Mercadorias where id = "+id+";",
        function (err, ret)  {
            
            if (parseInt(document.getElementById("txtCountMercadoria").innerHTML) == 1){
                onNewMercadoria();
                document.getElementById("txtCountMercadoria").innerHTML = (parseInt(document.getElementById("txtCountMercadoria").innerHTML)-1);
            }else{
                if (parseInt(document.getElementById("txtCountMercadoria").innerHTML) > 1){
                    document.getElementById("txtCountMercadoria").innerHTML = (parseInt(document.getElementById("txtCountMercadoria").innerHTML)-1);
                    if (condicao){
                        onBack();
                    }else{

                        let pos = parseInt(document.getElementById("txtIndiceMercadoria").innerHTML);

                        db.get("select id, mercadoria, valor "+
                        "from Mercadorias order by mercadoria limit 1 offset "+
                        (pos - 1) + ";",
                        function (err, row)  {
                            if (row != undefined)
                                preencheDadosMercadoria(row);
                        })
                    }
                }
            }
        })

    })
}

function onPesquisaMercadoria (){

    db.serialize(function (){
        db.get("select id, mercadoria, valor from Mercadorias where mercadoria like '%"+
        document.getElementById("txtPesquisaMercadoria").value+"%' order by mercadoria limit 1",
        function (err, row){
            if (row != undefined){
                preencheDadosMercadoria(row);
                atualizaInfosMercadoria();
            }
        });
    });

}
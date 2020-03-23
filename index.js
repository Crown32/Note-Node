const express=require("express");
const app=express();
const fs=require("fs");
const handlebars=require("express-handlebars");
const bodyParser=require("body-parser");

//config
    //template engine
    app.engine('handlebars', handlebars({defaultLayout:"main"}));
    app.set("view engine","handlebars");
    //Body Parser
    app.use(bodyParser.urlencoded({extended:false}));
    app.use(bodyParser.json());


//Página Home
app.get("/",(req,res)=>{
    const notas=fs.readFile("./storage/notas.txt",(err,data)=>{
        
        if(data.toString("utf-8")=="" ||data.toString("utf-8")=="[]"){
            res.render("homeNull");
        }else{
            const notas=JSON.parse(data);
            res.render("home",{notas:notas});
        }
    });
    
});

//Página para adicionar notas
app.get("/adicionar", (req,res)=>{
    res.render("adicionar");
});

//Script para adicionar notas
app.post("/add",(req,res)=>{
    const teste=fs.readFile("./storage/notas.txt",(err,data)=>{
        var titulo=req.body.titulo;
        const conteudo=req.body.conteudo;
        const id=Math.floor(Math.random()*1000000001);
        if(data.toString("utf-8")==""&&titulo!=""){
            fs.readFile("./storage/notas.txt",(err,data)=>{
                const objNotas=[{"titulo":titulo,"conteudo":conteudo,"id":id}];
                const notasProntas=JSON.stringify(objNotas);
                fs.writeFile("./storage/notas.txt",notasProntas,(err)=>{
                    if (err) throw err;
                    res.redirect("/");
                    })
                });
        }else if((titulo==""&&data.toString("utf-8")=="")||(titulo==""&&data.toString("utf-8")=="[]")){        
            titulo="Nota sem titulo";
            fs.readFile("./storage/notas.txt",(err,data)=>{
                const objNotas=[{"titulo":titulo,"conteudo":conteudo,"id":id}];
                const notasProntas=JSON.stringify(objNotas);
                fs.writeFile("./storage/notas.txt",notasProntas,(err)=>{
                    if (err) throw err;
                    res.redirect("/");
                    })
                });
        }else if(titulo=="" && data.toString("utf-8")!="[]"){
            const notas=JSON.parse(data);
            const titulo="Nota sem titulo";
            const objNotas={"titulo":titulo,"conteudo":conteudo,"id":id};
            notas.unshift(objNotas);
            const notasProntas=JSON.stringify(notas);
            fs.writeFile("./storage/notas.txt",notasProntas,(err)=>{
            if (err) throw err;
            res.redirect("/")
            });
        }else{
            const notas=JSON.parse(data); 
            const objNotas={"titulo":titulo,"conteudo":conteudo,"id":id};
            notas.unshift(objNotas);
            const notasProntas=JSON.stringify(notas);
            fs.writeFile("./storage/notas.txt",notasProntas,(err)=>{
            if (err) throw err;
            res.redirect("/")
            });
        }
    });

});

//Para deletar notas
app.get("/deletar/:id", (req,res)=>{
    fs.readFile("./storage/notas.txt",(err,data)=>{
        const notas=JSON.parse(data);
        const id=req.params.id;
        const dataLength=notas.length;
        for(var i=1;i<=dataLength;i++){
            var id1=notas[i-1]["id"];
            if(id1==id){
                var notaDeletada=notas.splice(i-1,1);
                var notasAtualizadas=JSON.stringify(notas);
                fs.writeFile("./storage/notas.txt", notasAtualizadas,(err)=>{
                 if (err) throw err;
                 res.redirect("/");   
                });
                i=dataLength+1;
            }

        }
    })
        

});

//Script para editar
app.get("/editar/:id",(req,res)=>{
    fs.readFile("./storage/notas.txt",(err,data)=>{
        const notas=JSON.parse(data);
        const id=req.params.id;
        const dataLength=notas.length;
        for(var i=1;i<=dataLength;i++){
            var nota=notas[i-1];
            var id1=notas[i-1]["id"];
            if(id1==id){
                i=dataLength+1;
            }
        };
        res.render("editar",{nota:nota}); 
    })
});

app.post("/edit",(req,res)=>{
    const titulo=req.body.titulo;
    const conteudo=req.body.conteudo;
    const id=req.body.id;
    fs.readFile("./storage/notas.txt", (err,data)=>{
        const notas=JSON.parse(data);
        const dataLength=notas.length;
        for(var i=1;i<=dataLength;i++){
            var nota=notas[i-1];
            var id1=notas[i-1]["id"];
            if(id1==id){
                const notaEditada={"titulo":titulo,"conteudo":conteudo,"id":id};
                var notaDeletada=notas.splice(i-1,1);
                notas.unshift(notaEditada);
                const notasEditadas=JSON.stringify(notas);
                fs.writeFile("./storage/notas.txt",notasEditadas,(err)=>{
                    if (err) throw err;
                    res.redirect("/");
                })
                
                i=dataLength+1;
            }
        }; 
       
        
    });
});



//Conexão com server
app.listen(8080, ()=>{
    console.log("Rodando na porta 8080");
    
});
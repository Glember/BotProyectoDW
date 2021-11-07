require('dotenv').config()

const { Telegraf } = require('telegraf')
const MySQLSession = require('telegraf-session-mysql')




const bot = new Telegraf(process.env.BOT_TOKEN)

const mysql = require('mysql')


const con = mysql.createConnection({
    host : 'frwahxxknm9kwy6c.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
    user : 'pdv1gqqg7iknbwz3',
    port : 3306,
    password :'rr0bjph2m7o5jk1g',
    database : 'ow0e0p4lyarum1cq'
});



con.connect(function(err){
    if(err){
        throw err;
    }
    console.log("Conectado");
    
    let cursos = `SELECT * FROM tb_cursos ORDER BY curso_id`
    con.query(cursos, function(err, res, fields){
        if(err){
            throw err;
        }
        dataStore = [];
        //console.log(res);
        
       /*  res.forEach(item => {
            //console.log(item.curso_nombre);
            dataStore.push({
                curso_id: item.curso_id,
                curso_nombre: item.curso_nombre
            });
        }); */
        
    });
   
    

});



const helpMessage = `

Ingresa los siguientes comando para obtener una respuesta:

/cursos -> Comando para ver la lista de cursos que estas asignado
/estudiantes -> Comando para los estudiantes que tienes asignados con tus datos
/notas -> Comando para ver las notas que tienes en tus cursos

`;

const startMessage = 'Escribe el comando /help para ver los distintos comandos'

bot.start(ctx => {
    ctx.reply(startMessage)
});

bot.help(ctx => {
    ctx.reply(helpMessage)
});

bot.command('cursos', ctx => {

    let cursos = `SELECT * FROM tb_cursos ORDER BY curso_id`
    con.query(cursos, function(err, res, fields){
        if(err){
            throw err;
        }
        dataStore = [];
        //console.log(res);
        
        res.forEach(item => {
            //console.log(item.curso_nombre);
            dataStore.push({
                curso_id: item.curso_id,
                curso_nombre: item.curso_nombre
            });
        });
        
    });

   
    let cursoMessage = 'Tus cursos asignado : \n';

    dataStore.forEach(item => {
        cursoMessage += `${item.curso_id} ${item.curso_nombre} \n`;
    });
    ctx.reply(cursoMessage);
});

 bot.command('notas', ctx => {

    let notas = `

    SELECT 

    
    concat(E.estudiante_nombres, ' ', E.estudiante_apellidos) AS Estudiante ,
    C.curso_nombre,
    nota_parcial1,
    nota_parcial2,
    nota_zona, 
    nota_final
FROM tb_asignados as A

inner join tb_estudiantes as E
on A.estudiante_id = E.estudiante_id
inner join tb_cursos as C
on A.curso_id = C.curso_id;

 `;

    con.query(notas, function(err, res, fields){
        if(err){
            throw err;
        }
        dataStore = [];
        //console.log(res);
        
        res.forEach(item => {
            //console.log(item.curso_nombre);
            dataStore.push({
                curso_nombre: item.curso_nombre,
                Estudiante: item.Estudiante,
                nota_parcial1  : item.nota_parcial1,
                nota_parcial2 : item.nota_parcial2,
                nota_zona : item.nota_zona,
                nota_final : item.nota_final

            });
        });
        
    });

    let notasMessage = 'Las notas de tus alumnos son : \n';

    dataStore.forEach(item => {
        notasMessage += `${item.Estudiante} ${item.curso_nombre} ${item.nota_parcial1} ${item.nota_parcial2} ${item.nota_zona} ${item.nota_final} \n`;
    });
    ctx.reply(notasMessage);
});

bot.command('estudiantes', ctx => {
    let estudiantes = `

    SELECT 
    usuario,
    CONCAT(usuario_nombres, ' ', usuario_apellidos) AS Nombres,
    usuario_telefono
    FROM tb_usuarios
    where usuario_rol_id = 2;

 `
    con.query(estudiantes, function(err, res, fields){
        if(err){
            throw err;
        }
        dataStore = [];
        //console.log(res);
        
        res.forEach(item => {
            //console.log(item.curso_nombre);
            dataStore.push({
                usuario: item.usuario,
                Nombres: item.Nombres,
                usuario_telefono  : item.usuario_telefono,
               

            });
        });
        
    });
   
    let estudiantesMessage = 'Los estudiantes asignados son: \n';

    dataStore.forEach(item => {
        estudiantesMessage += `${item.usuario} ${item.Nombres} ${item.usuario_telefono} \n`;
    });
    ctx.reply(estudiantesMessage);
}); 

bot.launch()
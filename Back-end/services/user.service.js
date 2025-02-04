const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient()
const bcrypt = require('../utils/bcrypt.util');
var jwt = require('jsonwebtoken');
const config= require('../config/app.config')
require('dotenv').config();

async function LoginUser(req, res) {
    //console.log("DATABASE_URL:", process.env.DATABASE_URL);

    const user = await prisma.Profissionais.findFirst({
        where:{
            email: req.usuario.email
        }
    })
    if(user == null) {
        throw new Error('Usuário ou senha não encontrado')
    }
    const senhaValida = bcrypt.compare(req.usuario.senha, user.senha);
    console.log(senhaValida)

    if(senhaValida){
        const token = jwt.sign(user, config.jwtSecret, {
            expiresIn: 86400 // 24 horas
        });
        console.log("Aqui")
        return {token: token, user}
        }
    else{
        throw new Error('Usuário ou senha inválido')
    }
}

module.exports = {LoginUser}
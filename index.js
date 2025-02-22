const express = require('express')
const app = express()
const port = 8080

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const cors = require('cors');
app.use(cors());
app.use(express.json());

const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');

const swaggerOptions = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "My API",
        version: "1.0.0",
        description: "API documentation",
      },
      servers: [
        {
          url: "http://localhost:8080",
        },
      ],
    },
    apis: ["./index.js"], // Update with the correct filename
  };
  
const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));



/**
 * @swagger
 * /:
 *   get:
 *     summary: Endpoint de Hello World
 *     description: Retorna um "Hello World!" message.
 *     responses:
 *       200:
 *         description: Resposta
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: "Hello World!"
 */

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
}) 

/*-------------------------------------ENDPOINTS-CLIENTE---------------------------------------*/

/**
 * @swagger
 * /clientes/{clienteId}:
 *   get:
 *     summary: Recuperar um cliente pelo ID
 *     tags: [Clientes]
 *     parameters:
 *       - in: path
 *         name: clienteId
 *         required: true
 *         schema:
 *           type: integer
 *         description: O ID do cliente a ser encontrado
 *     responses:
 *       200:
 *         description: Cliente encontrado com sucesso
 *       500:
 *         description: Erro interno do servidor
 */
app.get('/clientes/:clienteId', async (req, res) => {
    clienteId = parseInt(req.params.clienteId)
    try {
      const cliente = await prisma.cliente.findUnique({
        where:{
          id: clienteId
        }
      })
      res.status(200).json(cliente);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao encontrar o  cliente', details: error.message });
    }
  })

/**
 * @swagger
 * /clientes:
 *   post:
 *     summary: Cria um novo cliente
 *     tags: [Clientes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *                 description: Nome do cliente
 *                 example: João 
 *               sobrenome:
 *                 type: string
 *                 example: Silva
 *               timeDoCoracao:
 *                 type: string
 *                 example: Alecrim Futebol Clube
 *               
 *     responses:
 *       201:
 *         description: Cliente criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 nome:
 *                   type: string
 *                   example: João Silva
 * 
 *                
 *                 dataCadastro:
 *                   type: string
 *                   format: date-time
 *                   example: 2023-10-25T12:00:00.000Z
 *       500:
 *         description: Erro interno do servidor
 */
app.post('/clientes/', async (req, res) => {
    const { nome, sobrenome, timeDoCoracao } = req.body;
  
    if (!nome) {
      return res.status(400).json({ error: 'O campo "nome" é obrigatório.' });
    }
  
    if (!sobrenome) {
      return res.status(400).json({ error: 'O campo "sobrenome" é obrigatório.' });
    }
  
    if (!timeDoCoracao) {
      return res.status(400).json({ error: 'O campo "timeDoCoracao" é obrigatório.' });
    }
    
    try {
      const cliente = await prisma.cliente.create({
        data: {
          nome,
          sobrenome,
          timeDoCoracao
        },
      });
      res.status(201).json(cliente);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao criar cliente', details: error.message });
    }
  });

  
/**
 * @swagger
 * /clientes/{id}:
 *   put:
 *     summary: Atualiza um cliente pelo ID
 *     description: Atualiza o nome, sobrenome e time do coração de um cliente específico
 *     tags: [Clientes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do cliente a ser atualizado
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               sobrenome:
 *                 type: string
 *               timeDoCoracao:
 *                 type: string
 *     responses:
 *       200:
 *         description: Cliente atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 nome:
 *                   type: string
 *                 sobrenome:
 *                   type: string
 *                 timeDoCoracao:
 *                   type: string
 *       500:
 *         description: Erro ao atualizar cliente
 */
app.put('/clientes/:clienteId', async (req, res) => {
    const { nome, sobrenome, timeDoCoracao } = req.body;
    clienteId = parseInt(req.params.clienteId)
  
    try {
      const cliente = await prisma.cliente.update({
        where:{
          id: clienteId
        },
        data: {
          nome,
          sobrenome,
          timeDoCoracao
        },
      });
      res.status(200).json(cliente);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao atualizar cliente', details: error.message });
    }
  })


/**
 * @swagger
 * /clientes/{clienteId}:
 *   delete:
 *     summary: Excluir um cliente pelo ID
 *     tags: [Clientes]
 *     parameters:
 *       - in: path
 *         name: clienteId
 *         required: true
 *         schema:
 *           type: integer
 *         description: O ID do cliente a ser excluído
 *     responses:
 *       200:
 *         description: Cliente excluído com sucesso
 *       500:
 *         description: Erro interno do servidor
 */
app.delete('/clientes/:clienteId', async (req, res) => {
    clienteId = parseInt(req.params.clienteId)
  
    try {
      const cliente = await prisma.cliente.delete({
        where:{
          id: clienteId
        }
      })
      res.status(200).json(cliente);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao deletar o  cliente', details: error.message });
    }
  })

/**
 * @swagger
 * /clientes:
 *   get:
 *     summary: Lista todos os clientes
 *     description: Retorna uma lista de todos os clientes cadastrados
 *     tags: [Clientes]
 *     responses:
 *       200:
 *         description: Lista de clientes retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 4
 *                   nome:
 *                     type: string
 *                     example: Ana Oliveira
 *                   servicos:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                           example: 2
 *                         nome:
 *                           type: string
 *                           example: Troca de encanamento
 *                         categoriaServico:
 *                           type: string
 *                           example: Hidráulica
 *       500:
 *         description: Erro ao buscar os clientes
 */

app.get('/clientes', async (req, res) => {
  try {
    const clientes = await prisma.cliente.findMany({
      include: {
        servicos: true, // Inclui os serviços que o cliente solicitou
      },
    });

    const response = clientes.map(cliente => ({
      id: cliente.id,
      nome: cliente.nome,
      servicos: cliente.servicos.map(servico => ({
        id: servico.id,
        nome: servico.nome,
        categoriaServico: servico.categoriaServico,
      })),
    }));

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar os clientes', details: error.message });
  }
});


/*-------------------------------------ENDPOINTS-PRESTADOR---------------------------------------*/
  
/**
 * @swagger
 * /prestadores/{prestadorId}:
 *   get:
 *     summary: Recuperar um prestador pelo ID
 *     tags: [Prestadores]
 *     parameters:
 *       - in: path
 *         name: prestadorId
 *         required: true
 *         schema:
 *           type: integer
 *         description: O ID do prestador a ser encontrado
 *     responses:
 *       200:
 *         description: Prestador encontrado com sucesso
 *       500:
 *         description: Erro interno do servidor
 */
app.get('/prestadores/:prestadorId', async (req, res) => {
    prestadorId = parseInt(req.params.prestadorId)
    try {
      const prestador = await prisma.prestador.findUnique({
        where:{
          id: prestadorId
        }
      })
      res.status(200).json(prestador);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao encontrar o prestador', details: error.message });
    }
  })

  /**
 * @swagger
 * /prestadores:
 *   post:
 *     summary: Cria um novo prestador
 *     tags: [Prestadores]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *                 description: Nome do prestador
 *                 example: João 
 *               sobrenome:
 *                 type: string
 *                 example: Silva
 *               timeDoCoracao:
 *                 type: string
 *                 example: Alecrim Futebol Clube
 *               
 *     responses:
 *       201:
 *         description: Prestador criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 nome:
 *                   type: string
 *                   example: João Silva
 * 
 *                
 *                 dataCadastro:
 *                   type: string
 *                   format: date-time
 *                   example: 2023-10-25T12:00:00.000Z
 *       500:
 *         description: Erro interno do servidor
 */
app.post('/prestadores/', async (req, res) => {
    const { nome, sobrenome, timeDoCoracao } = req.body;
  
    if (!nome) {
      return res.status(400).json({ error: 'O campo "nome" é obrigatório.' });
    }
  
    if (!sobrenome) {
      return res.status(400).json({ error: 'O campo "sobrenome" é obrigatório.' });
    }
  
    if (!timeDoCoracao) {
      return res.status(400).json({ error: 'O campo "timeDoCoracao" é obrigatório.' });
    }
    
    try {
      const prestador = await prisma.prestador.create({
        data: {
          nome,
          sobrenome,
          timeDoCoracao
        },
      });
      res.status(201).json(prestador);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao criar o prestador', details: error.message });
    }
  });

/**
 * @swagger
 * /prestadores/{id}:
 *   put:
 *     summary: Atualiza um prestador pelo ID
 *     description: Atualiza o nome, sobrenome e time do coração de um prestador específico
 *     tags: [Prestadores]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do prestador a ser atualizado
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               sobrenome:
 *                 type: string
 *               timeDoCoracao:
 *                 type: string
 *     responses:
 *       200:
 *         description: Prestador atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 nome:
 *                   type: string
 *                 sobrenome:
 *                   type: string
 *                 timeDoCoracao:
 *                   type: string
 *       500:
 *         description: Erro ao atualizar o prestador
 */
app.put('/prestadores/:prestadorId', async (req, res) => {
    const { nome, sobrenome, timeDoCoracao } = req.body;
    prestadorId = parseInt(req.params.prestadorId)
  
    try {
      const prestador = await prisma.prestador.update({
        where:{
          id: prestadorId
        },
        data: {
          nome,
          sobrenome,
          timeDoCoracao
        },
      });
      res.status(200).json(prestador);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao atualizar o prestador', details: error.message });
    }
  })


/**
 * @swagger
 * /prestadores/{prestadorId}:
 *   delete:
 *     summary: Excluir um prestador pelo ID
 *     tags: [Prestadores]
 *     parameters:
 *       - in: path
 *         name: prestadorId
 *         required: true
 *         schema:
 *           type: integer
 *         description: O ID do prestador a ser excluído
 *     responses:
 *       200:
 *         description: Prestador excluído com sucesso
 *       500:
 *         description: Erro interno do servidor
 */
app.delete('/prestadores/:prestadorId', async (req, res) => {
    prestadorId = parseInt(req.params.prestadorId)
  
    try {
      const prestador = await prisma.prestador.delete({
        where:{
          id: prestadorId
        }
      })
      res.status(200).json(prestador);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao deletar o prestador', details: error.message });
    }
  })

  /**
 * @swagger
 * /prestadores:
 *   get:
 *     summary: Lista todos os prestadores
 *     description: Retorna uma lista de todos os prestadores cadastrados
 *     tags: [Prestadores]
 *     responses:
 *       200:
 *         description: Lista de prestadores retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   nome:
 *                     type: string
 *                     example: João Silva
 *                   servicos:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                           example: 3
 *                         nome:
 *                           type: string
 *                           example: Instalação elétrica
 *                         categoriaServico:
 *                           type: string
 *                           example: Elétrica
 *       500:
 *         description: Erro ao buscar os prestadores
 */

app.get('/prestadores', async (req, res) => {
  try {
    const prestadores = await prisma.prestador.findMany({
      include: {
        servicos: true, 
      },
    });

    const response = prestadores.map(prestador => ({
      id: prestador.id,
      nome: prestador.nome,
      servicos: prestador.servicos.map(servico => ({
        id: servico.id,
        nome: servico.nome,
        categoriaServico: servico.categoriaServico,
      })),
    }));

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar os prestadores', details: error.message });
  }
});


  
/*-------------------------------------ENDPOINTS-SERVIÇO---------------------------------------*/

/**
 * @swagger
 * /servicos/{servicoId}:
 *   get:
 *     summary: Recuperar um serviço pelo ID
 *     tags: [Serviços]
 *     parameters:
 *       - in: path
 *         name: servicoId
 *         required: true
 *         schema:
 *           type: integer
 *         description: O ID do serviço a ser encontrado
 *     responses:
 *       200:
 *         description: Serviço encontrado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 nome:
 *                   type: string
 *                   example: Reparo elétrico
 *                 dataCadastro:
 *                   type: string
 *                   format: date-time
 *                   example: 2023-10-25T12:00:00.000Z
 *                 categoriaServico:
 *                   type: string
 *                   example: Elétrica
 *                 prestador:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     nome:
 *                       type: string
 *                       example: Pedro Souza
 *                 cliente:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 4
 *                     nome:
 *                       type: string
 *                       example: Ana Oliveira
 *       404:
 *         description: Serviço não encontrado
 *       500:
 *         description: Erro interno do servidor
 */

app.get('/servicos/:servicoId', async (req, res) => {
  servicoId = parseInt(req.params.servicoId)
  try {
    const servico = await prisma.servico.findUnique({
      where:{
        id: servicoId
      },
      include: {
        prestador: { select: { id: true, nome: true } },
        cliente: { select: { id: true, nome: true } },
      },
    })

    if (!servico) {
      return res.status(404).json({ error: 'Serviço não encontrado' });
    }

    res.status(200).json({
      id: servico.id,
      nome: servico.nome,
      dataCadastro: servico.dataCadastro,
      categoriaServico: servico.categoriaServico,
      prestador: servico.prestador,
      cliente: servico.cliente,
    });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao encontrar o serviço', details: error.message });
  }
})

/**
 * @swagger
 * /servicos:
 *   post:
 *     summary: Cria um novo serviço
 *     tags: [Serviços]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *                 description: Nome do serviço
 *                 example: Reparo elétrico 
 *               categoriaServico:
 *                 type: string
 *                 example: Elétrica
 *               dataCadastro:
 *                 type: string
 *                 format: date
 *                 example: 2025-02-22
 *               prestadorId:
 *                 type: integer
 *                 description: O ID do prestador que realizará o serviço
 *                 example: 1
 *               clienteId:
 *                 type: integer
 *                 description: O ID do cliente que está solicitando o serviço
 *                 example: 1
 *     responses:
 *       201:
 *         description: Serviço criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 nome:
 *                   type: string
 *                   example: Reparo elétrico
 *                 dataCadastro:
 *                   type: string
 *                   format: date-time
 *                   example: 2023-10-25T12:00:00.000Z
 *                 categoriaServico:
 *                   type: string
 *                   example: Elétrica
 *                 prestador:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     nome:
 *                       type: string
 *                       example: Pedro Souza
 *                 cliente:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 4
 *                     nome:
 *                       type: string
 *                       example: Ana Oliveira
 *       400:
 *         description: Erro de validação nos campos obrigatórios
 *       500:
 *         description: Erro interno do servidor
 */


app.post('/servicos/', async (req, res) => {
  const { nome, categoriaServico, prestadorId, clienteId } = req.body;

  if (!nome) {
    return res.status(400).json({ error: 'O campo "nome" é obrigatório.' });
  }

  if (!categoriaServico) {
    return res.status(400).json({ error: 'O campo "categoriaServico" é obrigatório.' });
  }

  if (!prestadorId) {
    return res.status(400).json({ error: 'O campo "prestador" é obrigatório.' });
  }
  
  if (!clienteId) {
    return res.status(400).json({ error: 'O campo "cliente" é obrigatório.' });
  }
  
  try {

    const prestador = await prisma.prestador.findUnique({ where: { id: prestadorId } });
    const cliente = await prisma.cliente.findUnique({ where: { id: clienteId } });

    if (!prestador) {
      return res.status(404).json({ error: 'Prestador não encontrado.' });
    }

    if (!cliente) {
      return res.status(404).json({ error: 'Cliente não encontrado.' });
    }

    const servico = await prisma.servico.create({
      data: {
        nome,
        categoriaServico,
        prestador: { connect: { id: prestadorId } },
        cliente: { connect: { id: clienteId } }
      },
    });

    res.status(201).json({
      id: servico.id,
      nome: servico.nome,
      dataCadastro: servico.dataCadastro,
      categoriaServico: servico.categoriaServico,
      prestador: {
        id: prestadorId,
        nome: prestador.nome,  
      },
      cliente: {
        id: clienteId,
        nome: cliente.nome,  
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar o serviço', details: error.message });
  }
});


/**
 * @swagger
 * /servicos/{id}:
 *   put:
 *     summary: Atualiza um servico pelo ID
 *     description: Atualiza os campos de um serviço específico
 *     tags: [Serviços]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do serviço a ser atualizado
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               categoriaServico:
 *                 type: string
 *               prestadorId:
 *                 type: integer
 *                 example: 2
 *               clienteId:
 *                 type: integer
 *                 example: 5
 *              
 *     responses:
 *       200:
 *         description: Serviço atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 nome:
 *                   type: string
 *                   example: Reparo elétrico
 *                 dataCadastro:
 *                   type: string
 *                   format: date-time
 *                   example: 2023-10-25T12:00:00.000Z
 *                 categoriaServico:
 *                   type: string
 *                   example: Elétrica
 *                 prestador:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     nome:
 *                       type: string
 *                       example: Pedro Souza
 *                 cliente:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 4
 *                     nome:
 *                       type: string
 *                       example: Ana Oliveira
 *       500:
 *         description: Erro ao atualizar cliente
 */

app.put('/servicos/:servicoId', async (req, res) => {
  const { nome, categoriaServico, prestadorId, clienteId } = req.body;
  servicoId = parseInt(req.params.servicoId)

  try {

    const servicoExistente = await prisma.servico.findUnique({
      where: { id: servicoId },
      include: { prestador: true, cliente: true } 
    });

    if (!servicoExistente) {
      return res.status(404).json({ error: 'Serviço não encontrado.' });
    }

    let prestador = servicoExistente.prestador;
    let cliente = servicoExistente.cliente;

    if (prestadorId && prestadorId !== servicoExistente.prestadorId) {
      prestador = await prisma.prestador.findUnique({ where: { id: prestadorId } });
      if (!prestador) {
        return res.status(404).json({ error: 'Prestador não encontrado.' });
      }
    }

    if (clienteId && clienteId !== servicoExistente.clienteId) {
      cliente = await prisma.cliente.findUnique({ where: { id: clienteId } });
      if (!cliente) {
        return res.status(404).json({ error: 'Cliente não encontrado.' });
      }
    }
    
    const servicoAtualizado = await prisma.servico.update({
      where:{
        id: servicoId
      },
      data: {
        nome,
        categoriaServico,
        prestadorId: prestador.id,
        clienteId: cliente.id,
      },
      include: {
        prestador: { select: { id: true, nome: true } },
        cliente: { select: { id: true, nome: true } },
      },
    });
    
    res.status(200).json({
      id: servicoAtualizado.id,
      nome: servicoAtualizado.nome,
      dataCadastro: servicoAtualizado.dataCadastro,
      categoriaServico: servicoAtualizado.categoriaServico,
      prestador: {
        id: prestador.id,
        nome: prestador.nome,  
      },
      cliente: {
        id: cliente.id,
        nome: cliente.nome,  
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar o serviço', details: error.message });
  }
})

/**
 * @swagger
 * /servicos/{servicoId}:
 *   delete:
 *     summary: Deleta um serviço pelo ID
 *     tags: [Serviços]
 *     parameters:
 *       - in: path
 *         name: servicoId
 *         required: true
 *         schema:
 *           type: integer
 *         description: O ID do serviço a ser deletado
 *     responses:
 *       200:
 *         description: Serviço deletado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 nome:
 *                   type: string
 *                   example: Reparo elétrico
 *                 dataCadastro:
 *                   type: string
 *                   format: date-time
 *                   example: 2023-10-25T12:00:00.000Z
 *                 categoriaServico:
 *                   type: string
 *                   example: Elétrica
 *                 prestador:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     nome:
 *                       type: string
 *                       example: Pedro Souza
 *                 cliente:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 4
 *                     nome:
 *                       type: string
 *                       example: Ana Oliveira
 *       404:
 *         description: Serviço não encontrado
 *       500:
 *         description: Erro interno do servidor
 */

app.delete('/servicos/:servicoId', async (req, res) => {
  servicoId = parseInt(req.params.servicoId)
  try {
    const servico = await prisma.servico.delete({
      where:{
        id: servicoId
      },
    })

    if (!servico) {
      return res.status(404).json({ error: 'Serviço não encontrado' });
    }

    res.status(200).json({
      id: servico.id,
      nome: servico.nome,
      dataCadastro: servico.dataCadastro,
      categoriaServico: servico.categoriaServico,
      prestador: servico.prestador,
      cliente: servico.cliente,
    });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao tentar deletar o serviço', details: error.message });
  }
})

/**
 * @swagger
 * /servicos:
 *   get:
 *     summary: Lista todos os serviços
 *     description: Retorna uma lista de todos os serviços cadastrados
 *     tags: [Serviços]
 *     responses:
 *       200:
 *         description: Lista de serviços retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   nome:
 *                     type: string
 *                     example: Reparo hidráulico
 *                   dataCadastro:
 *                     type: string
 *                     format: date-time
 *                     example: 2023-11-10T14:30:00.000Z
 *                   categoriaServico:
 *                     type: string
 *                     example: Hidráulica
 *                   prestador:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 2
 *                       nome:
 *                         type: string
 *                         example: João Silva
 *                   cliente:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 5
 *                       nome:
 *                         type: string
 *                         example: Maria Fernandes
 *       500:
 *         description: Erro ao buscar os serviços
 */

app.get('/servicos', async (req, res) => {
  try {
    const servicos = await prisma.servico.findMany({
      include: {
        prestador: true,
        cliente: true,
      },
    });

    const response = servicos.map(servico => ({
      id: servico.id,
      nome: servico.nome,
      dataCadastro: servico.dataCadastro,
      categoriaServico: servico.categoriaServico,
      prestador: {
        id: servico.prestador.id,
        nome: servico.prestador.nome,
      },
      cliente: {
        id: servico.cliente.id,
        nome: servico.cliente.nome,
      },
    }));

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar os serviços', details: error.message });
  }
});

import usuarioController from './controller/usuarioController.js';
import produtoController from './controller/produtoController.js';
import despesasController from './controller/despesasController.js';
import vendaController from './controller/vendaController.js';

export default function adicionarRotas(api) {
    api.use(usuarioController);
    api.use(produtoController);
    api.use(despesasController);
    api.use(vendaController);
}
import { createRouter, createWebHistory } from "vue-router";

import Cadastro_usuario from "@/components/cadastro-usuario/cadastro-usuario.vue"
import PagLogin from "@/components/PagLogin/PagLogin.vue";
import Pagina_principal from "@/components/Pagina-principal/Pagina-principal.vue";
import Cadastrar_produtos from "@/components/Cadastro-de-Produtos/Cadastro-de-Produtos.vue";
import Pesquisar_produtos from "@/components/Consultar-Produtos/Consultar-Produtos.vue";
import testeVue from "@/components/testeVue.vue"
import Cadastrar_faltantes from "@/components/Cadastrar-Faltantes/Cadastrar-Faltantes.vue";
import Calendario from "@/components/Calendario/Calendario.vue";
import Banner_principal from "@/components/Banner-Principal/Banner-Principal.vue";
import Recuperar_senha from "@/components/Recuperar-senha/Recuperar-senha.vue";
import MeusDados from "@/components/meus-dados/meus-dados.vue";
import ExcluirProdutos from "@/components/Excluir-Produto/Excluir-Produtos.vue";
import EditarProdutos from "@/components/Editar-Produto/Editar-Produtos.vue";


const routes = [

    {
        path: "/",
        name: "Login",
        component: PagLogin
    },

    {
        path: "/Pagina-principal",
        name: "Pagina principal",
        component: Pagina_principal,
        children: [ 
            {
                path: "Banner-Principal",
                name: "Vitta Farma Drogaria",
                component: Banner_principal
            },
            
            {
                path: "Cadastro-de-Produtos",
                name: "Cadastro de Produtos",
                component: Cadastrar_produtos
            },

            {
                path: "Consultar-Produtos",
                name: "Consultar Produtos",
                component: Pesquisar_produtos
            },
             
            {
                path: "Cadastrar-Faltantes",
                name: "Cadastrar Faltantes",
                component: Cadastrar_faltantes
            },
            {
                path: "Calendario",
                name: "Calendário",
                component: Calendario
            },
            {
                path: "meus-dados",
                name: "Meus Dados",
                component: MeusDados
            },
            {
                path: "Excluir-Produto",
                name: "Excluir Produto",
                component: ExcluirProdutos
            },
            {
                path: "Editar-Produto",
                name: "Editar Produto",
                component: EditarProdutos
            }

        ]
    },

    {
        path: "/cadastro-usuario",
        name: "cadastro usuario",
        component: Cadastro_usuario
    },

    {
        path: "/testeVue",
        name: "testeVue",
        component: testeVue
    },
    {
        path: "/Recuperar-senha",
        name: "Recuperar senha",
        component: Recuperar_senha
    }

]

const router = createRouter({
    history: createWebHistory(), routes
})

export default router
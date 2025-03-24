<script setup>
    // Importação das bibliotecas e recursos necessários
    import bannerImg from "@/assets/banner-user.png" // Importa a imagem do banner do usuário
    import { ref } from "vue" // Importa a função ref do Vue para reatividade
    import { ElLoading } from 'element-plus'; // Importa o componente de carregamento do Element Plus
    import router from "@/router/router"; // Importa o roteador Vue para navegação
    import { useRoute } from "vue-router"; // Importa o hook useRoute para acessar a rota atual
    import { useUsers } from '@/composable/useUsers'; // Importa o composable que gerencia os dados do usuário

    //Dados reativos
    const isCollapse = ref(false) // Controla o estado de colapso do menu lateral
    const elAside = ref("") // Referência para o elemento aside
    elAside.value = "elAsideCollpase" // Define o valor inicial da classe do aside
    const rotas = useRoute() // Obtém a rota atual

    const Date = localStorage.getItem("Date") // Obtém a data armazenada no localStorage

    const { valores, loading } = useUsers() // Desestrutura o composable useUsers para obter dados e estado de carregamento

    // Função assíncrona para realizar o logout do usuário
    const logOut = async function() {
        // Exibe um indicador de carregamento durante o processo de logout
        const loading = ElLoading.service({
            lock: true, // Bloqueia a interface
            text: "Saindo...", // Texto exibido durante o carregamento
            background: 'rgba(0, 0, 0, 0.8)' // Fundo semi-transparente
        })

        // Define um tempo limite para fechar o indicador de carregamento
        setTimeout(() => {
            loading.close()
        }, 3000);

        // Espera 2 segundos antes de continuar (simulação de processamento)
        await new Promise(resolve => setTimeout(resolve, 2000))

        // Navega para a página inicial (login)
        router.push("/")

        // Limpa todos os dados armazenados no localStorage
        localStorage.clear()
    }

    // Função para colapsar o menu quando o usuário clica na área principal
    const collapseClick = function() {
        isCollapse.value = true // Define o estado de colapso como verdadeiro
    }

</script>

<template>
<!-- Layout principal da aplicação -->
<div class="common-layout">
    <el-container>
        <!-- Cabeçalho da aplicação -->
        <el-header>
            <!-- Título da página atual baseado no nome da rota -->
            <div class="title-menus">
                <p>{{ rotas.name }}</p>
            </div>
            
            <!-- Menu dropdown para opções do usuário -->
            <el-dropdown>
                <el-icon><Tools /></el-icon> <!-- Ícone de ferramentas -->
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item @click="logOut">Sair</el-dropdown-item> <!-- Opção para sair/logout -->
                        <router-link to="meus-dados" style="text-decoration: none;"><el-dropdown-item>Meus dados</el-dropdown-item></router-link> <!-- Link para página de dados do usuário -->
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
            
            <!-- Grupo de botões para expandir/colapsar o menu lateral -->
            <el-radio-group v-model="isCollapse" class="collapse">
                <el-tooltip
                effect="dark"
                content="Mostrar Menu"
                placement="bottom"
                >
                <el-radio-button type="button" :value="false"><el-icon><Expand /></el-icon></el-radio-button> <!-- Botão para expandir menu -->
                </el-tooltip>
                <el-tooltip
                effect="dark"
                content="Ocultar Menu"
                placement="right"
                >
                <el-radio-button type="button" :value="true"><el-icon><Fold /></el-icon></el-radio-button> <!-- Botão para colapsar menu -->
                </el-tooltip>
            </el-radio-group>
        </el-header>
        
        <!-- Container principal com menu lateral e conteúdo -->
        <el-container>
            <!-- Menu lateral (sidebar) -->
            <el-aside >
                <el-menu
                class="class-menu"
                default-active="2"
                :collapse="isCollapse" 
                >
                
                <!-- Seção com dados do usuário -->
                <div class="dados-user">
                    <span class="image">
                        <img class="subImage" :src="bannerImg" alt="BannerUser"> <!-- Imagem do banner do usuário -->
                    </span>
                    <span v-loading="loading" class="user">Usuário: {{ valores?.Nome }}</span> <!-- Nome do usuário com indicador de carregamento -->
                    <span class="data">Data: {{ Date }}</span> <!-- Data atual -->
                </div>

                <!-- Item de menu Home -->
                <el-tooltip
                    effect="dark"
                    content="Home"
                    placement="right"
                >
                <router-link class="span" to="Banner-Principal">
                <el-menu-item index="0">
                    <el-icon><el-icon><HomeFilled /></el-icon></el-icon> <!-- Ícone de casa -->
                    <span>Home</span>
                </el-menu-item>
                </router-link>
                </el-tooltip>

                <!-- Item de menu Cadastrar Produtos -->
                <el-tooltip
                    effect="dark"
                    content="Cadastrar Produtos"
                    placement="right"
                >
                <router-link class="span" to="Cadastro-de-Produtos">
                <el-menu-item index="1">
                        <el-icon><Plus /></el-icon> <!-- Ícone de adição -->
                        <span>Cadastrar Produtos</span>
                </el-menu-item>
                </router-link>
                </el-tooltip>

                <!-- Item de menu Consultar Produtos -->
                <el-tooltip
                    effect="dark"
                    content="Consultar Produtos"
                    placement="right"
                >
                <router-link class="span" to="Consultar-Produtos">
                <el-menu-item index="2">
                        <el-icon><Search /></el-icon> <!-- Ícone de pesquisa -->
                        <span>Consultar Produtos</span>
                </el-menu-item>
                </router-link>
                </el-tooltip>

                <!-- Item de menu Gestão de Itens Faltantes -->
                <el-tooltip
                    effect="dark"
                    content="Gestão de Itens Faltantes"
                    placement="right"
                >
                <router-link class="span" to="Cadastrar-Faltantes">
                <el-menu-item index="3">
                        <el-icon><Files /></el-icon> <!-- Ícone de arquivos -->
                        <span>Cadastrar Faltantes</span> 
                </el-menu-item>
                </router-link>
                </el-tooltip>

                <!-- Submenu para Excluir/Editar Produtos -->
                <el-sub-menu index="10">
                    <template #title>
                        <el-icon><Edit /></el-icon> <!-- Ícone de edição -->
                        <span class="span" title="Excluir / Editar">Excluir/Editar Produtos</span>
                    </template>

                    <el-menu-item-group>
                        <!-- Item de submenu Editar Produtos -->
                        <el-tooltip
                        effect="dark"
                        content="Editar"
                        placement="right"
                        >
                        <router-link to="Editar-Produto" class="span">
                        <el-menu-item>
                            <el-icon><EditPen /></el-icon> <!-- Ícone de caneta de edição -->
                            <span>Editar Produtos</span>
                        </el-menu-item>
                        </router-link>
                        </el-tooltip>

                        <!-- Item de submenu Excluir Produtos -->
                        <el-tooltip
                        effect="dark"
                        content="Excluir"
                        placement="right"
                        >
                        <router-link to="Excluir-Produto" class="span">
                        <el-menu-item>
                            <el-icon><Delete /></el-icon> <!-- Ícone de exclusão -->
                            <span>Excluir Produtos</span>
                        </el-menu-item>
                        </router-link>
                        </el-tooltip>
                    </el-menu-item-group>
                </el-sub-menu>

                <!-- Item de menu Calendário -->
                <el-tooltip
                    effect="dark"
                    content="Calendário"
                    placement="right"
                >
                <router-link class="span" to="Calendario">
                <el-menu-item index="20">
                        <el-icon><Calendar /></el-icon> <!-- Ícone de calendário -->
                        <span>Calendário</span> 
                </el-menu-item>
                </router-link>
                </el-tooltip>
                </el-menu>
            </el-aside>
            
            <!-- Área principal de conteúdo -->
            <el-main @click="collapseClick"> <!-- Colapsa o menu ao clicar na área principal -->
                <router-view></router-view> <!-- Renderiza o componente correspondente à rota atual -->
            </el-main>
        </el-container>
    </el-container>
</div>

</template>

<!-- Importação do arquivo CSS específico para este componente com escopo limitado -->
<style scoped src="./Home-Page.css"></style>
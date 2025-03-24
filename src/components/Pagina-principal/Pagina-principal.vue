
<script setup>

    import bannerImg from "@/assets/banner-user.png"
    import { ref } from "vue"
    import { ElLoading } from 'element-plus';
    import router from "@/router/router";
    import { useRoute } from "vue-router";
    import { useUsers } from '@/composable/useUsers';

    //Dados reativos
    const isCollapse = ref(false)
    const elAside = ref("")
    elAside.value = "elAsideCollpase"
    const rotas = useRoute() 

    const Date = localStorage.getItem("Date")

    const { valores, loading } = useUsers()

    const logOut = async function() {

        const loading = ElLoading.service({
            lock: true,
            text: "Saindo...",
            background: 'rgba(0, 0, 0, 0.8)'
        })

        setTimeout(() => {
            loading.close()
        }, 3000);

        await new Promise(resolve => setTimeout(resolve, 2000))

        router.push("/")

        localStorage.clear()
    }

    const collapseClick = function() {
        isCollapse.value = true
    }

</script>

<template>

<div class="common-layout">
    <el-container>
        <el-header>
            <div class="title-menus">
                <p>{{ rotas.name }}</p>
            </div>
    <el-dropdown>
        <el-icon><Tools /></el-icon>
        <template #dropdown>
            <el-dropdown-menu>
                <el-dropdown-item @click="logOut">Sair</el-dropdown-item>
                <router-link to="meus-dados" style="text-decoration: none;"><el-dropdown-item>Meus dados</el-dropdown-item></router-link>
            </el-dropdown-menu>
        </template>
    </el-dropdown>
        <el-radio-group v-model="isCollapse" class="collapse">
        <el-tooltip
        effect="dark"
        content="Mostrar Menu"
        placement="bottom"
        >
        <el-radio-button type="button" :value="false"><el-icon><Expand /></el-icon></el-radio-button>
        </el-tooltip>
        <el-tooltip
        effect="dark"
        content="Ocultar Menu"
        placement="right"
        >
        <el-radio-button type="button" :value="true"><el-icon><Fold /></el-icon></el-radio-button>
    </el-tooltip>
    </el-radio-group>
        </el-header>
      <el-container>
    <el-aside >
    <el-menu
    class="class-menu"
    default-active="2"
    :collapse="isCollapse"
    >

    <div class="dados-user">

        <span class="image">
            <img class="subImage" :src="bannerImg" alt="BannerUser">
        </span>
        <span v-loading="loading" class="user">Usuário: {{ valores?.Nome }}</span>
        <span class="data">Data: {{ Date }}</span> 

    </div>

    <el-tooltip
        effect="dark"
        content="Home"
        placement="right"
      >
    <router-link class="span" to="Banner-Principal">
    <el-menu-item index="0">
        <el-icon><el-icon><HomeFilled /></el-icon></el-icon>
        <span>Home</span>
    </el-menu-item>
    </router-link>
    </el-tooltip>

    <el-tooltip
        effect="dark"
        content="Cadastrar Produtos"
        placement="right"
    >
    <router-link class="span" to="Cadastro-de-Produtos">
    <el-menu-item index="1">
            <el-icon><Plus /></el-icon>
            <span>Cadastrar Produtos</span>
    </el-menu-item>
    </router-link>
    </el-tooltip>

    <el-tooltip
        effect="dark"
        content="Consultar Produtos"
        placement="right"
    >
    <router-link class="span" to="Consultar-Produtos">
    <el-menu-item index="2">
            <el-icon><Search /></el-icon>
            <span>Consultar Produtos</span>
    </el-menu-item>
    </router-link>
    </el-tooltip>

    <el-tooltip
        effect="dark"
        content="Gestão de Itens Faltantes"
        placement="right"
    >
    <router-link class="span" to="Cadastrar-Faltantes">
    <el-menu-item index="3">
            <el-icon><Files /></el-icon>
            <span>Cadastrar Faltantes</span> 
    </el-menu-item>
    </router-link>
    </el-tooltip>

    <el-sub-menu index="10">

  <template #title>
    <el-icon><Edit /></el-icon>
    <span class="span" title="Excluir / Editar">Excluir/Editar Produtos</span>
  </template>

    <el-menu-item-group>
        <el-tooltip
        effect="dark"
        content="Editar"
        placement="right"
        >
        <router-link to="Editar-Produto" class="span">
        <el-menu-item>
            <el-icon><EditPen /></el-icon>
            <span>Editar Produtos</span>
        </el-menu-item>
        </router-link>
        </el-tooltip>

        <el-tooltip
        effect="dark"
        content="Excluir"
        placement="right"
        >
        <router-link to="Excluir-Produto" class="span">
        <el-menu-item>
            <el-icon><Delete /></el-icon>
            <span>Excluir Produtos</span>
        </el-menu-item>
        </router-link>
        </el-tooltip>

    </el-menu-item-group>
    </el-sub-menu>

    <el-tooltip
        effect="dark"
        content="Calendário"
        placement="right"
    >
    <router-link class="span" to="Calendario">
    <el-menu-item index="20">
            <el-icon><Calendar /></el-icon>
            <span>Calendário</span> 
    </el-menu-item>
    </router-link>
    </el-tooltip>
    </el-menu>
        </el-aside>
        <el-main @click="collapseClick">
            <router-view></router-view>  
        </el-main>
      </el-container>
    </el-container>
  </div>

</template>

<style scoped src="./Home-Page.css"></style>
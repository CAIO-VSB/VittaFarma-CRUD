<script setup>

    import bannerImg from '@/assets/banner-principal.svg';
    import pilulas from "@/assets/pilulas-png.png"
    import { ref } from 'vue';
    import router from '@/router/router'; 
    import { ElMessageBox, ElMessage } from 'element-plus';
    import { signUser } from '@/repositorio-db/repositorio-db-pag-login';
    import { useUsers } from '@/composable/useUsers';


    const email = ref("")
    const password = ref("")
    const container = ref("container")
    const logo = ref("logo")
    const formControl = ref("formcontrol")
    const form = ref("form")
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    const inputUser = ref("")
    const iconAlert = ref("")
    const inputSenha = ref("")
    const isLoading = ref(false)
    const inputFocus = ref()
    const validSenha = ref(true)
    const isInputErrorSenha = ref(false)
    const isInputErrorUser = ref(false)

    inputUser.value = "inputUser"
    inputSenha.value = "inputSenha"

    const date = new Date()

    localStorage.setItem("Date", date.toLocaleDateString("pt-BR"))

    const { valores } = useUsers()

    //imagens
    const banner = ref(bannerImg)

    //Scripts

    function validData() {

        if (!email.value.trim() || !password.value.trim()) {
            validSenha.value = false
            isInputErrorSenha.value = true
            isInputErrorUser.value = true
            
            setTimeout(() => {
                isInputErrorSenha.value = false
                isInputErrorUser.value = false
                validSenha.value = true
            }, 3500);

            inputFocus.value.focus()
            
            return false
        } 

        if (password.value.length < 6) {
            ElMessageBox.alert("A senha deve conter no mínimo 6 caracteres", "Atenção")
            return false
        }

        if (!emailRegex.test(email.value)) {
        ElMessageBox.alert("Insira um e-mail válido", "Atenção", {
            confirmButtonText: "OK",
            callback: (action) => {
            if (action === "confirm") {
                ElMessage({
                type: "warning",
                message: "Tente novamente",
                });
            }
            },
        });


        return false
    }

    return true

    }

    const validUser = async function() {

        isLoading.value = true

        await new Promise(resolve => setTimeout(resolve, 2000))

        isLoading.value = false

        try {

            const userResutl = await signUser(email.value, password.value)

            if (!userResutl) {
                ElMessageBox.alert("Usuário ou senha incorretas", "Atenção")
                return false
            }

            ElMessage({
                message: "Login realizado com sucesso! Bom trabalho",
                type: "success"
            })

            router.push({name: "Vitta Farma Drogaria"})

        }catch {
            ElMessageBox.alert("Algo deu errado! Tente novamente...", "Atenção")
            return false
        }

    }

    function LoginEnter() {
        submitDados()
    }

    function submitDados() {

        const isValid = validData()

        if (!isValid) {
            return
        }
            
        validUser()
    }


</script>

<template>

    <main class="mainContainer">

    <div class="div-pilulas-superior">
            <img class="pilulas-content" :src="pilulas" alt="404">
            <img class="pilulas-content" :src="pilulas" alt="404">
            <img class="pilulas-content" :src="pilulas" alt="404">
            <img class="pilulas-content" :src="pilulas" alt="404">
            <img class="pilulas-content" :src="pilulas" alt="404">
            <img class="pilulas-content" :src="pilulas" alt="404">
    </div>

    <div class="div-pilulas-inferior">
            <img class="pilulas-content" :src="pilulas" alt="404">
            <img class="pilulas-content" :src="pilulas" alt="404">
            <img class="pilulas-content" :src="pilulas" alt="404">
            <img class="pilulas-content" :src="pilulas" alt="404">
            <img class="pilulas-content" :src="pilulas" alt="404">
            <img class="pilulas-content" :src="pilulas" alt="404">
    </div>
    
    <div class="div-pilulas">
            <img class="pilulas-content" :src="pilulas" alt="404">
            <img class="pilulas-content" :src="pilulas" alt="404">
            <img class="pilulas-content" :src="pilulas" alt="404">
            <img class="pilulas-content" :src="pilulas" alt="404">
            <img class="pilulas-content" :src="pilulas" alt="404">
            <img class="pilulas-content" :src="pilulas" alt="404">
    </div>

    <div id="app" :class="container">

    <div :class="logo">
        <img class="banner" :src="banner">
    </div>

    <div class="header">
        <h1 class="h1-title">BEM-VINDO</h1>
        <h2 class="h2-title">Faça login com suas credenciais</h2>
    </div>

    <form id="form" :class="form" @submit.prevent="submitDados">

    <div :class="formControl">
        <label for="email" class="label-username">E-mail</label>
        <el-input ref="inputFocus" :class="{inputUserError: isInputErrorUser, inputUser: validUser}" type="email" v-model="email" placeholder="Insira seu email"    
        clearable
        title="E-mail"
        autocomplete="email"
        name="email"
        />
        <el-icon v-show="iconAlert" :class="iconAlert"><WarningFilled /></el-icon>
    </div>

    <div :class="formControl">
        <label for="senha" class="label-senha">Senha</label>
        <el-input :class="{inputSenha: validSenha, inputSenhaError: isInputErrorSenha}" :type="password" title="Insira uma senha" v-model="password" 
        placeholder="Insira sua senha"
        show-password
        autocomplete="new-password"
        @keyup.enter="LoginEnter"
        
        />
    </div>
    
    <div class="bnt">
        <el-tooltip
        class="box-item"
        effect="dark"
        content="Logar no sistema"
        placement="top"
    >
    <el-button :loading="isLoading" id="btn-login" @click="submitDados" type="primary" ><span>LOGAR</span></el-button>
    </el-tooltip>
    </div>
    <div class="esqueceu-senha">
        <el-icon title="Recuperar senha" icones><Unlock /></el-icon> 
        <p title="Recuperar senha">Esqueceu sua senha? <router-link to="/Recuperar-senha" title="Recuperar senha"><el-link type="primary">Recupere aqui</el-link></router-link></p>
    </div>
    </form> 
    </div>
    </main>

</template>

<style scoped src="./Pag-Login.css">
</style>

<script setup>

    //Importações
    import bannerImg from "@/assets/banner-principal.svg"
    import pilulas from "@/assets/pilulas-png.png"
    import { RecuperarSenha } from "@/repositorio-db/respositorio-db-recup-senha";
    import { ElMessageBox, ElLoading} from 'element-plus';
    import { ref as vueRef} from "vue"
 
    //Variaveis reativas
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    const inputEmail= vueRef("")
    const inputSenhaError = vueRef("")
    const inputUserError = vueRef("")
    const iconAlert = vueRef("")
    const isSenhaError = vueRef(false)
   
    //Funcões

    function validData() {
        if (!emailRegex.test(inputEmail.value)) {
            ElMessageBox.alert("Insira um e-mail válido", "Atenção", {
                confirmButtonText: "OK"
            })
            return false
        } 

        if (!inputEmail.value.trim()) {
            alerts()
            ElMessageBox.alert("Campo 'E-mail' vazio", "Atenção", {
                confirmButtonText: "OK"
            })

            return false
        }

        return true
    }

    async function updateSenha() {

        try {
           
            const loading = ElLoading.service({
                lock: true,
                text: "Por favor, aguarde...",
                background: 'rgba(0, 0, 0, 0.8)'
            })
            setTimeout(() => {
                loading.close()
            }, 2000);

            await new Promise(resolve => setTimeout(resolve, 2000))

            await RecuperarSenha(inputEmail.value)

            ElMessageBox.alert("Sua solicitação de redefinição de senha foi enviada com sucesso. Verifique seu e-mail para continuar o processo.", "Atenção", {
                confirmButtonText: "OK"
            })

        } catch (error) {
           console.log(error)
           ElMessageBox.alert("Erro na requisição. Tente novamente", "Atenção")
        }
    }

    function alerts() {
        inputUserError.value = "inputUserError"
        inputSenhaError.value = "inputSenhaError"
        iconAlert.value = "iconAlert"
        isSenhaError.value = true

        setTimeout(() => {
            inputSenhaError.value = ""
            inputUserError.value = ""
            iconAlert.value = ""
            isSenhaError.value = false
        }, 2000);
    }

    async function submitRecuperar() {
        const isValid = validData()

        if (!isValid) {
            return
        }

       await updateSenha() 
    } 

    
</script>

<template>

    <main>
    <main class="mainForm">
        <div class="div-pilulas-superior">
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
    </div>
    
    <div class="div-pilulas">
        <img class="pilulas-content" :src="pilulas" alt="404">
        <img class="pilulas-content" :src="pilulas" alt="404">
        <img class="pilulas-content" :src="pilulas" alt="404">
        <img class="pilulas-content" :src="pilulas" alt="404">
    </div>

    <div class="container">

    <div class="logo">
        <img class="banner" :src="bannerImg" alt="Logo-Banner">
    </div>

    <div class="header">
        <h1 class="header">Recuperar Senha</h1>
        <h4 class="header-h4">Insira as informações logo abaixo</h4>
    </div>

    <form class="form" @submit.prevent="submitNewUser">
     
    <div class="form-control">
        <label class="labelUser" for="user">E-mail</label>
        <el-input
            style="width: 80%;"
            v-model="inputEmail"
            placeholder="Insira seu e-email"
            clearable  
            title="Insira seu e-mail"
            :class="inputUserError"
            autocomplete="email"
            name="email"
            type="email"
        />
        <el-icon v-show="iconAlert" :class="iconAlert"><WarningFilled /></el-icon>
    </div>

    <el-tooltip
        effect="dark"
        content="Recuperar"
        placement="top"
    >
    <el-button id="bntSubmit" @click="submitRecuperar" type="primary" ><span>RECUPERAR</span></el-button>
    </el-tooltip>

    <el-tooltip
        effect="dark"
        content="Voltar"
        placement="bottom"
    >
    <div>
        <router-link to="/"><el-button id="bnt-voltar" type="primary">VOLTAR</el-button></router-link>
    </div>
    </el-tooltip>

</form>
</div>
</main>
</main>
  
</template>

<style scoped src="./Recuperar-senha.css">

</style>
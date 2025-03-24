<script setup>

    import bannerImg from "@/assets/banner-principal.svg"
    import pilulas from "@/assets/pilulas-png.png"
    import { ref as vueRef } from "vue";    
    import { ElLoading } from 'element-plus'
    import { ElMessageBox, ElMessage } from 'element-plus';
    import { CreateUsuário } from "@/repositorio-db/repositorio-db-cad-user";
    import InputMask from 'primevue/inputmask';

 
    //Dados reativos
    const inputEmail = vueRef("")
    const inputPassword = vueRef("")
    const inputCargo = vueRef("")
    const inputEscala = vueRef("")
    const inputName = vueRef("")
    const inputTelefone = vueRef("")
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    const inputUserError = vueRef("")
    const inputSenhaError = vueRef("")
    const isInputError = vueRef(false)
    const inputTelefoneError = vueRef("")
    const iconAlert = vueRef("")

    // 77 9999-9999

    const alert = function() {
        inputUserError.value = "inputUserError"
        inputSenhaError.value = "inputSenhaError"
        isInputError.value = true
        inputTelefoneError.value = "inputTelefoneError"
        iconAlert.value = "iconAlert"

        setTimeout(() => {
            inputUserError.value = ""
            inputSenhaError.value = ""
            inputTelefoneError.value = ""
            iconAlert.value = ""
            isInputError.value = false
        }, 3200);
    }

    function maskCase() {
        inputCargo.value = inputCargo.value.toUpperCase()
        inputEscala.value = inputEscala.value.toUpperCase()
        inputName.value = inputName.value.toUpperCase()
    }

    function validData() {
        if (!inputCargo.value.trim() || !inputEscala.value.trim() || !inputName.value.trim() || !inputTelefone.value.trim()) {
            alert()
            ElMessage({
                type: "error",
                message: "Campo obrigatório vazio! Tente novamente.",
                duration: 300
            })
            
            return false
        }

        if (inputPassword.value.length < 6) {
            ElMessageBox.alert("A senha deve conter no mínimo 6 caracteres", "Atenção", {
                confirmButtonText: "OK"
            })

            return false
        }

        if (!emailRegex.test(inputEmail.value)) {
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

    
    //Função para inserir dados no fireBase
    async function inserirDados() {

        const loading = ElLoading.service({
            lock: true,
            text: "Salvando os dados do usuário... Por favor, aguarde.",
            background: 'rgba(0, 0, 0, 0.8)'
        })
        setTimeout(() => {
            loading.close()
        }, 2000);

        //Promessa anonima que cria um falso delay de 2s antes de efetuar a inserção banco
        await new Promise(resolve => setTimeout(resolve, 2000))

        try {

            await CreateUsuário(inputEmail.value, inputName.value, inputTelefone.value, inputCargo.value, inputEscala.value, inputPassword.value)

            // Mensagem de sucesso
            ElMessageBox.alert("Dados salvos com sucesso!", "Sucesso", {
                confirmButtonText: "OK",
                callback: (action) => {
                if (action === "confirm") {
                    ElMessage({
                    type: "success",
                    message: "Envie as informações para o cliente",
                    });
                }
                },
            });

        } catch (error) {
        // Função que lida com o erro da operação da promessa
        console.log("Erro ao salvar no DB" + error)
        ElMessageBox.alert("Erro ao salvar, tente novamente!", "Atenção", {
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
    }
}

     //Função com para enviar os dados para o banco e fazer toda a validação
    const submitNewUser = function() {

        const isValid = validData()

        if (!isValid) {
            return
        }
        
        inserirDados();

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
        <h1 class="header">Cadastro de Usuário</h1>
        <h4 class="header-h4">Insira as informações logo abaixo</h4>
    </div>

    <form class="form" @submit.prevent="submitNewUser">
     
    <div class="form-control">
        <label class="labelUser" for="user">E-mail</label>
        <el-input
             style="width: 80%;"
            v-model="inputEmail"
            placeholder="E-mail"
            clearable  
            title="Email"
            :class="inputUserError"
            autocomplete="email"
            type="email"
            name="email"
            show-word-limit
            maxlength="50"
    />
    <el-icon v-show="iconAlert" :class="iconAlert"><WarningFilled /></el-icon>
    </div>

    <div class="form-control">
        <label class="labelUser" for="user">Nome</label>
        <el-input
        style="width: 80%;"
        v-model="inputName"
        placeholder="Nome (Não precisa ser completo)"
        clearable  
        title="Nome"
        :class="inputUserError"
        autocomplete="username"
        name="username"
        @keyup="maskCase"
        maxlength="25"
        show-word-limit
        type="text"
    />
        <el-icon v-show="iconAlert" :class="iconAlert"><WarningFilled /></el-icon>
    </div>

    <div class="form-control">
        <label class="labelTelefone" for="user">Telefone</label>
        <el-input
        v-model="inputTelefone"
        maxlength="15"
        minlength="9"
        show-word-limit
        type="text"
        style="width: 80%;"
        placeholder="Telefone"
        clearable  
        :class="inputUserError"
        autocomplete="tel"
        name="tel"
    />
        <el-icon v-show="iconAlert" :class="iconAlert"><WarningFilled /></el-icon>
    </div>

    <div class="form-control">
        <label class="labelUser" for="user">Cargo</label>
        <el-input
            style="width: 80%;"
            v-model="inputCargo"
            placeholder="Cargo"
            clearable  
            show-word-limit
            maxlength="50"
            title="Cargo"
            :class="inputUserError"
            autocomplete="cargo"
            name="cargo"
            @keyup="maskCase"
        />
        <el-icon v-show="iconAlert" :class="iconAlert"><WarningFilled /></el-icon>
    </div>

    <div class="form-control">
        <label class="labelUser" for="user">Escala</label>
        <el-input
            style="width: 80%;"
            v-model="inputEscala"
            placeholder="Escala"
            clearable  
            maxlength="15"
            show-word-limit
            title="Escala"
            :class="inputUserError"
            autocomplete="escala"
            name="escala"
            @keyup="maskCase"
        />
        <el-icon v-show="iconAlert" :class="iconAlert"><WarningFilled /></el-icon>
    </div>

    <div class="form-control">
        <label class="labelUser" for="user">Senha</label>
        <el-input
            style="width: 80%;"
            v-model="inputPassword"
            placeholder="Senha"
            clearable  
            minlength="6"
            show-word-limit
            title="Senha"
            :class="inputUserError"
            show-password
        />
        <el-icon v-show="iconAlert" :class="iconAlert"><WarningFilled /></el-icon>
    </div>

    <el-tooltip
        effect="dark"
        content="Cadastrar"
        placement="top"
    >
    <el-button id="bntSubmit" @click="submitNewUser" type="primary" ><span>CADASTRAR</span></el-button>
    </el-tooltip>
    <!-- <div>
        <router-link to="/"><el-button id="bnt-voltar" type="primary">VOLTAR</el-button></router-link>
    </div> -->

</form>
</div>
</main>
    </main>

    
   
</template>

<style scoped src="./Cad-User.css">

</style>
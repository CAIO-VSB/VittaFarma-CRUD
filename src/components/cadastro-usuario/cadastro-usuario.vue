<script setup>
    // Importação das bibliotecas e recursos necessários
    import bannerImg from "@/assets/banner-principal.svg" // Importa a imagem do banner principal
    import pilulas from "@/assets/pilulas-png.png" // Importa a imagem de pílulas para decoração
    import { ref as vueRef } from "vue"; // Importa a função ref do Vue para reatividade, renomeada para vueRef
    import { ElLoading } from 'element-plus' // Importa o componente de carregamento do Element Plus
    import { ElMessageBox, ElMessage } from 'element-plus'; // Importa componentes de mensagem do Element Plus
    import { CreateUsuário } from "@/repositorio-db/repositorio-db-cad-user"; // Importa a função para criar usuário no banco de dados
    import router from "@/router/router"; // Importa o roteador Vue para navegação

 
    //Dados reativos
    const inputEmail = vueRef("") // Campo de email
    const inputPassword = vueRef("") // Campo de senha
    const inputCargo = vueRef("") // Campo de cargo
    const inputEscala = vueRef("") // Campo de escala de trabalho
    const inputName = vueRef("") // Campo de nome
    const inputTelefone = vueRef("") // Campo de telefone
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/; // Expressão regular para validação de email
    const inputUserError = vueRef("") // Classe CSS para erro no campo de usuário
    const inputSenhaError = vueRef("") // Classe CSS para erro no campo de senha
    const isInputError = vueRef(false) // Flag para indicar se há erro nos inputs
    const inputTelefoneError = vueRef("") // Classe CSS para erro no campo de telefone
    const iconAlert = vueRef("") // Classe CSS para ícone de alerta

 
    //Função para mostrar o alert de erro
    // Adiciona classes CSS de erro aos campos e remove após um tempo
    const alert = function() {
        inputUserError.value = "inputUserError" // Adiciona classe de erro ao campo de usuário
        inputSenhaError.value = "inputSenhaError" // Adiciona classe de erro ao campo de senha
        isInputError.value = true // Ativa a flag de erro
        inputTelefoneError.value = "inputTelefoneError" // Adiciona classe de erro ao campo de telefone
        iconAlert.value = "iconAlert" // Ativa o ícone de alerta

        // Remove as classes de erro após 3.2 segundos
        setTimeout(() => {
            inputUserError.value = ""
            inputSenhaError.value = ""
            inputTelefoneError.value = ""
            iconAlert.value = ""
            isInputError.value = false
        }, 3200);
    }

    //Mascara para as letras
    // Converte o texto para maiúsculas em tempo real
    function maskCase() {
        inputCargo.value = inputCargo.value.toUpperCase() // Converte o cargo para maiúsculas
        inputEscala.value = inputEscala.value.toUpperCase() // Converte a escala para maiúsculas
        inputName.value = inputName.value.toUpperCase() // Converte o nome para maiúsculas
    }

    //Função para validar os inputs
    // Verifica se todos os campos obrigatórios estão preenchidos corretamente
    function validData() {
        //Verifico se não está vazio os campos
        if (!inputCargo.value.trim() || !inputEscala.value.trim() || !inputName.value.trim() || !inputTelefone.value.trim()) {
            alert() // Mostra alerta visual
            ElMessage({
                type: "error",
                message: "Campo obrigatório vazio! Tente novamente.",
                duration: 300
            })
            
            return false // Muito importante retornar true ou false para a logica funcione
        }

        //Verificar se a senha é menor que 6 caracteres
        if (inputPassword.value.length < 6) {
            ElMessageBox.alert("A senha deve conter no mínimo 6 caracteres", "Atenção", {
                confirmButtonText: "OK"
            })

            return false
        }

        //Validar e-mail
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

    return true // Retorna verdadeiro se todos os campos estiverem válidos
          
    }

    //Função para inserir dados no fireBase
    // Função assíncrona que cria um novo usuário no banco de dados
    async function inserirDados() {
        // Exibe um indicador de carregamento durante o processo
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
            //Aguardo o promisse ser resolvida
            // Chama a função para criar o usuário no banco de dados
            await CreateUsuário(inputEmail.value, inputName.value, inputTelefone.value, inputCargo.value, inputEscala.value, inputPassword.value)

            // Mensagem de sucesso
            ElMessageBox.alert("Dados salvos com sucesso!", "Sucesso", {
                confirmButtonText: "OK"
            });

            await new Promise(resolve => setTimeout(resolve, 2000))

            //Redireciono o usuário para a pagina de login
            router.push({name: "Login"})

        } catch (error) {
        // Função que lida com o erro da operação da promessa
        console.log("Erro ao salvar no DB" + error) // Registra o erro no console
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
     // Função principal chamada ao submeter o formulário
    function submitNewUser() {
        const isValid = validData() // Valida os dados do formulário

        if (!isValid) {
            return // Se os dados não forem válidos, interrompe a execução da função
        }
        
        inserirDados(); // Chama a função para inserir os dados no banco

    }   

</script>

<template>
    <!-- Container principal do formulário -->
    <main>
    <main class="mainForm">
        <!-- Elementos decorativos (pílulas) na parte superior -->
        <div class="div-pilulas-superior">
        <img class="pilulas-content" :src="pilulas" alt="404"> <!-- Imagem de pílula -->
        <img class="pilulas-content" :src="pilulas" alt="404"> <!-- Imagem de pílula -->
        <img class="pilulas-content" :src="pilulas" alt="404"> <!-- Imagem de pílula -->
        <img class="pilulas-content" :src="pilulas" alt="404"> <!-- Imagem de pílula -->
    </div>

    <!-- Elementos decorativos (pílulas) na parte inferior -->
    <div class="div-pilulas-inferior">
        <img class="pilulas-content" :src="pilulas" alt="404"> <!-- Imagem de pílula -->
        <img class="pilulas-content" :src="pilulas" alt="404"> <!-- Imagem de pílula -->
        <img class="pilulas-content" :src="pilulas" alt="404"> <!-- Imagem de pílula -->
        <img class="pilulas-content" :src="pilulas" alt="404"> <!-- Imagem de pílula -->
    </div>
    
    <!-- Elementos decorativos (pílulas) adicionais -->
    <div class="div-pilulas">
        <img class="pilulas-content" :src="pilulas" alt="404"> <!-- Imagem de pílula -->
        <img class="pilulas-content" :src="pilulas" alt="404"> <!-- Imagem de pílula -->
        <img class="pilulas-content" :src="pilulas" alt="404"> <!-- Imagem de pílula -->
        <img class="pilulas-content" :src="pilulas" alt="404"> <!-- Imagem de pílula -->
    </div>

    <!-- Container do formulário -->
    <div class="container">
        <!-- Logo/Banner da aplicação -->
        <div class="logo">
            <img class="banner" :src="bannerImg" alt="Logo-Banner"> <!-- Imagem do banner -->
        </div>

        <!-- Cabeçalho do formulário -->
        <div class="header">
            <h1 class="header">Cadastro de Usuário</h1> <!-- Título principal -->
            <h4 class="header-h4">Insira as informações logo abaixo</h4> <!-- Subtítulo -->
        </div>

        <!-- Formulário de cadastro -->
        <form class="form" @submit.prevent="submitNewUser">
         
        <!-- Campo de email -->
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
        <el-icon v-show="iconAlert" :class="iconAlert"><WarningFilled /></el-icon> <!-- Ícone de alerta -->
        </div>

        <!-- Campo de nome -->
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
            <el-icon v-show="iconAlert" :class="iconAlert"><WarningFilled /></el-icon> <!-- Ícone de alerta -->
        </div>

        <!-- Campo de telefone -->
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
            <el-icon v-show="iconAlert" :class="iconAlert"><WarningFilled /></el-icon> <!-- Ícone de alerta -->
        </div>

        <!-- Campo de cargo -->
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
            <el-icon v-show="iconAlert" :class="iconAlert"><WarningFilled /></el-icon> <!-- Ícone de alerta -->
        </div>

        <!-- Campo de escala -->
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
            <el-icon v-show="iconAlert" :class="iconAlert"><WarningFilled /></el-icon> <!-- Ícone de alerta -->
        </div>

        <!-- Campo de senha -->
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
            <el-icon v-show="iconAlert" :class="iconAlert"><WarningFilled /></el-icon> <!-- Ícone de alerta -->
        </div>

        <!-- Botão de cadastro com tooltip -->
        <el-tooltip
            effect="dark"
            content="Cadastrar"
            placement="top"
        >
        <el-button id="bntSubmit" @click="submitNewUser" type="primary" ><span>CADASTRAR</span></el-button>
        </el-tooltip>

    </form>
    </div>
    </main>
    </main>
</template>

<!-- Importação do arquivo CSS específico para este componente com escopo limitado -->
<style scoped src="./Cad-User.css">

</style>
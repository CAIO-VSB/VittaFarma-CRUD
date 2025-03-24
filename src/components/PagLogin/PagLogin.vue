<script setup>
    // Importação das bibliotecas e recursos necessários
    import bannerImg from '@/assets/banner-principal.svg'; // Importa a imagem do banner principal
    import pilulas from "@/assets/pilulas-png.png" // Importa a imagem de pílulas para decoração
    import { ref } from 'vue'; // Importa a função ref do Vue para reatividade
    import router from '@/router/router'; // Importa o roteador Vue para navegação
    import { ElMessageBox, ElMessage } from 'element-plus'; // Importa componentes de mensagem do Element Plus
    import { signUser } from '@/repositorio-db/repositorio-db-pag-login'; // Importa a função para autenticação de usuário
    import { useUsers } from '@/composable/useUsers'; // Importa o composable que gerencia os dados do usuário


    // Declaração das variáveis reativas (refs) para controle da interface e dados
    const email = ref("") // Campo de email
    const password = ref("") // Campo de senha
    const container = ref("container") // Classe CSS para o container
    const logo = ref("logo") // Classe CSS para o logo
    const formControl = ref("formcontrol") // Classe CSS para o controle do formulário
    const form = ref("form") // Classe CSS para o formulário
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/; // Expressão regular para validação de email
    const inputUser = ref("") // Classe CSS para o input de usuário
    const iconAlert = ref("") // Classe CSS para o ícone de alerta
    const inputSenha = ref("") // Classe CSS para o input de senha
    const isLoading = ref(false) // Controla o estado de carregamento do botão de login
    const inputFocus = ref() // Referência para o elemento de input para foco
    const validSenha = ref(true) // Controla a validação da senha
    const isInputErrorSenha = ref(false) // Controla o estado de erro do campo de senha
    const isInputErrorUser = ref(false) // Controla o estado de erro do campo de usuário

    // Define valores iniciais para algumas variáveis
    inputUser.value = "inputUser" // Classe CSS inicial para o input de usuário
    inputSenha.value = "inputSenha" // Classe CSS inicial para o input de senha

    // Obtém a data atual e armazena no localStorage
    const date = new Date()
    localStorage.setItem("Date", date.toLocaleDateString("pt-BR")) // Armazena a data formatada no localStorage

    // Desestruturação do composable useUsers para obter os dados
    const { valores } = useUsers()

    //imagens
    const banner = ref(bannerImg) // Referência para a imagem do banner

    //Scripts

    // Função para validar os dados do formulário
    function validData() {
        // Verifica se os campos de email e senha estão vazios
        if (!email.value.trim() || !password.value.trim()) {
            validSenha.value = false // Desativa a validação da senha
            isInputErrorSenha.value = true // Ativa o estado de erro do campo de senha
            isInputErrorUser.value = true // Ativa o estado de erro do campo de usuário
            
            // Remove os estados de erro após 3.5 segundos
            setTimeout(() => {
                isInputErrorSenha.value = false
                isInputErrorUser.value = false
                validSenha.value = true
            }, 3500);

            inputFocus.value.focus() // Coloca o foco no campo de email
            
            return false // Retorna falso indicando que a validação falhou
        } 

        // Verifica se a senha tem pelo menos 6 caracteres
        if (password.value.length < 6) {
            ElMessageBox.alert("A senha deve conter no mínimo 6 caracteres", "Atenção")
            return false // Retorna falso indicando que a validação falhou
        }

        // Verifica se o email está no formato correto usando a expressão regular
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

        return false // Retorna falso indicando que a validação falhou
    }

    return true // Retorna verdadeiro se todos os campos estiverem válidos
    }

    // Função assíncrona para validar o usuário e realizar o login
    const validUser = async function() {
        isLoading.value = true // Ativa o indicador de carregamento

        // Espera 2 segundos antes de continuar (simulação de processamento)
        await new Promise(resolve => setTimeout(resolve, 2000))

        isLoading.value = false // Desativa o indicador de carregamento

        try {
            // Chama a função para autenticar o usuário
            const userResutl = await signUser(email.value, password.value)

            // Verifica se a autenticação falhou
            if (!userResutl) {
                ElMessageBox.alert("Usuário ou senha incorretas", "Atenção")
                return false // Retorna falso indicando que a autenticação falhou
            }

            // Exibe mensagem de sucesso
            ElMessage({
                message: "Login realizado com sucesso! Bom trabalho",
                type: "success"
            })

            // Navega para a página principal após o login bem-sucedido
            router.push({name: "Vitta Farma Drogaria"})

        } catch {
            // Captura e trata erros durante a autenticação
            ElMessageBox.alert("Algo deu errado! Tente novamente...", "Atenção")
            return false // Retorna falso indicando que a autenticação falhou
        }
    }

    // Função chamada quando o usuário pressiona Enter no campo de senha
    function LoginEnter() {
        submitDados() // Chama a função para submeter os dados
    }

    // Função principal chamada ao submeter o formulário
    function submitDados() {
        const isValid = validData() // Valida os dados do formulário

        if (!isValid) {
            return // Se os dados não forem válidos, interrompe a execução da função
        }
            
        validUser() // Chama a função para validar o usuário e realizar o login
    }

</script>

<template>
    <!-- Container principal da página de login -->
    <main class="mainContainer">
        <!-- Elementos decorativos (pílulas) na parte superior -->
        <div class="div-pilulas-superior">
                <img class="pilulas-content" :src="pilulas" alt="404"> <!-- Imagem de pílula -->
                <img class="pilulas-content" :src="pilulas" alt="404"> <!-- Imagem de pílula -->
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
                <img class="pilulas-content" :src="pilulas" alt="404"> <!-- Imagem de pílula -->
                <img class="pilulas-content" :src="pilulas" alt="404"> <!-- Imagem de pílula -->
        </div>
        
        <!-- Elementos decorativos (pílulas) adicionais -->
        <div class="div-pilulas">
                <img class="pilulas-content" :src="pilulas" alt="404"> <!-- Imagem de pílula -->
                <img class="pilulas-content" :src="pilulas" alt="404"> <!-- Imagem de pílula -->
                <img class="pilulas-content" :src="pilulas" alt="404"> <!-- Imagem de pílula -->
                <img class="pilulas-content" :src="pilulas" alt="404"> <!-- Imagem de pílula -->
                <img class="pilulas-content" :src="pilulas" alt="404"> <!-- Imagem de pílula -->
                <img class="pilulas-content" :src="pilulas" alt="404"> <!-- Imagem de pílula -->
        </div>

        <!-- Container do formulário de login -->
        <div id="app" :class="container">
            <!-- Logo/Banner da aplicação -->
            <div :class="logo">
                <img class="banner" :src="banner"> <!-- Imagem do banner -->
            </div>

            <!-- Cabeçalho do formulário -->
            <div class="header">
                <h1 class="h1-title">BEM-VINDO</h1> <!-- Título principal -->
                <h2 class="h2-title">Faça login com suas credenciais</h2> <!-- Subtítulo -->
            </div>

            <!-- Formulário de login -->
            <form id="form" :class="form" @submit.prevent="submitDados">
                <!-- Campo de email -->
                <div :class="formControl">
                    <label for="email" class="label-username">E-mail</label>
                    <el-input ref="inputFocus" :class="{inputUserError: isInputErrorUser, inputUser: validUser}" type="email" v-model="email" placeholder="Insira seu email"    
                    clearable
                    title="E-mail"
                    autocomplete="email"
                    name="email"
                    />
                    <el-icon v-show="iconAlert" :class="iconAlert"><WarningFilled /></el-icon> <!-- Ícone de alerta -->
                </div>

                <!-- Campo de senha -->
                <div :class="formControl">
                    <label for="senha" class="label-senha">Senha</label>
                    <el-input :class="{inputSenha: validSenha, inputSenhaError: isInputErrorSenha}" :type="password" title="Insira uma senha" v-model="password" 
                    placeholder="Insira sua senha"
                    show-password 
                    autocomplete="new-password"
                    @keyup.enter="LoginEnter" 
                    
                    />
                </div>
                
                <!-- Botão de login com tooltip -->
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
                
                <!-- Link para recuperação de senha -->
                <div class="esqueceu-senha">
                    <el-icon title="Recuperar senha" icones><Unlock /></el-icon> <!-- Ícone de desbloqueio -->
                    <p title="Recuperar senha">Esqueceu sua senha? <router-link to="/Recuperar-senha" title="Recuperar senha"><el-link class="el-links" type="primary">Recupere aqui</el-link></router-link></p>
                </div>
                
                <!-- Link para criação de conta -->
                <div class="criar-conta">
                    <el-icon title="Criar usuário e senha" icones><el-icon><User /></el-icon></el-icon> <!-- Ícone de usuário -->
                    <p title="Criar usuário e senha">Crie seu usuário e senha: <router-link to="/cadastro-usuario" title="Criar usuário e senha"><el-link class="el-links" type="primary">Crie seu usuário aqui</el-link></router-link></p>
                </div>
            </form> 
        </div>
    </main>
</template>

<!-- Importação do arquivo CSS específico para este componente com escopo limitado -->
<style scoped src="./Pag-Login.css">
</style>
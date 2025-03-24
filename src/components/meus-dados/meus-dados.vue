<script setup>
    // Importação das bibliotecas e componentes necessários
    import Splitter from 'primevue/splitter'; // Importa o componente Splitter do PrimeVue para dividir a tela
    import Dialog from 'primevue/dialog'; // Importa o componente Dialog do PrimeVue para modais
    import SplitterPanel from 'primevue/splitterpanel'; // Importa o componente SplitterPanel do PrimeVue para painéis do Splitter
    import imgMeuDados from "@/assets/img-meus-dados.png" // Importa a imagem para o ícone de usuário
    import { useUsers } from '@/composable/useUsers'; // Importa o composable que gerencia os dados do usuário
    import { RecuperarSenha } from '@/repositorio-db/respositorio-db-recup-senha'; // Importa a função para recuperação de senha
    import { ElMessageBox, ElLoading} from 'element-plus'; // Importa componentes de mensagem e carregamento do Element Plus
    import { ref } from 'vue'; // Importa a função ref do Vue para reatividade


    // Declaração das variáveis reativas (refs) para controle da interface e dados
    const dialogInfoPessoais = ref(false) // Controla a visibilidade do modal de informações pessoais
    const inputEmail = ref("") // Armazena o email digitado pelo usuário para recuperação de senha
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/; // Expressão regular para validação de email
    const isEmailError = ref(false) // Controla o estado de erro do campo de email

    // Desestruturação do composable useUsers para obter os dados e estado de carregamento
    const { valores, loading } = useUsers()

    // Função para validar os dados do formulário de recuperação de senha
    function validData() {
        // Verifica se o campo de email está vazio
        if (!inputEmail.value.trim()) {
            isEmailError.value = true // Ativa o estado de erro do campo

            // Remove o estado de erro após 2 segundos
            setTimeout(() => {
                isEmailError.value = false
            }, 2000);
            
            return false // Retorna falso indicando que a validação falhou
        }

        // Verifica se o email está no formato correto usando a expressão regular
        if (!emailRegex.test(inputEmail.value)) {
            // Exibe uma mensagem de alerta se o email for inválido
            ElMessageBox.alert("Insira um e-mail válido", "Atenção", {
                confirmButtonText: "OK"
            })

            return false // Retorna falso indicando que a validação falhou
        } 

        return true // Retorna verdadeiro se o email for válido
    }

    // Função assíncrona para processar a solicitação de recuperação de senha
    async function UpdateSenha() {
        try {
           // Exibe um indicador de carregamento durante o processo
           const loading = ElLoading.service({
               lock: true, // Bloqueia a interface
               text: "Por favor, aguarde...", // Texto exibido durante o carregamento
               background: 'rgba(0, 0, 0, 0.8)' // Fundo semi-transparente
           })
           // Define um tempo limite para fechar o indicador de carregamento
           setTimeout(() => {
               loading.close()
           }, 2000);

           // Espera 2 segundos antes de continuar (simulação de processamento)
           await new Promise(resolve => setTimeout(resolve, 2000))

           // Chama a função para enviar a solicitação de recuperação de senha
           await RecuperarSenha(inputEmail.value)

           // Exibe uma mensagem de sucesso após o envio da solicitação
           ElMessageBox.alert("Sua solicitação de redefinição de senha foi enviada com sucesso. Verifique seu e-mail para continuar o processo.", "Atenção", {
               confirmButtonText: "OK"
           })

       } catch (error) {
          // Registra erros no console
          console.log(error)
       }
    }

    // Função assíncrona chamada quando o usuário clica no botão de enviar
    async function updatepassword() {
        const isValid = validData() // Valida os dados do formulário

        if (!isValid) {
            return // Se os dados não forem válidos, interrompe a execução da função
        }

        await UpdateSenha() // Chama a função para processar a solicitação de recuperação de senha
    }
</script>

<template>
    <!-- Container principal do componente -->
    <main class="content-main">
        <!-- Div para mostrar o indicador de carregamento -->
        <div class="loading-container" v-loading="loading"></div>
        <!-- Container principal do conteúdo -->
        <div class="main">
            <!-- Card que contém as informações do usuário -->
            <div class="card">
            <!-- Componente Splitter para dividir a tela em dois painéis -->
            <Splitter :gutterSize="5" class="responvise-splitter" style="height: 100%">
                <!-- Painel esquerdo (25% da largura) com informações pessoais -->
                <SplitterPanel  class="flex items-center justify-center painel1" :size="25" :minSize="20">  
                    <!-- Div com a imagem e título da seção -->
                    <div class="div-img-meus-dados div-info-pessoais"> 
                        <img class="img-meus-dados" :src="imgMeuDados" alt="icon-user"> <!-- Imagem do ícone de usuário -->
                        <p class="p-info-pessoais">Informações Pessoais</p> <!-- Título da seção -->
                    </div>
                    <!-- Div com as informações pessoais do usuário -->
                    <div class="responsive-info-pessoais no-responsive-info-pessoais">
                        <!-- Título da seção -->
                        <div class="info-user-left">
                            <h4 class="titles">Informações Pessoais</h4>
                        </div> 
                        <!-- Nome completo do usuário -->
                        <div class="info-user-left">
                            <p>Nome completo</p>
                            <p class="infos-user-left">{{ valores?.Nome }}</p> <!-- Nome do usuário com operador opcional -->
                        </div>
                        <!-- Email corporativo do usuário -->
                        <div class="info-email-left">
                            <p>E-mail corporativo </p>
                            <p class="infos-user-left">{{ valores?.Email }}</p> <!-- Email do usuário com operador opcional -->
                        </div>
                        <!-- Telefone interno do usuário -->
                        <div class="info-email-left">
                            <p>Telefone interno</p>
                            <p class="infos-user-left">{{ valores.Telefone}}</p> <!-- Telefone do usuário -->
                        </div>
                        <!-- Data de criação da conta -->
                        <div class="info-email-left">
                            <p>Criado em</p>
                            <p class="infos-user-left">{{ valores?.criadoEm}}</p> <!-- Data de criação com operador opcional -->
                        </div>
                    </div>
                </SplitterPanel>
                <!-- Painel direito (75% da largura) com informações adicionais -->
                <SplitterPanel class="flex items-center justify-center" :size="75">
                    <!-- Div com as informações adicionais do usuário -->
                    <div class="responsive-info-adicionais">
                        <!-- Título da seção -->
                        <div class="info-user-right">
                            <p class="title-info-adicionais">Informações Adicionais</p>
                        </div>
                        <!-- Escala de trabalho do usuário -->
                        <div>
                            <p class="infos-adicionais-right">Escala de trabalho</p>
                            <p >{{ valores.Escala }}</p> <!-- Escala de trabalho do usuário -->
                        </div>
                        <!-- Cargo do usuário -->
                        <div>
                            <p  class="infos-adicionais-right">Cargo</p>
                            <p>{{ valores.Cargo  }}</p> <!-- Cargo do usuário -->
                        </div>
                        <!-- Informações de contato do suporte/TI -->
                        <div>
                            <p  class="infos-adicionais-right">Suporte/TI</p>
                            <p>77 99945-9897</p> <!-- Telefone do suporte/TI -->
                        </div>
                        <!-- Informações de contato do setor administrativo -->
                        <div>
                            <p  class="infos-adicionais-right">Setor administrativo </p>
                            <p>viitafarmaADM@gmail.com ou 77 99867-9867</p> <!-- Email e telefone do setor administrativo -->
                        </div>
                        <!-- Seção para trocar a senha de acesso -->
                        <div class="responsive-trocar-senha">
                            <p  class="infos-adicionais-right">Trocar senha de acesso?</p>
                            <!-- Div com o campo de email para recuperação de senha -->
                            <div class="div-flex-senha">
                                <el-input v-model="inputEmail" name="email" type="email" autocomplete="email" :class="{inputEmailError: isEmailError}" style="width: 30%; font-size: 0.85rem; height: 30px;" placeholder="Digite seu e-mail corporativo"></el-input>
                            </div>
                            <!-- Botão para enviar a solicitação de recuperação de senha -->
                            <el-button @click="updatepassword" id="bnt-trocar-senha" type="primary">Enviar</el-button>
                        </div>
                        <br>
                        <hr> <!-- Linha horizontal para separar as seções -->
                        <br>
                        <!-- Div com lembrete/aviso importante -->
                        <div class="div-lembrete-aviso">
                            <p class="lembrete-aviso"> <strong>Lembrete: </strong>Para solicitar a alteração do seu e-mail de acesso, modificar informações pessoais ou registrar qualquer tipo de queixa, entre em contato primeiramente com seu superior na filial. Caso a solicitação seja de competência exclusiva do setor administrativo, é obrigatório encaminhá-la diretamente para esse setor por meio do e-mail ou telefone em anexo. </p>
                        </div>
                        </div>
                    </SplitterPanel>
                </Splitter>
            </div>
            <!-- Modal com dica sobre o email corporativo -->
            <Dialog v-model:visible="dialogInfoPessoais" maximizable modal header="Dica" :style="{ width: '50rem' }" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
                <p class="m-0">
                    "Atenção: Este e-mail será utilizado para a recuperação de senha, acesso ao sistema interno da empresa e recebimento de comunicados e informações institucionais. Certifique-se de fornecer um endereço válido e de uso frequente."
                </p>
            </dialog>
        </div>
    </main>
    
</template>

<!-- Importação do arquivo CSS específico para este componente com escopo limitado -->
<style src="./meus-dados.css" scoped>

</style>
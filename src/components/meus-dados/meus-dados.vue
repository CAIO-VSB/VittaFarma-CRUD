<script setup>
    import Splitter from 'primevue/splitter';
    import Dialog from 'primevue/dialog';
    import SplitterPanel from 'primevue/splitterpanel';
    import imgMeuDados from "@/assets/img-meus-dados.png"
    import { useUsers } from '@/composable/useUsers';
    import { RecuperarSenha } from '@/repositorio-db/respositorio-db-recup-senha';
    import { ElMessageBox, ElLoading} from 'element-plus';
    import { ref } from 'vue';


    const dialogInfoPessoais = ref(false)
    const inputEmail = ref("")
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    const isEmailError = ref(false)

    const { valores } = useUsers()

    function validData() {

        if (!inputEmail.value.trim()) {
            isEmailError.value = true

            setTimeout(() => {
                isEmailError.value = false
            }, 2000);
            
            return false
        }

        if (!emailRegex.test(inputEmail.value)) {
            ElMessageBox.alert("Insira um e-mail válido", "Atenção", {
                confirmButtonText: "OK"
            })

            return false
        } 

        return true
    }

    async function UpdateSenha() {
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
       }

    }

    async function updatepassword() {
        const isValid = validData()

        if (!isValid) {
            return
        }

        await UpdateSenha()

    }
</script>

<template>
    <main class="content-main">
        <div class="loading-container" v-loading="loading"></div>
        <div class="main">
            <div class="card">
            <Splitter :gutterSize="5" class="responvise-splitter" style="height: 100%">
                <SplitterPanel  class="flex items-center justify-center painel1" :size="25" :minSize="20">  
                    <div class="div-img-meus-dados div-info-pessoais"> 
                        <img class="img-meus-dados" :src="imgMeuDados" alt="icon-user">
                        <p class="p-info-pessoais">Informações Pessoais</p>
                    </div>
                    <div class="responsive-info-pessoais no-responsive-info-pessoais">
                        <div class="info-user-left">
                            <h4 class="titles">Informações Pessoais</h4>
                        </div> 
                        <div class="info-user-left">
                            <p>Nome completo</p>
                            <p class="infos-user-left">{{ valores?.Nome }}</p>
                        </div>
                        <div class="info-email-left">
                            <p>E-mail corporativo </p>
                            <p class="infos-user-left">{{ valores?.Email }}</p>
                        </div>
                        <div class="info-email-left">
                            <p>Telefone interno</p>
                            <p class="infos-user-left">{{ valores.Telefone}}</p>
                        </div>
                        <div class="info-email-left">
                            <p>Criado em</p>
                            <p class="infos-user-left">{{ valores?.criadoEm}}</p>
                        </div>
                    </div>
                </SplitterPanel>
                <SplitterPanel class="flex items-center justify-center" :size="75">
                    <div class="responsive-info-adicionais">
                        <div class="info-user-right">
                            <p class="title-info-adicionais">Informações Adicionais</p>
                        </div>
                        <div>
                            <p class="infos-adicionais-right">Escala de trabalho</p>
                            <p >{{ valores.Escala }}</p>
                        </div>
                        <div>
                            <p  class="infos-adicionais-right">Cargo</p>
                            <p>{{ valores.Cargo  }}</p>
                        </div>
                        <div>
                            <p  class="infos-adicionais-right">Suporte/TI</p>
                            <p>77 99945-9897</p>
                        </div>
                        <div>
                            <p  class="infos-adicionais-right">Setor administrativo </p>
                            <p>viitafarmaADM@gmail.com ou 77 99867-9867</p>
                        </div>
                        <div class="responsive-trocar-senha">
                            <p  class="infos-adicionais-right">Trocar senha de acesso?</p>
                            <div class="div-flex-senha">
                                <el-input v-model="inputEmail" name="email" type="email" autocomplete="email" :class="{inputEmailError: isEmailError}" style="width: 30%; font-size: 0.85rem; height: 30px;" placeholder="Digite seu e-mail corporativo"></el-input>
                            </div>
                            <el-button @click="updatepassword" id="bnt-trocar-senha" type="primary">Enviar</el-button>
                        </div>
                        <br>
                        <hr>
                        <br>
                        <div class="div-lembrete-aviso">
                            <p class="lembrete-aviso"> <strong>Lembrete: </strong>Para solicitar a alteração do seu e-mail de acesso, modificar informações pessoais ou registrar qualquer tipo de queixa, entre em contato primeiramente com seu superior na filial. Caso a solicitação seja de competência exclusiva do setor administrativo, é obrigatório encaminhá-la diretamente para esse setor por meio do e-mail ou telefone em anexo. </p>
                        </div>
                        </div>
                    </SplitterPanel>
                </Splitter>
            </div>
            <Dialog v-model:visible="dialogInfoPessoais" maximizable modal header="Dica" :style="{ width: '50rem' }" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
                <p class="m-0">
                    "Atenção: Este e-mail será utilizado para a recuperação de senha, acesso ao sistema interno da empresa e recebimento de comunicados e informações institucionais. Certifique-se de fornecer um endereço válido e de uso frequente."
                </p>
            </dialog>
        </div>
    </main>
    
</template>

<style src="./meus-dados.css" scoped>

</style>